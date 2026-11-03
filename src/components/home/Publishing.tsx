import { artwork } from '../../content/artwork'
import { publishingFormats, publishingPlatforms, publishingSupport } from '../../content/home'
import { ArtImage } from '../ui/ArtImage'
import { Checklist } from '../ui/Checklist'
import { Accent, Section, SectionHeading } from '../ui/Section'

export function Publishing() {
  return (
    <Section id="publishing" labelledBy="publishing-title">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="bg-paper px-6 py-10 sm:px-12 sm:py-14">
          <ArtImage artwork={artwork.formats} />
        </div>

        <div>
          <SectionHeading
            id="publishing-title"
            eyebrow="Publishing and distribution"
            title={
              <>
                Ready for print, <Accent>ready for stores</Accent>
              </>
            }
            intro="A book listing needs the right files, categories, and description. We prepare each edition and explain every decision, so you know where your book is sold and how."
          />

          <p className="text-display mt-8 flex flex-wrap gap-x-3 text-2xl">
            {publishingFormats.map((format, index) => (
              <span key={format} className="flex gap-x-3">
                {index > 0 && (
                  <span aria-hidden className="text-brand-red">
                    ·
                  </span>
                )}
                {format}
              </span>
            ))}
          </p>

          <div className="mt-10 grid gap-10 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-bold tracking-[0.08em] uppercase">What we handle</h3>
              <Checklist items={publishingSupport} className="mt-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-[0.08em] uppercase">Prepared for platforms such as</h3>
              <Checklist items={publishingPlatforms} className="mt-4" marker="bg-sun" />
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
