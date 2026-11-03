import type { CSSProperties } from 'react'
import { mediaLogos } from '../../content/home'
import { Container } from '../ui/Container'
import { Accent } from '../ui/Section'

// Three copies keep the strip filled on very wide screens; the track moves by one copy per loop.
const COPIES = 3

export function MediaMarquee() {
  return (
    <section aria-labelledby="media-title" className="border-b border-ink/10 bg-white py-16 sm:py-20">
      <Container className="text-center">
        <h2 id="media-title" className="text-display text-[clamp(1.9rem,1.4rem+1.8vw,3rem)] leading-tight">
          Get featured &amp; amplify <Accent>your success</Accent>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-ink-soft">
          Publications we can target when pitching your book in press outreach. Children Book is not affiliated with
          these outlets, and coverage is not guaranteed.
        </p>
      </Container>

      <div
        className="marquee mt-12 overflow-hidden focus-visible:outline-offset-[-3px]"
        tabIndex={0}
        role="region"
        aria-label="Media outreach targets"
      >
        <ul className="marquee-track flex w-max items-center">
          {Array.from({ length: COPIES }, (_, copy) =>
            mediaLogos.map((logo) => (
              <li
                key={`${copy}-${logo.name}`}
                aria-hidden={copy > 0 || undefined}
                className={`flex h-20 shrink-0 items-center px-8 sm:h-24 sm:px-12 lg:px-16 ${copy > 0 ? 'marquee-clone' : ''}`}
              >
                <img
                  src={logo.src}
                  alt={copy > 0 ? '' : logo.name}
                  width={logo.width}
                  height={logo.height}
                  loading="lazy"
                  decoding="async"
                  style={{ '--logo-h': `${logo.height}px` } as CSSProperties}
                  className="h-[calc(var(--logo-h)*0.75)] w-auto max-w-none sm:h-(--logo-h)"
                />
              </li>
            )),
          )}
        </ul>
      </div>
    </section>
  )
}
