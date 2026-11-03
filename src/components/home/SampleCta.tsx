import { artwork } from '../../content/artwork'
import { sampleChecklist } from '../../content/home'
import { ArtImage } from '../ui/ArtImage'
import { ButtonLink } from '../ui/Button'
import { Checklist } from '../ui/Checklist'
import { Accent, Section, SectionHeading } from '../ui/Section'

export function SampleCta() {
  return (
    <Section id="free-sample" tone="sun" labelledBy="free-sample-title">
      <div id="contact" tabIndex={-1} className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            id="free-sample-title"
            eyebrow="Free sample"
            eyebrowClassName="text-ink"
            title={
              <>
                See your story <Accent>before you commit</Accent>
              </>
            }
            intro="Tell us about your book and request a free sample. It is an easy way to see how we would approach your story before you decide on the full project."
          />

          <h3 className="mt-10 text-sm font-bold tracking-[0.08em] uppercase">Helpful to have ready</h3>
          <Checklist items={sampleChecklist} className="mt-4 text-lg" />

          <ButtonLink href="/contact" className="mt-10">
            Request a free sample
          </ButtonLink>
        </div>

        <ArtImage artwork={artwork.sampleSketch} className="mx-auto max-w-xl" />
      </div>
    </Section>
  )
}
