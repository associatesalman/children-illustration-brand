import { ButtonLink } from '../ui/Button'
import { Accent, Section, SectionHeading } from '../ui/Section'

export function PortfolioCta() {
  return (
    <Section id="start" labelledBy="start-title">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <SectionHeading
          id="start-title"
          eyebrow="Start a conversation"
          className="[&_h2]:text-balance [&>p:last-child]:mx-auto"
          title={
            <>
              Picture <Accent>your story</Accent> here
            </>
          }
          intro="Tell us about your book, its readers and the style you have in mind. We’ll talk through the illustration, format and next steps with you."
        />
        <div className="mt-9">
          <ButtonLink href="/contact">Discuss your book</ButtonLink>
        </div>
      </div>
    </Section>
  )
}
