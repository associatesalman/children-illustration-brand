import { artwork } from '../../content/artwork'
import { marketingSupport } from '../../content/home'
import { ArtImage } from '../ui/ArtImage'
import { Checklist } from '../ui/Checklist'
import { Accent, Section, SectionHeading } from '../ui/Section'

export function Marketing() {
  return (
    <Section id="marketing" tone="sun" labelledBy="marketing-title">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,7fr)] lg:gap-20">
        <div>
          <SectionHeading
            id="marketing-title"
            eyebrow="Marketing and author branding"
            eyebrowClassName="text-ink"
            title={
              <>
                Publishing is chapter one. <Accent>Getting found</Accent> is next.
              </>
            }
            intro="Good books often go unnoticed because readers never see them. We help parents, teachers, and young readers discover your book on Amazon and beyond, and help you build an author brand that lasts past one title."
          />
          <Checklist items={marketingSupport} className="mt-10 grid gap-x-8 sm:grid-cols-2 sm:space-y-0 sm:gap-y-3" />
        </div>

        <ArtImage artwork={artwork.marketing} />
      </div>
    </Section>
  )
}
