import { ambitions } from '../../content/about'
import { exampleArt } from '../../content/exampleArt'
import { ArtImage } from '../ui/ArtImage'
import { Accent, Section, SectionHeading } from '../ui/Section'

export function PurposeVision() {
  return (
    <Section id="purpose" labelledBy="purpose-title">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,4fr)] lg:gap-20">
        <div>
          <SectionHeading
            id="purpose-title"
            eyebrow="Purpose and vision"
            title={
              <>
                Books children enjoy and <Accent>families keep</Accent>
              </>
            }
          />
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Many authors have a story worth telling but need help with the creative and technical work of turning it
            into a book. Our purpose is to give them professional illustration, editing, design, and publishing
            support, so the finished book is one children enjoy and families value.
          </p>

          <h3 className="mt-12 text-sm font-bold tracking-[0.08em] text-brand-red uppercase">What we are working toward</h3>
          <ol className="mt-5 space-y-5">
            {ambitions.map((ambition, index) => (
              <li key={ambition} className="grid grid-cols-[2.5rem_1fr] gap-3 text-lg leading-relaxed">
                <span aria-hidden className="text-display text-2xl leading-tight text-brand-red">
                  {index + 1}
                </span>
                <span>{ambition}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Shown no wider than its 488px source so it stays sharp. */}
        <figure className="mx-auto w-full max-w-[30.5rem]">
          <ArtImage artwork={exampleArt.familyWorkshop} />
          <figcaption className="mt-3 text-sm text-ink-soft">
            Example illustration: a family moment of the kind children&rsquo;s books are made for.
          </figcaption>
        </figure>
      </div>
    </Section>
  )
}
