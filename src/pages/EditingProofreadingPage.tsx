import { CorrectionsSection } from '../components/editing/CorrectionExamples'
import { EditingCta, EditingIntroSection, EditingServicesSection, HumanEditorSection } from '../components/editing/EditingSections'
import { BookTypesSection, FormattingSection, PrintReadySection } from '../components/editing/FormattingSections'
import { MockupHero } from '../components/ui/MockupHero'
import { heroBackground, heroImage } from '../content/editing'
import { usePageMeta } from '../lib/pageMeta'

export function EditingProofreadingPage() {
  usePageMeta(
    'Editing & Proofreading',
    'Children’s book editing and proofreading, with formatting and layout design: before-and-after editing examples, page layout, trim and bleed checks, and print and ebook files.',
  )

  return (
    <>
      <MockupHero title="Editing & Proofreading, and Formatting & Layout Design" titleId="editing-hero-title" image={heroImage} background={heroBackground} fit="cover" />
      <EditingIntroSection />
      <HumanEditorSection />
      <EditingServicesSection />
      <CorrectionsSection />
      <FormattingSection />
      <PrintReadySection />
      <BookTypesSection />
      <EditingCta />
    </>
  )
}
