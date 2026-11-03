import { type CSSProperties, useEffect, useRef, useState } from 'react'
import type { StyleVideoAsset } from '../../content/illustrationStyles'
import { registerVideo, toggleVideo } from './videoPlayback'

type StyleVideoProps = {
  video: StyleVideoAsset
  className?: string
  /** No rounded corners or dark fill, for a video that sits directly on a matching background. */
  bare?: boolean
  /** Above the fold: load the poster immediately instead of lazily. */
  priority?: boolean
  style?: CSSProperties
}

/**
 * Silent, looping showcase video with no visible controls. A lazy poster image reserves the exact
 * frame; the video sits on top and becomes visible once it is actually playing. Playback is managed
 * in videoPlayback.ts. The only control is a pause/play button that appears on keyboard focus.
 */
export function StyleVideo({ video, className = '', bare = false, priority = false, style }: StyleVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const { poster } = video

  useEffect(() => {
    const element = ref.current
    if (!element) return
    return registerVideo(element, video.src, setPlaying)
  }, [video.src])

  return (
    <div
      className={`relative overflow-hidden ${bare ? '' : 'rounded-lg bg-ink'} ${className}`}
      style={{ aspectRatio: `${poster.width} / ${poster.height}`, ...style }}
    >
      <img
        src={poster.src}
        alt=""
        width={poster.width}
        height={poster.height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        disableRemotePlayback
        aria-label={video.label}
        width={poster.width}
        height={poster.height}
        className="invisible absolute inset-0 h-full w-full object-cover data-[started=true]:visible"
      />
      <button
        type="button"
        onClick={() => ref.current && toggleVideo(ref.current)}
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:bottom-3 focus-visible:left-3 focus-visible:rounded-md focus-visible:bg-ink focus-visible:px-3 focus-visible:py-2 focus-visible:text-sm focus-visible:font-bold focus-visible:text-white"
      >
        {playing ? 'Pause' : 'Play'} video: {video.label}
      </button>
    </div>
  )
}
