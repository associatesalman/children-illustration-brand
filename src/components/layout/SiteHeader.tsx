import { ChevronDown, Menu, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { brand, ctaHref, isCurrentPage, primaryNav, type NavItem } from '../../content/site'
import { ButtonLink } from '../ui/Button'
import { Container } from '../ui/Container'
import { Logo } from '../ui/Logo'

const textLinks = primaryNav.filter((item) => item.href !== ctaHref)
const cta = primaryNav.find((item) => item.href === ctaHref)

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const mobileId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMobileOpen(false)
      toggleRef.current?.focus()
    }
    // Close if the viewport grows past the mobile breakpoint.
    const desktop = window.matchMedia('(min-width: 1024px)')
    const onResize = () => desktop.matches && setMobileOpen(false)
    document.addEventListener('keydown', onKey)
    desktop.addEventListener('change', onResize)
    return () => {
      document.removeEventListener('keydown', onKey)
      desktop.removeEventListener('change', onResize)
    }
  }, [mobileOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-white">
      <Container className="flex h-18 items-center justify-between gap-6">
        <a href="/" className="shrink-0" aria-label={`${brand.name}, home`}>
          <Logo alt="" className="h-12 lg:h-14" />
        </a>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {textLinks.map((item) => (
              <li key={item.label}>
                {item.children ? <ServicesMenu item={item} pathname={pathname} /> : (
                  <DesktopLink href={item.href} current={isCurrentPage(item.href, pathname)}>
                    {item.label}
                  </DesktopLink>
                )}
              </li>
            ))}
            {cta && (
              <li className="ml-3">
                <ButtonLink href={cta.href} size="sm">
                  {cta.label}
                </ButtonLink>
              </li>
            )}
          </ul>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="-mr-2 inline-flex size-11 items-center justify-center rounded-md lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls={mobileId}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
          {mobileOpen ? <X aria-hidden size={24} /> : <Menu aria-hidden size={24} />}
        </button>
      </Container>

      <nav
        id={mobileId}
        aria-label="Main"
        hidden={!mobileOpen}
        className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-ink/10 bg-white lg:hidden"
        data-lenis-prevent
      >
        <Container className="py-4">
          <ul className="flex flex-col">
            {primaryNav.map((item) => (
              <li key={item.label}>
                {item.href === ctaHref ? (
                  <ButtonLink href={item.href} className="my-3 w-full" onClick={() => setMobileOpen(false)}>
                    {item.label}
                  </ButtonLink>
                ) : item.children ? (
                  <p className="py-3 text-lg font-medium">{item.label}</p>
                ) : (
                  <a
                    href={item.href}
                    aria-current={isCurrentPage(item.href, pathname) ? 'page' : undefined}
                    className="block py-3 text-lg font-medium hover:text-brand-red aria-[current=page]:text-brand-red"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                )}
                {item.children && (
                  <ul className="mb-2 border-l-2 border-sun pl-4">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <a
                          href={child.href}
                          aria-current={isCurrentPage(child.href, pathname) ? 'page' : undefined}
                          className="block py-2 text-ink-soft hover:text-brand-red aria-[current=page]:font-medium aria-[current=page]:text-brand-red"
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </Container>
      </nav>
    </header>
  )
}

function DesktopLink({ href, current, children }: { href: string; current: boolean; children: string }) {
  return (
    <a
      href={href}
      aria-current={current ? 'page' : undefined}
      className="block rounded-md px-3 py-2 text-[0.95rem] font-medium hover:text-brand-red aria-[current=page]:text-brand-red aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8"
    >
      {children}
    </a>
  )
}

/** Disclosure-style submenu: opens on click or Enter/Space, closes on Escape, outside click, or focus leaving. */
function ServicesMenu({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const inSection = item.children?.some((child) => isCurrentPage(child.href, pathname)) ?? false

  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      buttonRef.current?.focus()
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className={`flex items-center gap-1 rounded-md px-3 py-2 text-[0.95rem] font-medium hover:text-brand-red ${inSection ? 'text-brand-red' : ''}`}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        {item.label}
        <ChevronDown aria-hidden size={16} className={open ? 'rotate-180' : undefined} />
      </button>
      <ul
        id={menuId}
        hidden={!open}
        className="absolute top-full left-0 mt-2 w-60 border border-ink/10 bg-white py-2"
      >
        {item.children?.map((child) => (
          <li key={child.label}>
            <a
              href={child.href}
              aria-current={isCurrentPage(child.href, pathname) ? 'page' : undefined}
              className="block px-4 py-2.5 font-medium hover:bg-paper hover:text-brand-red aria-[current=page]:text-brand-red"
              onClick={() => setOpen(false)}
            >
              {child.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
