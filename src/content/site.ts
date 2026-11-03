export const brand = {
  name: 'Children Book',
  description:
    "Children's book illustration for authors in the US and UK, with publishing and marketing support from one team.",
}

export type NavLink = {
  label: string
  href: string
}

export type NavItem = NavLink & {
  children?: NavLink[]
}

// Service pages are real routes; services without a page yet link to the existing section that
// covers them ("/#section" or "/portfolio#section"), so every entry works from any page.
// Swap each for its route once the page exists.
export const serviceLinks: NavLink[] = [
  { label: 'Illustration Styles', href: '/services/illustration-styles' },
  { label: 'Character Design', href: '/services/character-design' },
  { label: 'Activity Book Illustration', href: '/services/activity-book-illustration' },
  { label: 'Storybook Illustration', href: '/portfolio#page-planning' },
  { label: 'Publishing', href: '/#publishing' },
  { label: 'Marketing', href: '/#marketing' },
]

/** The header's Services dropdown: dedicated, finished service pages only. */
export const servicesMenu: NavLink[] = [
  { label: 'Illustration Styles', href: '/services/illustration-styles' },
  { label: 'Character Design', href: '/services/character-design' },
  { label: 'Activity Book Illustration', href: '/services/activity-book-illustration' },
]

export const primaryNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/#services', children: servicesMenu },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Free Sample', href: '/#free-sample' },
  { label: 'Contact', href: '/contact' },
]

/** Nav entry rendered as the header call to action instead of a plain link. */
export const ctaHref = '/#free-sample'

/** True when a nav href is the page currently shown (section links never are). */
export const isCurrentPage = (href: string, pathname: string) => !href.includes('#') && href === pathname
