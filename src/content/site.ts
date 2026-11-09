export const brand = {
  name: 'Klutzbookpublishers',
  description:
    "Children's book illustration for authors in the US and UK, with publishing and marketing support from one team.",
}

/** Public support address shown on the site. Form submissions go to the private inbox set on the server, not here. */
export const supportEmail = 'support@klutzbookpublishers.com'

/** Office address shown in the footer and on the Contact page; the link opens Google Maps in a new tab. */
const addressText = '447 Broadway, 2nd Floor, New York, NY 10013'
export const officeAddress = {
  lines: ['447 Broadway, 2nd Floor', 'New York, NY 10013'],
  text: addressText,
  mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressText)}`,
}

export type NavLink = {
  label: string
  href: string
}

export type NavItem = NavLink & {
  children?: NavLink[]
}

// Every service has its own page.
export const serviceLinks: NavLink[] = [
  { label: 'Illustration Styles', href: '/services/illustration-styles' },
  { label: 'Character Design', href: '/services/character-design' },
  { label: 'Activity Book Illustration', href: '/services/activity-book-illustration' },
  { label: 'Storybook Illustration', href: '/services/storybook-illustration' },
  { label: 'Editing & Proofreading', href: '/services/editing-proofreading' },
  { label: 'Book Publishing & Distribution', href: '/services/book-publishing-distribution' },
  { label: 'Book Marketing', href: '/services/book-marketing' },
  { label: 'Children’s Book Translation', href: '/services/childrens-book-translation' },
  { label: '2D & 3D Animation', href: '/services/2d-3d-animation' },
]

/** The header's Services dropdown: dedicated, finished service pages only. */
export const servicesMenu: NavLink[] = [
  { label: 'Illustration Styles', href: '/services/illustration-styles' },
  { label: 'Character Design', href: '/services/character-design' },
  { label: 'Activity Book Illustration', href: '/services/activity-book-illustration' },
  { label: 'Storybook Illustration', href: '/services/storybook-illustration' },
  { label: 'Editing & Proofreading', href: '/services/editing-proofreading' },
  { label: 'Book Publishing & Distribution', href: '/services/book-publishing-distribution' },
  { label: 'Book Marketing', href: '/services/book-marketing' },
  { label: 'Children’s Book Translation', href: '/services/childrens-book-translation' },
  { label: '2D & 3D Animation', href: '/services/2d-3d-animation' },
]

export const primaryNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  // Services opens a menu (desktop) or lists its pages (mobile); the href is the Home services section, used only
  // as a fallback and never rendered as a link in the header or footer.
  { label: 'Services', href: '/#services', children: servicesMenu },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Coloring Studio', href: '/coloring-studio' },
  { label: 'Free Sample', href: '/free-sample' },
  { label: 'Contact', href: '/contact' },
]

/** Nav entry rendered as the header call to action instead of a plain link. */
export const ctaHref = '/free-sample'

/** True when a nav href is the page currently shown (section links never are). */
export const isCurrentPage = (href: string, pathname: string) => !href.includes('#') && href === pathname
