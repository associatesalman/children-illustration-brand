import { ArrowDown, ArrowRight } from 'lucide-react'
import { coloring, heroVideoAsset } from '../../content/activityBooks'
import { StyleVideo } from '../styles/StyleVideo'
import { ButtonLink } from '../ui/Button'
import { Accent, Eyebrow } from '../ui/Section'

/**
 * Full-width white hero, at least as tall as the viewport below the 4.5rem sticky header. Desktop: heading,
 * introduction and links on the left; the workbook video on the right, vertically centered with the text.
 * Phones: text first, video second. The video is shown as recorded: no mask, filter, tint or overlay.
 */
export function ActivityHero() {
  return (
    <section aria-labelledby="activity-hero-title" className="flex min-h-[calc(100svh-4.5rem)] w-full bg-white text-ink">
      <div className="mx-auto grid w-full max-w-[120rem] grid-cols-1 items-center gap-12 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-12 lg:gap-16 lg:px-[clamp(3rem,5vw,7rem)] lg:py-[clamp(2.5rem,5vh,4.5rem)]">
        <div className="lg:col-span-7">
          <Eyebrow className="text-ink">Services &middot; Activity book illustration</Eyebrow>
          <h1
            id="activity-hero-title"
            className="text-display text-[clamp(3rem,1rem+5vw,7.5rem)] leading-[0.95] tracking-[-0.02em] text-balance"
          >
            Activity Book <Accent className="text-brand-red-dark">Illustration</Accent>
          </h1>
          <p className="mt-7 max-w-[36rem] text-xl leading-relaxed">
            We illustrate activity books children want to pick up: coloring pages with clean line art, puzzles
            that really work, and learning pages that make letters and numbers inviting, all drawn for your
            readers&rsquo; age and ready to print.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <ButtonLink href="/contact">
              Discuss your activity book <ArrowRight aria-hidden size={18} />
            </ButtonLink>
            <ButtonLink href={`#${coloring.id}`} variant="quiet">
              Explore the three types <ArrowDown aria-hidden size={18} />
            </ButtonLink>
          </div>
        </div>

        {/* Portrait 9:16 video, sized so the whole frame fits the screen height; never cropped or stretched. */}
        <div className="flex justify-center lg:col-span-5 lg:justify-end">
          <StyleVideo
            video={heroVideoAsset}
            bare
            priority
            className="w-[min(100%,clamp(16rem,calc((100svh-4.5rem-7rem)*0.5625),32rem))] rounded-lg"
          />
        </div>
      </div>
    </section>
  )
}
