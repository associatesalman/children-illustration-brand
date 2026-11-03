import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'

/** Share of the video that must be on screen for it to play (and, for the hero, keep its sound). */
const VISIBLE_RATIO = 0.35

type Options = {
  /**
   * Try to start with sound the first time the video plays. Browsers that block
   * audible autoplay reject the attempt, and the video falls back to muted.
   */
  tryAudible?: boolean
}

/**
 * Plays a video while it is on screen: pauses when it leaves the viewport or the
 * tab is hidden, and mutes once it is mostly scrolled away (sound never returns
 * on its own). With reduced motion it never starts by itself; the poster shows
 * until the visitor presses play.
 */
export function useAutoplayVideo(ref: RefObject<HTMLVideoElement | null>, { tryAudible = false }: Options = {}) {
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  // Set when the visitor pauses, so scrolling or switching tabs never restarts it.
  const pausedByVisitor = useRef(false)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    video.muted = true
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let visible = false
    let triedAudible = !tryAudible

    const sync = () => {
      setPlaying(!video.paused)
      setMuted(video.muted)
    }
    const events = ['play', 'pause', 'volumechange'] as const
    events.forEach((name) => video.addEventListener(name, sync))

    const start = () => {
      if (reduceMotion || pausedByVisitor.current || !visible || document.hidden || !video.paused) return
      if (!triedAudible) {
        triedAudible = true
        video.muted = false
        void video.play().catch(() => {
          video.muted = true
          return video.play().catch(() => {})
        })
        return
      }
      void video.play().catch(() => {})
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= VISIBLE_RATIO
        if (!visible) video.muted = true
        if (!entry.isIntersecting) video.pause()
        else start()
      },
      { threshold: [0, VISIBLE_RATIO] },
    )
    observer.observe(video)

    const onVisibility = () => (document.hidden ? video.pause() : start())
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      events.forEach((name) => video.removeEventListener(name, sync))
    }
  }, [ref, tryAudible])

  const togglePlay = useCallback(() => {
    const video = ref.current
    if (!video) return
    pausedByVisitor.current = !video.paused
    if (video.paused) void video.play().catch(() => {})
    else video.pause()
  }, [ref])

  const toggleMute = useCallback(() => {
    const video = ref.current
    if (video) video.muted = !video.muted
  }, [ref])

  return { playing, muted, togglePlay, toggleMute }
}
