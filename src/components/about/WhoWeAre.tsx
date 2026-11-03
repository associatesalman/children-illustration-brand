import { disciplines } from '../../content/about'
import { exampleArt } from '../../content/exampleArt'
import { ArtImage } from '../ui/ArtImage'
import { Section, SectionHeading } from '../ui/Section'

export function WhoWeAre() {
  return (
    <Section id="who-we-are" tone="paper" labelledBy="who-title">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-20">
        <div>
          <SectionHeading
            id="who-title"
            eyebrow="Who we are"
            title="Illustration first, with publishing and marketing on the same team"
          />
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-soft">
            <p>
              We work on children&rsquo;s books and nothing else. Illustration is the center of that work: character
              design, picture book and storybook pages, covers, and coloring and activity books.
            </p>
            <p>
              Around it, we offer the editorial, design, publishing, and marketing services a finished book needs.
              Instead of hiring each specialist separately, you work with one coordinated team that knows your
              characters, your readers, and your goals.
            </p>
          </div>

          <dl className="mt-10 divide-y divide-ink/15 border-y border-ink/15">
            {disciplines.map((item) => (
              <div key={item.title} className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <dt className="text-display text-xl">{item.title}</dt>
                <dd className="leading-relaxed text-ink-soft">{item.body}</dd>
              </div>
            ))}
          </dl>
        </div>

        <figure className="lg:order-first">
          <ArtImage artwork={exampleArt.readerDiscovery} />
          <figcaption className="mt-3 text-sm text-ink-soft">
            Example interior illustration: a moment of discovery carried by expression, color, and detail.
          </figcaption>
        </figure>
      </div>
    </Section>
  )
}
