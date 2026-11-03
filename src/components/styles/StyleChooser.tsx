import { ArrowRight } from 'lucide-react'
import { choosingQuestions, styleById, styleMatches } from '../../content/illustrationStyles'
import { Accent, Section, SectionHeading } from '../ui/Section'

export function StyleChooser() {
  return (
    <Section id="choosing-a-style" tone="sun" labelledBy="choosing-title">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading
            id="choosing-title"
            eyebrow="Choosing the right style"
            eyebrowClassName="text-ink"
            title={
              <>
                Start with your story, <Accent>not the style</Accent>
              </>
            }
          />
          <p className="mt-6 text-lg leading-relaxed">
            There is no single best style, only the best fit for a particular story and its readers. These four
            questions narrow it down quickly. If you are still unsure, we will recommend a direction and explain our
            reasoning.
          </p>
          <dl className="mt-10 space-y-6">
            {choosingQuestions.map((question) => (
              <div key={question.title}>
                <dt className="text-display text-xl">{question.title}</dt>
                <dd className="mt-1 leading-relaxed">{question.body}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-7 lg:self-center">
          <h3 className="text-sm font-bold tracking-[0.08em] uppercase">If your book needs&hellip;</h3>
          <ul className="mt-4 overflow-hidden rounded-lg bg-white">
            {styleMatches.map((match) => {
              const style = styleById[match.id]
              return (
                <li key={match.id} className="border-b border-ink/10 last:border-b-0">
                  <a
                    href={`#${style.id}`}
                    className="grid grid-cols-1 gap-2 p-6 hover:bg-paper sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8 sm:p-7"
                  >
                    <span className="text-lg leading-snug">{match.need}</span>
                    <span className="flex items-center gap-2 font-bold whitespace-nowrap text-brand-red">
                      {style.name} <ArrowRight aria-hidden size={18} />
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </Section>
  )
}
