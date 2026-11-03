import Lenis from 'lenis'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigate, useNavigationType } from 'react-router'

/**
 * Subtle smooth scrolling with Lenis. Falls back to native scrolling when the
 * visitor prefers reduced motion.
 *
 * Internal links ("/about", "/#faq", "#main") are routed here: a new page
 * opens at the top, a section link scrolls to its section (smoothly when it
 * is on the current page) and moves keyboard focus there, and Back/Forward
 * return to the position the visitor left.
 */
export function useSmoothScroll() {
  const navigate = useNavigate()
  const location = useLocation()
  const navigationType = useNavigationType()
  const lenisRef = useRef<Lenis | null>(null)
  const positions = useRef(new Map<string, number>())
  const currentKey = useRef<string | null>(null)
  const previousPath = useRef<string | null>(null)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const start = () => {
      if (lenisRef.current || reduceMotion.matches) return
      const lenis = new Lenis({ lerp: 0.12, smoothWheel: true })
      lenisRef.current = lenis
      const raf = (time: number) => {
        lenis.raf(time)
        frame = requestAnimationFrame(raf)
      }
      frame = requestAnimationFrame(raf)
    }

    const stop = () => {
      cancelAnimationFrame(frame)
      lenisRef.current?.destroy()
      lenisRef.current = null
    }

    const onMotionChange = () => (reduceMotion.matches ? stop() : start())
    const onScroll = () => {
      if (currentKey.current) positions.current.set(currentKey.current, window.scrollY)
    }

    history.scrollRestoration = 'manual'
    start()
    reduceMotion.addEventListener('change', onMotionChange)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      stop()
      reduceMotion.removeEventListener('change', onMotionChange)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]')
      if (!link || (link.target && link.target !== '_self') || link.hasAttribute('download')) return
      const url = new URL(link.href)
      if (url.origin !== window.location.origin) return

      event.preventDefault()
      const to = url.pathname + url.hash
      navigate(to, { replace: to === window.location.pathname + window.location.hash })
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [navigate])

  // Layout effect: scroll before the new page paints, so it never flashes at the old position.
  useLayoutEffect(() => {
    const samePage = previousPath.current === location.pathname
    const firstLoad = previousPath.current === null
    previousPath.current = location.pathname
    currentKey.current = location.key

    const lenis = lenisRef.current
    lenis?.resize()
    const id = decodeURIComponent(location.hash.slice(1))
    const target = id && id !== 'top' ? document.getElementById(id) : null
    const smooth = samePage && !firstLoad

    const scrollTo = (destination: number | HTMLElement) => {
      if (lenis) {
        // Lenis reads the target's scroll-margin-top, which already clears the sticky header.
        lenis.scrollTo(destination, { immediate: !smooth, force: true })
      } else if (typeof destination === 'number') {
        window.scrollTo(0, destination)
      } else {
        destination.scrollIntoView()
      }
    }

    if (navigationType === 'POP' && !firstLoad) {
      scrollTo(positions.current.get(location.key) ?? target ?? 0)
      return
    }

    scrollTo(target ?? 0)
    if (firstLoad) return
    // Move keyboard focus to the section, or to the new page's content.
    const focusTarget = target ?? (samePage ? document.getElementById('top') : document.getElementById('main'))
    focusTarget?.focus({ preventScroll: true })
  }, [location, navigationType])
}
