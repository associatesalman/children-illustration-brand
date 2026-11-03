/**
 * Shared playback for the Illustration Styles videos. One pair of observers serves every video:
 *
 * - A video's file is attached only when it comes within LOAD_MARGIN of the viewport, so far-away
 *   videos never download. Leaving the page detaches every file and frees the decoders.
 * - Videos that are at least PLAY_RATIO on screen play, muted and looping, up to MAX_PLAYING at a
 *   time (the most visible win). Everything else is paused. All of them pause while the tab is hidden.
 * - With prefers-reduced-motion nothing starts by itself; the poster stays until the visitor plays it.
 * - If the browser blocks autoplay, play() rejects quietly and the poster image stays in place.
 *
 * State lives here, outside React, so scrolling never re-renders the page.
 */

const LOAD_MARGIN = '300px 0px'
const PLAY_RATIO = 0.4
const MAX_PLAYING = 2

type Entry = {
  src: string
  ratio: number
  /** Visitor pressed pause: stays paused until they press play again. */
  paused: boolean
  /** Visitor pressed play under reduced motion: allowed to run while visible. */
  requested: boolean
  onChange: (playing: boolean) => void
}

const entries = new Map<HTMLVideoElement, Entry>()
let loader: IntersectionObserver | null = null
let watcher: IntersectionObserver | null = null
let motion: MediaQueryList | null = null

const reduced = () => motion?.matches ?? false

function attach(video: HTMLVideoElement, entry: Entry) {
  if (video.getAttribute('src')) return
  video.muted = true
  video.src = entry.src
}

function sync() {
  const visible = [...entries]
    .filter(([, e]) => e.ratio >= PLAY_RATIO && !e.paused && (!reduced() || e.requested))
    .sort((a, b) => b[1].ratio - a[1].ratio)
    .slice(0, MAX_PLAYING)
    .map(([video]) => video)

  for (const [video, entry] of entries) {
    const shouldPlay = !document.hidden && visible.includes(video)
    if (shouldPlay) {
      attach(video, entry)
      video.muted = true
      if (video.paused) void video.play().catch(() => {})
    } else if (!video.paused) {
      video.pause()
    }
  }
}

function setUp() {
  motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  motion.addEventListener('change', sync)
  document.addEventListener('visibilitychange', sync)
  loader = new IntersectionObserver(
    (changes) => {
      for (const change of changes) {
        const video = change.target as HTMLVideoElement
        const entry = entries.get(video)
        if (entry && change.isIntersecting && !reduced()) attach(video, entry)
      }
    },
    { rootMargin: LOAD_MARGIN },
  )
  watcher = new IntersectionObserver(
    (changes) => {
      for (const change of changes) {
        const entry = entries.get(change.target as HTMLVideoElement)
        if (entry) entry.ratio = change.isIntersecting ? change.intersectionRatio : 0
      }
      sync()
    },
    { threshold: [0, 0.2, PLAY_RATIO, 0.6, 0.8, 1] },
  )
}

function tearDown() {
  motion?.removeEventListener('change', sync)
  document.removeEventListener('visibilitychange', sync)
  loader?.disconnect()
  watcher?.disconnect()
  loader = watcher = motion = null
}

const onPlay = (event: Event) => {
  const video = event.currentTarget as HTMLVideoElement
  video.dataset.started = 'true'
  entries.get(video)?.onChange(true)
}
const onPause = (event: Event) => entries.get(event.currentTarget as HTMLVideoElement)?.onChange(false)

export function registerVideo(video: HTMLVideoElement, src: string, onChange: (playing: boolean) => void) {
  if (entries.size === 0) setUp()
  entries.set(video, { src, ratio: 0, paused: false, requested: false, onChange })
  video.addEventListener('playing', onPlay)
  video.addEventListener('pause', onPause)
  loader?.observe(video)
  watcher?.observe(video)

  return () => {
    loader?.unobserve(video)
    watcher?.unobserve(video)
    video.removeEventListener('playing', onPlay)
    video.removeEventListener('pause', onPause)
    entries.delete(video)
    video.pause()
    video.removeAttribute('src')
    video.load() // releases the network request and decoder
    if (entries.size === 0) tearDown()
  }
}

/** The visitor's pause/play button. */
export function toggleVideo(video: HTMLVideoElement) {
  const entry = entries.get(video)
  if (!entry) return
  const playing = !video.paused
  entry.paused = playing
  entry.requested = !playing
  if (!playing) attach(video, entry)
  sync()
}
