import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer, type ServerResponse } from 'node:http'
import { extname, join, normalize, resolve, sep } from 'node:path'
import { handleContact } from './contact.ts'
import { handleFreeSample } from './freeSample.ts'

/**
 * Production server: serves the built site from dist/, falls back to
 * index.html for client-side routes (/about, /portfolio, /contact), and handles
 * POST /api/contact and POST /api/free-sample. Start with `npm run build && npm start`.
 */

const root = resolve('dist')
const port = Number(process.env.PORT) || 3000

const types: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.mp4': 'video/mp4',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
}

const baseHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'SAMEORIGIN',
}

const server = createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? '/', 'http://localhost')

  if (pathname === '/api/contact') {
    for (const [name, value] of Object.entries(baseHeaders)) res.setHeader(name, value)
    return handleContact(req, res)
  }
  if (pathname === '/api/free-sample') {
    for (const [name, value] of Object.entries(baseHeaders)) res.setHeader(name, value)
    return handleFreeSample(req, res)
  }
  if (pathname.startsWith('/api/')) return send(res, 404, 'Not found')
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed')

  // Resolve inside dist/ only.
  const file = normalize(join(root, decodeURIComponent(pathname)))
  if (file !== root && !file.startsWith(root + sep)) return send(res, 404, 'Not found')

  const found = await stat(file).then((s) => (s.isFile() ? file : null), () => null)
  const target = found ?? (extname(pathname) ? null : join(root, 'index.html'))
  if (!target) return send(res, 404, 'Not found')

  const { size } = await stat(target)
  const headers = {
    ...baseHeaders,
    'Content-Type': types[extname(target)] ?? 'application/octet-stream',
    // Hashed build assets never change; pages must always be fresh.
    'Cache-Control': target.includes(`${sep}assets${sep}`) ? 'public, max-age=31536000, immutable' : 'no-cache',
    'Accept-Ranges': 'bytes',
  }

  // Byte ranges let videos stream and seek (Safari will not play video without them).
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? '')
  if (range && (range[1] || range[2])) {
    const start = range[1] ? Number(range[1]) : Math.max(size - Number(range[2]), 0)
    const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1
    if (start > end) {
      res.writeHead(416, { ...baseHeaders, 'Content-Range': `bytes */${size}` })
      return res.end()
    }
    res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1 })
    if (req.method === 'HEAD') return res.end()
    return void createReadStream(target, { start, end }).pipe(res)
  }

  res.writeHead(200, { ...headers, 'Content-Length': size })
  if (req.method === 'HEAD') return res.end()
  createReadStream(target).pipe(res)
})

function send(res: ServerResponse, status: number, message: string) {
  res.writeHead(status, { ...baseHeaders, 'Content-Type': 'text/plain; charset=utf-8' })
  res.end(message)
}

server.listen(port, () => console.log(`klutzbookpublisher running on http://localhost:${port}`))
