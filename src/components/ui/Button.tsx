import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'

const variants = {
  primary: 'bg-brand-red text-white hover:bg-brand-red-dark',
  dark: 'bg-ink text-white hover:bg-black',
  quiet: 'text-current underline decoration-2 underline-offset-[6px] hover:decoration-brand-red',
}

const sizes = {
  md: 'px-6 py-3.5 text-base',
  sm: 'px-4 py-2 text-sm',
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}

const buttonClasses = (variant: keyof typeof variants, size: keyof typeof sizes, className: string) => {
  const box = variant === 'quiet' ? 'py-3.5' : `rounded-md ${sizes[size]}`
  return `inline-flex items-center justify-center gap-2 font-medium ${box} ${variants[variant]} ${className}`
}

export function ButtonLink({ variant = 'primary', size = 'md', className = '', ...props }: ButtonLinkProps) {
  return <a className={buttonClasses(variant, size, className)} {...props} />
}

/** Same styles as ButtonLink, for actions that stay on the page. */
export function Button({ variant = 'primary', size = 'md', className = '', type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, size, className)} {...props} />
}
