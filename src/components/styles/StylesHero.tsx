import { ArrowDown, ArrowRight } from 'lucide-react'
import { hero } from '../../content/illustrationStyles'
import { ButtonLink } from '../ui/Button'
import { Accent, Eyebrow } from '../ui/Section'

export function StylesHero() {
  return (
    // Full-bleed yellow band at least as tall as the viewport below the 4.5rem sticky header. The content
    // is centred in it with wider fluid gutters; on small screens it stacks and the band grows to fit.
    <section
      aria-labelledby="styles-hero-title"
      className="flex min-h-[calc(100svh-4.5rem)] w-full items-center bg-sun"
    >
      <div className="mx-auto w-full max-w-[120rem] px-5 py-12 sm:px-8 sm:py-16 lg:px-[clamp(3rem,5vw,7rem)] lg:py-[clamp(3rem,6vh,6rem)]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-[clamp(3.5rem,5vw,7rem)]">
          <div className="lg:col-span-5">
            <Eyebrow className="text-ink">Services &middot; Illustration styles</Eyebrow>
            <h1 id="styles-hero-title" className="text-display text-[clamp(2.6rem,1.6rem+3.4vw,4.4rem)] leading-[1.02] text-balance">
              Every story has a look. <Accent>Let&rsquo;s find yours.</Accent>
            </h1>
            <p className="mt-6 text-xl leading-relaxed">
              From bouncy cartoon characters to soft watercolor, painted worlds, dimensional 3D and clean, minimal
              design, the style you choose shapes how children meet your story.
            </p>
            <p className="mt-4 text-lg leading-relaxed">
              Explore each style below with example artwork and process videos, see what it does best, and then talk
              to us about the look that fits your manuscript and your readers.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <ButtonLink href="/contact">
                Discuss your book <ArrowRight aria-hidden size={18} />
              </ButtonLink>
              <ButtonLink href="#cartoon-style" variant="quiet">
                Explore the five styles <ArrowDown aria-hidden size={18} />
              </ButtonLink>
            </div>
          </div>

          <figure className="lg:col-span-7">
            <picture>
              <source media="(max-width: 639px)" srcSet={hero.tall.src} width={hero.tall.width} height={hero.tall.height} />
              <img
                src={hero.wide.src}
                srcSet={hero.wide.srcSet}
                sizes="(min-width: 1920px) 1050px, (min-width: 1024px) 55vw, 100vw"
                width={hero.wide.width}
                height={hero.wide.height}
                alt={hero.alt}
                fetchPriority="high"
                decoding="async"
                className="block h-auto w-full"
              />
            </picture>
          </figure>
        </div>
      </div>
    </section>
  )
}
