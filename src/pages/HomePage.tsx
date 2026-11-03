import { BookShowcase } from '../components/books/BookShowcase'
import { BookTypes } from '../components/home/BookTypes'
import { CharacterDesign } from '../components/home/CharacterDesign'
import { ExploreServices } from '../components/home/ExploreServices'
import { Faq } from '../components/home/Faq'
import { Features } from '../components/home/Features'
import { Hero } from '../components/home/Hero'
import { Marketing } from '../components/home/Marketing'
import { MediaMarquee } from '../components/home/MediaMarquee'
import { Process } from '../components/home/Process'
import { Publishing } from '../components/home/Publishing'
import { SampleCta } from '../components/home/SampleCta'
import { StylesGallery } from '../components/home/StylesGallery'
import { WhyUs } from '../components/home/WhyUs'
import { Accent } from '../components/ui/Section'
import { brand } from '../content/site'
import { usePageMeta } from '../lib/pageMeta'

export function HomePage() {
  usePageMeta(
    "Children Book — Children's Book Illustration, Publishing & Marketing",
    `${brand.name} illustrates children's books for authors in the US and UK, with publishing and marketing support from one team.`,
  )

  return (
    <>
      <Hero />
      <MediaMarquee />
      <BookShowcase
        id="portfolio"
        collection="home"
        variant="white"
        eyebrow="Book showcase"
        title={
          <>
            Covers that make readers <Accent>pick them up</Accent>
          </>
        }
        intro="A collection of children’s book covers grouped by subject, audience and format. More covers, with sample illustrations and character work, are on our portfolio page."
      />
      <ExploreServices />
      <StylesGallery />
      <CharacterDesign />
      <BookTypes />
      <Process />
      <Features />
      <Publishing />
      <Marketing />
      <WhyUs />
      <Faq />
      <SampleCta />
    </>
  )
}
