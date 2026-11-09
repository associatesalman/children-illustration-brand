import { Mail, MapPin } from 'lucide-react'
import { brand, officeAddress, primaryNav, serviceLinks, supportEmail, type NavLink } from '../../content/site'
import { Container } from '../ui/Container'
import { Logo } from '../ui/Logo'

const year = new Date().getFullYear()

/** Page links only: Services opens a menu in the header, and its pages have their own column here. */
const exploreLinks = primaryNav.filter((item) => !item.children)

const linkClass = 'underline-offset-4 hover:underline'

export function SiteFooter() {
  return (
    <footer className="bg-sun text-ink">
      <Container className="grid gap-x-10 gap-y-12 py-16 sm:grid-cols-2 lg:grid-cols-3 lg:py-20 xl:grid-cols-[1.3fr_0.8fr_1.1fr_1.3fr]">
        <div className="max-w-sm sm:col-span-2 lg:col-span-3 xl:col-span-1">
          <a href="/" aria-label={`${brand.name}, home`} className="inline-block">
            <Logo alt="" className="h-16 sm:h-[4.5rem]" />
          </a>
          <p className="mt-6 leading-relaxed">{brand.description}</p>
        </div>

        <FooterLinks title="Explore" links={exploreLinks} />
        <FooterLinks title="Services" links={serviceLinks} />

        <div>
          <FooterHeading id="footer-contact">Contact</FooterHeading>
          <address aria-labelledby="footer-contact" className="mt-5 not-italic">
            <p className="text-sm font-semibold">Email support</p>
            <a href={`mailto:${supportEmail}`} className={`mt-1 inline-flex items-start gap-2 text-[0.95rem] font-medium [overflow-wrap:anywhere] ${linkClass}`}>
              <Mail aria-hidden size={18} className="mt-1 shrink-0" />
              {supportEmail}
            </a>
            <p className="mt-5 text-sm font-semibold">Office</p>
            <a
              href={officeAddress.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${officeAddress.text} (opens Google Maps in a new tab)`}
              className={`mt-1 inline-flex items-start gap-2 text-[0.95rem] font-medium ${linkClass}`}
            >
              <MapPin aria-hidden size={18} className="mt-1 shrink-0" />
              <span>
                {officeAddress.lines[0]}
                <br />
                {officeAddress.lines[1]}
              </span>
            </a>
          </address>
          <p className="mt-6 leading-relaxed">
            Planning a book? Tell us about it on our{' '}
            <a href="/contact" className="font-medium underline underline-offset-4">
              contact page
            </a>{' '}
            or{' '}
            <a href="/free-sample" className="font-medium underline underline-offset-4">
              request a free sample
            </a>
            .
          </p>
        </div>
      </Container>

      <Container>
        <p className="border-t border-ink/20 py-6 text-sm">
          &copy; {year} {brand.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  )
}

function FooterHeading({ id, children }: { id: string; children: string }) {
  return (
    <h2 id={id} className="text-sm font-bold tracking-[0.08em] uppercase">
      {children}
    </h2>
  )
}

function FooterLinks({ title, links }: { title: string; links: NavLink[] }) {
  const id = `footer-${title.toLowerCase()}`
  return (
    <nav aria-labelledby={id}>
      <FooterHeading id={id}>{title}</FooterHeading>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href} className={linkClass}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
