import { artwork } from '../../content/artwork'
import { ArtImage } from '../ui/ArtImage'
import { ButtonLink } from '../ui/Button'
import { Container } from '../ui/Container'
import { Accent, Eyebrow } from '../ui/Section'

export function AboutHero() {
  return (
    <section aria-labelledby="about-hero-title" className="bg-white">
      <Container className="grid grid-cols-1 items-center gap-12 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16 lg:py-24">
        <div className="max-w-xl">
          <Eyebrow>About Children Book</Eyebrow>
          <h1 id="about-hero-title" className="text-display text-[clamp(2.6rem,1.6rem+3.6vw,4.75rem)] leading-[1.02]">
            A creative partner for people who write <Accent>for children.</Accent>
          </h1>
          <p className="mt-7 text-lg leading-relaxed text-ink-soft sm:text-xl">
            Children Book is an illustration studio for children&rsquo;s authors in the United States and the United
            Kingdom. We draw the characters and pages at the heart of your book, then help you publish and promote it,
            so one team carries your story from manuscript to bookshelf.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">
            <ButtonLink href="/contact">Discuss your story</ButtonLink>
            <ButtonLink href="/#illustration" variant="quiet">
              Explore illustration services
            </ButtonLink>
          </div>
        </div>

        <ArtImage artwork={artwork.aboutHero} priority />
      </Container>
    </section>
  )
}
