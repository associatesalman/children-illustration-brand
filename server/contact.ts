import type { IncomingMessage, ServerResponse } from 'node:http'
import nodemailer from 'nodemailer'
import { validateInquiry, type InquiryValues } from '../src/lib/inquiry.ts'

/**
 * POST /api/contact: validates an inquiry and emails it to the internal
 * recipient over SMTP. Everything here runs on the server; the recipient
 * address and SMTP credentials come from environment variables and never
 * reach the browser.
 *
 * Required: CONTACT_RECIPIENT_EMAIL, CONTACT_FROM_EMAIL (a sender address
 * verified with the mail provider), SMTP_HOST, SMTP_USER, SMTP_PASS.
 * Optional: SMTP_PORT (587), SMTP_SECURE ("true" for port 465),
 * CONTACT_FROM_NAME, TRUST_PROXY ("true" behind a reverse proxy).
 */

const REQUIRED_ENV = ['CONTACT_RECIPIENT_EMAIL', 'CONTACT_FROM_EMAIL', 'SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'] as const

const MAX_BODY_BYTES = 16 * 1024
const RATE_WINDOW_MS = 15 * 60 * 1000
const RATE_MAX = 5
const HONEYPOT_FIELD = 'website'

type Result = { status: number; body: Record<string, unknown>; headers?: Record<string, string> }

export async function handleContact(req: IncomingMessage, res: ServerResponse) {
  const result = await processRequest(req).catch((error: unknown): Result => {
    log('unexpected error', error)
    return { status: 500, body: { ok: false, error: 'server' } }
  })
  res.writeHead(result.status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...result.headers,
  })
  res.end(JSON.stringify(result.body))
}

async function processRequest(req: IncomingMessage): Promise<Result> {
  if (req.method !== 'POST') return { status: 405, body: { ok: false, error: 'method' }, headers: { Allow: 'POST' } }
  if (!String(req.headers['content-type'] ?? '').startsWith('application/json')) {
    return { status: 415, body: { ok: false, error: 'content-type' } }
  }

  const retryAfter = rateLimited(clientIp(req))
  if (retryAfter) {
    return { status: 429, body: { ok: false, error: 'rate-limit' }, headers: { 'Retry-After': String(retryAfter) } }
  }

  const raw = await readBody(req)
  if (raw === null) return { status: 413, body: { ok: false, error: 'too-large' } }

  let input: unknown
  try {
    input = JSON.parse(raw)
  } catch {
    return { status: 400, body: { ok: false, error: 'invalid-json' } }
  }

  // Bots fill every field, people never see this one. Accept quietly and send nothing.
  const honeypot = (input as Record<string, unknown> | null)?.[HONEYPOT_FIELD]
  if (typeof honeypot === 'string' && honeypot.trim()) {
    log('honeypot triggered; inquiry discarded')
    return { status: 200, body: { ok: true } }
  }

  const { values, errors } = validateInquiry(input)
  if (Object.keys(errors).length) return { status: 422, body: { ok: false, error: 'validation', errors } }

  const missing = REQUIRED_ENV.filter((name) => !process.env[name]?.trim())
  if (missing.length) {
    log(`email is not configured; missing ${missing.join(', ')}`)
    return { status: 503, body: { ok: false, error: 'unavailable' } }
  }

  try {
    const recipient = process.env.CONTACT_RECIPIENT_EMAIL!.trim()
    const info = await transport().sendMail({
      from: { name: process.env.CONTACT_FROM_NAME?.trim() || 'Children Book Website', address: process.env.CONTACT_FROM_EMAIL!.trim() },
      to: recipient,
      replyTo: { name: values.fullName, address: values.email },
      subject: `New inquiry: ${values.mainService} from ${values.fullName}`,
      text: emailText(values),
      html: emailHtml(values),
    })
    // Success only when the provider accepted the message for our recipient.
    const accepted = info.accepted.map((entry: string | { address: string }) =>
      (typeof entry === 'string' ? entry : entry.address).toLowerCase(),
    )
    if (!accepted.includes(recipient.toLowerCase()) || info.rejected.length) {
      log('provider did not accept the message')
      return { status: 502, body: { ok: false, error: 'delivery' } }
    }
    return { status: 200, body: { ok: true } }
  } catch (error) {
    log('delivery failed', error)
    return { status: 502, body: { ok: false, error: 'delivery' } }
  }
}

// ------------------------------------------------------------------ email

const rows = (v: InquiryValues): [string, string][] => [
  ['Full name', v.fullName],
  ['Email address', v.email],
  ['Phone number', v.phone || 'Not provided'],
  ['Country', v.country || 'Not provided'],
  ['Main service', v.mainService],
  ['Specific service', v.specificService || 'Not specified'],
  ['Project stage', v.projectStage || 'Not specified'],
]

function emailText(v: InquiryValues) {
  return [
    'New inquiry from the Children Book contact page',
    '',
    ...rows(v).map(([label, value]) => `${label}: ${value}`),
    '',
    'Project details:',
    v.details,
    '',
    `Submitted: ${new Date().toUTCString()}`,
    'Reply to this email to answer the visitor directly.',
  ].join('\n')
}

function emailHtml(v: InquiryValues) {
  const cell = 'padding:8px 12px;border-bottom:1px solid #e6dfd1;vertical-align:top;text-align:left'
  const table = rows(v)
    .map(([label, value]) => `<tr><th style="${cell};width:160px;color:#4d4741">${escapeHtml(label)}</th><td style="${cell}">${escapeHtml(value)}</td></tr>`)
    .join('')
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#161412;max-width:640px">
<h1 style="font-size:20px;margin:0 0 16px">New inquiry from the Children Book contact page</h1>
<table style="border-collapse:collapse;width:100%">${table}</table>
<h2 style="font-size:16px;margin:24px 0 8px">Project details</h2>
<p style="white-space:pre-wrap;margin:0;line-height:1.5">${escapeHtml(v.details)}</p>
<p style="margin:24px 0 0;color:#4d4741;font-size:13px">Submitted ${escapeHtml(new Date().toUTCString())}. Reply to this email to answer the visitor directly.</p>
</div>`
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`)
}

let cached: { key: string; transporter: ReturnType<typeof nodemailer.createTransport> } | null = null

function transport() {
  const env = process.env
  const port = Number(env.SMTP_PORT) || 587
  const secure = env.SMTP_SECURE ? env.SMTP_SECURE === 'true' : port === 465
  const key = [env.SMTP_HOST, port, secure, env.SMTP_USER, env.SMTP_PASS].join('|')
  if (cached?.key !== key) {
    cached = {
      key,
      transporter: nodemailer.createTransport({
        host: env.SMTP_HOST,
        port,
        secure,
        auth: { user: env.SMTP_USER!, pass: env.SMTP_PASS! },
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 20_000,
      }),
    }
  }
  return cached.transporter
}

// ------------------------------------------------------------------ request helpers

function readBody(req: IncomingMessage): Promise<string | null> {
  return new Promise((resolve, reject) => {
    let size = 0
    let tooLarge = false
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => {
      size += chunk.length
      if (size > MAX_BODY_BYTES) tooLarge = true
      else chunks.push(chunk)
    })
    req.on('end', () => resolve(tooLarge ? null : Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function clientIp(req: IncomingMessage) {
  if (process.env.TRUST_PROXY === 'true') {
    const forwarded = String(req.headers['x-forwarded-for'] ?? '').split(',')[0].trim()
    if (forwarded) return forwarded
  }
  return req.socket.remoteAddress ?? 'unknown'
}

const attempts = new Map<string, number[]>()

/** Returns seconds to wait when the address is over the limit, otherwise records the attempt and returns 0. */
function rateLimited(ip: string) {
  const now = Date.now()
  const recent = (attempts.get(ip) ?? []).filter((time) => now - time < RATE_WINDOW_MS)
  if (recent.length >= RATE_MAX) {
    attempts.set(ip, recent)
    return Math.ceil((recent[0] + RATE_WINDOW_MS - now) / 1000)
  }
  recent.push(now)
  attempts.set(ip, recent)
  if (attempts.size > 5000) {
    for (const [key, times] of attempts) if (times.every((time) => now - time >= RATE_WINDOW_MS)) attempts.delete(key)
  }
  return 0
}

/** Logs without personal data or secrets: only an error's code, never its message or the addresses involved. */
function log(message: string, error?: unknown) {
  const detail = error && typeof error === 'object' ? (error as { code?: string; responseCode?: number }) : null
  const suffix = detail ? ` (${[detail.code, detail.responseCode].filter(Boolean).join(' ') || 'no code'})` : ''
  console.warn(`[contact] ${message}${suffix}`)
}
