import { ArrowDown, ArrowRight } from 'lucide-react'
import { fullPage, heroImages } from '../../content/storybook'
import type { StyleImage } from '../../content/illustrationStyles'
import { ButtonLink } from '../ui/Button'
import { Accent, Eyebrow } from '../ui/Section'

function HeroImage({ image, className = '' }: { image: StyleImage; className?: string }) {
  return (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes="(min-width: 1280px) 38vw, (min-width: 640px) 50vw, 100vw"
      alt={image.alt}
      width={image.width}
      height={image.height}
      loading="eager"
      fetchPriority="high"
      decoding="async"
      className={`block h-auto w-full rounded-md ${className}`}
    />
  )
}

/**
 * Full-width white hero, at least as tall as the viewport below the 4.5rem sticky header.
 * Wide screens (1280px and up): the heading and description in the center column, one book mockup high on the left and a
 * second, slightly larger one set lower on the right, so the row reads as a gentle diagonal. Nothing
 * overlaps the text. Smaller screens: heading, description, then the two images (side by side from 640px).
 */
export function StorybookHero() {
  return (
    <section aria-labelledby="storybook-hero-title" className="flex min-h-[calc(100svh-4.5rem)] w-full bg-white text-ink">
      <div className="mx-auto grid w-full max-w-[120rem] grid-cols-1 gap-10 px-5 py-12 sm:px-8 sm:py-16 xl:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)_minmax(0,1.24fr)] xl:items-center xl:gap-x-[clamp(1.75rem,2.6vw,3.5rem)] xl:px-[clamp(1.5rem,2.4vw,3.5rem)] xl:py-[clamp(2.5rem,6vh,5rem)]">
        <div className="text-center xl:col-start-2 xl:row-start-1">
          <Eyebrow className="text-ink">Services &middot; Storybook illustration</Eyebrow>
          <h1
            id="storybook-hero-title"
            className="text-display text-[clamp(3rem,0.9rem+4.3vw,7rem)] leading-[0.95] tracking-[-0.02em] text-balance"
          >
            Storybook <Accent className="text-brand-red-dark">Illustration</Accent>
          </h1>
          <p className="mx-auto mt-7 max-w-[34rem] text-lg leading-relaxed xl:text-xl">
            We illustrate picture books page by page: full-page moments, sweeping spreads, scenes children can
            read at a glance and settings that make the story feel real, all planned around your manuscript.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <ButtonLink href="/contact">
              Discuss your storybook <ArrowRight aria-hidden size={18} />
            </ButtonLink>
            <ButtonLink href={`#${fullPage.id}`} variant="quiet">
              Explore the four types <ArrowDown aria-hidden size={18} />
            </ButtonLink>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:contents">
          <HeroImage image={heroImages.book} className="xl:col-start-1 xl:row-start-1 xl:mb-[clamp(4rem,16vh,11rem)]" />
          <HeroImage image={heroImages.spread} className="xl:col-start-3 xl:row-start-1 xl:mt-[clamp(4rem,18vh,12rem)]" />
        </div>
      </div>
    </section>
  )
}
