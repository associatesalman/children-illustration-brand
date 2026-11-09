import {
  ArrowRight,
  BookOpenCheck,
  Check,
  ClipboardCheck,
  FileUp,
  Handshake,
  Megaphone,
  Palette,
  PenLine,
  Printer,
  Truck,
  type LucideIcon,
} from 'lucide-react'
import { books } from '../../content/books'
import {
  introCopy,
  introImage,
  introPoints,
  platformNote,
  platforms,
  processImage,
  processSteps,
  showcaseSlugs,
  type ProcessStep,
} from '../../content/publishing'
import { BookCard } from '../books/BookCard'
import { tiltFivePerRow } from '../books/bookTilt'
import { ButtonLink } from '../ui/Button'
import { Accent, Eyebrow, Section, SectionHeading } from '../ui/Section'

/** "With Our Studio, Sell Your Book On": a static grid of stores and library lending. No slider. */
export function PlatformsSection() {
  return (
    <Section id="platforms" tone="sun" labelledBy="platforms-title">
      <SectionHeading
        id="platforms-title"
        eyebrow="Distribution"
        eyebrowClassName="text-ink"
        title={
          <>
            With Our Studio, <Accent>Sell Your Book On</Accent>
          </>
        }
        intro="We prepare your print and ebook editions for the major stores and library platforms where children’s books are bought and borrowed."
      />

      <ul className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:mt-16 xl:grid-cols-6">
        {platforms.map((platform) => (
          <li key={platform.name} className="flex flex-col items-center justify-center border-t-2 border-ink px-2 pt-6 pb-2 text-center">
            <div className="flex h-14 items-center justify-center">
              {platform.logo ? (
                <img
                  src={platform.logo.src}
                  alt={platform.name}
                  width={platform.logo.width}
                  height={platform.logo.height}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto max-h-14 w-auto"
                />
              ) : (
                <span className="text-[1.35rem] leading-tight font-bold tracking-[-0.01em]">{platform.name}</span>
              )}
            </div>
            <p className="mt-3 text-sm leading-snug">
              {platform.logo ? <span className="sr-only">{platform.name}: </span> : null}
              {platform.note}
            </p>
          </li>
        ))}
      </ul>

      <p className="mt-10 max-w-3xl border-l-4 border-brand-red pl-5 leading-relaxed">{platformNote}</p>
    </Section>
  )
}

/**
 * Publishing introduction: the printed picture-book mockup (on its own white backdrop, so it sits
 * seamlessly on the white section) beside the heading, two paragraphs, six service points and the inquiry
 * link. A hairline separates it from the white showcase that follows.
 */
export function PublishingIntroSection() {
  return (
    <Section id="publishing-support" labelledBy="publishing-support-title" className="border-b border-ink/10">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <img
          src={introImage.src}
          srcSet={introImage.srcSet}
          sizes="(min-width: 1024px) 40vw, 100vw"
          alt={introImage.alt}
          width={introImage.width}
          height={introImage.height}
          loading="lazy"
          decoding="async"
          className="mx-auto block h-auto w-full max-w-[34rem] lg:col-span-5 lg:max-w-none"
        />

        <div className="lg:col-span-7">
          <Eyebrow>Publishing support</Eyebrow>
          <h2
            id="publishing-support-title"
            className="text-display text-[clamp(2.4rem,1.4rem+2.6vw,4.25rem)] leading-[1.02] tracking-[-0.02em] text-balance"
          >
            From first manuscript <Accent>to finished book</Accent>
          </h2>
          {introCopy.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="mt-6 max-w-2xl text-lg leading-relaxed">
              {paragraph}
            </p>
          ))}

          <ul className="mt-10 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
            {introPoints.map((point) => (
              <li key={point.title} className="flex gap-4">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-sun text-ink">
                  <Check aria-hidden size={17} strokeWidth={2.75} />
                </span>
                <div>
                  <h3 className="font-bold">{point.title}</h3>
                  <p className="mt-1 leading-relaxed text-ink-soft">{point.body}</p>
                </div>
              </li>
            ))}
          </ul>

          <ButtonLink href="/contact" className="mt-10">
            Start your publishing inquiry <ArrowRight aria-hidden size={18} />
          </ButtonLink>
        </div>
      </div>
    </Section>
  )
}

/** Exactly 15 books: three rows of five on wide screens, white section, red cards (this page only). */
export function BookShowcaseSection() {
  const shelf = showcaseSlugs.map((slug) => {
    const book = books.find((item) => item.slug === slug)
    if (!book) throw new Error(`Unknown book: ${slug}`)
    return book
  })

  return (
    <Section id="childrens-books" labelledBy="childrens-books-title" wide>
      <SectionHeading
        id="childrens-books-title"
        eyebrow="Book showcase"
        title={
          <>
            Explore <Accent>Children&rsquo;s Books</Accent>
          </>
        }
        intro="Fifteen children’s book covers, from classics and early readers to coloring books and stories for curious minds."
      />
      <ul className="mt-14 grid grid-cols-1 justify-items-center gap-x-6 gap-y-10 sm:grid-cols-2 sm:justify-items-stretch md:grid-cols-3 xl:grid-cols-5 xl:gap-x-8 xl:gap-y-14 lg:mt-16">
        {shelf.map((book) => (
          <BookCard
            key={book.slug}
            book={book}
            variant="red"
            tilt={tiltFivePerRow}
            sizes="(min-width: 1280px) 15vw, (min-width: 768px) 28vw, (min-width: 640px) 44vw, 18rem"
          />
        ))}
      </ul>
    </Section>
  )
}

const stepIcons: Record<ProcessStep['icon'], LucideIcon> = {
  submit: FileUp,
  check: ClipboardCheck,
  agree: Handshake,
  edit: PenLine,
  design: Palette,
  promote: Megaphone,
  print: Printer,
  review: BookOpenCheck,
  distribute: Truck,
}

/** The supplied process chart, large, beside its nine steps written out as page text in the same order. */
export function ProcessSection() {
  return (
    <Section id="process" tone="sun" labelledBy="process-title">
      <SectionHeading
        id="process-title"
        eyebrow="Step by step"
        eyebrowClassName="text-ink"
        title={
          <>
            The publishing process, <Accent>step by step</Accent>
          </>
        }
        intro="How your self-published book travels from manuscript to reader with us. The chart follows a single path through nine steps, and each one is explained here in the same order."
      />

      <div className="mt-14 grid grid-cols-1 gap-12 lg:mt-16 lg:grid-cols-12 lg:items-start lg:gap-16">
        {/* Kept large (up to its native 941px) so the labels inside the chart stay legible. */}
        <figure className="mx-auto w-full max-w-[44rem] lg:col-span-6 lg:max-w-none">
          <img
            src={processImage.src}
            srcSet={processImage.srcSet}
            sizes="(min-width: 1024px) 46vw, 100vw"
            alt={processImage.alt}
            width={processImage.width}
            height={processImage.height}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full rounded-lg ring-1 ring-ink/10"
          />
          <figcaption className="mt-3">
            <a href={processImage.src} target="_blank" rel="noreferrer" className="text-sm font-bold underline underline-offset-4">
              Open the full-size chart<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </figcaption>
        </figure>

        <ol className="lg:col-span-6">
          {processSteps.map((step, index) => {
            const Icon = stepIcons[step.icon]
            return (
              <li key={step.title} className="grid grid-cols-[auto_1fr] gap-x-5 border-t border-ink/25 py-6 first:border-t-2 first:border-ink sm:gap-x-6">
                <div className="flex flex-col items-center gap-2">
                  <span className="flex size-12 items-center justify-center rounded-full bg-white text-brand-red-dark">
                    <Icon aria-hidden size={22} strokeWidth={2} />
                  </span>
                  <span className="text-display text-sm text-brand-red-dark">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    <span className="sr-only">Step {index + 1}: </span>
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-lg leading-relaxed">{step.body}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </Section>
  )
}
