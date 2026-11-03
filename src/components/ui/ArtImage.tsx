import type { Artwork } from '../../content/artwork'

type ArtImageProps = {
  artwork: Artwork
  /** Load eagerly for artwork that is visible on first paint. */
  priority?: boolean
  className?: string
}

export function ArtImage({ artwork, priority = false, className = '' }: ArtImageProps) {
  return (
    <img
      src={artwork.src}
      alt={artwork.alt}
      width={artwork.width}
      height={artwork.height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      className={`block h-auto w-full ${className}`}
    />
  )
}
