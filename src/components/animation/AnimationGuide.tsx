import { ArrowRight, Plus } from 'lucide-react'
import { comparison, comparisonNote, faqs, processNote, processSteps } from '../../content/animation'
import { ButtonLink } from '../ui/Button'
import { Checklist } from '../ui/Checklist'
import { Section } from '../ui/Section'
import { AnimationHeading } from './AnimationParts'

/**
 * Yellow: 2D and 3D side by side. A real table from md up; on small screens each topic becomes a card with
 * the two answers stacked, so nothing scrolls sideways.
 */
export function ComparisonSection() {
  return (
    <Section id="2d-vs-3d" tone="sun" labelledBy="2d-vs-3d-title">
      <AnimationHeading id="2d-vs-3d-title" eyebrow="2D vs. 3D" eyebrowClassName="text-brand-red-dark" className="max-w-3xl">
        Two approaches, <em className="text-brand-red-dark italic">side by side</em>
      </AnimationHeading>

      <div className="mt-12 hidden overflow-hidden rounded-lg bg-white md:block lg:mt-14">
        <table className="w-full table-fixed border-collapse text-left">
          <caption className="sr-only">Comparison of 2D and 3D animation</caption>
          <colgroup>
            <col className="w-[24%]" />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr className="bg-ink text-white">
              <th scope="col" className="px-6 py-5 text-sm font-bold tracking-[0.08em] uppercase lg:px-8">
                Topic
              </th>
              <th scope="col" className="text-display px-6 py-5 text-2xl font-normal lg:px-8">
                2D animation
              </th>
              <th scope="col" className="text-display px-6 py-5 text-2xl font-normal lg:px-8">
                3D animation
              </th>
            </tr>
          </thead>
          <tbody>
            {comparison.map((row) => (
              <tr key={row.topic} className="border-t border-ink/15 align-top first:border-t-0">
                <th scope="row" className="px-6 py-6 text-lg font-bold lg:px-8">
                  {row.topic}
                </th>
                <td className="px-6 py-6 leading-relaxed lg:px-8">{row.twoD}</td>
                <td className="px-6 py-6 leading-relaxed lg:px-8">{row.threeD}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="mt-10 grid gap-5 md:hidden">
        {comparison.map((row) => (
          <li key={row.topic} className="rounded-lg bg-white p-6">
            <h3 className="text-xl font-bold">{row.topic}</h3>
            <dl className="mt-4 grid gap-4">
              <div>
                <dt className="text-sm font-bold tracking-[0.08em] text-brand-red-dark uppercase">2D</dt>
                <dd className="mt-1 leading-relaxed">{row.twoD}</dd>
              </div>
              <div className="border-t border-ink/15 pt-4">
                <dt className="text-sm font-bold tracking-[0.08em] text-brand-red-dark uppercase">3D</dt>
                <dd className="mt-1 leading-relaxed">{row.threeD}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      <p className="mt-10 max-w-3xl text-lg leading-relaxed">{comparisonNote}</p>
    </Section>
  )
}

/** White: the seven production steps with static numbers on a connecting rule. */
export function ProcessSection() {
  return (
    <Section id="animation-process" labelledBy="animation-process-title">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
        <AnimationHeading id="animation-process-title" eyebrow="Production process" className="lg:col-span-6">
          How an animation <em className="text-brand-red italic">comes together</em>
        </AnimationHeading>
        <p className="text-lg leading-relaxed lg:col-span-6 lg:pt-10">{processNote}</p>
      </div>
      <ol className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
        {processSteps.map((step, index) => (
          <li key={step.title} className="relative border-t-2 border-ink pt-8">
            <span className="text-display absolute -top-6 left-0 flex size-12 items-center justify-center rounded-full bg-brand-red text-lg text-white">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="mt-4 text-xl font-bold">{step.title}</h3>
            <p className="mt-2 leading-relaxed text-ink-soft">{step.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}

/** Yellow: questions authors ask before an animation project. */
export function AnimationFaqSection() {
  return (
    <Section id="animation-faq" tone="sun" labelledBy="animation-faq-title">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-20">
        <div>
          <AnimationHeading id="animation-faq-title" eyebrow="Questions" eyebrowClassName="text-brand-red-dark">
            Planning your <em className="text-brand-red-dark italic">animation</em>
          </AnimationHeading>
          <p className="mt-6 max-w-md text-lg leading-relaxed">What authors usually ask before an animation project starts.</p>
        </div>
        <div className="border-t border-ink/30">
          {faqs.map((faq) => (
            <details key={faq.title} className="group border-b border-ink/30">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-lg font-bold hover:text-brand-red-dark sm:text-xl [&::-webkit-details-marker]:hidden">
                {faq.title}
                <Plus aria-hidden size={22} className="mt-1 shrink-0 group-open:rotate-45" />
              </summary>
              <p className="-mt-1 max-w-2xl pb-7 text-lg leading-relaxed">{faq.body}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  )
}

const helpful = [
  'Your manuscript, script or story summary',
  'Existing illustrations or character designs, layered if possible',
  'Whether you are leaning toward 2D, 3D or are still deciding',
  'Where the animation will be shown, and any target length',
]

/** White: closing call to action, linking to the existing Contact page. */
export function AnimationCta() {
  return (
    <Section id="start-animation" labelledBy="animation-cta-title" className="border-t border-ink/10">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-7">
          <AnimationHeading id="animation-cta-title" eyebrow="Start your animation">
            Let’s set your characters <em className="text-brand-red italic">in motion</em>
          </AnimationHeading>
          <p className="mt-6 max-w-xl text-lg leading-relaxed">
            Tell us about your book and what you would like the animation to do. We will talk through 2D and 3D options, the
            scope that fits your goals, and the next steps.
          </p>
          <ButtonLink href="/contact" className="mt-9">
            Discuss your animation <ArrowRight aria-hidden size={18} />
          </ButtonLink>
        </div>
        <div className="rounded-lg bg-sun p-8 sm:p-10 lg:col-span-5">
          <h3 className="text-display text-2xl">Helpful to share</h3>
          <Checklist items={helpful} className="mt-6 text-lg" marker="bg-ink" />
        </div>
      </div>
    </Section>
  )
}
