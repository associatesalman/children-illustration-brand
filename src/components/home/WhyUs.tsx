import { reasons } from '../../content/home'
import { Accent, Section, SectionHeading } from '../ui/Section'

export function WhyUs() {
  return (
    <Section id="about" labelledBy="about-title">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div>
          <SectionHeading
            id="about-title"
            eyebrow="Why authors choose us"
            title={
              <>
                One team, from idea <Accent>to bookshelf</Accent>
              </>
            }
          />
          <div className="mt-6 max-w-lg space-y-4 text-lg leading-relaxed text-ink-soft">
            <p>
              Many authors have a story ready but no simple way to turn it into a finished book. Finding an
              illustrator, an editor, a designer, and publishing help separately takes time and often leads to uneven
              results.
            </p>
            <p>We bring that work together, with a team that focuses on books for young readers.</p>
          </div>
        </div>

        <ol className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {reasons.map((reason, index) => (
            <li key={reason.title} className="border-t border-ink/15 pt-6">
              <p className="text-display text-3xl text-brand-red" aria-hidden>
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-3 text-xl font-bold">{reason.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{reason.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
