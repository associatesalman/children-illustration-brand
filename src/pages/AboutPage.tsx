import { AboutCta } from '../components/about/AboutCta'
import { AboutHero } from '../components/about/AboutHero'
import { AuthorExpectations } from '../components/about/AuthorExpectations'
import { BeyondFirstBook } from '../components/about/BeyondFirstBook'
import { ChildrensBooks } from '../components/about/ChildrensBooks'
import { PurposeVision } from '../components/about/PurposeVision'
import { WhoWeAre } from '../components/about/WhoWeAre'
import { WhyWeExist } from '../components/about/WhyWeExist'
import { WorkTogether } from '../components/about/WorkTogether'
import { usePageMeta } from '../lib/pageMeta'

export function AboutPage() {
  usePageMeta(
    'About Us — Children Book',
    "Children Book is an illustration studio for children's authors in the US and UK, with editing, publishing, and marketing support from one coordinated team.",
  )

  return (
    <>
      <AboutHero />
      <WhoWeAre />
      <WhyWeExist />
      <PurposeVision />
      <ChildrensBooks />
      <WorkTogether />
      <AuthorExpectations />
      <BeyondFirstBook />
      <AboutCta />
    </>
  )
}
