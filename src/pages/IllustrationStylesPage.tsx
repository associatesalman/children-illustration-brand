import { StyleChooser } from '../components/styles/StyleChooser'
import {
  CartoonSection,
  DigitalPaintingSection,
  MinimalSection,
  ThreeDSection,
  WatercolorSection,
} from '../components/styles/StyleSections'
import { StylesCta } from '../components/styles/StylesCta'
import { StylesFaq } from '../components/styles/StylesFaq'
import { StylesHero } from '../components/styles/StylesHero'
import { usePageMeta } from '../lib/pageMeta'

export function IllustrationStylesPage() {
  usePageMeta(
    'Illustration Styles',
    "Children's book illustration in five styles: Cartoon Style, Watercolor Style, Digital Painting, 3D Style and Minimal Style. Example artwork, process videos, what each style does best and how we illustrate your book.",
  )

  return (
    <>
      <StylesHero />
      <CartoonSection />
      <WatercolorSection />
      <DigitalPaintingSection />
      <ThreeDSection />
      <MinimalSection />
      <StyleChooser />
      <StylesFaq />
      <StylesCta />
    </>
  )
}
