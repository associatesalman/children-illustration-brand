import { ArrowDown, ArrowRight } from 'lucide-react'
import { creation, hero } from '../../content/characterDesign'
import { ButtonLink } from '../ui/Button'
import { Accent, Eyebrow } from '../ui/Section'

/**
 * Full-bleed yellow hero at least as tall as the viewport below the 4.5rem sticky header. Desktop: the
 * introduction sits upper left, the large heading upper right, and the character lineup stands along
 * the bottom edge across the hero. Phones: heading, introduction, then artwork, and the band grows.
 */
export function CharacterHero() {
  return (
    <section aria-labelledby="character-hero-title" className="flex min-h-[calc(100svh-4.5rem)] w-full flex-col bg-sun">
      <div className="mx-auto flex w-full max-w-[120rem] flex-1 flex-col px-5 pt-10 sm:px-8 sm:pt-14 lg:px-[clamp(3rem,5vw,7rem)] lg:pt-[clamp(2.5rem,6vh,5rem)]">
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-12 lg:items-end lg:gap-12">
          <h1
            id="character-hero-title"
            className="text-display text-[clamp(3.6rem,1rem+8.2vw,10.5rem)] leading-[0.92] tracking-[-0.02em] lg:order-2 lg:col-span-7 lg:text-right"
          >
            Character <Accent>Design</Accent>
          </h1>
          <div className="lg:order-1 lg:col-span-5 lg:pb-3">
            <Eyebrow className="text-ink">Services &middot; Character design</Eyebrow>
            <p className="max-w-xl text-xl leading-relaxed">
              We create characters children remember, shaped by personality, emotion, age group and the needs of
              your story. From the first concept to expressions, reference sheets and full development, every
              choice helps young readers recognize and love the characters in your book.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <ButtonLink href="/contact">
                Discuss your characters <ArrowRight aria-hidden size={18} />
              </ButtonLink>
              <ButtonLink href={`#${creation.id}`} variant="quiet">
                See how it works <ArrowDown aria-hidden size={18} />
              </ButtonLink>
            </div>
          </div>
        </div>

        {/* The lineup stands on the hero's bottom edge. On desktop its width follows the space left
            under the intro row, so the whole cast fits on screen without cropping anyone. */}
        <div className="mt-auto flex justify-center pt-10 lg:pt-12">
          <img
            src={hero.src}
            srcSet={hero.srcSet}
            sizes="(min-width: 1024px) min(78vw, 1394px), 100vw"
            width={hero.width}
            height={hero.height}
            alt={hero.alt}
            fetchPriority="high"
            decoding="async"
            className="block h-auto w-full max-w-[1394px] lg:w-[clamp(44rem,calc((100svh-4.5rem-25.5rem)*1.717),100%)]"
          />
        </div>
      </div>
    </section>
  )
}
