import { bookCategories, bookImage, type Book } from '../../content/books'

/**
 * Colors per showcase; the card layout is the same everywhere.
 * - sun: white cards on a yellow section (Portfolio).
 * - white: yellow cards on a white section (Home).
 */
const bookCardColors = {
  sun: {
    card: 'bg-white',
    pill: 'bg-sun',
    description: 'text-ink-soft',
  },
  white: {
    card: 'bg-sun',
    pill: 'bg-white',
    description: 'text-ink',
  },
} as const

export type BookCardVariant = keyof typeof bookCardColors

/**
 * On wide screens the four cards in each row are set at fixed tilts of -2°, +2°,
 * -1° and +2° with small vertical offsets. Static: no transition or hover change.
 */
const tilt = [
  'xl:[&:nth-child(4n+1)]:-rotate-2 xl:[&:nth-child(4n+1)]:top-3',
  'xl:[&:nth-child(4n+2)]:rotate-2',
  'xl:[&:nth-child(4n+3)]:-rotate-1 xl:[&:nth-child(4n+3)]:top-1',
  'xl:[&:nth-child(4n)]:rotate-2 xl:[&:nth-child(4n)]:top-3',
].join(' ')

/**
 * One book in a showcase grid: a card with two small ears on top, the cover
 * centered directly on the card in a fixed 3:4 area, then the category, title
 * and description.
 */
export function BookCard({ book, variant = 'sun' }: { book: Book; variant?: BookCardVariant }) {
  const { src, small } = bookImage(book)
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
            src={src}
            srcSet={small ? `${small} 220w, ${src} ${book.width}w` : undefined}
            sizes="(min-width: 1024px) 18vw, (min-width: 640px) 38vw, 18rem"
            alt={`Cover of ${book.title}: ${book.cover}`}
            width={book.width}
            height={book.height}
            loading="lazy"
            decoding="async"
            // A soft shadow that follows the cover's own edges, so light covers stay distinct from the card.
            className="absolute inset-0 block h-full w-full object-contain p-2 drop-shadow-[0_4px_8px_rgba(22,20,18,0.22)]"
          />
        </div>

        <div className="flex flex-1 flex-col px-3 pt-5 pb-4">
          <p
            className={`self-start rounded-full px-3 py-1 text-[0.7rem] font-bold tracking-[0.08em] uppercase ${colors.pill}`}
          >
            {bookCategories[book.category].label}
          </p>
          <h4 className="text-display mt-3 text-[1.35rem] leading-snug">{book.title}</h4>
          <p className={`mt-2 text-[0.95rem] leading-relaxed ${colors.description}`}>{book.description}</p>
        </div>
      </div>
    </li>
  )
}
