import type { IncomingMessage, ServerResponse } from 'node:http'
import nodemailer from 'nodemailer'

/**
 * Shared server helpers for the form endpoints (contact.ts, freeSample.ts): the SMTP transport, the sender,
 * JSON responses, client IP, rate limiting and privacy-safe logging. Credentials and the receiving
 * addresses come from environment variables and never reach the browser.
 */

export const SMTP_ENV = ['CONTACT_FROM_EMAIL', 'SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'] as const

export type Result = { status: number; body: Record<string, unknown>; headers?: Record<string, string> }

export function sendJson(res: ServerResponse, result: Result) {
  res.writeHead(result.status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...result.headers,
  })
  res.end(JSON.stringify(result.body))
}

/** Names of the given variables that are missing or blank. */
export const missingEnv = (names: readonly string[]) => names.filter((name) => !process.env[name]?.trim())

export function sender() {
  return { name: process.env.CONTACT_FROM_NAME?.trim() || 'Klutzbookpublishers website', address: process.env.CONTACT_FROM_EMAIL!.trim() }
}

/** True only when the provider accepted the message for the recipient and rejected no one. */
export function acceptedBy(info: { accepted: (string | { address: string })[]; rejected: unknown[] }, recipient: string) {
  const accepted = info.accepted.map((entry) => (typeof entry === 'string' ? entry : entry.address).toLowerCase())
  return accepted.includes(recipient.toLowerCase()) && !info.rejected.length
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`)
}

let cached: { key: string; transporter: ReturnType<typeof nodemailer.createTransport> } | null = null

export function transport() {
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
        // Large attachments take longer to send.
        socketTimeout: 60_000,
      }),
    }
  }
  return cached.transporter
}

export function clientIp(req: IncomingMessage) {
  if (process.env.TRUST_PROXY === 'true') {
    const forwarded = String(req.headers['x-forwarded-for'] ?? '').split(',')[0].trim()
    if (forwarded) return forwarded
  }
  return req.socket.remoteAddress ?? 'unknown'
}

/** A per-IP sliding-window limiter. The returned function gives seconds to wait, or 0 after recording the attempt. */
export function createRateLimiter(max: number, windowMs: number) {
  const attempts = new Map<string, number[]>()
  return (ip: string) => {
    const now = Date.now()
    const recent = (attempts.get(ip) ?? []).filter((time) => now - time < windowMs)
    if (recent.length >= max) {
      attempts.set(ip, recent)
      return Math.ceil((recent[0] + windowMs - now) / 1000)
    }
    recent.push(now)
    attempts.set(ip, recent)
    if (attempts.size > 5000) {
      for (const [key, times] of attempts) if (times.every((time) => now - time >= windowMs)) attempts.delete(key)
    }
    return 0
  }
}

/** Logs without personal data or secrets: only an error's code, never its message or the addresses involved. */
export function createLogger(scope: string) {
  return (message: string, error?: unknown) => {
    const detail = error && typeof error === 'object' ? (error as { code?: string; responseCode?: number }) : null
    const suffix = detail ? ` (${[detail.code, detail.responseCode].filter(Boolean).join(' ') || 'no code'})` : ''
    console.warn(`[${scope}] ${message}${suffix}`)
  }
}
