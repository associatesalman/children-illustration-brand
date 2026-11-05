import { Box, Clapperboard, GraduationCap, PenTool, type LucideIcon } from 'lucide-react'
import { heroIntro, pillars, type PillarIcon } from '../../content/animation'

const icons: Record<PillarIcon, LucideIcon> = { story: PenTool, world: Box, trailer: Clapperboard, learn: GraduationCap }

/** Desktop placement: the four corners of a 3 x 3 grid, around the central heading (as on Book Marketing). */
const corners = [
  'lg:col-start-1 lg:row-start-1 lg:self-start',
  'lg:col-start-3 lg:row-start-1 lg:self-start lg:justify-self-end lg:items-end lg:text-right',
  'lg:col-start-1 lg:row-start-3 lg:self-end',
  'lg:col-start-3 lg:row-start-3 lg:self-end lg:justify-self-end lg:items-end lg:text-right',
]

/**
 * Brand-red hero with white text. The heading and introduction sit in the center, with the four service
 * pillars in the corners on large screens; below that, the pillars form a 2 x 2 (then single-column) grid
 * under the introduction. Static: no motion of any kind.
 */
export function AnimationHero() {
  return (
    <section aria-labelledby="animation-hero-title" className="bg-brand-red text-white">
      <div className="mx-auto grid w-full max-w-[110rem] grid-cols-1 gap-x-10 gap-y-12 px-5 py-16 sm:px-8 sm:py-20 lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,46rem)_minmax(0,1fr)] lg:grid-rows-[auto_1fr_auto] lg:gap-y-6 lg:px-12 lg:py-14 xl:gap-x-16">
        <div className="text-center lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:self-center">
          <p className="text-sm font-bold tracking-[0.08em] uppercase">Animation for children’s stories</p>
          <h1
            id="animation-hero-title"
            className="text-display mt-5 text-[clamp(3.4rem,1.6rem+6.6vw,8.5rem)] leading-[0.95] tracking-[-0.03em] text-balance"
          >
            2D &amp; 3D Animation
          </h1>
          <p className="mx-auto mt-8 max-w-[36rem] text-lg leading-relaxed sm:text-xl">{heroIntro}</p>
        </div>

        <ul className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:contents">
          {pillars.map((pillar, index) => {
            const Icon = icons[pillar.icon]
            return (
              <li key={pillar.title} className={`flex flex-col items-start border-t-2 border-white pt-5 lg:max-w-[20rem] ${corners[index]}`}>
                <span className="flex size-11 items-center justify-center rounded-full bg-white text-brand-red">
                  <Icon aria-hidden size={20} strokeWidth={2.25} />
                </span>
                <h2 className="mt-4 text-xl font-bold">{pillar.title}</h2>
                <p className="mt-1.5 leading-relaxed">{pillar.body}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
