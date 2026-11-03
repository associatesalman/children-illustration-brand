import { Outlet } from 'react-router'
import { useSmoothScroll } from '../../lib/smoothScroll'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export function SiteLayout() {
  useSmoothScroll()

  return (
    <div id="top" tabIndex={-1} className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-[60] rounded-md bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
