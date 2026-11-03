import { exploreServices } from '../../content/home'
import { Accent, Section, SectionHeading } from '../ui/Section'

export function ExploreServices() {
  return (
    <Section id="services" tone="paper" labelledBy="services-title">
      <SectionHeading
        id="services-title"
        eyebrow="What we do"
        title={
          <>
            Explore children&rsquo;s book <Accent>services</Accent>
          </>
        }
        intro="Start with the illustration your book needs now, or bring us the whole project."
      />

      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-5">
        {exploreServices.map((service) => (
          <li key={service.title} className="relative border-t-4 border-brand-red bg-white px-6 pt-14 pb-8 text-center">
            <span aria-hidden className="bookmark absolute top-0 left-6 h-9 w-6 bg-brand-red" />
            <h3 className="text-display text-[1.4rem] leading-tight text-brand-red">
              <a href={service.href} className="after:absolute after:inset-0 hover:underline">
                {service.title}
              </a>
            </h3>
            <p className="mt-4 leading-relaxed text-ink-soft">{service.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
