import { portfolioArt } from '../../content/portfolio'
import { ArtImage } from '../ui/ArtImage'
import { Checklist } from '../ui/Checklist'
import { Accent, Section, SectionHeading } from '../ui/Section'

const sheetContents = [
  'Front, three-quarter, side and back views',
  'Shared guidelines that lock height and proportions',
  'Clothing details that only show from behind',
  'A final color reference for every page',
]

const expressions = [
  { name: 'Worried', detail: 'raised inner brows, a crooked, pressed mouth' },
  { name: 'Startled', detail: 'wide eyes, a small round mouth' },
  { name: 'Laughing', detail: 'head tipped back, mouth wide open' },
  { name: 'Delighted', detail: 'eyes bright, an open, upturned smile' },
  { name: 'Unsure', detail: 'one brow lifted, a hesitant half-smile' },
  { name: 'Beaming', detail: 'cheeks raised, a full grin' },
]

export function CharacterWork() {
  return (
    <Section id="character-design" labelledBy="character-title">
      <SectionHeading
        id="character-title"
        eyebrow="Character design"
        title={
          <>
            Characters children <Accent>remember</Accent>
          </>
        }
        intro="We develop each character from their personality, emotions, age group and the needs of the story. Character sheets then keep them consistent from the first page to the last."
      />

      <div className="mt-14 grid grid-cols-1 gap-12 lg:mt-20 lg:grid-cols-2 lg:items-end lg:gap-10">
        <figure>
          <ArtImage artwork={portfolioArt.modelSheetPencil} />
          <figcaption className="mt-3 text-sm text-ink-soft">
            Main character model sheet in pencil. Five views on shared guidelines; the rear views show the tie at the
            back of her dress.
          </figcaption>
        </figure>
        <figure>
          <ArtImage artwork={portfolioArt.turnaroundColor} />
          <figcaption className="mt-3 text-sm text-ink-soft">
            Color turnaround of a second character, fixing the knit hat, curls, checkered wristband and wide-leg
            trousers.
          </figcaption>
        </figure>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
        <h3 className="text-display text-3xl lg:col-span-5">Character sheets</h3>
        <div className="lg:col-span-7">
          <p className="max-w-2xl text-lg leading-relaxed text-ink-soft">
            A turnaround answers the questions an illustrator meets on every spread: how the hair falls from the side,
            where a clip or a bow sits, what the back of an outfit looks like. Settling them once means a character
            never changes shape between scenes.
          </p>
          <Checklist items={sheetContents} className="mt-6 text-lg" />
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 items-center gap-12 lg:mt-28 lg:grid-cols-12 lg:gap-20">
        <div className="max-w-2xl lg:col-span-7">
          <h3 className="text-display text-[clamp(1.9rem,1.5rem+1.4vw,2.6rem)] leading-[1.1]">Character expressions</h3>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            Children read feelings from faces long before they can read the words. In this sample sheet the hair,
            features and white top never change; only the brows, eyes, mouth and tilt of the head do. Loose pencil lines
            and soft color keep each study light and expressive.
          </p>
          <dl className="mt-8 grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
            {expressions.map((expression) => (
              <div key={expression.name} className="border-t border-ink/15 pt-3">
                <dt className="font-semibold">{expression.name}</dt>
                <dd className="text-ink-soft">{expression.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
        <figure className="mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
          <ArtImage artwork={portfolioArt.expressionSheet} />
          <figcaption className="mt-3 text-sm text-ink-soft">
            Expression sheet: six moods for one character, read left to right, top to bottom.
          </figcaption>
        </figure>
      </div>
    </Section>
  )
}
