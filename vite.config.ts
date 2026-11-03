import { readdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { handleContact } from './server/contact.ts'

// Source Word documents and the raw About, portfolio, book-cover, illustration-style and character-design files live in public/ for
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
      for (const folder of ['about-mockups', 'portfolio', 'illustration books', 'illustration style service', 'character design', 'activity book illustration']) rmSync(join(outDir, folder), { recursive: true, force: true })
      for (const entry of readdirSync(outDir, { recursive: true, encoding: 'utf8' })) {
        if (/\.(docx?|dotx)$/i.test(entry)) rmSync(join(outDir, entry))
      }
    },
  }
}

// Serves POST /api/contact from the dev and preview servers, using the same handler as server/index.ts.
function contactApi(): Plugin {
  return {
    name: 'contact-api',
    configureServer(server) {
      server.middlewares.use('/api/contact', (req, res) => void handleContact(req, res))
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/contact', (req, res) => void handleContact(req, res))
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Server-only settings from .env for the dev/preview API. Only VITE_ variables ever reach the browser,
  // so the recipient address and SMTP credentials stay out of the bundle.
  const env = loadEnv(mode, process.cwd(), ['CONTACT_', 'SMTP_', 'TRUST_PROXY'])
  for (const [name, value] of Object.entries(env)) process.env[name] ??= value

  return {
    plugins: [react(), tailwindcss(), excludeSourceDocuments(), contactApi()],
  }
})
