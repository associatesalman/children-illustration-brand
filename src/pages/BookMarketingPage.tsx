import { MarketingHero } from '../components/marketing/MarketingHero'
import { MarketingIntroSection, WhyChooseSection } from '../components/marketing/MarketingIntro'
import {
  AmazonDetailSection,
  AuthorServicesSection,
  IncludedSection,
  PlatformsSection,
} from '../components/marketing/MarketingReferences'
import {
  AdvertisingServiceSection,
  AmazonServiceSection,
  BrandingServiceSection,
  ContentServiceSection,
  LaunchServiceSection,
  PromotionServiceSection,
  ServicesOverviewSection,
  SocialServiceSection,
  WebsiteServiceSection,
} from '../components/marketing/MarketingServices'
import { usePageMeta } from '../lib/pageMeta'

export function BookMarketingPage() {
  usePageMeta(
    'Book Marketing',
    'Book marketing for children’s authors: Amazon listings and ads, launch campaigns, author branding, social media, promotion, content and author websites.',
  )

  return (
    <>
      {/* 1. Hero with the four pillars */}
      <MarketingHero />
      {/* 2. Supplied introduction and benefits */}
      <MarketingIntroSection />
      <WhyChooseSection />
      {/* 3. The eight services */}
      <ServicesOverviewSection />
      <AmazonServiceSection />
      <LaunchServiceSection />
      <BrandingServiceSection />
      <SocialServiceSection />
      <PromotionServiceSection />
      <AdvertisingServiceSection />
      <ContentServiceSection />
      <WebsiteServiceSection />
      {/* 4. Detailed Amazon Book Marketing */}
      <AmazonDetailSection />
      {/* 5. Sections from the document's final references, in order (the duplicate Website one is removed) */}
      <IncludedSection />
      <PlatformsSection />
      <AuthorServicesSection />
    </>
  )
}
