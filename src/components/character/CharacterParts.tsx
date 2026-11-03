import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import type { SectionCopy } from '../../content/characterDesign'
import { ButtonLink } from '../ui/Button'
import { Checklist } from '../ui/Checklist'
import { Container } from '../ui/Container'
import { Accent } from '../ui/Section'

export type Tone = 'white' | 'sun'

/** Full-width band for one of the four main sections. */
export function CharacterShell({ copy, tone, children }: { copy: SectionCopy; tone: Tone; children: ReactNode }) {
  return (
    <section
      id={copy.id}
      tabIndex={-1}
      aria-labelledby={`${copy.id}-title`}
      className={`${tone === 'sun' ? 'bg-sun' : 'bg-white'} py-20 text-ink sm:py-24 lg:py-28`}
    >
      <Container>{children}</Container>
    </section>
  )
}

export function SectionIntro({ copy, className = '' }: { copy: SectionCopy; className?: string }) {
  return (
    <div className={className}>
      <p className="flex items-center gap-3 text-sm font-bold tracking-[0.08em] uppercase">
        <span className="text-display text-2xl tracking-normal text-brand-red">{copy.number}</span>
        <span aria-hidden className="h-px w-8 bg-current" />
        {copy.name}
      </p>
      <h2 id={`${copy.id}-title`} className="text-display mt-5 text-[clamp(2.1rem,1.4rem+2.6vw,3.6rem)] leading-[1.05] text-balance">
        {copy.heading[0]} <Accent>{copy.heading[1]}</Accent>
      </h2>
      <p className="mt-6 max-w-2xl text-xl leading-relaxed">{copy.lead}</p>
    </div>
  )
}

export function Paragraphs({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <div className={`max-w-2xl space-y-5 text-lg leading-relaxed ${className}`}>
      {items.map((text) => (
        <p key={text.slice(0, 40)}>{text}</p>
      ))}
    </div>
  )
}

export function SubHeading({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h3 className={`text-display text-[clamp(1.5rem,1.25rem+0.9vw,2rem)] leading-tight ${className}`}>{children}</h3>
}

type Topic = { title: string; body: string }

/** Titled notes, either stacked with a red rule or as a grid separated by hairlines. */
export function Topics({ items, variant = 'rule', className = '' }: { items: Topic[]; variant?: 'rule' | 'grid'; className?: string }) {
  if (variant === 'rule') {
    return (
      <div className={`space-y-8 ${className}`}>
        {items.map((item) => (
          <div key={item.title} className="border-l-2 border-brand-red pl-5">
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p className="mt-1.5 leading-relaxed text-ink-soft">{item.body}</p>
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className={`grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 ${className}`}>
      {items.map((item) => (
        <div key={item.title} className="border-t border-ink/25 pt-4">
          <h3 className="text-lg font-bold">{item.title}</h3>
          <p className="mt-1.5 leading-relaxed text-ink-soft">{item.body}</p>
        </div>
      ))}
    </div>
  )
}

type OfferProps = {
  intro: string
  items: string[]
  cta: string
  /** Panel color: the opposite of the section it sits in. */
  panel: Tone
  className?: string
}

/** What we offer, with the inquiry link, as one horizontal band. */
export function OfferBand({ intro, items, cta, panel, className = '' }: OfferProps) {
  return (
    <div
      className={`grid grid-cols-1 gap-8 rounded-lg p-7 sm:p-10 lg:grid-cols-12 lg:gap-12 lg:p-12 ${panel === 'sun' ? 'bg-sun' : 'bg-white'} ${className}`}
    >
      <div className="lg:col-span-4">
        <SubHeading>What we offer</SubHeading>
        <p className="mt-3 leading-relaxed text-ink-soft">{intro}</p>
      </div>
      <div className="lg:col-span-8">
        <Checklist items={items} className="grid gap-x-8 sm:grid-cols-2" />
        <ButtonLink href="/contact" className="mt-8">
          {cta} <ArrowRight aria-hidden size={18} />
        </ButtonLink>
      </div>
    </div>
  )
}
