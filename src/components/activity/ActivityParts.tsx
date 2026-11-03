import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import type { CategoryCopy } from '../../content/activityBooks'
import type { StyleImage } from '../../content/illustrationStyles'
import { ButtonLink } from '../ui/Button'
import { Checklist } from '../ui/Checklist'
import { Container } from '../ui/Container'
import { Accent } from '../ui/Section'

export type Tone = 'white' | 'sun'

export function CategoryShell({ copy, tone, children }: { copy: CategoryCopy; tone: Tone; children: ReactNode }) {
  return (
    <section
      id={copy.id}
      tabIndex={-1}
      aria-labelledby={`${copy.id}-title`}
      className={`${tone === 'sun' ? 'bg-sun' : 'bg-white'} py-20 text-ink sm:py-24 lg:py-32`}
    >
      <Container>{children}</Container>
    </section>
  )
}

/** Large red category number beside the eyebrow and heading. */
export function CategoryHeading({ copy, className = '' }: { copy: CategoryCopy; className?: string }) {
  return (
    <div className={`flex gap-5 sm:gap-8 ${className}`}>
      <span aria-hidden className="text-display text-[clamp(3rem,2rem+3vw,5.5rem)] leading-[0.85] text-brand-red">
        {copy.number}
      </span>
      <div>
        <p className="text-sm font-bold tracking-[0.08em] uppercase">{copy.name}</p>
        <h2 id={`${copy.id}-title`} className="text-display mt-3 text-[clamp(2.1rem,1.4rem+2.6vw,3.6rem)] leading-[1.05] text-balance">
          {copy.heading[0]} <Accent>{copy.heading[1]}</Accent>
        </h2>
      </div>
    </div>
  )
}

export function Lead({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`max-w-2xl text-xl leading-relaxed ${className}`}>{children}</p>
}

export function SubHeading({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h3 className={`text-display text-[clamp(1.5rem,1.25rem+0.9vw,2rem)] leading-tight ${className}`}>{children}</h3>
}

/** An activity page shown at its native size (or smaller), with a hairline so white pages read on white. */
export function PageImage({ image, sizes, className = '' }: { image: StyleImage; sizes?: string; className?: string }) {
  return (
    <figure className={className}>
      <img
        src={image.src}
        srcSet={image.srcSet}
        sizes={image.srcSet ? sizes : undefined}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full rounded-md ring-1 ring-ink/10"
      />
      <figcaption className="mt-3 text-sm leading-relaxed text-ink-soft">{image.caption}</figcaption>
    </figure>
  )
}

/** What we offer: a heading, a three-column checklist and the inquiry link, on a contrasting band. */
export function OfferRow({ items, cta, panel, className = '' }: { items: string[]; cta: string; panel: Tone | 'ink'; className?: string }) {
  const surface = panel === 'ink' ? 'on-dark bg-ink text-white' : panel === 'sun' ? 'bg-sun' : 'bg-white'
  return (
    <div className={`rounded-lg p-7 sm:p-10 lg:p-12 ${surface} ${className}`}>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
        <SubHeading className="shrink-0">What we offer</SubHeading>
        <Checklist
          items={items}
          className={`grid flex-1 gap-x-8 sm:grid-cols-2 xl:grid-cols-3 ${panel === 'ink' ? 'text-white/90' : ''}`}
          marker={panel === 'ink' ? 'bg-sun' : 'bg-brand-red'}
        />
      </div>
      <ButtonLink href="/contact" className="mt-9">
        {cta} <ArrowRight aria-hidden size={18} />
      </ButtonLink>
    </div>
  )
}
