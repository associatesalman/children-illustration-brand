import { AlignLeft, BookOpen, Columns2, LayoutTemplate, Scale, Type, type LucideIcon } from 'lucide-react'
import {
  bookTypes,
  formatsCopy,
  formatsImage,
  formattingBeforeAfter,
  formattingIntro,
  layoutChecks,
  layoutPrinciples,
  layoutSamples,
} from '../../content/editing'
import { Accent, Eyebrow, Section } from '../ui/Section'
import { Figure } from './EditingSections'

const principleIcons: LucideIcon[] = [Scale, Type, Columns2, AlignLeft, BookOpen, LayoutTemplate]

/** 05 · Formatting & Layout Design: the six principles, then each supplied spread beside the principle it shows. */
export function FormattingSection() {
  return (
    <Section id="formatting" labelledBy="formatting-title">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
        <div className="lg:col-span-7">
          <Eyebrow>Formatting &amp; layout design</Eyebrow>
          <h2 id="formatting-title" className="text-display text-[clamp(2.4rem,1.5rem+3vw,4.5rem)] leading-[1.02] text-balance">
            Pages that are <Accent>easy to follow</Accent>
          </h2>
        </div>
        <div className="lg:col-span-5">
          <h3 className="text-xl font-bold">{formattingIntro.title}</h3>
          <p className="mt-3 text-lg leading-relaxed text-ink-soft">{formattingIntro.lead}</p>
        </div>
      </div>

      <ul className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-ink/15 ring-1 ring-ink/15 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
        {layoutPrinciples.map((principle, index) => {
          const Icon = principleIcons[index]
          return (
            <li key={principle.title} className="bg-white p-7 sm:p-8">
              <span className="flex size-12 items-center justify-center rounded-full bg-sun">
                <Icon aria-hidden size={22} strokeWidth={2} />
              </span>
              <h3 className="mt-5 text-xl font-bold">{principle.title}</h3>
              <p className="mt-2 text-lg leading-relaxed text-ink-soft">{principle.body}</p>
            </li>
          )
        })}
      </ul>

      <div className="mt-24 space-y-20 lg:mt-32 lg:space-y-28">
        {layoutSamples.map((sample, index) => (
          <article key={sample.id} aria-labelledby={`layout-${sample.id}`} className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <Figure
              image={sample.image}
              sizes="(min-width: 1024px) 56vw, 100vw"
              className={`lg:col-span-7 ${index % 2 ? 'lg:order-2' : ''}`}
              imgClassName={sample.id === 'balanced' || sample.id === 'spread' ? '' : 'rounded-lg'}
            />
            <div className={`lg:col-span-5 ${index % 2 ? 'lg:order-1' : ''}`}>
              <p className="text-sm font-bold tracking-[0.08em] text-brand-red uppercase">{sample.eyebrow}</p>
              <h3 id={`layout-${sample.id}`} className="text-display mt-3 text-[clamp(1.8rem,1.4rem+1.4vw,2.6rem)] leading-tight">
                {sample.title}
              </h3>
              <p className="mt-4 text-lg leading-relaxed">{sample.body}</p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}

/** 06 · Print checks beside the before/after formatting sample, then print and ebook files. */
export function PrintReadySection() {
  return (
    <Section id="print-ready" tone="sun" labelledBy="print-ready-title">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <Eyebrow className="text-ink">{layoutChecks.eyebrow}</Eyebrow>
          <h2 id="print-ready-title" className="text-display text-[clamp(2rem,1.4rem+2.2vw,3.3rem)] leading-[1.06] text-balance">
            {layoutChecks.title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed">{layoutChecks.body}</p>
          <dl className="mt-10 space-y-0">
            {layoutChecks.checks.map((check) => (
              <div key={check.title} className="border-t-2 border-ink py-6">
                <dt className="text-xl font-bold">{check.title}</dt>
                <dd className="mt-2 text-lg leading-relaxed">{check.body}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="lg:col-span-6">
          <div className="rounded-lg bg-white p-4 sm:p-6">
            <Figure image={formattingBeforeAfter} sizes="(min-width: 1024px) 44vw, 100vw" imgClassName="rounded-md" />
          </div>
          <div className="mt-6 rounded-lg bg-ink p-7 text-white sm:p-9">
            <h3 className="text-display text-2xl">{layoutChecks.closing.title}</h3>
            <p className="mt-3 text-lg leading-relaxed text-white/85">{layoutChecks.closing.body}</p>
          </div>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 items-center gap-10 rounded-lg bg-white p-6 sm:p-10 lg:mt-28 lg:grid-cols-12 lg:gap-14 lg:p-14">
        <Figure image={formatsImage} sizes="(min-width: 1024px) 48vw, 100vw" className="lg:col-span-7" />
        <div className="lg:col-span-5">
          <h3 className="text-display text-[clamp(1.8rem,1.4rem+1.4vw,2.6rem)] leading-tight">{formatsCopy.title}</h3>
          {formatsCopy.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="mt-4 text-lg leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </Section>
  )
}

/** 07 · Layout considerations by kind of children's book, with the matching supplied samples. */
export function BookTypesSection() {
  return (
    <Section id="book-types" labelledBy="book-types-title">
      <div className="max-w-3xl">
        <Eyebrow>Every kind of children&rsquo;s book</Eyebrow>
        <h2 id="book-types-title" className="text-display text-[clamp(2.1rem,1.5rem+2.4vw,3.6rem)] leading-[1.06] text-balance">
          Professional formatting for kids&rsquo; stories <Accent>from all genres</Accent>
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">
          Kids&rsquo; book formatting changes with age, length, art and style, so each kind of book gets a layout
          planned for its readers.
        </p>
      </div>

      <ol className="mt-14 lg:mt-16">
        {bookTypes.map((type, index) => (
          <li key={type.title} className="grid grid-cols-1 gap-6 border-t-2 border-ink py-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-3">
              <span className="text-display text-lg text-brand-red">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="text-display mt-1 text-[clamp(1.6rem,1.3rem+1vw,2.2rem)] leading-tight">{type.title}</h3>
            </div>
            <p className={`text-lg leading-relaxed ${type.image ? 'lg:col-span-4' : 'lg:col-span-6'}`}>{type.body}</p>
            {type.image && (
              <Figure
                image={type.image}
                sizes="(min-width: 1024px) 34vw, 100vw"
                className={`lg:col-span-5 ${type.image.height > type.image.width ? 'mx-auto w-full max-w-[22rem]' : ''}`}
                imgClassName="rounded-lg ring-1 ring-ink/10"
              />
            )}
          </li>
        ))}
      </ol>
    </Section>
  )
}
