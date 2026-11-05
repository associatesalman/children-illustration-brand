import { Check } from 'lucide-react'
import {
  beginningBody,
  beginningQuote,
  introAnswer,
  introHeading,
  introLead,
  introQuestions,
  whyBenefits,
  whyHeading,
} from '../../content/marketing'
import { Section } from '../ui/Section'

/** Yellow: the supplied opening heading, lead, the three questions and the answer, word for word. */
export function MarketingIntroSection() {
  return (
    <Section id="after-publishing" tone="sun" labelledBy="after-publishing-title">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h2
            id="after-publishing-title"
            className="text-display text-[clamp(2.3rem,1.4rem+2.8vw,4.4rem)] leading-[1.04] tracking-[-0.02em] text-balance"
          >
            {introHeading[0]} <em className="text-brand-red-dark italic">{introHeading[1]}</em>
          </h2>
          <p className="mt-8 max-w-2xl text-xl leading-relaxed">{introLead}</p>
        </div>

        <div className="lg:col-span-5 lg:pt-3">
          <ul className="grid gap-3">
            {introQuestions.map((question, index) => (
              <li key={question} className="flex items-center gap-5 rounded-lg bg-white px-6 py-5">
                <span className="text-display text-2xl text-brand-red-dark">{String(index + 1).padStart(2, '0')}</span>
                <span className="text-lg font-bold">{question}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 border-l-4 border-ink pl-5 text-lg leading-relaxed">{introAnswer}</p>
        </div>
      </div>
    </Section>
  )
}

/** White: the "only the beginning" statement and paragraph, then "Why Choose" with its five benefits. */
export function WhyChooseSection() {
  return (
    <Section id="why-choose" labelledBy="why-choose-title">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <p className="text-display text-[clamp(1.8rem,1.3rem+1.6vw,2.8rem)] leading-[1.15] tracking-[-0.015em] text-balance">
            {beginningQuote}
          </p>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-soft">{beginningBody}</p>
        </div>

        <div className="lg:col-span-6">
          <h2 id="why-choose-title" className="text-display text-[clamp(1.9rem,1.4rem+1.6vw,2.9rem)] leading-[1.1] text-balance">
            {whyHeading}
          </h2>
          <ul className="mt-8 border-t-2 border-ink">
            {whyBenefits.map(([lead, rest]) => (
              <li key={lead} className="flex gap-4 border-b border-ink/15 py-4">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-sun text-ink">
                  <Check aria-hidden size={15} strokeWidth={3} />
                </span>
                <span className="text-lg leading-relaxed">
                  <strong className="font-bold">{lead}</strong>
                  {rest}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
