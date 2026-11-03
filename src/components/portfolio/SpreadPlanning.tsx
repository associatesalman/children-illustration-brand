import { portfolioArt } from '../../content/portfolio'
import { ArtImage } from '../ui/ArtImage'
import { Accent, Eyebrow, Section } from '../ui/Section'

const points = [
  {
    title: 'Text placed first',
    body: 'Gray lines mark where the words will go: on a plain facing page, across an open sky, or over a quiet stretch of wall. The art is composed around them, so nothing important ends up under a paragraph.',
  },
  {
    title: 'A varied rhythm',
    body: 'Single-page scenes beside text alternate with full-bleed spreads, like the long view down the church aisle from behind the girl. Changing the scale keeps each page turn feeling new.',
  },
  {
    title: 'One character throughout',
    body: 'Her rounded hair, bow and dress stay the same from the first thumbnail to the last, so she is recognizable in a crowd scene as easily as in a close-up.',
  },
]

export function SpreadPlanning() {
  return (
    <Section id="page-planning" tone="sun" labelledBy="planning-title">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-20">
        <figure className="mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
          <ArtImage artwork={portfolioArt.spreadThumbnails} />
          <figcaption className="mt-3 text-sm">Ten double-page spreads planned as pencil thumbnails.</figcaption>
        </figure>

        <div className="max-w-2xl lg:col-span-7">
          <Eyebrow className="text-ink">Interior layout</Eyebrow>
          <h2 id="planning-title" className="text-display text-[clamp(2.1rem,1.5rem+2.4vw,3.6rem)] leading-[1.06]">
            Every page turn planned <Accent>before the color</Accent>
          </h2>
          <p className="mt-5 text-lg leading-relaxed">
            Before final art, a picture book is mapped out in small, quick sketches. This sample sheet plans ten
            spreads that follow one girl from her bedroom, along the street and into church, then home again. At this
            size a whole book fits on one page, and a change costs minutes rather than days.
          </p>

          <div className="mt-10 space-y-8">
            {points.map((point) => (
              <div key={point.title}>
                <h3 className="text-display text-2xl">{point.title}</h3>
                <p className="mt-2 text-lg leading-relaxed">{point.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
