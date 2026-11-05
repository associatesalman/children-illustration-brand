import logo480 from '../../assets/brand/klutz-logo-480.webp'
import logo960 from '../../assets/brand/klutz-logo-960.webp'
import { brand } from '../../content/site'

type LogoProps = {
  /** Sets the rendered height; the width follows the logo's 2295:990 ratio. */
  className?: string
  /** Empty when the surrounding link already names the brand. */
  alt?: string
}

/**
 * The supplied logo, trimmed to its visible pixels by scripts/build_brand_assets.py so the height given here
 * is the height of the artwork itself, not of transparent margin. Never stretched: only the height is set.
 */
export function Logo({ className = 'h-11', alt = brand.name }: LogoProps) {
  return (
    <img
      src={logo480}
      srcSet={`${logo480} 480w, ${logo960} 960w`}
      sizes="(min-width: 1024px) 140px, 120px"
      width={2295}
      height={990}
      alt={alt}
      decoding="async"
      className={`block w-auto max-w-none ${className}`}
    />
  )
}
