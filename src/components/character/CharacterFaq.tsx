import { Plus } from 'lucide-react'
import { characterFaqs } from '../../content/characterDesign'
import { Accent, Section, SectionHeading } from '../ui/Section'

export function CharacterFaq() {
  return (
    <Section id="faq" labelledBy="character-faq-title">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-20">
        <SectionHeading
          id="character-faq-title"
          eyebrow="Frequently asked questions"
          title={
            <>
              Questions about <Accent>character design</Accent>
            </>
          }
          intro="Getting started, working from your ideas, sheets and expressions, and the examples on this page."
        />

        <div className="border-t border-ink/20">
          {characterFaqs.map((faq) => (
            <details key={faq.title} className="group border-b border-ink/20">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-lg font-bold hover:text-brand-red sm:text-xl [&::-webkit-details-marker]:hidden">
                {faq.title}
                <Plus aria-hidden size={22} className="mt-1 shrink-0 group-open:rotate-45" />
              </summary>
              <p className="-mt-1 max-w-2xl pb-7 leading-relaxed text-ink-soft">{faq.body}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  )
}
