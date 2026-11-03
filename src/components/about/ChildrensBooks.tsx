import { characterCraft, pageCraft } from '../../content/about'
import { artwork, type Artwork } from '../../content/artwork'
import { exampleArt } from '../../content/exampleArt'
import { ArtImage } from '../ui/ArtImage'
import { Accent, Section, SectionHeading } from '../ui/Section'

export function ChildrensBooks() {
  return (
    <Section id="childrens-books" tone="paper" labelledBy="craft-title">
      <SectionHeading
        id="craft-title"
        eyebrow="What we understand"
        title={
          <>
            Children read the pictures <Accent>before the words</Accent>
          </>
        }
        intro="A general publisher can format a manuscript. A children’s book also has to work for a reader who may be four years old, and for the adult reading it aloud. These are the details we pay attention to."
      />

      <CraftRow
        artwork={exampleArt.characterSpread}
        caption="Example spread: one character kept consistent across four poses and expressions."
        points={characterCraft}
      />
      <CraftRow
        artwork={artwork.layouts}
        caption="The same story told through three layouts: full bleed, vignette, and split page."
        points={pageCraft}
        reverse
      />
    </Section>
  )
}

type CraftRowProps = {
  artwork: Artwork
  caption: string
  points: { title: string; body: string }[]
  reverse?: boolean
}

function CraftRow({ artwork: art, caption, points, reverse = false }: CraftRowProps) {
  return (
    <div className="mt-14 grid grid-cols-1 items-center gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-16">
      <figure className={`lg:col-span-7 ${reverse ? 'lg:order-2' : ''}`}>
        <ArtImage artwork={art} />
        <figcaption className="mt-3 text-sm text-ink-soft">{caption}</figcaption>
      </figure>
      <div className="space-y-8 lg:col-span-5">
        {points.map((point) => (
          <div key={point.title}>
            <h3 className="text-display text-2xl">{point.title}</h3>
            <p className="mt-2 text-lg leading-relaxed text-ink-soft">{point.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
