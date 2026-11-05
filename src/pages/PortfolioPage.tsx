import { BookShowcase } from '../components/books/BookShowcase'
import { ActivityBooks } from '../components/portfolio/ActivityBooks'
import { CharacterWork } from '../components/portfolio/CharacterWork'
import { IllustrationStyles } from '../components/portfolio/IllustrationStyles'
import { PortfolioCta } from '../components/portfolio/PortfolioCta'
import { PortfolioHero } from '../components/portfolio/PortfolioHero'
import { SpreadPlanning } from '../components/portfolio/SpreadPlanning'
import { StorybookWork } from '../components/portfolio/StorybookWork'
import { Accent } from '../components/ui/Section'
import { usePageMeta } from '../lib/pageMeta'

export function PortfolioPage() {
  usePageMeta(
    'Portfolio',
    "Sample children's book illustration from klutzbookpublisher: storybook spreads and board-book mockups, page planning sketches, character sheets, illustration styles, activity book pages, and children's book covers by category.",
  )

  return (
    <>
      <PortfolioHero />
      <StorybookWork />
      <SpreadPlanning />
      <CharacterWork />
      <IllustrationStyles />
      <ActivityBooks />
      <BookShowcase
        id="book-covers"
        collection="portfolio"
        eyebrow="Book covers"
        title={
          <>
            Children&rsquo;s books, <Accent>shelf by shelf</Accent>
          </>
        }
        intro="Thirty covers grouped by subject, audience and format, from classic tales and animal stories to phonics workbooks and bilingual picture dictionaries."
      />
      <PortfolioCta />
    </>
  )
}
