import type { IncomingMessage, ServerResponse } from 'node:http'
import {
  checkFiles,
  extensionOf,
  fileKeysFor,
  formatBytes,
  fileRules,
  serviceById,
  summarize,
  validateRequest,
  type SummarySection,
} from '../src/lib/freeSample.ts'
import {
  acceptedBy,
  clientIp,
  createLogger,
  createRateLimiter,
  escapeHtml,
  missingEnv,
  type Result,
  sender,
  sendJson,
  SMTP_ENV,
  transport,
} from './mail.ts'

/**
 * POST /api/free-sample: a multipart request with one "payload" part (JSON: services, values, honeypot)
 * and any number of "file:<field key>" parts. The request is validated with the same rules as the browser
 * (src/lib/freeSample.ts), each file's type is confirmed from its contents, and the whole request is emailed
 * to the private inbox with the files attached. Nothing is written to disk; attachments live in memory
 * only for the time it takes to send them.
 *
 * Receiving address: FREE_SAMPLE_RECIPIENT_EMAIL, or CONTACT_RECIPIENT_EMAIL when that is not set. It is
 * server-side configuration only and is never sent to the browser.
 * Also required (shared with the contact form): CONTACT_FROM_EMAIL, SMTP_HOST, SMTP_USER, SMTP_PASS.
 * Optional: SMTP_PORT, SMTP_SECURE, CONTACT_FROM_NAME, TRUST_PROXY.
 */

// Files plus the JSON payload and multipart overhead.
const MAX_BODY_BYTES = fileRules.maxTotalBytes + 512 * 1024
const RATE_MAX = 5
const RATE_WINDOW_MS = 15 * 60 * 1000

const rateLimited = createRateLimiter(RATE_MAX, RATE_WINDOW_MS)
const log = createLogger('free-sample')

const contentTypes: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  txt: 'text/plain; charset=utf-8',
}

class TooLarge extends Error {}

export async function handleFreeSample(req: IncomingMessage, res: ServerResponse) {
  const result = await processRequest(req).catch((error: unknown): Result => {
    if (error instanceof TooLarge) return { status: 413, body: { ok: false, error: 'too-large' }, headers: { Connection: 'close' } }
    log('unexpected error', error)
    return { status: 500, body: { ok: false, error: 'server' } }
  })
  // Read and discard the rest of a rejected upload before answering: browsers report a reply sent while they
  // are still uploading as a network error, so the visitor would not see why. Bodies far beyond the limit
  // are not worth reading; those get the answer straight away and the connection closes.
  if (!req.readableEnded) {
    req.resume()
    if (Number(req.headers['content-length'] || 0) <= MAX_BODY_BYTES * 3) {
      await new Promise<void>((done) => {
        const timer = setTimeout(done, 30_000)
        const finish = () => {
          clearTimeout(timer)
          done()
        }
        req.once('end', finish)
        req.once('error', finish)
        req.once('close', finish)
      })
    }
  }
  sendJson(res, result)
}

async function processRequest(req: IncomingMessage): Promise<Result> {
  if (req.method !== 'POST') return { status: 405, body: { ok: false, error: 'method' }, headers: { Allow: 'POST' } }
  const contentType = String(req.headers['content-type'] ?? '')
  if (!contentType.startsWith('multipart/form-data')) return { status: 415, body: { ok: false, error: 'content-type' } }
  if (Number(req.headers['content-length']) > MAX_BODY_BYTES) throw new TooLarge()

  const retryAfter = rateLimited(clientIp(req))
  if (retryAfter) return { status: 429, body: { ok: false, error: 'rate-limit' }, headers: { 'Retry-After': String(retryAfter) } }

  let form: FormData
  try {
    form = await new Request('http://localhost/api/free-sample', {
      method: 'POST',
      headers: { 'content-type': contentType },
      body: limitedBody(req, MAX_BODY_BYTES),
      duplex: 'half',
    } as RequestInit).formData()
  } catch (error) {
    if (error instanceof TooLarge || (error as { cause?: unknown })?.cause instanceof TooLarge) throw new TooLarge()
    return { status: 400, body: { ok: false, error: 'invalid-body' } }
  }

  let input: { website?: unknown } & Record<string, unknown>
  try {
    const payload = form.get('payload')
    input = JSON.parse(typeof payload === 'string' ? payload : '')
  } catch {
    return { status: 400, body: { ok: false, error: 'invalid-json' } }
  }

  // Bots fill every field; people never see this one. Accept quietly and send nothing.
  if (typeof input?.website === 'string' && input.website.trim()) {
    log('honeypot triggered; request discarded')
    return { status: 200, body: { ok: true } }
  }

  const { selected, values, errors } = validateRequest(input)
  if (Object.keys(errors).length) return { status: 422, body: { ok: false, error: 'validation', errors } }

  // Files: only for file fields of the selected services, then checked by name, size and contents.
  const allowed = new Set(fileKeysFor(selected))
  const attachments: { key: string; name: string; content: Buffer; contentType: string }[] = []
  for (const [part, entry] of form.entries()) {
    if (!part.startsWith('file:')) continue
    const key = part.slice(5)
    if (!allowed.has(key) || typeof entry === 'string') return filesError('A file was attached to a field that is not part of this request.')
    const content = Buffer.from(await entry.arrayBuffer())
    const name = safeFileName(entry.name)
    attachments.push({ key, name, content, contentType: contentTypes[extensionOf(name)] ?? 'application/octet-stream' })
  }
  const problem = checkFiles(attachments.map((file) => ({ name: file.name, size: file.content.length })))
  if (problem) return filesError(problem)
  const mismatch = attachments.find((file) => !contentMatches(extensionOf(file.name), file.content))
  if (mismatch) return filesError(`“${mismatch.name}” does not look like a valid ${extensionOf(mismatch.name).toUpperCase()} file.`)

  const recipient = (process.env.FREE_SAMPLE_RECIPIENT_EMAIL?.trim() || process.env.CONTACT_RECIPIENT_EMAIL?.trim()) ?? ''
  const missing = [...(recipient ? [] : ['FREE_SAMPLE_RECIPIENT_EMAIL']), ...missingEnv(SMTP_ENV)]
  if (missing.length) {
    log(`email is not configured; missing ${missing.join(', ')}`)
    return { status: 503, body: { ok: false, error: 'unavailable' } }
  }

  const fileNames: Record<string, string[]> = {}
  for (const file of attachments) (fileNames[file.key] ??= []).push(`${file.name} (${formatBytes(file.content.length)})`)
  const sections = summarize(selected, values, fileNames)
  const serviceNames = selected.map((id) => serviceById[id].name)
  const fullName = String(values['contact.fullName'])

  try {
    const info = await transport().sendMail({
      from: sender(),
      to: recipient,
      replyTo: { name: fullName, address: String(values['contact.email']) },
      subject: truncate(`Free sample request: ${serviceNames.join(', ')} from ${fullName}`, 180),
      text: emailText(serviceNames, sections, attachments.length),
      html: emailHtml(serviceNames, sections, attachments.length),
      attachments: attachments.map((file) => ({
        filename: attachmentName(file.key, file.name),
        content: file.content,
        contentType: file.contentType,
        contentDisposition: 'attachment' as const,
      })),
    })
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

const filesError = (message: string): Result => ({ status: 422, body: { ok: false, error: 'files', message } })

/* ------------------------------------------------------------------ files */

/** The request body as a web stream that fails once it passes the size limit. */
function limitedBody(req: IncomingMessage, max: number) {
  let size = 0
  let done = false
  return new ReadableStream<Uint8Array>({
    start(controller) {
      req.on('data', (chunk: Buffer) => {
        if (done) return
        size += chunk.length
        if (size > max) {
          done = true
          controller.error(new TooLarge())
        } else controller.enqueue(new Uint8Array(chunk))
      })
      req.on('end', () => {
        if (!done) controller.close()
        done = true
      })
      req.on('error', (error) => {
        if (!done) controller.error(error)
        done = true
      })
    },
  })
}

const startsWith = (content: Buffer, bytes: number[], offset = 0) => bytes.every((byte, index) => content[offset + index] === byte)
const ascii = (text: string) => [...text].map((char) => char.charCodeAt(0))

/** Confirms the file's contents match its extension, so a renamed executable or script is refused. */
function contentMatches(extension: string, content: Buffer) {
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return startsWith(content, [0xff, 0xd8, 0xff])
    case 'png':
      return startsWith(content, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    case 'webp':
      return startsWith(content, ascii('RIFF')) && startsWith(content, ascii('WEBP'), 8)
    case 'pdf':
      return startsWith(content, ascii('%PDF-'))
    case 'docx':
      return startsWith(content, [0x50, 0x4b, 0x03, 0x04])
    case 'doc':
      return startsWith(content, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])
    case 'txt':
      try {
        new TextDecoder('utf-8', { fatal: true }).decode(content)
        return !content.includes(0)
      } catch {
        return false
      }
    default:
      return false
  }
}

/** A plain file name: no folders, control characters or unusual symbols, and a sensible length. */
function safeFileName(raw: string) {
  const base = raw.split(/[\\/]/).pop() ?? ''
  const extension = extensionOf(base)
  const stem = base
    .slice(0, extension ? -(extension.length + 1) : undefined)
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N} ._()-]+/gu, '_')
    .replace(/\s+/g, ' ')
    .replace(/^[ .]+|[ .]+$/g, '')
    .slice(0, 80)
  return `${stem || 'attachment'}${extension ? `.${extension}` : ''}`
}

/** Prefixes each attachment with its service, so files from several services stay identifiable. */
function attachmentName(key: string, name: string) {
  const serviceId = key.split('.')[1]
  const service = serviceById[serviceId]?.name.replace(/[^\p{L}\p{N} ]+/gu, '').trim()
  return service ? `${service} - ${name}` : name
}

/* ------------------------------------------------------------------ email */

const truncate = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1)}…` : text)

function emailText(serviceNames: string[], sections: SummarySection[], fileCount: number) {
  const lines = ['New free sample request from the Klutzbookpublishers website', '', 'SELECTED SERVICES', ...serviceNames.map((name) => `- ${name}`)]
  for (const section of sections) {
    lines.push('', section.title.toUpperCase())
    if (!section.rows.length) lines.push('(No additional details)')
    for (const row of section.rows) {
      lines.push(row.value.includes('\n') ? `${row.label}:\n${row.value}` : `${row.label}: ${row.value}`)
    }
  }
  lines.push(
    '',
    fileCount ? `${fileCount} file${fileCount === 1 ? '' : 's'} attached.` : 'No files attached.',
    `Submitted: ${new Date().toUTCString()}`,
    'Reply to this email to answer the visitor directly.',
  )
  return lines.join('\n')
}

function emailHtml(serviceNames: string[], sections: SummarySection[], fileCount: number) {
  const cell = 'padding:8px 12px;border-bottom:1px solid #e6dfd1;vertical-align:top;text-align:left'
  const sectionHtml = sections
    .map((section) => {
      const rows = section.rows.length
        ? section.rows
            .map(
              (row) =>
                `<tr><th style="${cell};width:200px;color:#4d4741;font-weight:600">${escapeHtml(row.label)}</th><td style="${cell};white-space:pre-wrap">${escapeHtml(row.value)}</td></tr>`,
            )
            .join('')
        : `<tr><td style="${cell};color:#4d4741">No additional details</td></tr>`
      return `<h2 style="font-size:17px;margin:28px 0 8px;padding:8px 12px;background:#ffc72c;color:#161412">${escapeHtml(section.title)}</h2>
<table style="border-collapse:collapse;width:100%">${rows}</table>`
    })
    .join('\n')
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#161412;max-width:720px">
<h1 style="font-size:21px;margin:0 0 12px">New free sample request from the Klutzbookpublishers website</h1>
<p style="margin:0 0 6px;font-weight:600">Selected services</p>
<ul style="margin:0;padding-left:20px;line-height:1.6">${serviceNames.map((name) => `<li>${escapeHtml(name)}</li>`).join('')}</ul>
${sectionHtml}
<p style="margin:24px 0 0;color:#4d4741;font-size:13px">${fileCount ? `${fileCount} file${fileCount === 1 ? '' : 's'} attached.` : 'No files attached.'} Submitted ${escapeHtml(new Date().toUTCString())}. Reply to this email to answer the visitor directly.</p>
</div>`
}
