import { Check } from 'lucide-react'
import type { ReactNode } from 'react'
import type { StyleImage } from '../../content/illustrationStyles'

/** A lazily loaded responsive image with its frame reserved by width and height. */
export function MediaImage({ image, sizes, className = '' }: { image: StyleImage; sizes: string; className?: string }) {
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

/** Number, eyebrow and heading shared by the eight service sections. */
export function ServiceHeading({ id, number, children }: { id: string; number: number; children: ReactNode }) {
  return (
    <>
      <p className="mb-4 flex items-center gap-3 text-sm font-bold tracking-[0.08em] uppercase">
        <span className="text-display text-base text-brand-red">{String(number).padStart(2, '0')}</span>
        <span aria-hidden className="h-px w-8 bg-ink/40" />
        <span>Service {number} of 8</span>
      </p>
      <h2 id={id} className="text-display text-[clamp(2.2rem,1.5rem+2.4vw,3.75rem)] leading-[1.04] tracking-[-0.02em] text-balance">
        {children}
      </h2>
    </>
  )
}

export function Paragraphs({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <>
      {items.map((text) => (
        <p key={text.slice(0, 32)} className={`mt-5 max-w-2xl text-lg leading-relaxed ${className}`}>
          {text}
        </p>
      ))}
    </>
  )
}

/** Check-marked list of what a service includes. `onSun` uses a white badge for yellow sections. */
export function PointList({ items, onSun = false, className = '' }: { items: string[]; onSun?: boolean; className?: string }) {
  return (
    <ul className={`grid gap-3 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full ${onSun ? 'bg-white' : 'bg-sun'} text-ink`}>
            <Check aria-hidden size={14} strokeWidth={3} />
          </span>
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  )
}

/** Small uppercase label above a list. */
export function ListLabel({ children }: { children: ReactNode }) {
  return <h3 className="mt-9 mb-4 text-sm font-bold tracking-[0.08em] uppercase">{children}</h3>
}

/** The page's call-to-action link: brand red, no hover change (this page has no hover effects). */
export const ctaClass =
  'mt-8 inline-flex items-center justify-center gap-2 rounded-md bg-brand-red px-6 py-3.5 text-base font-medium text-white'
