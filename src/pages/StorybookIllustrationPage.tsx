import { StorybookCta } from '../components/storybook/StorybookCta'
import { StorybookFaq } from '../components/storybook/StorybookFaq'
import { StorybookHero } from '../components/storybook/StorybookHero'
import {
  BackgroundSection,
  FullPageSection,
  SceneSection,
  SpreadSection,
  StorybookProcess,
} from '../components/storybook/StorybookSections'
import { usePageMeta } from '../lib/pageMeta'

export function StorybookIllustrationPage() {
  usePageMeta(
    'Storybook Illustration',
    "Storybook illustration for children's picture books: full-page illustrations, double-page spreads, scene illustrations and background design, planned around your manuscript.",
  )

  return (
    <>
      <StorybookHero />
      <FullPageSection />
      <SpreadSection />
      <SceneSection />
      <BackgroundSection />
      <StorybookProcess />
      <StorybookFaq />
      <StorybookCta />
    </>
  )
}
