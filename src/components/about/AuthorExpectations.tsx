import { expectations } from '../../content/about'
import { Accent, Section, SectionHeading } from '../ui/Section'

export function AuthorExpectations() {
  return (
    <Section id="expectations" labelledBy="expect-title">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-20">
        <SectionHeading
          id="expect-title"
          eyebrow="What to expect"
          title={
            <>
              What you can expect <Accent>from us</Accent>
            </>
          }
          intro="The standards we hold every project to, whatever its size."
        />

        <dl className="divide-y divide-ink/15 border-y border-ink/15">
          {expectations.map((item) => (
            <div key={item.title} className="grid gap-2 py-7 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-10">
              <dt className="text-display text-2xl leading-snug">{item.title}</dt>
              <dd className="text-lg leading-relaxed text-ink-soft">{item.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  )
}
