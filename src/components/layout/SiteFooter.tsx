import { brand, primaryNav, serviceLinks, type NavLink } from '../../content/site'
import { Container } from '../ui/Container'
import { Wordmark } from '../ui/Wordmark'

const year = new Date().getFullYear()

export function SiteFooter() {
  return (
    <footer className="on-dark bg-ink text-white">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] lg:py-20">
        <div className="max-w-sm">
          <a href="#top" aria-label="Children Book, back to top">
            <Wordmark className="text-3xl" />
          </a>
          <p className="mt-5 leading-relaxed text-white/75">{brand.description}</p>
        </div>

        <FooterLinks title="Explore" links={primaryNav} />
        <FooterLinks title="Services" links={serviceLinks} />
      </Container>

      <Container className="text-sm text-white/60">
        <p className="border-t border-white/15 py-6">
          &copy; {year} {brand.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  )
}

function FooterLinks({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <nav aria-label={`Footer ${title.toLowerCase()}`}>
      <h2 className="text-sm font-semibold tracking-wide text-sun uppercase">{title}</h2>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="text-white/85 hover:text-white hover:underline">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
