import { AnimationCta, AnimationFaqSection, ComparisonSection, ProcessSection } from '../components/animation/AnimationGuide'
import { AnimationHero } from '../components/animation/AnimationHero'
import {
  AnimationIntroSection,
  CharacterSection,
  EducationSection,
  SoundDeliverySection,
  StoryAnimationSection,
  StoryboardSection,
  ThreeDSection,
  TrailerSection,
  TwoDSection,
} from '../components/animation/AnimationServices'
import { usePageMeta } from '../lib/pageMeta'

export function AnimationPage() {
  usePageMeta(
    '2D & 3D Animation',
    '2D and 3D animation for children’s authors: character animation, story scenes, animated book trailers, educational animation, storyboarding, sound and delivery.',
  )

  return (
    <>
      <AnimationHero />
      <AnimationIntroSection />
      {/* Services */}
      <TwoDSection />
      <ThreeDSection />
      <CharacterSection />
      <StoryAnimationSection />
      <TrailerSection />
      <EducationSection />
      <StoryboardSection />
      <SoundDeliverySection />
      {/* Guidance */}
      <ComparisonSection />
      <ProcessSection />
      <AnimationFaqSection />
      <AnimationCta />
    </>
  )
}
