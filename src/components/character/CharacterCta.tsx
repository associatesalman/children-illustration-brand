import { ArrowRight } from 'lucide-react'
import { ButtonLink } from '../ui/Button'
import { Checklist } from '../ui/Checklist'
import { Accent, Section } from '../ui/Section'

const bring = [
  'Your manuscript, or a short summary of the story',
  'The age group you are writing for',
  'A description of each character you need',
  'Any sketches, photos or books that inspire you',
]

export function CharacterCta() {
  return (
    <Section id="start" tone="sun" labelledBy="character-cta-title">
      <div className="grid grid-cols-1 overflow-hidden rounded-lg bg-white lg:grid-cols-12">
        <div className="p-8 sm:p-12 lg:col-span-7 lg:p-16">
          <p className="mb-4 text-sm font-bold tracking-[0.08em] text-brand-red uppercase">Start your characters</p>
          <h2 id="character-cta-title" className="text-display text-[clamp(2.1rem,1.5rem+2.4vw,3.6rem)] leading-[1.06] text-balance">
            Create characters <Accent>children remember</Accent>
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            Tell us about your story and the characters in it. We will talk through what your book needs, from a
            single main character to a full cast with sheets and expressions, and explain the next steps.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <ButtonLink href="/contact">
              Discuss your character design <ArrowRight aria-hidden size={18} />
            </ButtonLink>
            <ButtonLink href="/#free-sample" variant="quiet">
              Request a free sample
            </ButtonLink>
          </div>
        </div>
        <div className="on-dark bg-ink p-8 text-white sm:p-12 lg:col-span-5 lg:p-16">
          <h3 className="text-display text-2xl">Helpful to share</h3>
          <Checklist items={bring} className="mt-6 text-lg text-white/90" marker="bg-sun" />
          <p className="mt-8 text-white/70">Only have an idea so far? That is a fine place to start.</p>
        </div>
      </div>
    </Section>
  )
}
