import { ongoingSupport } from '../../content/about'
import { artwork } from '../../content/artwork'
import { ArtImage } from '../ui/ArtImage'
import { Accent, Section, SectionHeading } from '../ui/Section'

export function BeyondFirstBook() {
  return (
    <Section id="beyond-the-first-book" tone="paper" labelledBy="beyond-title">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            id="beyond-title"
            eyebrow="Beyond the first book"
            title={
              <>
                Support that continues <Accent>after launch day</Accent>
              </>
            }
            intro="A published book is a beginning. We aim to work with authors over the long term, so each book builds on the last."
          />

          <dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {ongoingSupport.map((item) => (
              <div key={item.title} className="border-t-2 border-sun pt-4">
                <dt className="text-lg font-bold">{item.title}</dt>
                <dd className="mt-1 leading-relaxed text-ink-soft">{item.body}</dd>
              </div>
            ))}
          </dl>
        </div>

        <figure>
          <ArtImage artwork={artwork.series} />
          <figcaption className="mt-3 text-sm text-ink-soft">
            A studio sample series, with the fourth book still in sketch. Original artwork.
          </figcaption>
        </figure>
      </div>
    </Section>
  )
}
