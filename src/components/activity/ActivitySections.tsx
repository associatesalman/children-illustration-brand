import {
  coloring,
  coloringMedia,
  coloringOffer,
  coloringPrint,
  coloringTheme,
  coloringTopics,
  educational,
  educationalBehindScenes,
  educationalConsistency,
  educationalMedia,
  educationalOffer,
  educationalPrinciples,
  educationalTopics,
  process,
  puzzleMedia,
  puzzleOffer,
  puzzlePrinciples,
  puzzles,
  puzzleTypes,
} from '../../content/activityBooks'
import { Figure, VideoFigure } from '../styles/StyleParts'
import { Container } from '../ui/Container'
import { Accent } from '../ui/Section'
import { CategoryHeading, CategoryShell, Lead, OfferRow, PageImage, SubHeading } from './ActivityParts'

/** 01 · Tall coloring set beside the craft notes, then video, theme and the themed set in a row of three. */
export function ColoringSection() {
  return (
    <CategoryShell copy={coloring} tone="white">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
        <CategoryHeading copy={coloring} className="lg:col-span-7" />
        <Lead className="lg:col-span-5">{coloring.lead}</Lead>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
        <PageImage
          image={coloringMedia.copyColors}
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="mx-auto w-full max-w-xl lg:col-span-5 lg:max-w-none"
        />
        <div className="lg:col-span-7">
          <dl className="space-y-9">
            {coloringTopics.map((topic) => (
              <div key={topic.title} className="max-w-2xl">
                <dt className="text-display text-2xl leading-tight">{topic.title}</dt>
                <dd className="mt-2.5 text-lg leading-relaxed text-ink-soft">{topic.body}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-12 max-w-2xl border-t border-ink/20 pt-8">
            <SubHeading>{coloringPrint.title}</SubHeading>
            <p className="mt-3 text-lg leading-relaxed text-ink-soft">{coloringPrint.body}</p>
          </div>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:mt-24 lg:grid-cols-12 lg:items-center lg:gap-12">
        <VideoFigure video={coloringMedia.video} className="mx-auto w-full max-w-sm lg:col-span-3" />
        <div className="md:order-last md:col-span-2 lg:order-none lg:col-span-4">
          <SubHeading>{coloringTheme.title}</SubHeading>
          <div className="mt-4 space-y-4 text-lg leading-relaxed">
            {coloringTheme.body.map((text) => (
              <p key={text.slice(0, 30)}>{text}</p>
            ))}
          </div>
        </div>
        <PageImage image={coloringMedia.windowSet} sizes="(min-width: 1024px) 38vw, (min-width: 768px) 50vw, 100vw" className="lg:col-span-5" />
      </div>

      <OfferRow {...coloringOffer} panel="sun" className="mt-16 lg:mt-24" />
    </CategoryShell>
  )
}

/** 02 · The robot spread at full width, the four puzzle types, three jungle pages, then design principles. */
export function PuzzleSection() {
  const { spread, maze, matching, difference } = puzzleMedia
  return (
    <CategoryShell copy={puzzles} tone="sun">
      <div className="max-w-4xl">
        <CategoryHeading copy={puzzles} />
        <Lead className="mt-6">{puzzles.lead}</Lead>
      </div>

      <Figure image={spread} sizes="(min-width: 1440px) 1065px, 100vw" className="mx-auto mt-14 max-w-[1065px] lg:mt-20" />

      <div className="mt-16 grid grid-cols-1 gap-x-14 gap-y-10 md:grid-cols-2 lg:mt-24">
        {puzzleTypes.map((type) => (
          <div key={type.title}>
            <SubHeading>{type.title}</SubHeading>
            <p className="mt-3 max-w-xl text-lg leading-relaxed">{type.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 grid grid-cols-1 justify-items-center gap-10 sm:grid-cols-3 sm:gap-6 lg:gap-10">
        {[maze, matching, difference].map((page) => (
          <PageImage key={page.src} image={page} className="w-full max-w-[344px]" />
        ))}
      </div>

      <div className="mt-16 border-t border-ink/25 pt-12 lg:mt-24 lg:pt-16">
        <SubHeading>How the illustration makes a puzzle work</SubHeading>
        <ol className="mt-8 grid grid-cols-1 gap-x-14 gap-y-9 md:grid-cols-2 lg:grid-cols-3">
          {puzzlePrinciples.map((item, index) => (
            <li key={item.title} className="flex gap-4">
              <span aria-hidden className="text-display text-3xl leading-none text-brand-red">
                {index + 1}
              </span>
              <div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-1.5 leading-relaxed">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <OfferRow {...puzzleOffer} panel="white" className="mt-16 lg:mt-24" />
    </CategoryShell>
  )
}

/** 03 · Three learning pages, each with its explanation underneath, then the robot book overview. */
export function EducationalSection() {
  const { alphabet, counting, completeFaces, grid } = educationalMedia
  const pages = [alphabet, counting, completeFaces]
  return (
    <CategoryShell copy={educational} tone="white">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
        <CategoryHeading copy={educational} className="lg:col-span-7" />
        <Lead className="lg:col-span-5">{educational.lead}</Lead>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-14 md:grid-cols-3 md:gap-8 lg:mt-20 lg:gap-12">
        {educationalTopics.map((topic, index) => (
          <article key={topic.title}>
            <PageImage image={pages[index]} className="mx-auto w-full max-w-[344px]" />
            <h3 className="text-display mt-7 text-2xl leading-tight">{topic.title}</h3>
            <p className="mt-2.5 leading-relaxed text-ink-soft">{topic.body}</p>
          </article>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-1 gap-10 lg:mt-24 lg:grid-cols-12 lg:items-center lg:gap-16">
        <PageImage image={grid} sizes="(min-width: 1024px) 58vw, 100vw" className="lg:col-span-7" />
        <div className="lg:col-span-5">
          <SubHeading>{educationalConsistency.title}</SubHeading>
          <div className="mt-4 space-y-4 text-lg leading-relaxed">
            {educationalConsistency.body.map((text) => (
              <p key={text.slice(0, 30)}>{text}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3 lg:mt-20 lg:gap-12">
        {educationalPrinciples.map((item) => (
          <div key={item.title} className="border-t-2 border-brand-red pt-5">
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p className="mt-2 leading-relaxed text-ink-soft">{item.body}</p>
          </div>
        ))}
      </div>

      {/* Behind the scenes: the eight stages as a ruled, numbered sequence on a yellow panel. */}
      <div className="mt-16 rounded-lg bg-sun p-7 sm:p-10 lg:mt-24 lg:p-14">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-end lg:gap-16">
          <h3 className="text-display text-[clamp(1.9rem,1.4rem+1.8vw,3rem)] leading-[1.05] lg:col-span-5">
            Behind <Accent>the scenes</Accent>
          </h3>
          <p className="max-w-2xl text-lg leading-relaxed lg:col-span-7">{educationalBehindScenes.intro}</p>
        </div>
        <ol className="mt-10 grid grid-cols-1 gap-x-10 gap-y-9 sm:grid-cols-2 lg:mt-12 xl:grid-cols-4">
          {educationalBehindScenes.steps.map((step, index) => (
            <li key={step.title} className="border-t-2 border-ink pt-5">
              <span className="text-display block text-3xl leading-none text-brand-red-dark">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h4 className="mt-3 text-lg font-bold">{step.title}</h4>
              <p className="mt-1.5 leading-relaxed">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>

      <OfferRow {...educationalOffer} panel="ink" className="mt-16 lg:mt-24" />
    </CategoryShell>
  )
}

/** How a project runs, in six steps. */
export function ProcessSection() {
  return (
    <section id="process" tabIndex={-1} aria-labelledby="process-title" className="bg-sun py-20 text-ink sm:py-24 lg:py-28">
      <Container>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
          <h2 id="process-title" className="text-display text-[clamp(2.1rem,1.5rem+2.4vw,3.6rem)] leading-[1.06] text-balance lg:col-span-7">
            How we illustrate <Accent>your activity book</Accent>
          </h2>
          <p className="max-w-xl text-lg leading-relaxed lg:col-span-5">
            Whether your book is all coloring, all puzzles, all learning pages or a mix, the work follows the same
            clear steps.
          </p>
        </div>
        <ol className="mt-12 grid grid-cols-1 border-t border-ink/25 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {process.map((step, index) => (
            <li key={step.title} className="border-b border-ink/25 py-8 sm:pr-8 lg:pr-12">
              <span className="text-display text-4xl text-brand-red-dark">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="mt-3 text-xl font-bold">{step.title}</h3>
              <p className="mt-2 max-w-sm leading-relaxed">{step.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
