import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { brand } from '../content/site'

/**
 * Public production origin, e.g. https://www.example.com, from VITE_SITE_URL at build time. Canonical and
 * og:url tags are written only when it is set, so no domain is ever guessed.
 */
export const siteUrl = String(import.meta.env.VITE_SITE_URL ?? '').trim().replace(/\/+$/, '')

/** Title template shared by every page: "<Page> | Klutzbookpublishers". */
export const pageTitle = (name: string) => `${name} | ${brand.name}`

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.append(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.append(el)
  }
  el.href = href
}

/**
 * Sets the document title, meta description and the matching Open Graph / Twitter tags for the current page.
 * `name` goes through the title template unless `exactTitle` is set (used by Home).
 */
export function usePageMeta(name: string, description: string, options: { exactTitle?: boolean } = {}) {
  const { pathname } = useLocation()
  const title = options.exactTitle ? name : pageTitle(name)

  useEffect(() => {
    document.title = title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    if (siteUrl) {
      const url = `${siteUrl}${pathname === '/' ? '/' : pathname.replace(/\/+$/, '')}`
      setCanonical(url)
      setMeta('property', 'og:url', url)
    }
  }, [title, description, pathname])
}
