import {
  backgroundBalance,
  backgroundContinuity,
  backgroundCraft,
  backgroundIntro,
  backgroundMedia,
  backgroundOffer,
  backgrounds,
  fullPage,
  fullPageBalance,
  fullPageContinuity,
  fullPageMedia,
  fullPageOffer,
  fullPagePoints,
  process,
  sceneCamera,
  sceneConsistency,
  sceneMedia,
  sceneOffer,
  scenePoints,
  scenes,
  spreadMedia,
  spreadOffer,
  spreadPoints,
  spreads,
  type Point,
} from '../../content/storybook'
import { CategoryHeading, CategoryShell, Lead, OfferRow, PageImage, SubHeading } from '../activity/ActivityParts'
import { VideoFigure } from '../styles/StyleParts'
import { Container } from '../ui/Container'
import { Accent } from '../ui/Section'

function Paragraphs({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <div className={`space-y-4 text-lg leading-relaxed ${className}`}>
      {items.map((text) => (
        <p key={text.slice(0, 32)}>{text}</p>
      ))}
    </div>
  )
}

/** A short statement set off by a red rule: used once per section for continuity notes. */
function Callout({ point, className = '' }: { point: Point; className?: string }) {
  return (
    <div className={`border-l-4 border-brand-red pl-6 sm:pl-8 ${className}`}>
      <SubHeading>{point.title}</SubHeading>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed">{point.body}</p>
    </div>
  )
}

/** 01 · The supplied full-page mockup, shown whole, beside the craft notes; then text balance and continuity. */
export function FullPageSection() {
  return (
    <CategoryShell copy={fullPage} tone="sun">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
        <CategoryHeading copy={fullPage} className="lg:col-span-7" />
        <Lead className="lg:col-span-5">{fullPage.lead}</Lead>
      </div>

      {/* The supplied mockup is portrait (2:3) and shown whole: a column beside the notes, never cropped. */}
      <div className="mt-14 grid grid-cols-1 gap-12 lg:mt-20 lg:grid-cols-12 lg:items-center lg:gap-16">
        <PageImage
          image={fullPageMedia.mockup}
          sizes="(min-width: 1024px) 40vw, (min-width: 640px) 32rem, 100vw"
          className="mx-auto w-full max-w-lg lg:col-span-5 lg:max-w-none"
        />
        <dl className="space-y-9 lg:col-span-7">
          {fullPagePoints.map((point) => (
            <div key={point.title}>
              <dt className="text-display text-2xl leading-tight">{point.title}</dt>
              <dd className="mt-2.5 text-lg leading-relaxed">{point.body}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-16 lg:mt-24">
        <SubHeading>{fullPageBalance.title}</SubHeading>
        <Paragraphs items={fullPageBalance.body} className="mt-4 max-w-3xl" />
      </div>

      <Callout point={fullPageContinuity} className="mt-16 lg:mt-20" />

      <OfferRow {...fullPageOffer} panel="white" className="mt-16 lg:mt-20" />
    </CategoryShell>
  )
}

/** 02 · The flowing spread shown whole, the portrait video beside the craft notes, then the cover-to-cover video. */
export function SpreadSection() {
  const [path, text, gutter, whole] = spreadPoints
  return (
    <CategoryShell copy={spreads} tone="white">
      <div className="mx-auto max-w-4xl text-center">
        <CategoryHeading copy={spreads} className="justify-center text-left" />
        <Lead className="mx-auto mt-6">{spreads.lead}</Lead>
      </div>

      {/* Shown whole at its own landscape proportions, never cropped, and never wider than the supplied 735px file so it
          is not upscaled (and softened) on wide screens. */}
      <PageImage image={spreadMedia.yarn} className="mx-auto mt-14 w-full max-w-[735px] lg:mt-20" />

      {/* The tall portrait (9:16) video sits beside all four craft notes, so the text column is about as tall as the
          video and no empty band opens up above or below a short block of copy. */}
      <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center lg:mt-20 lg:gap-16">
        <VideoFigure video={spreadMedia.video} className="mx-auto w-full max-w-xs md:col-span-5 lg:col-span-4 lg:max-w-sm" />
        <div className="space-y-9 md:col-span-7 lg:col-span-8">
          {[path, text, gutter].map((point) => (
            <div key={point.title}>
              <SubHeading>{point.title}</SubHeading>
              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-soft">{point.body}</p>
            </div>
          ))}
          <div>
            <SubHeading>{whole.title}</SubHeading>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed">{whole.body}</p>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed">
              The video moves through the openings of one square picture book: the characters, the text and the soft
              background shapes are arranged for each two-page view, not for separate single pages.
            </p>
          </div>
        </div>
      </div>

      {/* Square video shown whole (the spread sits inside its own backdrop), at up to its native 720px. */}
      <VideoFigure video={spreadMedia.coverToCover} className="mx-auto mt-16 w-full max-w-[720px] lg:mt-24" />

      <OfferRow {...spreadOffer} panel="sun" className="mt-16 lg:mt-24" />
    </CategoryShell>
  )
}

/** 03 · The water scene with its reading notes, then camera and pacing beside the bedtime page. */
export function SceneSection() {
  return (
    <CategoryShell copy={scenes} tone="sun">
      <div className="max-w-4xl">
        <CategoryHeading copy={scenes} />
        <Lead className="mt-6">{scenes.lead}</Lead>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
        <PageImage image={sceneMedia.water} className="lg:col-span-7" />
        <ol className="space-y-8 lg:col-span-5">
          {scenePoints.map((point, index) => (
            <li key={point.title} className="flex gap-5">
              <span aria-hidden className="text-display text-3xl leading-none text-brand-red">
                {index + 1}
              </span>
              <div>
                <h3 className="text-lg font-bold">{point.title}</h3>
                <p className="mt-1.5 leading-relaxed">{point.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center lg:mt-24 lg:gap-16">
        <PageImage image={sceneMedia.bedtime} className="mx-auto w-full max-w-[36rem]" />
        <div>
          <SubHeading>{sceneCamera.title}</SubHeading>
          <Paragraphs items={sceneCamera.body} className="mt-4 max-w-xl" />
        </div>
      </div>

      <Callout point={sceneConsistency} className="mt-16 lg:mt-20" />

      <OfferRow {...sceneOffer} panel="white" className="mt-16 lg:mt-20" />
    </CategoryShell>
  )
}

/** 04 · Interior and village side by side, setting types and craft as editorial lists, then balance and continuity. */
export function BackgroundSection() {
  return (
    <CategoryShell copy={backgrounds} tone="white">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
        <CategoryHeading copy={backgrounds} className="lg:col-span-7" />
        <Lead className="lg:col-span-5">{backgrounds.lead}</Lead>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.44fr)_minmax(0,1fr)] md:items-end lg:mt-20 lg:gap-12">
        <PageImage image={backgroundMedia.interior} />
        <PageImage image={backgroundMedia.village} />
      </div>

      <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3 lg:mt-20 lg:gap-12">
        {backgroundIntro.map((point) => (
          <div key={point.title} className="border-t-2 border-ink pt-5">
            <h3 className="text-display text-2xl leading-tight">{point.title}</h3>
            <p className="mt-2.5 leading-relaxed text-ink-soft">{point.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-1 gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SubHeading>Perspective, lighting, atmosphere and color</SubHeading>
          <dl className="mt-6 space-y-6">
            {backgroundCraft.map((point) => (
              <div key={point.title}>
                <dt className="font-bold">
                  <span aria-hidden className="mr-2 text-brand-red">&mdash;</span>
                  {point.title}
                </dt>
                <dd className="mt-1.5 leading-relaxed text-ink-soft">{point.body}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="lg:col-span-7">
          <SubHeading>{backgroundBalance.title}</SubHeading>
          <Paragraphs items={backgroundBalance.body} className="mt-4 max-w-2xl" />
          <Callout point={backgroundContinuity} className="mt-12" />
        </div>
      </div>

      <OfferRow {...backgroundOffer} panel="ink" className="mt-16 lg:mt-24" />
    </CategoryShell>
  )
}

/** How a storybook project runs, as a numbered two-column list. */
export function StorybookProcess() {
  return (
    <section id="process" tabIndex={-1} aria-labelledby="storybook-process-title" className="bg-sun py-20 text-ink sm:py-24 lg:py-28">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 id="storybook-process-title" className="text-display text-[clamp(2.1rem,1.5rem+2.4vw,3.6rem)] leading-[1.06] text-balance">
              How we illustrate <Accent>your storybook</Accent>
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed">
              From the first read of your manuscript to print-ready files, every page is planned before it is
              painted.
            </p>
          </div>
          <ol className="grid grid-cols-1 gap-x-12 sm:grid-cols-2 lg:col-span-8">
            {process.map((step, index) => (
              <li key={step.title} className="flex gap-5 border-t border-ink/25 py-7">
                <span className="text-display w-10 shrink-0 text-3xl leading-none text-brand-red-dark">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="mt-2 leading-relaxed">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}
