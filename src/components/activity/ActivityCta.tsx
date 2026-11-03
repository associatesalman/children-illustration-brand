import { ArrowRight } from 'lucide-react'
import { ButtonLink } from '../ui/Button'
import { Checklist } from '../ui/Checklist'
import { Accent, Section } from '../ui/Section'

const bring = [
  'The age group and purpose of the book',
  'The activity types you have in mind, or your theme',
  'Your book size and how it will be printed',
  'Any characters or learning content you already have',
]

export function ActivityCta() {
  return (
    <Section id="start" tone="sun" labelledBy="activity-cta-title">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-7">
          <p className="mb-4 text-sm font-bold tracking-[0.08em] text-brand-red-dark uppercase">Start your activity book</p>
          <h2 id="activity-cta-title" className="text-display text-[clamp(2.1rem,1.5rem+2.4vw,3.6rem)] leading-[1.06] text-balance">
            Pages children want to <Accent className="text-brand-red-dark">color, solve and learn from</Accent>
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed">
            Tell us about your activity book idea. We will talk through the page mix, the illustration style and
            what your readers need, and explain the next steps.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <ButtonLink href="/contact">
              Discuss your activity book <ArrowRight aria-hidden size={18} />
            </ButtonLink>
            <ButtonLink href="/#free-sample" variant="quiet">
              Request a free sample
            </ButtonLink>
          </div>
        </div>
        <div className="rounded-lg bg-white p-8 sm:p-10 lg:col-span-5">
          <h3 className="text-display text-2xl">Helpful to share</h3>
          <Checklist items={bring} className="mt-6 text-lg" />
        </div>
      </div>
    </Section>
  )
}
