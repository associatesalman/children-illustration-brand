import { heroBackground, heroImage } from '../../content/publishing'
import { MockupHero } from '../ui/MockupHero'

/** The supplied library mockup as the whole hero. It rests on the bottom edge so any band falls on its near-black top. */
export function PublishingHero() {
  return (
    <MockupHero
      title="Book Publishing & Distribution"
      titleId="publishing-hero-title"
      image={heroImage}
      background={heroBackground}
      position="object-bottom"
    />
  )
}
