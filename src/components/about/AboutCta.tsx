import { ButtonLink } from '../ui/Button'
import { Accent, Section, SectionHeading } from '../ui/Section'

export function AboutCta() {
  return (
    <Section id="start" tone="sun" labelledBy="start-title">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <SectionHeading
          id="start-title"
          eyebrow="Start a conversation"
          eyebrowClassName="text-ink"
          className="[&_h2]:text-balance [&>p:last-child]:mx-auto"
          title={
            <>
              Tell us about the book <Accent>you&rsquo;re writing</Accent>
            </>
          }
          intro="Whether you have an idea, a finished manuscript, or a book that needs new illustrations, we’ll talk through what it needs. A free sample shows how we would approach your story before you commit."
        />
        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
          <ButtonLink href="/contact">Discuss your story</ButtonLink>
          <ButtonLink href="/services/illustration-styles" variant="quiet">
            Explore illustration services
          </ButtonLink>
        </div>
      </div>
    </Section>
  )
}
