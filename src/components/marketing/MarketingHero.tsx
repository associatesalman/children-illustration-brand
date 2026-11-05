import { MessagesSquare, Rocket, Search, UserRound, type LucideIcon } from 'lucide-react'
import { heroIntro, pillars, type PillarIcon } from '../../content/marketing'

const icons: Record<PillarIcon, LucideIcon> = { discover: Search, identity: UserRound, engage: MessagesSquare, launch: Rocket }

/** Desktop placement: the four corners of a 3 x 3 grid, around the central heading. */
const corners = [
  'lg:col-start-1 lg:row-start-1 lg:self-start',
  'lg:col-start-3 lg:row-start-1 lg:self-start lg:justify-self-end lg:items-end lg:text-right',
  'lg:col-start-1 lg:row-start-3 lg:self-end',
  'lg:col-start-3 lg:row-start-3 lg:self-end lg:justify-self-end lg:items-end lg:text-right',
]

/**
 * Pure-white hero. A large heading and introduction in the center, with the four marketing pillars in the
 * corners on large screens; below, the pillars form a 2 x 2 (then single-column) grid under the introduction.
 * Static: no motion of any kind.
 */
export function MarketingHero() {
  return (
    <section aria-labelledby="marketing-hero-title" className="bg-white text-ink">
      <div className="mx-auto grid w-full max-w-[110rem] grid-cols-1 gap-x-10 gap-y-12 px-5 py-16 sm:px-8 sm:py-20 lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,46rem)_minmax(0,1fr)] lg:grid-rows-[auto_1fr_auto] lg:gap-y-6 lg:px-12 lg:py-14 xl:gap-x-16">
        <div className="text-center lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:self-center">
          <p className="text-sm font-bold tracking-[0.08em] text-brand-red uppercase">Services for children’s authors</p>
          <h1
            id="marketing-hero-title"
            className="text-display mt-5 text-[clamp(3.4rem,1.6rem+6.6vw,8.5rem)] leading-[0.95] tracking-[-0.03em] text-balance"
          >
            Book Marketing
          </h1>
          <p className="mx-auto mt-8 max-w-[36rem] text-lg leading-relaxed text-ink-soft sm:text-xl">{heroIntro}</p>
        </div>

        <ul className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:contents">
          {pillars.map((pillar, index) => {
            const Icon = icons[pillar.icon]
            return (
              <li key={pillar.title} className={`flex flex-col items-start border-t-2 border-ink pt-5 lg:max-w-[20rem] ${corners[index]}`}>
                <span className="flex size-11 items-center justify-center rounded-full bg-sun text-ink">
                  <Icon aria-hidden size={20} strokeWidth={2.25} />
                </span>
                <h2 className="mt-4 text-xl font-bold">{pillar.title}</h2>
                <p className="mt-1.5 leading-relaxed text-ink-soft">{pillar.body}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
