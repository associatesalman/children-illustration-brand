import { ArrowRight } from 'lucide-react'
import { ButtonLink } from '../ui/Button'
import { Checklist } from '../ui/Checklist'
import { Accent, Section } from '../ui/Section'

const bring = [
  'Your manuscript, or a short summary of the story',
  'The age group you are writing for',
  'Notes on your main characters',
  'Any styles or books you love, from this page or elsewhere',
]

export function StylesCta() {
  return (
    <Section id="start" tone="sun" labelledBy="styles-cta-title">
      <div className="grid grid-cols-1 overflow-hidden rounded-lg bg-white lg:grid-cols-12">
        <div className="p-8 sm:p-12 lg:col-span-7 lg:p-16">
          <p className="mb-4 text-sm font-bold tracking-[0.08em] text-brand-red uppercase">Start your project</p>
          <h2 id="styles-cta-title" className="text-display text-[clamp(2.1rem,1.5rem+2.4vw,3.6rem)] leading-[1.06] text-balance">
            Let&rsquo;s find the look <Accent>your story deserves</Accent>
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            Tell us about your book and the styles you are drawn to. We will talk through the right illustration
            approach for your story and readers, and explain the next steps.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <ButtonLink href="/contact">
              Discuss your illustration project <ArrowRight aria-hidden size={18} />
            </ButtonLink>
            <ButtonLink href="/free-sample" variant="quiet">
              Request a free sample
            </ButtonLink>
          </div>
        </div>
        <div className="on-dark bg-ink p-8 text-white sm:p-12 lg:col-span-5 lg:p-16">
          <h3 className="text-display text-2xl">Helpful to share</h3>
          <Checklist items={bring} className="mt-6 text-lg text-white/90" marker="bg-sun" />
          <p className="mt-8 text-white/70">Not sure about a style yet? That is fine. We will help you choose.</p>
        </div>
      </div>
    </Section>
  )
}
