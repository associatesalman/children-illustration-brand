import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'

/** Share of the video that must be on screen for it to play (and, for the hero, keep its sound). */
const VISIBLE_RATIO = 0.35

/** Interactions that count as user activation, after which browsers allow a video to play with sound. */
const ACTIVATION_EVENTS = ['pointerdown', 'keydown', 'touchstart'] as const

type Options = {
  /**
   * Try to start with sound the first time the video plays. Browsers that block
   * audible autoplay reject the attempt, and the video falls back to muted.
   */
  tryAudible?: boolean
  /**
   * Sound follows visibility: the video plays with sound while it is on screen, goes
   * silent once it is mostly scrolled away, and the sound comes back when it returns.
   * If the browser blocks audible autoplay, it plays muted and the sound turns on at
   * the visitor's first click, tap or key press on the page.
   */
  soundWhileVisible?: boolean
}

/**
 * Plays a video while it is on screen: pauses when it leaves the viewport or the
 * tab is hidden, and mutes once it is mostly scrolled away (unless soundWhileVisible
 * is set, sound never returns on its own). With reduced motion it never starts by
 * itself; the poster shows until the visitor presses play.
 */
export function useAutoplayVideo(
  ref: RefObject<HTMLVideoElement | null>,
  { tryAudible = false, soundWhileVisible = false }: Options = {},
) {
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
    let triedAudible = !(tryAudible || soundWhileVisible)
    // soundWhileVisible: whether the browser has let this video play with sound.
    let soundAllowed = false

    const sync = () => {
      setPlaying(!video.paused)
      setMuted(video.muted)
    }
    const events = ['play', 'pause', 'volumechange'] as const
    events.forEach((name) => video.addEventListener(name, sync))

    const removeActivation = () => ACTIVATION_EVENTS.forEach((name) => window.removeEventListener(name, onActivation))
    // First interaction anywhere on the page: sound is now allowed, so turn it on if the video is on screen.
    function onActivation() {
      removeActivation()
      soundAllowed = true
      if (visible && !document.hidden) {
        video!.muted = false
        if (video!.paused) start()
      }
    }

    const start = () => {
      if (reduceMotion || pausedByVisitor.current || !visible || document.hidden || !video.paused) return
      if (!triedAudible) {
        triedAudible = true
        video.muted = false
        void video
          .play()
          .then(() => {
            soundAllowed = true
            removeActivation()
          })
          .catch(() => {
            video.muted = true
            if (soundWhileVisible && !soundAllowed) {
              ACTIVATION_EVENTS.forEach((name) => window.addEventListener(name, onActivation, { passive: true }))
            }
            return video.play().catch(() => {})
          })
        return
      }
      if (soundWhileVisible && soundAllowed) video.muted = false
      void video.play().catch(() => {})
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= VISIBLE_RATIO
        if (!visible) video.muted = true
        else if (soundWhileVisible && soundAllowed) video.muted = false
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
      removeActivation()
      document.removeEventListener('visibilitychange', onVisibility)
      events.forEach((name) => video.removeEventListener(name, sync))
    }
  }, [ref, tryAudible, soundWhileVisible])

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
