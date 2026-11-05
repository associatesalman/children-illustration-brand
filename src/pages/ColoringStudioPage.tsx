import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router'
import { ColoringCta } from '../components/coloring/ColoringCta'
import { ColoringEditor } from '../components/coloring/ColoringEditor'
import { ColoringLibrary } from '../components/coloring/ColoringLibrary'
import { Container } from '../components/ui/Container'
import { findSheet } from '../content/coloringSheets'
import { usePageMeta } from '../lib/pageMeta'

const description =
  'Free online coloring pages from klutzbookpublisher. Choose a drawing, color it in your browser and pick up where you left off. No sign-up needed.'

/**
 * Coloring Studio: /coloring-studio shows the library, /coloring-studio?sheet=<id> opens a drawing.
 * Loaded on demand (see App.tsx), so no other page downloads the studio.
 */
export default function ColoringStudioPage() {
  const [params] = useSearchParams()
  const sheetId = params.get('sheet')
  const entry = findSheet(sheetId)
  const unknownId = sheetId !== null && !entry ? sheetId : null
  usePageMeta(entry ? `${entry.title} Coloring Page` : 'Free Online Coloring Studio', description)

  // Switching between the library and a drawing (including Back/Forward): show the new view from the top and move
  // keyboard focus to its heading. The first render keeps the site's normal page-load behaviour.
  const view = entry?.id ?? 'library'
  const previousView = useRef<string | null>(null)
  useEffect(() => {
    const previous = previousView.current
    previousView.current = view
    if (previous === null || previous === view) return
    window.scrollTo(0, 0)
    document.getElementById(entry ? 'sheet-title' : 'studio-title')?.focus({ preventScroll: true })
  }, [view, entry])

  return (
    <>
      <section aria-labelledby="studio-title" className="bg-white">
        <Container wide={!!entry} className={entry ? 'pt-6 pb-4 sm:pt-8' : 'pt-12 pb-10 sm:pt-16 lg:pt-20'}>
          <h1
            id="studio-title"
            tabIndex={-1}
            className={`text-display ${entry ? 'text-2xl sm:text-3xl' : 'text-[clamp(2.4rem,1.7rem+2.6vw,4rem)] leading-[1.05]'}`}
          >
            Free Online Coloring Studio
          </h1>
          {!entry && (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Choose a drawing and color it right here in your browser. Fill shapes with colors, fades and patterns,
              paint with a marker, crayon or airbrush, then download or print your page. Come back any time: your coloring is saved on this device.
            </p>
          )}
        </Container>
        {entry ? <ColoringEditor key={entry.id} entry={entry} /> : <ColoringLibrary unknownId={unknownId} />}
      </section>
      <ColoringCta />
    </>
  )
}
