import { artwork } from '../../content/artwork'
import { ButtonLink } from '../ui/Button'
import { Container } from '../ui/Container'
import { Accent, Eyebrow } from '../ui/Section'

export function Hero() {
  const art = artwork.hero
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-sun lg:flex lg:min-h-[calc(100svh-4.5rem)] lg:items-center"
    >
      {/* Wide screens: the scene fills the hero and its open sky on the left holds the text. */}
      <img
        src={art.src}
        alt={art.alt}
        width={art.width}
        height={art.height}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 hidden size-full object-cover object-bottom-right lg:block"
      />

      <Container className="relative pt-14 pb-10 sm:pt-20 lg:py-24">
        <div className="max-w-xl lg:max-w-[min(34rem,38vw)]">
          <Eyebrow className="text-ink">Children&rsquo;s book illustration studio</Eyebrow>
          <h1 id="hero-title" className="text-display text-[clamp(2.75rem,1.7rem+4.2vw,5.5rem)] leading-none">
            Your story, <Accent>beautifully illustrated.</Accent>
          </h1>
          <p className="mt-7 max-w-md text-lg leading-relaxed sm:text-xl">
            We design your characters, illustrate every page, and help your book reach young readers, all with one
            team for authors in the US and UK.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">
            <ButtonLink href="#free-sample">Request a free sample</ButtonLink>
            <ButtonLink href="#portfolio" variant="quiet">
              See our work
            </ButtonLink>
          </div>
        </div>
      </Container>

      {/* Small screens: the same scene below the text, cropped to the characters. */}
      <img
        src={art.src}
        alt={art.alt}
        width={art.width}
        height={art.height}
        fetchPriority="high"
        decoding="async"
        className="block aspect-4/3 w-full object-cover object-[80%_100%] lg:hidden"
      />
    </section>
  )
}
