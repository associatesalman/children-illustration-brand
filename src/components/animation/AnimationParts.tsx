import type { ReactNode } from 'react'
import type { AnimationImage } from '../../content/animation'
import type { StyleVideoAsset } from '../../content/illustrationStyles'
import { StyleVideo } from '../styles/StyleVideo'
import { Eyebrow } from '../ui/Section'

/** Eyebrow plus a large display heading, shared by every section on the page. */
export function AnimationHeading({
  id,
  eyebrow,
  children,
  eyebrowClassName,
  className = '',
}: {
  id: string
  eyebrow: string
  children: ReactNode
  eyebrowClassName?: string
  className?: string
}) {
  return (
    <div className={className}>
      <Eyebrow className={eyebrowClassName}>{eyebrow}</Eyebrow>
      <h2 id={id} className="text-display text-[clamp(2.4rem,1.4rem+3vw,4.75rem)] leading-[1] tracking-[-0.025em] text-balance">
        {children}
      </h2>
    </div>
  )
}

export function Paragraphs({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <div className={`grid content-start gap-5 ${className}`}>
      {items.map((text) => (
        <p key={text.slice(0, 32)} className="text-lg leading-relaxed">
          {text}
        </p>
      ))}
    </div>
  )
}

/** A silent showcase video with its caption underneath. */
export function VideoFigure({ video, className = '', videoClassName = '' }: { video: StyleVideoAsset; className?: string; videoClassName?: string }) {
  return (
    <figure className={className}>
      <StyleVideo video={video} className={`w-full ${videoClassName}`} />
      <figcaption className="mt-4 text-sm leading-relaxed text-ink-soft">{video.caption}</figcaption>
    </figure>
  )
}

/** A lazily loaded still that reserves its frame. */
export function AnimationPicture({ image, sizes, className = '' }: { image: AnimationImage; sizes: string; className?: string }) {
  return (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={sizes}
      alt={image.alt}
      width={image.width}
      height={image.height}
      loading="lazy"
      decoding="async"
      className={`block h-auto w-full ${className}`}
    />
  )
}
