import { artwork } from '../../content/artwork'
import { characterPoints } from '../../content/home'
import { ArtImage } from '../ui/ArtImage'
import { Accent, Section, SectionHeading } from '../ui/Section'

export function CharacterDesign() {
  return (
    <Section id="characters" tone="paper" labelledBy="characters-title">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,8fr)] lg:gap-16">
        <div>
          <SectionHeading
            id="characters-title"
            eyebrow="Character design"
            title={
              <>
                Characters children <Accent>remember</Accent>
              </>
            }
            intro="We design each character around their personality, age, and role in the story, then build a reference sheet so they look right on every page."
          />
          <ol className="mt-10 space-y-7">
            {characterPoints.map((point, index) => (
              <li key={point.title} className="grid grid-cols-[2.5rem_1fr] gap-x-3">
                <span aria-hidden className="text-display text-2xl text-brand-red">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-lg font-bold">{point.title}</h3>
                  <p className="mt-1 text-ink-soft">{point.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <figure>
          <ArtImage artwork={artwork.characterSheet} className="rounded-sm" />
          <figcaption className="mt-4 text-sm text-ink-soft">
            Turnaround and expression sheet for Mia, a studio sample character.
          </figcaption>
        </figure>
      </div>
    </Section>
  )
}
