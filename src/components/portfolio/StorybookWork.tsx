import { portfolioArt } from '../../content/portfolio'
import { ArtImage } from '../ui/ArtImage'
import { Accent, Section, SectionHeading } from '../ui/Section'

const notes = [
  {
    title: 'Characters read at a glance',
    body: 'Big round eyes, rosy cheeks and a bright red hood make the heroine easy to find on every page. The wolf’s long frame, hunched shoulders and sideways look tell young readers to be wary of him before a word is read aloud.',
  },
  {
    title: 'Painted settings with room for words',
    body: 'The forest is built in layers: flowers and ferns up front, an open path in the middle, soft trees behind. That leaves a quiet, pale clearing at top left where the text can sit without covering anyone.',
  },
  {
    title: 'Made for small hands',
    body: 'Both spreads are shown as a board book with thick pages and rounded corners, the format for the youngest readers. Short lines of text and large figures suit pages that are read aloud and pointed at.',
  },
]

export function StorybookWork() {
  return (
    <Section id="storybook" labelledBy="storybook-title">
      <SectionHeading
        id="storybook-title"
        eyebrow="Storybook illustration"
        title={
          <>
            A classic tale, illustrated as a <Accent>board book</Accent>
          </>
        }
        intro="This sample retells Little Red Riding Hood across two double-page spreads. The artwork on its own, then the printed mockups, show how the same pictures work on screen and in a child’s hands."
      />

      <figure className="mt-14 lg:mt-20">
        <ArtImage artwork={portfolioArt.forestSpread} />
        <figcaption className="mt-3 text-sm text-ink-soft">
          Forest spread, artwork only. Textured, painterly greens set the scene while the cartoon characters stay crisp
          against them.
        </figcaption>
      </figure>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:mt-16 lg:grid-cols-3 lg:gap-14">
        {notes.map((note) => (
          <div key={note.title} className="max-w-2xl">
            <h3 className="text-display text-2xl">{note.title}</h3>
            <p className="mt-2 text-lg leading-relaxed text-ink-soft">{note.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-1 gap-12 lg:mt-24 lg:grid-cols-2 lg:gap-10">
        <figure>
          <ArtImage artwork={portfolioArt.forestBoardBook} />
          <figcaption className="mt-3 text-sm text-ink-soft">
            Spread one in print. The text sits in the clearing, well away from both characters and the fold.
          </figcaption>
        </figure>
        <figure>
          <ArtImage artwork={portfolioArt.bedroomBoardBook} />
          <figcaption className="mt-3 text-sm text-ink-soft">
            Spread two: Grandmother’s bedroom. The dialogue runs in two columns across the wall, above the wolf in a
            frilled nightcap and glasses.
          </figcaption>
        </figure>
      </div>
    </Section>
  )
}
