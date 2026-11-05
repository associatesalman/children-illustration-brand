import { ArrowRight } from 'lucide-react'
import {
  editingPromises,
  editingServices,
  humanEditor,
  introBody,
  introLead,
  reviewAreas,
  reviewSteps,
  servicesTagline,
  tabletImage,
} from '../../content/editing'
import type { StyleImage } from '../../content/illustrationStyles'
import { ButtonLink } from '../ui/Button'
import { Checklist } from '../ui/Checklist'
import { Accent, Eyebrow, Section } from '../ui/Section'

const h2 = 'text-display text-[clamp(2.1rem,1.5rem+2.4vw,3.6rem)] leading-[1.06] text-balance'
const pad = (n: number) => String(n + 1).padStart(2, '0')

/** Lazy, dimensioned image with an optional caption. Shared by the editing and formatting sections. */
export function Figure({ image, sizes, className = '', imgClassName = 'rounded-lg' }: { image: StyleImage; sizes: string; className?: string; imgClassName?: string }) {
  return (
    <figure className={className}>
      <img
        src={image.src}
        srcSet={image.srcSet}
        sizes={sizes}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading="lazy"
        decoding="async"
        className={`block h-auto w-full ${imgClassName}`}
      />
      {image.caption && <figcaption className="mt-3 text-sm leading-relaxed text-ink-soft">{image.caption}</figcaption>}
    </figure>
  )
}

/** 01 · What editing and proofreading involve, beside the proofreading tablet, then what every sentence is checked for. */
export function EditingIntroSection() {
  return (
    <Section id="editing" labelledBy="editing-title">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <Eyebrow>Editing &amp; proofreading</Eyebrow>
          <h2 id="editing-title" className={h2}>
            Every word ready for <Accent>young readers</Accent>
          </h2>
          <p className="mt-6 text-xl leading-relaxed">{introLead}</p>
          {introBody.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="mt-5 text-lg leading-relaxed text-ink-soft">
              {paragraph}
            </p>
          ))}
        </div>
        <Figure image={tabletImage} sizes="(min-width: 1024px) 44vw, 100vw" className="mx-auto w-full max-w-[38rem] lg:col-span-6 lg:max-w-none" />
      </div>

      <div className="mt-20 lg:mt-28">
        <h3 className="text-display text-[clamp(1.6rem,1.3rem+1vw,2.25rem)] leading-tight">What we review in every sentence</h3>
        <dl className="mt-8 grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {reviewAreas.map((area) => (
            <div key={area.title} className="border-t-2 border-ink py-6">
              <dt className="text-lg font-bold">{area.title}</dt>
              <dd className="mt-2 leading-relaxed text-ink-soft">{area.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  )
}

/** 02 · The source's human-editor argument, set as an editorial spread with a pull quote. */
export function HumanEditorSection() {
  return (
    <Section id="human-editor" tone="sun" labelledBy="human-editor-title">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Eyebrow className="text-ink">Human editors, not automated rewrites</Eyebrow>
          <p aria-hidden className="text-display text-[clamp(2.4rem,1.6rem+3vw,4.5rem)] leading-[1.02] text-brand-red-dark italic">
            &ldquo;{humanEditor.pullQuote}&rdquo;
          </p>
        </div>
        <div className="lg:col-span-7">
          <h2 id="human-editor-title" className="text-display text-[clamp(1.8rem,1.4rem+1.6vw,2.75rem)] leading-[1.1] text-balance">
            {humanEditor.title}
          </h2>
          {humanEditor.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="mt-6 text-lg leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </Section>
  )
}

/** 03 · The six editing services, the six promises, and how the author takes part. */
export function EditingServicesSection() {
  return (
    <Section id="editing-services" labelledBy="editing-services-title">
      <div className="max-w-3xl">
        <Eyebrow>What the service includes</Eyebrow>
        <h2 id="editing-services-title" className={h2}>
          Children&rsquo;s book editing: <Accent>proofreading, copy editing and manuscript editing</Accent>
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">{servicesTagline}</p>
      </div>

      <ol className="mt-14 grid grid-cols-1 gap-x-14 md:grid-cols-2 lg:mt-16">
        {editingServices.map((service, index) => (
          <li key={service.title} className="grid grid-cols-[3rem_1fr] gap-x-4 border-t border-ink/20 py-7">
            <span aria-hidden className="text-display text-2xl text-brand-red">
              {pad(index)}
            </span>
            <div>
              <h3 className="text-xl font-bold">{service.title}</h3>
              <p className="mt-2 text-lg leading-relaxed text-ink-soft">{service.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-20 rounded-lg bg-sun p-7 sm:p-10 lg:mt-24 lg:p-14">
        <h3 className="text-display text-[clamp(1.6rem,1.3rem+1vw,2.25rem)] leading-tight">What you can expect from our editors</h3>
        <ul className="mt-10 grid grid-cols-1 gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {editingPromises.map((promise, index) => (
            <li key={promise.title} className="border-l-2 border-ink pl-5">
              <span className="text-display text-lg text-brand-red-dark">{pad(index)}</span>
              <h4 className="text-display mt-1 text-2xl leading-tight">{promise.title}</h4>
              <p className="mt-2 text-lg leading-relaxed">{promise.body}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <h3 className="text-display text-[clamp(1.6rem,1.3rem+1vw,2.25rem)] leading-tight">How you take part in the review</h3>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            Editing is a conversation. You see every suggested change and the reason for it, and you decide which
            changes to keep.
          </p>
        </div>
        <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-8">
          {reviewSteps.map((step, index) => (
            <li key={step.title} className="rounded-lg bg-ink p-7 text-white">
              <span className="flex size-10 items-center justify-center rounded-full bg-sun font-bold text-ink">{index + 1}</span>
              <h4 className="mt-5 text-xl font-bold">
                <span className="sr-only">Step {index + 1}: </span>
                {step.title}
              </h4>
              <p className="mt-2 leading-relaxed text-white/85">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}

const bring = [
  'Your manuscript, or the part that is ready',
  'The age group and kind of book (picture book, early reader, chapter book or activity book)',
  'Whether the book is illustrated, and whether the artwork is finished',
  'The formats you need: paperback, hardcover or ebook',
]

/** Closing inquiry. The contact form has no preselect, so the copy names the options to choose. */
export function EditingCta() {
  return (
    <Section id="start" tone="sun" labelledBy="editing-cta-title">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-7">
          <Eyebrow className="text-brand-red-dark">Start with your manuscript</Eyebrow>
          <h2 id="editing-cta-title" className={h2}>
            A careful edit and <Accent className="text-brand-red-dark">a clean layout</Accent>
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed">
            Tell us about your book and where it is now. We will suggest the level of editing it needs, talk through
            formatting for your chosen editions and explain the next steps. On the contact form, choose
            &ldquo;Editing and Proofreading&rdquo; or &ldquo;Book Design and Formatting&rdquo;.
          </p>
          <div className="mt-9">
            <ButtonLink href="/contact">
              Discuss editing and formatting <ArrowRight aria-hidden size={18} />
            </ButtonLink>
          </div>
        </div>
        <div className="rounded-lg bg-white p-8 sm:p-10 lg:col-span-5">
          <h3 className="text-display text-2xl">Helpful to share</h3>
          <Checklist items={bring} className="mt-6 text-lg" />
        </div>
      </div>
    </Section>
  )
}
