import { bookCategories, bookImage, type Book } from '../../content/books'
import { tiltFourPerRow } from './bookTilt'

/**
 * Colors per showcase; the card layout is the same everywhere.
 * - sun: white cards on a yellow section (Portfolio).
 * - white: yellow cards on a white section (Home).
 * - red: red cards with white text on a white section (Book Publishing page only).
 * - black: black cards with white text on a white section (Children's Book Translation page only). A faint
 *   light edge that follows the cover's own outline keeps dark covers distinct from the black card.
 */
const bookCardColors = {
  sun: {
    card: 'bg-white',
    pill: 'bg-sun',
    description: 'text-ink-soft',
    cover: 'drop-shadow-[0_4px_8px_rgba(22,20,18,0.22)]',
  },
  white: {
    card: 'bg-sun',
    pill: 'bg-white',
    description: 'text-ink',
    cover: 'drop-shadow-[0_4px_8px_rgba(22,20,18,0.22)]',
  },
  red: {
    card: 'bg-brand-red text-white',
    pill: 'bg-white text-brand-red-dark',
    description: 'text-white/90',
    cover: 'drop-shadow-[0_4px_8px_rgba(22,20,18,0.22)]',
  },
  black: {
    card: 'bg-black text-white',
    pill: 'bg-white text-ink',
    description: 'text-white/85',
    cover: 'drop-shadow-[0_0_1px_rgba(255,255,255,0.6)]',
  },
} as const

export type BookCardVariant = keyof typeof bookCardColors

type CardLayoutProps = {
  variant?: BookCardVariant
  /** Tilt pattern for the grid the card sits in (four per row by default). */
  tilt?: string
  /** Image sizes hint for the grid the card sits in. */
  sizes?: string
  /** Heading level of the title, to fit the page outline. */
  headingLevel?: 'h3' | 'h4'
}

type BookCardViewProps = CardLayoutProps & {
  image: { src: string; srcSet?: string; width: number; height: number; alt: string }
  label: string
  title: string
  /** Optional author line under the title. */
  byline?: string
  description: string
}

/**
 * One book in a showcase grid: a card with two small ears on top, the cover
 * centered directly on the card in a fixed 3:4 area, then the label, title
 * and description.
 */
export function BookCardView({
  image,
  label,
  title,
  byline,
  description,
  variant = 'sun',
  tilt = tiltFourPerRow,
  sizes = '(min-width: 1024px) 18vw, (min-width: 640px) 38vw, 18rem',
  headingLevel: Heading = 'h4',
}: BookCardViewProps) {
  const colors = bookCardColors[variant]

  return (
    <li className={`relative flex max-w-sm pt-5 sm:max-w-none ${tilt}`}>
      <span aria-hidden className="absolute top-0 left-1/2 flex -translate-x-1/2 gap-4">
        <span className={`h-7 w-4 rounded-t-full ${colors.card}`} />
        <span className={`h-7 w-4 rounded-t-full ${colors.card}`} />
      </span>

      <div className={`flex w-full flex-col rounded-[1.75rem] p-2.5 ${colors.card}`}>
        {/* Same area for every cover, with no backdrop; object-contain keeps each one whole and centered. */}
        <div className="relative aspect-[3/4]">
          <img
            src={image.src}
            srcSet={image.srcSet}
            sizes={image.srcSet ? sizes : undefined}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 block h-full w-full object-contain p-2 ${colors.cover}`}
          />
        </div>

        <div className="flex flex-1 flex-col px-3 pt-5 pb-4">
          <p className={`self-start rounded-full px-3 py-1 text-[0.7rem] font-bold tracking-[0.08em] uppercase ${colors.pill}`}>
            {label}
          </p>
          <Heading className="text-display mt-3 text-[1.35rem] leading-snug">{title}</Heading>
          {byline && <p className="mt-1 text-[0.95rem] font-bold">{byline}</p>}
          <p className={`mt-2 text-[0.95rem] leading-relaxed ${colors.description}`}>{description}</p>
        </div>
      </div>
    </li>
  )
}

type BookCardProps = CardLayoutProps & { book: Book }

/** A Home/Portfolio/Publishing book entry, shown with its category label. */
export function BookCard({ book, ...layout }: BookCardProps) {
  const { src, small } = bookImage(book)
  return (
    <BookCardView
      {...layout}
      image={{
        src,
        srcSet: small ? `${small} 220w, ${src} ${book.width}w` : undefined,
        width: book.width,
        height: book.height,
        alt: `Cover of ${book.title}: ${book.cover}`,
      }}
      label={bookCategories[book.category].label}
      title={book.title}
      description={book.description}
    />
  )
}
