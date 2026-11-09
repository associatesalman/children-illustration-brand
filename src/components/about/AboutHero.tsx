import { ButtonLink } from '../ui/Button'
import { Container } from '../ui/Container'
import { Accent, Eyebrow } from '../ui/Section'

/** Plain white hero with the copy centred; a short red rule is the only accent. No image. */
export function AboutHero() {
  return (
    <section aria-labelledby="about-hero-title" className="border-b border-ink/10 bg-white">
      <Container className="py-20 text-center sm:py-24 lg:py-32">
        <div className="mx-auto max-w-[54rem]">
          <Eyebrow>About Klutz</Eyebrow>
          <h1
            id="about-hero-title"
            className="text-display text-[clamp(2.75rem,1.5rem+4.6vw,6rem)] leading-[1] tracking-[-0.01em]"
          >
            A creative partner for people who write <Accent>for children.</Accent>
          </h1>
          <span aria-hidden className="mx-auto mt-8 block h-1 w-16 rounded-full bg-sun" />
          <p className="mx-auto mt-8 max-w-[42rem] text-lg leading-relaxed text-ink-soft sm:text-xl">
            KLUTZ is an illustration studio for children&rsquo;s authors in the United States and the United
            Kingdom. We draw the characters and pages at the heart of your book, then help you publish and promote it,
            so one team carries your story from manuscript to bookshelf.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-x-8 gap-y-3 sm:flex-row">
            <ButtonLink href="/contact">Discuss your story</ButtonLink>
            <ButtonLink href="/services/illustration-styles" variant="quiet">
              Explore illustration services
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  )
}
