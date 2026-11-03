import { workingSteps } from '../../content/about'
import { artwork } from '../../content/artwork'
import { ButtonLink } from '../ui/Button'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/Section'

export function WorkTogether() {
  const wide = artwork.journeyWide
  const stacked = artwork.journeyStacked

  return (
    <section id="working-together" tabIndex={-1} aria-labelledby="together-title" className="bg-sun py-20 sm:py-24 lg:py-32">
      <Container>
        <SectionHeading
          id="together-title"
          eyebrow="How we work together"
          eyebrowClassName="text-ink"
          title="From your manuscript to a book ready for print"
          intro="Every project follows a structured process, but it starts with a conversation about your story. Here is how we work with you along the way."
        />
      </Container>

      {/* Broad illustration: one page moving from manuscript to finished art. Stacked on small screens. */}
      <figure className="mx-auto mt-12 max-w-[110rem] lg:mt-16">
        <picture>
          <source media="(min-width: 768px)" srcSet={wide.src} width={wide.width} height={wide.height} />
          <img
            src={stacked.src}
            alt={wide.alt}
            width={stacked.width}
            height={stacked.height}
            loading="lazy"
            decoding="async"
            className="mx-auto block h-auto w-full max-w-xl md:max-w-none"
          />
        </picture>
        <Container>
          <figcaption className="mt-3 text-sm">
            One studio sample page: manuscript, pencil sketch, flat color, and finished art.
          </figcaption>
        </Container>
      </figure>

      <Container>
        <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-5">
          {workingSteps.map((step, index) => (
            <li key={step.title} className="border-t-2 border-ink pt-5">
              <p aria-hidden className="text-display text-2xl text-brand-red-dark">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-2 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 leading-relaxed">{step.body}</p>
            </li>
          ))}
        </ol>

        <ButtonLink href="/#process" variant="quiet" className="mt-10">
          See the six steps of book creation
        </ButtonLink>
      </Container>
    </section>
  )
}
