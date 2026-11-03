import { BrowserRouter, Route, Routes } from 'react-router'
import { SiteLayout } from './components/layout/SiteLayout'
import { AboutPage } from './pages/AboutPage'
import { ActivityBookIllustrationPage } from './pages/ActivityBookIllustrationPage'
import { CharacterDesignPage } from './pages/CharacterDesignPage'
import { ContactPage } from './pages/ContactPage'
import { HomePage } from './pages/HomePage'
import { IllustrationStylesPage } from './pages/IllustrationStylesPage'
import { PortfolioPage } from './pages/PortfolioPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          {/* Further service pages and the free sample page are added in later phases. */}
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="services/illustration-styles" element={<IllustrationStylesPage />} />
          <Route path="services/character-design" element={<CharacterDesignPage />} />
          <Route path="services/activity-book-illustration" element={<ActivityBookIllustrationPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
