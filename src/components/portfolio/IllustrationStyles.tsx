import { portfolioArt } from '../../content/portfolio'
import { ArtImage } from '../ui/ArtImage'
import { Accent, Eyebrow, Section } from '../ui/Section'

/** Documented styles, pointed at the sample on this page that shows each one. */
const styles = [
  {
    name: 'Cartoon',
    body: 'Rounded shapes, oversized eyes and clear outlines, as in the Little Red Riding Hood spreads and the expression sheet.',
    href: '#storybook',
    link: 'See the storybook spreads',
  },
  {
    name: 'Flat color',
    body: 'Even fills, a single line weight and no shading, as in the color character turnaround.',
    href: '#character-design',
    link: 'See the turnaround',
  },
  {
    name: 'Realistic, 3D/detailed and comic book',
    body: 'Also part of our illustration services. A free sample is the best way to see one of these styles applied to your own story.',
    href: '/free-sample',
    link: 'Ask for a free sample',
  },
]

export function IllustrationStyles() {
  return (
    <Section id="styles" tone="sun" labelledBy="styles-title">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-20">
        <div className="max-w-2xl lg:col-span-7">
          <Eyebrow className="text-ink">Illustration styles</Eyebrow>
          <h2 id="styles-title" className="text-display text-[clamp(2.1rem,1.5rem+2.4vw,3.6rem)] leading-[1.06]">
            Choose the right style <Accent>for your story</Accent>
          </h2>
          <p className="mt-5 text-lg leading-relaxed">
            Style decides how a book feels before a word is read: playful, gentle, serious or bold. The samples on this
            page cover three of the approaches we work in.
          </p>

          <h3 className="text-display mt-12 text-3xl">Watercolor</h3>
          <p className="mt-3 text-lg leading-relaxed">
            In this portrait, loose washes of teal and slate bleed into the paper behind a boy with flame-orange hair,
            a rumpled blue shirt and a green backpack. The drips and splatters are left visible, while his face is
            painted with close, realistic detail. The steady, wary look over his shoulder gives the piece a quiet,
            serious mood that suits older picture books and stories for confident readers.
          </p>

          <dl className="mt-12 space-y-8">
            {styles.map((style) => (
              <div key={style.name} className="border-t border-ink/20 pt-6">
                <dt className="text-display text-2xl">{style.name}</dt>
                <dd className="mt-2 text-lg leading-relaxed">
                  {style.body}{' '}
                  <a
                    href={style.href}
                    className="font-medium whitespace-nowrap underline decoration-2 underline-offset-4 hover:decoration-brand-red"
                  >
                    {style.link}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <figure className="mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
          <ArtImage artwork={portfolioArt.watercolorPortrait} />
          <figcaption className="mt-3 text-sm">Watercolor portrait with realistic detail.</figcaption>
        </figure>
      </div>
    </Section>
  )
}
