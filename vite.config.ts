import { readdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { handleContact } from './server/contact.ts'
import { handleFreeSample } from './server/freeSample.ts'

// Source Word documents and the raw About, portfolio, book-cover, illustration-style, character-design and other service-page files live in public/ for
// reference only; strip them from the production build (the pages use optimized copies from src/assets).
function excludeSourceDocuments(): Plugin {
  let outDir = 'dist'
  return {
    name: 'exclude-source-documents',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      for (const folder of ['about-mockups', 'portfolio', 'illustration books', 'illustration style service', 'character design', 'activity book illustration', 'storybook illustration', 'book publication and distribution', 'editing and proofreading', 'book marketing', 'children book translation', '2d & 3d animation']) rmSync(join(outDir, folder), { recursive: true, force: true })
      // Supplied brand and hero-video sources; the site uses the copies made by scripts/build_brand_assets.py and
      // scripts/optimize_home_video.py.
      for (const file of ['klutz-logo.png', 'site-title.png', 'klutz-home-video.mp4']) rmSync(join(outDir, file), { force: true })
      for (const entry of readdirSync(outDir, { recursive: true, encoding: 'utf8' })) {
        if (/\.(docx?|dotx)$/i.test(entry)) rmSync(join(outDir, entry))
      }
    },
  }
}

// Serves POST /api/contact and /api/free-sample from the dev and preview servers, using the same handlers as server/index.ts.
function contactApi(): Plugin {
  return {
    name: 'contact-api',
    configureServer(server) {
      server.middlewares.use('/api/contact', (req, res) => void handleContact(req, res))
      server.middlewares.use('/api/free-sample', (req, res) => void handleFreeSample(req, res))
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/contact', (req, res) => void handleContact(req, res))
      server.middlewares.use('/api/free-sample', (req, res) => void handleFreeSample(req, res))
    },
  }
}

// With VITE_SITE_URL set (the public production origin), writes absolute canonical, og:url and og:image tags into
// index.html for crawlers that don't run JavaScript. Unset, no URL tags are written rather than guessing a domain.
function siteUrlTags(siteUrl: string): Plugin {
  return {
    name: 'site-url-tags',
    transformIndexHtml() {
      if (!siteUrl) return []
      return [
        { tag: 'link', attrs: { rel: 'canonical', href: `${siteUrl}/` }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:url', content: `${siteUrl}/` }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:image', content: `${siteUrl}/icon-512.png` }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'twitter:image', content: `${siteUrl}/icon-512.png` }, injectTo: 'head' },
      ]
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Server-only settings from .env for the dev/preview API. Only VITE_ variables ever reach the browser,
  // so the recipient address and SMTP credentials stay out of the bundle.
  //
  // Vite restarts in the same process when .env changes, so the values copied on the previous load are replaced
  // each time (a plain `??=` kept the first, possibly empty, value and the API answered 503 until a manual restart).
  // Variables that were already set in the real environment before the first load still take priority. loadEnv lets
  // process.env override the files, so the copies from the previous load are removed before .env is read again.
  const state = globalThis as { __shellEnvNames?: Set<string>; __dotenvNames?: Set<string> }
  state.__shellEnvNames ??= new Set(Object.keys(process.env).filter((name) => process.env[name] !== undefined))
  state.__dotenvNames ??= new Set()
  for (const name of state.__dotenvNames) delete process.env[name]
  state.__dotenvNames.clear()
  const env = loadEnv(mode, process.cwd(), ['CONTACT_', 'FREE_SAMPLE_', 'SMTP_', 'TRUST_PROXY'])
  for (const [name, value] of Object.entries(env)) {
    if (state.__shellEnvNames.has(name)) continue
    process.env[name] = value
    state.__dotenvNames.add(name)
  }
  const siteUrl = (process.env.VITE_SITE_URL ?? loadEnv(mode, process.cwd(), 'VITE_').VITE_SITE_URL ?? '').trim().replace(/\/+$/, '')

  return {
    plugins: [react(), tailwindcss(), excludeSourceDocuments(), contactApi(), siteUrlTags(siteUrl)],
  }
})
