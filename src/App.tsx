import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { SiteLayout } from './components/layout/SiteLayout'
import { AboutPage } from './pages/AboutPage'
import { ActivityBookIllustrationPage } from './pages/ActivityBookIllustrationPage'
import { AnimationPage } from './pages/AnimationPage'
import { BookMarketingPage } from './pages/BookMarketingPage'
import { BookPublishingPage } from './pages/BookPublishingPage'
import { CharacterDesignPage } from './pages/CharacterDesignPage'
import { ChildrensBookTranslationPage } from './pages/ChildrensBookTranslationPage'
import { ContactPage } from './pages/ContactPage'
import { FreeSamplePage } from './pages/FreeSamplePage'
import { EditingProofreadingPage } from './pages/EditingProofreadingPage'
import { HomePage } from './pages/HomePage'
import { IllustrationStylesPage } from './pages/IllustrationStylesPage'
import { PortfolioPage } from './pages/PortfolioPage'
import { StorybookIllustrationPage } from './pages/StorybookIllustrationPage'

// The Coloring Studio loads on demand, so no other page downloads it.
const ColoringStudioPage = lazy(() => import('./pages/ColoringStudioPage'))

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          {/* Further pages are added in later phases. */}
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="services/illustration-styles" element={<IllustrationStylesPage />} />
          <Route path="services/character-design" element={<CharacterDesignPage />} />
          <Route path="services/activity-book-illustration" element={<ActivityBookIllustrationPage />} />
          <Route path="services/storybook-illustration" element={<StorybookIllustrationPage />} />
          <Route path="services/editing-proofreading" element={<EditingProofreadingPage />} />
          <Route path="services/book-publishing-distribution" element={<BookPublishingPage />} />
          <Route path="services/book-marketing" element={<BookMarketingPage />} />
          <Route path="services/childrens-book-translation" element={<ChildrensBookTranslationPage />} />
          <Route path="services/2d-3d-animation" element={<AnimationPage />} />
          <Route path="free-sample" element={<FreeSamplePage />} />
          <Route
            path="coloring-studio"
            element={
              <Suspense fallback={<p className="px-5 py-24 text-center text-ink-soft">Loading the Coloring Studio&hellip;</p>}>
                <ColoringStudioPage />
              </Suspense>
            }
          />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
