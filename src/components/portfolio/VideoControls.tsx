import { Pause, Play, Volume2, VolumeX } from 'lucide-react'

type VideoControlsProps = {
  /** Names the video in the button labels, e.g. "portfolio reel". */
  name: string
  playing: boolean
  togglePlay: () => void
  /** Omit for videos that always stay muted. */
  muted?: boolean
  toggleMute?: () => void
}

/**
 * Play/pause (and optional sound) buttons laid over a video. Hidden until a
 * keyboard user tabs to them, so the footage stays clean for everyone else.
 */
export function VideoControls({ name, playing, togglePlay, muted, toggleMute }: VideoControlsProps) {
  const button =
    'inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-black'

  return (
    <div className="video-controls on-dark absolute bottom-4 left-4 flex gap-2">
      <button type="button" className={button} onClick={togglePlay}>
        {playing ? <Pause aria-hidden size={18} /> : <Play aria-hidden size={18} />}
        {playing ? 'Pause' : 'Play'} <span className="sr-only">{name}</span>
      </button>
      {toggleMute && (
        <button type="button" className={button} onClick={toggleMute}>
          {muted ? <Volume2 aria-hidden size={18} /> : <VolumeX aria-hidden size={18} />}
          {muted ? 'Turn sound on' : 'Mute'} <span className="sr-only">{name}</span>
        </button>
      )}
    </div>
  )
}
