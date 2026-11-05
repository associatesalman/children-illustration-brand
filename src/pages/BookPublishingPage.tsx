import { PublishingHero } from '../components/publishing/PublishingHero'
import { BookShowcaseSection, PlatformsSection, ProcessSection, PublishingIntroSection } from '../components/publishing/PublishingSections'
import { usePageMeta } from '../lib/pageMeta'

export function BookPublishingPage() {
  usePageMeta(
    'Book Publishing & Distribution',
    'Children’s book publishing and distribution: the stores where your book can be sold, a showcase of children’s books and the publishing process step by step.',
  )

  return (
    <>
      <PublishingHero />
      <PlatformsSection />
      <PublishingIntroSection />
      <BookShowcaseSection />
      <ProcessSection />
    </>
  )
}
