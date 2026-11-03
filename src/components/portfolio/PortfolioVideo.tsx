import { useRef } from 'react'
import type { PortfolioVideo as Video } from '../../content/portfolio'
import { useAutoplayVideo } from '../../lib/useAutoplayVideo'
import { VideoControls } from './VideoControls'

type PortfolioVideoProps = {
  video: Video
  /** Short name for the control labels, e.g. "booklet video". */
  name: string
  className?: string
}

/**
 * A supporting video: always muted, plays while it is in view, and pauses when
 * scrolled away or the tab is hidden. Nothing downloads until it first plays.
 */
export function PortfolioVideo({ video, name, className = '' }: PortfolioVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const { playing, togglePlay } = useAutoplayVideo(ref)

  return (
    <div className={`relative ${className}`}>
      <video
        ref={ref}
        className="block h-auto w-full cursor-pointer bg-ink"
        width={video.width}
        height={video.height}
        poster={video.poster}
        preload="none"
        muted
        loop
        playsInline
        aria-label={video.label}
        onClick={togglePlay}
      >
        <source src={video.src} type="video/mp4" />
      </video>
      <VideoControls name={name} playing={playing} togglePlay={togglePlay} />
    </div>
  )
}
