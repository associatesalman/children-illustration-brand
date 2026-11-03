import { bookTypes } from '../../content/home'
import { ArtImage } from '../ui/ArtImage'
import { Accent, Section, SectionHeading } from '../ui/Section'

export function BookTypes() {
  return (
    <Section id="books" labelledBy="books-title">
      <SectionHeading
        id="books-title"
        eyebrow="Books we illustrate"
        title={
          <>
            Stories to read, color, <Accent>and solve</Accent>
          </>
        }
        intro="The same characters can carry a bedtime story, a coloring book, and an activity book, so young readers meet them again and again."
      />

      <ul className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-3 lg:mt-16">
        {bookTypes.map((book) => (
          <li key={book.title}>
            <div className="bg-paper p-5 sm:p-8">
              <ArtImage artwork={book.artwork} className="mx-auto max-w-sm md:max-w-none" />
            </div>
            <h3 className="text-display mt-6 text-2xl">{book.title}</h3>
            <p className="mt-2 text-ink-soft">{book.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
