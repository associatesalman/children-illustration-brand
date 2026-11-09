import { heroBackground, heroImage } from '../../content/publishing'
import { MockupHero } from '../ui/MockupHero'

/**
 * The supplied library mockup as the whole hero. It covers the section edge to edge with no bands; the doorway
 * and child sit at the center of the image, so only a thin strip of the top and bottom is trimmed on wide screens.
 */
export function PublishingHero() {
  return (
    <MockupHero
      title="Book Publishing & Distribution"
      titleId="publishing-hero-title"
      image={heroImage}
      background={heroBackground}
      fit="cover"
    />
  )
}
