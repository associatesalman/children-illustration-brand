import { Plus } from 'lucide-react'
import { styleFaqs } from '../../content/illustrationStyles'
import { Accent, Section, SectionHeading } from '../ui/Section'

export function StylesFaq() {
  return (
    <Section id="faq" labelledBy="styles-faq-title">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-20">
        <SectionHeading
          id="styles-faq-title"
          eyebrow="Frequently asked questions"
          title={
            <>
              Questions about <Accent>illustration styles</Accent>
            </>
          }
          intro="Choosing a style, adapting it to your story, the examples on this page, and keeping characters consistent."
        />

        <div className="border-t border-ink/20">
          {styleFaqs.map((faq) => (
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
