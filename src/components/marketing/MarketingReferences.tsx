import {
  AtSign,
  Award,
  BadgeCheck,
  BookMarked,
  BookOpen,
  Check,
  ChevronRight,
  Clapperboard,
  FileSearch,
  Film,
  ImagePlus,
  Library,
  Megaphone,
  Mic,
  MousePointerClick,
  Newspaper,
  Pin,
  Search,
  Share2,
  Sparkles,
  Store,
  ThumbsUp,
  TrendingUp,
  Users,
  type LucideIcon,
} from 'lucide-react'
import {
  amazonCards,
  amazonDetailPurpose,
  authorServices,
  authorServicesIntro,
  includedHeading,
  includedServices,
  marketingPlatforms,
  platformsNote,
  websiteFeatures,
  type AmazonCard,
  type IncludedIcon,
  type PlatformIcon,
} from '../../content/marketing'
import { Section } from '../ui/Section'
import { ctaClass } from './MarketingParts'

const amazonIcons: Record<AmazonCard['icon'], LucideIcon> = { listing: FileSearch, aplus: ImagePlus, ads: TrendingUp, page: BookOpen }

/** White: the detailed Amazon service, four content cards in a simple responsive grid. */
export function AmazonDetailSection() {
  return (
    <Section id="amazon-detail" labelledBy="amazon-detail-title">
      <div className="max-w-3xl">
        <p className="mb-4 text-sm font-bold tracking-[0.08em] text-brand-red uppercase">In detail</p>
        <h2 id="amazon-detail-title" className="text-display text-[clamp(2.3rem,1.5rem+2.6vw,4rem)] leading-[1.04] tracking-[-0.02em]">
          Amazon Book Marketing
        </h2>
        <p className="mt-5 text-xl leading-relaxed">
          <span className="font-bold">Purpose: </span>
          {amazonDetailPurpose}
        </p>
      </div>

      <ul className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:mt-14 lg:gap-6 xl:grid-cols-4">
        {amazonCards.map((card) => {
          const Icon = amazonIcons[card.icon]
          return (
            <li key={card.title} className="flex flex-col rounded-lg border-2 border-ink p-7">
              <span className="flex size-12 items-center justify-center rounded-full bg-sun text-ink">
                <Icon aria-hidden size={22} strokeWidth={2} />
              </span>
              <h3 className="mt-5 text-xl leading-snug font-bold">{card.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{card.body}</p>
              <ul className="mt-6 grid gap-2.5 border-t border-ink/15 pt-5">
                {card.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <Check aria-hidden size={18} strokeWidth={2.75} className="mt-0.5 shrink-0 text-brand-red" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>

      <p className="mt-10 max-w-3xl border-l-4 border-brand-red pl-5 leading-relaxed">
        Amazon decides rankings and placement itself, so no one can promise a position, reviews or sales. What we can do is make sure your book is presented as clearly and accurately as possible.
      </p>
    </Section>
  )
}

const includedIcons: Record<IncludedIcon, LucideIcon> = {
  social: Share2,
  seo: Search,
  ppc: MousePointerClick,
  podcast: Mic,
  logo: BadgeCheck,
  trailer: Clapperboard,
  press: Newspaper,
  fair: Store,
  platform: Megaphone,
  animation: Film,
}

/** Reference 1 (yellow): "What’s Included", rebuilt as a tile grid with an icon and a short line per service. */
export function IncludedSection() {
  return (
    <Section id="whats-included" tone="sun" labelledBy="whats-included-title">
      <h2 id="whats-included-title" className="text-display max-w-3xl text-[clamp(2.1rem,1.5rem+2.2vw,3.5rem)] leading-[1.06] text-balance">
        {includedHeading}
      </h2>
      <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 xl:grid-cols-5">
        {includedServices.map((service) => {
          const Icon = includedIcons[service.icon]
          return (
            <li key={service.title} className="rounded-lg bg-white p-6">
              <Icon aria-hidden size={28} strokeWidth={1.75} className="text-brand-red-dark" />
              <h3 className="mt-4 text-lg leading-snug font-bold">{service.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{service.body}</p>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

const platformIcons: Record<PlatformIcon, LucideIcon> = {
  pinterest: Pin,
  facebook: ThumbsUp,
  goodreads: BookMarked,
  x: AtSign,
  librarything: Library,
  bookclub: Users,
  readers: Award,
}

/** Reference 2 (white): the "Book Marketing" platform cards, each with a check badge as in the reference. */
export function PlatformsSection() {
  return (
    <Section id="marketing-platforms" labelledBy="marketing-platforms-title">
      <div className="max-w-3xl">
        <p className="mb-4 text-sm font-bold tracking-[0.08em] text-brand-red uppercase">Book Marketing</p>
        <h2 id="marketing-platforms-title" className="text-display text-[clamp(2.1rem,1.5rem+2.2vw,3.5rem)] leading-[1.06] text-balance">
          Platforms where we promote your book
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">
          Social networks, reader communities and review sites where parents, teachers and book lovers discover new titles.
        </p>
      </div>
      <ul className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:mt-14 xl:grid-cols-4">
        {marketingPlatforms.map((platform) => {
          const Icon = platformIcons[platform.icon]
          return (
            <li key={platform.title} className="rounded-lg border border-ink/15 p-6">
              <div className="flex items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-full bg-sun text-ink">
                  <Icon aria-hidden size={22} strokeWidth={2} />
                </span>
                <span className="flex size-7 items-center justify-center rounded bg-brand-red text-white">
                  <Check aria-hidden size={16} strokeWidth={3} />
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold">{platform.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{platform.body}</p>
            </li>
          )
        })}
        <li className="flex items-end rounded-lg bg-paper p-6">
          <p className="leading-relaxed">{platformsNote}</p>
        </li>
      </ul>
    </Section>
  )
}

/** Reference 4 (white): "Features" and "Services for Authors and Publishers", two chevron lists side by side. */
export function AuthorServicesSection() {
  return (
    <Section id="website-features" labelledBy="website-features-title">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <h2 id="website-features-title" className="text-display text-[clamp(2rem,1.5rem+1.8vw,3rem)] leading-[1.08]">
            Features
          </h2>
          <ChevronList items={websiteFeatures} />
          <div className="mt-10 flex items-start gap-4 rounded-lg bg-sun p-6">
            <Sparkles aria-hidden size={22} className="mt-0.5 shrink-0" />
            <p className="leading-relaxed">Your website can be planned together with your branding and marketing, so everything readers see feels like one author.</p>
          </div>
        </div>
        <div className="lg:col-span-7">
          <h2 className="text-display text-[clamp(2rem,1.5rem+1.8vw,3rem)] leading-[1.08]">Services for Authors and Publishers</h2>
          <p className="mt-6 text-lg font-bold">{authorServicesIntro}</p>
          <ChevronList items={authorServices} />
          <a href="/contact" className={ctaClass}>
            Talk to us about your website <ChevronRight aria-hidden size={18} />
          </a>
        </div>
      </div>
    </Section>
  )
}

function ChevronList({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 grid gap-4">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-lg leading-relaxed">
          <ChevronRight aria-hidden size={20} strokeWidth={2.5} className="mt-1 shrink-0 text-brand-red" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
