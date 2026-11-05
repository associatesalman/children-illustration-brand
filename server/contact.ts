import type { IncomingMessage, ServerResponse } from 'node:http'
import { validateInquiry, type InquiryValues } from '../src/lib/inquiry.ts'
import { acceptedBy, clientIp, createLogger, createRateLimiter, escapeHtml, missingEnv, type Result, sender, sendJson, SMTP_ENV, transport } from './mail.ts'

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

const REQUIRED_ENV = ['CONTACT_RECIPIENT_EMAIL', ...SMTP_ENV] as const

const MAX_BODY_BYTES = 16 * 1024
const RATE_WINDOW_MS = 15 * 60 * 1000
const RATE_MAX = 5
const HONEYPOT_FIELD = 'website'

const rateLimited = createRateLimiter(RATE_MAX, RATE_WINDOW_MS)
const log = createLogger('contact')

export async function handleContact(req: IncomingMessage, res: ServerResponse) {
  const result = await processRequest(req).catch((error: unknown): Result => {
    log('unexpected error', error)
    return { status: 500, body: { ok: false, error: 'server' } }
  })
  sendJson(res, result)
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

  const missing = missingEnv(REQUIRED_ENV)
  if (missing.length) {
    log(`email is not configured; missing ${missing.join(', ')}`)
    return { status: 503, body: { ok: false, error: 'unavailable' } }
  }

  try {
    const recipient = process.env.CONTACT_RECIPIENT_EMAIL!.trim()
    const info = await transport().sendMail({
      from: sender(),
      to: recipient,
      replyTo: { name: values.fullName, address: values.email },
      subject: `New inquiry: ${values.mainService} from ${values.fullName}`,
      text: emailText(values),
      html: emailHtml(values),
    })
    // Success only when the provider accepted the message for our recipient.
    if (!acceptedBy(info, recipient)) {
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
    'New inquiry from the klutzbookpublisher contact page',
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
<h1 style="font-size:20px;margin:0 0 16px">New inquiry from the klutzbookpublisher contact page</h1>
<table style="border-collapse:collapse;width:100%">${table}</table>
<h2 style="font-size:16px;margin:24px 0 8px">Project details</h2>
<p style="white-space:pre-wrap;margin:0;line-height:1.5">${escapeHtml(v.details)}</p>
<p style="margin:24px 0 0;color:#4d4741;font-size:13px">Submitted ${escapeHtml(new Date().toUTCString())}. Reply to this email to answer the visitor directly.</p>
</div>`
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

