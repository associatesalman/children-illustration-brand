import { ArrowRight, Check } from 'lucide-react'
import {
  collections,
  coverSrc,
  heroImage,
  readerIntro,
  readerPoints,
  readerVideo,
  spreadsImage,
  storyIntro,
  storyPoints,
  type BookCollection,
  type ServicePoint,
} from '../../content/translation'
import { BookCardView } from '../books/BookCard'
import { tiltFourPerRow } from '../books/bookTilt'
import { StyleVideo } from '../styles/StyleVideo'
import { Container } from '../ui/Container'
import { Eyebrow, Section } from '../ui/Section'

/**
 * Image-only hero. On landscape screens it fills the viewport below the 4.5 rem sticky header edge to edge
 * with object-fit: cover, positioned left of center so the title block and the drawn child stay in view.
 * On portrait screens a full-height crop would cut the title mid-word, so the section takes the image's
 * own proportions instead: still full width, with no strips. Loaded eagerly at high priority.
 */
export function TranslationHero() {
  return (
    <section aria-labelledby="translation-hero-title" className="w-full bg-[#3b7fd0]">
      <h1 id="translation-hero-title" className="sr-only">
        Children’s Book Translation
      </h1>
      <img
        src={heroImage.src}
        srcSet={heroImage.srcSet}
        sizes="100vw"
        alt={heroImage.alt}
        width={heroImage.width}
        height={heroImage.height}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="block h-auto w-full object-cover object-[15%_50%] [@media(min-aspect-ratio:1/1)]:h-[calc(100svh-4.5rem)]"
      />
    </section>
  )
}

function PointBlock({ point, index, onSun = false }: { point: ServicePoint; index: number; onSun?: boolean }) {
  return (
    <li className="border-t-2 border-ink pt-6">
      <p className="text-display text-lg text-brand-red-dark">{String(index + 1).padStart(2, '0')}</p>
      <h3 className="mt-2 text-[1.6rem] leading-tight font-bold">{point.title}</h3>
      <p className="mt-3 text-lg leading-relaxed">{point.body}</p>
      <ul className="mt-5 grid gap-2.5">
        {point.points.map((item) => (
          <li key={item} className="flex gap-3">
            <span className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full ${onSun ? 'bg-white' : 'bg-sun'} text-ink`}>
              <Check aria-hidden size={14} strokeWidth={3} />
            </span>
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </li>
  )
}

/** White: the picture-book spreads mockup, large, beside the story-and-voice copy. */
export function StoryVoiceSection() {
  return (
    <Section id="translation-story" labelledBy="translation-story-title">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Eyebrow>Children’s book translation</Eyebrow>
          <h2
            id="translation-story-title"
            className="text-display text-[clamp(2.6rem,1.4rem+3.6vw,5.5rem)] leading-[0.98] tracking-[-0.025em] text-balance"
          >
            Translating the story, <em className="text-brand-red italic">not just the words</em>
          </h2>
          {storyIntro.map((text) => (
            <p key={text.slice(0, 24)} className="mt-6 max-w-2xl text-xl leading-relaxed">
              {text}
            </p>
          ))}
          <ol className="mt-12 grid gap-12">
            {storyPoints.map((point, index) => (
              <PointBlock key={point.title} point={point} index={index} />
            ))}
          </ol>
        </div>
        <figure className="mx-auto w-full max-w-[34rem] lg:col-span-5 lg:max-w-none lg:pt-4">
          <img
            src={spreadsImage.src}
            srcSet={spreadsImage.srcSet}
            sizes="(min-width: 1024px) 38vw, 34rem"
            alt={spreadsImage.alt}
            width={spreadsImage.width}
            height={spreadsImage.height}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full rounded-lg ring-1 ring-ink/10"
          />
          <figcaption className="mt-4 text-sm leading-relaxed text-ink-soft">
            Three spreads from a picture book about Benny the Little Bear and Max the Little Mouse, with the text set in the open space around each picture.
          </figcaption>
        </figure>
      </div>
    </Section>
  )
}

/** Yellow: the silent picture-book video beside the reading-age, culture and read-aloud copy. */
export function ReaderLanguageSection() {
  return (
    <Section id="translation-readers" tone="sun" labelledBy="translation-readers-title">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div>
            <h2
              id="translation-readers-title"
              className="text-display text-[clamp(2.4rem,1.4rem+3vw,4.75rem)] leading-[1] tracking-[-0.025em] text-balance"
            >
              A book that feels written in its new language
            </h2>
            <p className="mt-6 text-lg leading-relaxed">{readerIntro}</p>
            <StyleVideo video={readerVideo} className="mt-10 w-full max-w-[26rem]" />
          </div>
        </div>
        <div className="lg:col-span-7">
          <ol className="grid gap-12">
            {readerPoints.map((point, index) => (
              <PointBlock key={point.title} point={point} index={index} onSun />
            ))}
          </ol>
          <a href="/contact" className="mt-12 inline-flex items-center gap-2 rounded-md bg-ink px-6 py-3.5 font-medium text-white">
            Discuss your translation <ArrowRight aria-hidden size={18} />
          </a>
        </div>
      </div>
    </Section>
  )
}

/** Pure white: one collection, with a huge heading and four large black cards per row on desktop. */
export function CollectionSection({ collection, first }: { collection: BookCollection; first: boolean }) {
  const titleId = `${collection.id}-title`
  return (
    <section
      id={collection.id}
      tabIndex={-1}
      aria-labelledby={titleId}
      className={`bg-white py-20 text-ink sm:py-24 lg:py-28 ${first ? '' : 'border-t border-ink/10'}`}
    >
      <Container>
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-bold tracking-[0.08em] text-brand-red uppercase">
            {collection.books.length} {collection.books.length === 1 ? 'book' : 'books'}
          </p>
          <h2 id={titleId} className="text-display text-[clamp(2.8rem,1.4rem+4.2vw,6rem)] leading-[0.98] tracking-[-0.025em]">
            {collection.title}
          </h2>
          <p className="mt-6 text-xl leading-relaxed text-ink-soft">{collection.intro}</p>
        </div>
        <ul className="mt-14 grid grid-cols-1 justify-items-center gap-x-8 gap-y-12 sm:grid-cols-2 sm:justify-items-stretch lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-10 xl:gap-y-16 lg:mt-16">
          {collection.books.map((book) => (
            <BookCardView
              key={book.slug}
              variant="black"
              tilt={tiltFourPerRow}
              headingLevel="h3"
              image={{
                src: coverSrc(book.slug),
                width: book.width,
                height: book.height,
                alt: `Cover of ${book.title}: ${book.cover}`,
              }}
              label={book.language}
              title={book.title}
              byline={book.author}
              description={book.description}
            />
          ))}
        </ul>
      </Container>
    </section>
  )
}

/** Collections with no books are left out until they have some. */
export function BookCollections() {
  return (
    <>
      {collections.filter((collection) => collection.books.length > 0).map((collection, index) => (
        <CollectionSection key={collection.id} collection={collection} first={index === 0} />
      ))}
    </>
  )
}
