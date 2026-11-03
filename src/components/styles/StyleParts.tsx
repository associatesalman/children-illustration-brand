import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import type { StyleCopy, StyleImage, StyleVideoAsset } from '../../content/illustrationStyles'
import { ButtonLink } from '../ui/Button'
import { Checklist } from '../ui/Checklist'
import { Container } from '../ui/Container'
import { Accent } from '../ui/Section'
import { StyleVideo } from './StyleVideo'

export type Tone = 'white' | 'sun'

/** Full-width section for one style. */
export function StyleShell({ style, tone, children }: { style: StyleCopy; tone: Tone; children: ReactNode }) {
  return (
    <section
      id={style.id}
      tabIndex={-1}
      aria-labelledby={`${style.id}-title`}
      className={`${tone === 'sun' ? 'bg-sun' : 'bg-white'} py-20 text-ink sm:py-24 lg:py-28`}
    >
      <Container>{children}</Container>
    </section>
  )
}

export function StyleIntro({ style, className = '' }: { style: StyleCopy; className?: string }) {
  return (
    <div className={className}>
      <p className="flex items-center gap-3 text-sm font-bold tracking-[0.08em] uppercase">
        <span className="text-display text-2xl tracking-normal text-brand-red">{style.number}</span>
        <span aria-hidden className="h-px w-8 bg-current" />
        {style.name}
      </p>
      <h2 id={`${style.id}-title`} className="text-display mt-5 text-[clamp(2.1rem,1.4rem+2.6vw,3.6rem)] leading-[1.05] text-balance">
        {style.heading[0]} <Accent>{style.heading[1]}</Accent>
      </h2>
      <p className="mt-6 max-w-2xl text-xl leading-relaxed">{style.lead}</p>
    </div>
  )
}

export function Prose({ paragraphs, className = '' }: { paragraphs: string[]; className?: string }) {
  return (
    <div className={`max-w-2xl space-y-5 text-lg leading-relaxed ${className}`}>
      {paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 32)}>{paragraph}</p>
      ))}
    </div>
  )
}

export function SubHeading({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h3 className={`text-display text-[clamp(1.5rem,1.25rem+0.9vw,2rem)] leading-tight ${className}`}>{children}</h3>
}

type FigureProps = { image: StyleImage; sizes: string; priority?: boolean; className?: string; fill?: boolean }

/** Image with caption. `fill` crops to the parent's box (for equal-height rows). */
export function Figure({ image, sizes, priority = false, className = '', fill = false }: FigureProps) {
  return (
    <figure className={`${fill ? 'flex flex-col' : ''} ${className}`}>
      <img
        src={image.src}
        srcSet={image.srcSet}
        sizes={image.srcSet ? sizes : undefined}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`block w-full rounded-lg bg-white ${fill ? 'min-h-0 flex-1 object-cover' : 'h-auto'}`}
      />
      <figcaption className="mt-3 text-sm leading-relaxed text-ink-soft">{image.caption}</figcaption>
    </figure>
  )
}

export function VideoFigure({ video, className = '' }: { video: StyleVideoAsset; className?: string }) {
  return (
    <figure className={className}>
      <StyleVideo video={video} />
      <figcaption className="mt-3 text-sm leading-relaxed text-ink-soft">{video.caption}</figcaption>
    </figure>
  )
}

/**
 * A row of media at one shared height: each item's width follows its aspect ratio, so portrait
 * and landscape pieces line up without cropping. On phones the pieces sit two to a row.
 */
export function MediaRow({ items, className = '' }: { items: { ratio: number; node: ReactNode }[]; className?: string }) {
  return (
    <div className={`grid grid-cols-2 items-start gap-x-4 gap-y-8 sm:flex sm:flex-row sm:gap-5 lg:gap-6 ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="min-w-0" style={{ flex: `${item.ratio} 1 0%` }}>
          {item.node}
        </div>
      ))}
    </div>
  )
}

type StrengthsProps = { style: StyleCopy; className?: string; row?: boolean }

export function Strengths({ style, className = '', row = false }: StrengthsProps) {
  return (
    <div className={className}>
      <SubHeading>What makes {style.name} work</SubHeading>
      <dl className={row ? 'mt-6 grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-10' : 'mt-6 space-y-6'}>
        {style.strengths.map((item) => (
          <div key={item.title} className="border-l-2 border-brand-red pl-5">
            <dt className="text-lg font-bold">{item.title}</dt>
            <dd className="mt-1 leading-relaxed text-ink-soft">{item.body}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/** How characters, scenes, color and detail work, as a 2x2 (or 4-across) set of short notes. */
export function Craft({ style, columns = 2, className = '' }: { style: StyleCopy; columns?: 2 | 4; className?: string }) {
  return (
    <div className={className}>
      <SubHeading>How it works on the page</SubHeading>
      <dl className={`mt-6 grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2 ${columns === 4 ? 'lg:grid-cols-4' : ''}`}>
        {style.craft.map((item) => (
          <div key={item.title} className="border-t border-ink/20 pt-4">
            <dt className="font-bold">{item.title}</dt>
            <dd className="mt-1.5 leading-relaxed text-ink-soft">{item.body}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/** Formats, subjects and readers, then the services and the inquiry CTA. */
export function ServiceBand({ style, tone }: { style: StyleCopy; tone: Tone }) {
  const panel = tone === 'sun' ? 'bg-white' : 'bg-sun'
  return (
    <div className={`mt-16 grid grid-cols-1 overflow-hidden rounded-lg lg:mt-20 lg:grid-cols-12 ${panel}`}>
      <div className="p-7 sm:p-10 lg:col-span-5 lg:p-12">
        <SubHeading>Where {style.name} fits best</SubHeading>
        <dl className="mt-6 space-y-5">
          <div>
            <dt className="text-sm font-bold tracking-[0.06em] uppercase">Formats</dt>
            <dd className="mt-1.5">{style.fit.formats.join(' · ')}</dd>
          </div>
          <div>
            <dt className="text-sm font-bold tracking-[0.06em] uppercase">Subjects</dt>
            <dd className="mt-1.5">{style.fit.subjects.join(' · ')}</dd>
          </div>
          <div>
            <dt className="text-sm font-bold tracking-[0.06em] uppercase">Readers</dt>
            <dd className="mt-1.5">{style.fit.readers}</dd>
          </div>
        </dl>
      </div>
      <div className="on-dark bg-ink p-7 text-white sm:p-10 lg:col-span-7 lg:p-12">
        <SubHeading>What we offer authors</SubHeading>
        <p className="mt-3 max-w-xl leading-relaxed text-white/80">{style.offerIntro}</p>
        <Checklist items={style.offers} className="mt-6 grid gap-x-8 sm:grid-cols-2" marker="bg-sun" />
        <ButtonLink href="/contact" className="mt-9">
          {style.cta} <ArrowRight aria-hidden size={18} />
        </ButtonLink>
      </div>
    </div>
  )
}
