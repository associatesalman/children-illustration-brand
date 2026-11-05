import type { StyleImage } from '../../content/illustrationStyles'

type MockupHeroProps = {
  /** Page title for screen readers; nothing is drawn over the mockup. */
  title: string
  titleId: string
  image: StyleImage
  /** Measured edge color of the mockup, filling any space around the contained image. */
  background: string
  /** Which edge the image rests on when there is spare height. */
  position?: 'object-bottom' | 'object-center'
  /** contain (default) shows the whole image; cover fills the section edge to edge, cropping the overflow. */
  fit?: 'contain' | 'cover'
}

/**
 * A supplied mockup as the whole hero: no text, buttons or overlays. Full viewport width; on large landscape
 * screens it fills the height below the 4.5rem sticky header with object-fit: contain, so the complete image
 * always shows, and any band beside or above it takes the image's own edge color. On smaller or portrait
 * screens the section is exactly the image's height, with no blank space. With fit="cover" the image fills
 * the section edge to edge instead, centered, cropping whatever overflows rather than leaving any band.
 */
export function MockupHero({ title, titleId, image, background, position = 'object-center', fit = 'contain' }: MockupHeroProps) {
  return (
    <section aria-labelledby={titleId} className="w-full" style={{ backgroundColor: background }}>
      <h1 id={titleId} className="sr-only">
        {title}
      </h1>
      <img
        src={image.src}
        srcSet={image.srcSet}
        sizes="100vw"
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className={`block h-auto w-full ${fit === 'cover' ? 'object-cover object-center' : `object-contain ${position}`} [@media(min-width:1024px)_and_(min-aspect-ratio:16/10)]:h-[calc(100svh-4.5rem)]`}
      />
    </section>
  )
}
