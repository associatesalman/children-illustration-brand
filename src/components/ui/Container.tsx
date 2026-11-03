import type { ReactNode } from 'react'

type ContainerProps = {
  children: ReactNode
  className?: string
  /** Wider measure with slimmer desktop gutters, for large card galleries. */
  wide?: boolean
}

/** Shared page gutters. Wide enough for broad galleries; text widths are limited per section. */
export function Container({ children, className = '', wide = false }: ContainerProps) {
  const measure = wide ? 'max-w-[112rem] lg:px-8' : 'max-w-[90rem] lg:px-12'
  return <div className={`mx-auto w-full px-5 sm:px-8 ${measure} ${className}`}>{children}</div>
}
