import { ActivityCta } from '../components/activity/ActivityCta'
import { ActivityFaq } from '../components/activity/ActivityFaq'
import { ActivityHero } from '../components/activity/ActivityHero'
import {
  ColoringSection,
  EducationalSection,
  ProcessSection,
  PuzzleSection,
} from '../components/activity/ActivitySections'
import { usePageMeta } from '../lib/pageMeta'

export function ActivityBookIllustrationPage() {
  usePageMeta(
    'Activity Book Illustration — Children Book',
    "Activity book illustration for children's books: coloring pages, illustrated puzzles such as mazes, matching and spot the difference, and educational alphabet, counting and skill-building worksheets.",
  )

  return (
    <>
      <ActivityHero />
      <ColoringSection />
      <PuzzleSection />
      <EducationalSection />
      <ProcessSection />
      <ActivityFaq />
      <ActivityCta />
    </>
  )
}
