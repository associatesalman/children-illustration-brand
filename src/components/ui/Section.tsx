import type { ReactNode } from 'react'
import { Container } from './Container'

const tones = {
  white: 'bg-white text-ink',
  paper: 'bg-paper text-ink',
  sun: 'bg-sun text-ink',
  ink: 'on-dark bg-ink text-white',
}

type SectionProps = {
  id?: string
  tone?: keyof typeof tones
  labelledBy?: string
  children: ReactNode
  className?: string
  wide?: boolean
}

export function Section({ id, tone = 'white', labelledBy, children, className = '', wide }: SectionProps) {
  return (
    <section
      id={id}
      tabIndex={id ? -1 : undefined}
      aria-labelledby={labelledBy}
      className={`${tones[tone]} py-20 sm:py-24 lg:py-32 ${className}`}
    >
      <Container wide={wide}>{children}</Container>
    </section>
  )
}

type SectionHeadingProps = {
  id: string
  eyebrow?: string
  title: ReactNode
  intro?: ReactNode
  eyebrowClassName?: string
  className?: string
}

export function SectionHeading({ id, eyebrow, title, intro, className = '', eyebrowClassName }: SectionHeadingProps) {
  return (
    <div className={`max-w-2xl ${className}`}>
      {eyebrow && <Eyebrow className={eyebrowClassName}>{eyebrow}</Eyebrow>}
      <h2 id={id} className="text-display text-[clamp(2.1rem,1.5rem+2.4vw,3.6rem)] leading-[1.06]">
        {title}
      </h2>
      {intro && <p className="mt-5 max-w-xl text-lg leading-relaxed opacity-80">{intro}</p>}
    </div>
  )
}

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`mb-4 text-sm font-bold tracking-[0.08em] uppercase ${className || 'text-brand-red'}`}>{children}</p>
  )
}

/** Red, italic emphasis for a word or two inside a display heading. */
export function Accent({ children, className = 'text-brand-red' }: { children: ReactNode; className?: string }) {
  return <em className={`italic ${className}`}>{children}</em>
}
