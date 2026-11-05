import { FreeSampleForm } from '../components/freeSample/FreeSampleForm'
import { Container } from '../components/ui/Container'
import { usePageMeta } from '../lib/pageMeta'

export function FreeSamplePage() {
  usePageMeta(
    'Free Sample',
    'Request a free sample or project review for illustration, character design, publishing, editing, marketing, translation or animation.',
  )

  return (
    <section aria-labelledby="free-sample-page-title" className="bg-sun pt-16 pb-20 text-ink sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-32">
      <Container>
        <div className="max-w-4xl">
          <p className="text-sm font-bold tracking-[0.08em] text-brand-red-dark uppercase">Free sample</p>
          <h1
            id="free-sample-page-title"
            className="text-display mt-4 text-[clamp(3rem,1.6rem+5.4vw,7rem)] leading-[0.95] tracking-[-0.03em] text-balance"
          >
            Let’s Bring Your Book <em className="text-brand-red-dark italic">to Life</em>
          </h1>
          <p className="mt-7 max-w-2xl text-xl leading-relaxed">
            Choose the services you’re interested in, tell us about your project, and share the details we need to review your request.
          </p>
        </div>
        <div className="mt-12 lg:mt-16">
          <FreeSampleForm />
        </div>
      </Container>
    </section>
  )
}
