import { useRef } from 'react'
import { portfolioVideos } from '../../content/portfolio'
import { useAutoplayVideo } from '../../lib/useAutoplayVideo'
import { Container } from '../ui/Container'
import { Accent, Eyebrow } from '../ui/Section'
import { VideoControls } from './VideoControls'

const reel = portfolioVideos.hero

/**
 * Hero reel. Starts on its own, with sound where the browser allows it and
 * muted otherwise; mutes once scrolled away. Clicking the video pauses or plays
 * it, and keyboard users get the controls on focus.
 */
export function PortfolioHero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { playing, muted, togglePlay, toggleMute } = useAutoplayVideo(videoRef, { tryAudible: true })

  return (
    <section aria-labelledby="portfolio-title" className="bg-sun">
      <Container className="pt-14 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-28">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-7">
            <Eyebrow className="text-ink">Portfolio</Eyebrow>
            <h1 id="portfolio-title" className="text-display text-[clamp(2.6rem,1.6rem+3.6vw,4.75rem)] leading-[1.02]">
              Illustration, from first sketch to <Accent>finished book</Accent>
            </h1>
          </div>
          <p className="max-w-xl text-lg leading-relaxed sm:text-xl lg:col-span-5">
            Sample storybook spreads and board-book mockups, the pencil plans behind them, character sheets,
            illustration styles, activity pages, and a shelf of children&rsquo;s book covers, shown large enough to
            study the detail.
          </p>
        </div>

        <figure className="mt-12 lg:mt-16">
          <div className="relative">
            <video
              ref={videoRef}
              className="block aspect-video h-auto w-full cursor-pointer bg-ink"
              width={reel.width}
              height={reel.height}
              poster={reel.poster}
              preload="none"
              muted
              loop
              playsInline
              aria-label={reel.label}
              onClick={togglePlay}
            >
              <source src={reel.src} type="video/mp4" />
            </video>
            <VideoControls
              name="portfolio reel"
              playing={playing}
              togglePlay={togglePlay}
              muted={muted}
              toggleMute={toggleMute}
            />
          </div>
          <figcaption className="mt-5 max-w-2xl">
            <span className="font-semibold">Animated illustration sample, 1:48.</span> Characters, interiors and
            landscapes in rich gradient color, linked by flowing ribbons of light.
          </figcaption>
        </figure>
      </Container>
    </section>
  )
}
