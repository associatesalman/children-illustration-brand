import { useRef } from 'react'
import heroPoster from '../../assets/home/klutz-home-poster.webp'
import heroVideo from '../../assets/home/klutz-home-720p.mp4'
import { useAutoplayVideo } from '../../lib/useAutoplayVideo'
import { ButtonLink } from '../ui/Button'
import { Container } from '../ui/Container'
import { Accent, Eyebrow } from '../ui/Section'

/**
 * Two-column hero on pure white: heading, description and buttons on the left (left-aligned), the supplied video
 * (scripts/optimize_home_video.py) large on the right. On small screens the copy comes first and the video below.
 *
 * The video keeps its own 2:1 proportions (the 1280x640 picture once the letterbox bars are cropped), so it is
 * neither stretched nor cropped. No overlay, filter or tint. It plays muted, loops inline with no controls,
 * pauses while off screen, and with reduced motion it stays on its poster. Text and buttons are plain.
 */
export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  useAutoplayVideo(videoRef)

  return (
    <section aria-labelledby="hero-title" className="bg-white lg:flex lg:min-h-[calc(100svh-4.5rem)] lg:items-center">
      <Container className="grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 lg:py-24 xl:gap-20">
        <div className="max-w-[36rem]">
          <Eyebrow className="text-ink">Children&rsquo;s book illustration studio</Eyebrow>
          <h1 id="hero-title" className="text-display text-[clamp(2.75rem,1.9rem+3.4vw,5.25rem)] leading-[1.02] tracking-[-0.01em] text-ink">
            Your story, <Accent>beautifully illustrated.</Accent>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink sm:text-xl">
            We design your characters, illustrate every page, and help your book reach young readers, all with one
            team for authors in the US and UK.
          </p>
          <div className="mt-9 flex flex-col items-start gap-x-8 gap-y-3 sm:flex-row sm:items-center">
            <ButtonLink href="/free-sample">Request a free sample</ButtonLink>
            <ButtonLink href="/portfolio" variant="quiet">
              See our work
            </ButtonLink>
          </div>
        </div>

        <video
          ref={videoRef}
          src={heroVideo}
          poster={heroPoster}
          width={1280}
          height={640}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
          tabIndex={-1}
          className="block aspect-[2/1] h-auto w-full rounded-lg bg-white object-contain"
        />
      </Container>
    </section>
  )
}
