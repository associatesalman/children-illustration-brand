import type { ReactNode } from 'react'
import { bookCategories, books, collectionCategories, type BookCollection } from '../../content/books'
import { Section, SectionHeading } from '../ui/Section'
import { BookCard, type BookCardVariant } from './BookCard'

type BookShowcaseProps = {
  id: string
  collection: BookCollection
  eyebrow: string
  title: ReactNode
  intro: string
  /** sun: yellow section, white cards (default). white: white section, yellow cards. */
  variant?: BookCardVariant
}

/**
 * A showcase of one book collection, grouped by category. The large cards take
 * four columns from 1280px; below that, two roomier columns, then one.
 */
export function BookShowcase({ id, collection, eyebrow, title, intro, variant = 'sun' }: BookShowcaseProps) {
  const titleId = `${id}-title`

  return (
    <Section id={id} tone={variant} labelledBy={titleId} wide>
      <SectionHeading
        id={titleId}
        eyebrow={eyebrow}
        eyebrowClassName={variant === 'sun' ? 'text-ink' : undefined}
        title={title}
        intro={intro}
      />

      {collectionCategories[collection].map((key) => {
        const category = bookCategories[key]
        const shelf = books.filter((book) => book.collection === collection && book.category === key)
        const headingId = `${id}-${key}`

        return (
          <section key={key} aria-labelledby={headingId} className="mt-20 lg:mt-28">
            <div className="max-w-2xl border-t-2 border-ink pt-6">
              <h3 id={headingId} className="text-display text-[clamp(1.75rem,1.4rem+1.2vw,2.4rem)] leading-tight">
                {category.label}
              </h3>
              <p className="mt-3 text-lg leading-relaxed">{category.intro}</p>
            </div>

            <ul className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-4 xl:gap-x-12 xl:gap-y-16">
              {shelf.map((book) => (
                <BookCard key={book.slug} book={book} variant={variant} />
              ))}
            </ul>
          </section>
        )
      })}
    </Section>
  )
}
