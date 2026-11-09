import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Check,
  Lightbulb,
  ListOrdered,
  Repeat,
  Shapes,
  Smile,
  type LucideIcon,
} from 'lucide-react'
import { Fragment } from 'react'
import {
  approaches,
  characterCapabilities,
  characterParagraphs,
  developmentTopics,
  educationCapabilities,
  educationParagraphs,
  cutoutRigCaption,
  cutoutRigImage,
  cutoutRigIntro,
  cutoutRigPoints,
  introParagraphs,
  introVideo,
  parkSceneVideo,
  processImage,
  sceneBeats,
  soundGroups,
  soundIntro,
  stages,
  storyParagraphs,
  storyPoints,
  storyVideo,
  threeDCapabilities,
  threeDParagraphs,
  trailerBeats,
  trailerParagraphs,
  twoDCapabilities,
  twoDParagraphs,
} from '../../content/animation'
import { Section } from '../ui/Section'
import { AnimationHeading, AnimationPicture, Paragraphs, VideoFigure } from './AnimationParts'

/** White: what animation can do for an author, 2D and 3D in plain terms, beside the sketch-to-render video. */
export function AnimationIntroSection() {
  return (
    <Section id="animation-intro" labelledBy="animation-intro-title">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <AnimationHeading id="animation-intro-title" eyebrow="Animation for children’s authors">
            Your story, <em className="text-brand-red italic">in motion</em>
          </AnimationHeading>
          <Paragraphs items={introParagraphs} className="mt-8 max-w-2xl" />

          <h3 className="text-display mt-14 text-[1.9rem] leading-tight">2D or 3D: what is the difference?</h3>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {approaches.map((approach) => (
              <div key={approach.name} className="rounded-lg bg-sun p-6 sm:p-7">
                <h4 className="text-xl font-bold">{approach.name}</h4>
                <p className="mt-2 leading-relaxed">{approach.summary}</p>
                <p className="mt-5 text-sm font-bold tracking-[0.08em] uppercase">Often a good fit for</p>
                <ul className="mt-3 grid gap-2.5">
                  {approach.suits.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-white">
                        <Check aria-hidden size={14} strokeWidth={3} />
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <VideoFigure video={introVideo} className="mx-auto w-full max-w-[24rem] lg:col-span-5 lg:mt-4 lg:max-w-[26rem] lg:justify-self-end" />
      </div>
    </Section>
  )
}

/** Yellow: the copy, then the cut-out rig beside how a rig works, then five capability cards. */
export function TwoDSection() {
  return (
    <Section id="2d-animation" tone="sun" labelledBy="2d-animation-title">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
        <AnimationHeading id="2d-animation-title" eyebrow="2D animation" eyebrowClassName="text-brand-red-dark" className="lg:col-span-6">
          Illustrations that <em className="text-brand-red-dark italic">come to life</em>
        </AnimationHeading>
        <Paragraphs items={twoDParagraphs} className="lg:col-span-6 lg:pt-10" />
      </div>

      <div className="mt-14 grid grid-cols-1 gap-12 lg:mt-16 lg:grid-cols-12 lg:items-start lg:gap-16">
        <figure className="mx-auto w-full max-w-[26rem] lg:col-span-5 lg:max-w-none">
          <AnimationPicture image={cutoutRigImage} sizes="(min-width: 1024px) 36vw, 26rem" className="rounded-lg bg-white" />
          <figcaption className="mt-4 text-sm leading-relaxed text-ink-soft">{cutoutRigCaption}</figcaption>
        </figure>
        <div className="lg:col-span-7">
          <h3 className="text-display text-[1.9rem] leading-tight">How a cut-out rig works</h3>
          <Paragraphs items={cutoutRigIntro} className="mt-6 max-w-2xl" />
          <ul className="mt-10 grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2">
            {cutoutRigPoints.map((item) => (
              <li key={item.title} className="border-t-2 border-ink pt-4">
                <h4 className="text-xl font-bold">{item.title}</h4>
                <p className="mt-1.5 leading-relaxed">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ul className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-6">
        {twoDCapabilities.map((item, index) => (
          <li key={item.title} className={`rounded-lg bg-white p-7 ${index < 2 ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
            <h3 className="text-xl font-bold">{item.title}</h3>
            <p className="mt-2 leading-relaxed text-ink-soft">{item.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

/** White: the seven-panel 3D process infographic beside the copy and the five numbered 3D capabilities. */
export function ThreeDSection() {
  return (
    <Section id="3d-animation" labelledBy="3d-animation-title">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <AnimationHeading id="3d-animation-title" eyebrow="3D animation">
            Characters and worlds <em className="text-brand-red italic">with depth</em>
          </AnimationHeading>
          <Paragraphs items={threeDParagraphs} className="mt-8 max-w-2xl" />
          <ol className="mt-12 grid gap-8">
            {threeDCapabilities.map((item, index) => (
              <li key={item.title} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 border-t-2 border-ink pt-5">
                <span className="text-display text-2xl text-brand-red">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-ink-soft">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <figure className="mx-auto w-full max-w-[30rem] lg:col-span-5 lg:max-w-none">
          <AnimationPicture image={processImage} sizes="(min-width: 1024px) 36vw, 30rem" className="rounded-lg" />
          <figcaption className="mt-4 text-sm leading-relaxed text-ink-soft">
            One character through the 3D pipeline: concept, modeling, texturing, rigging, animation, lighting and the final render.
          </figcaption>
        </figure>
      </div>
    </Section>
  )
}

/** Yellow: the 3D park scene beside its five story beats, with the five character qualities underneath. */
export function CharacterSection() {
  return (
    <Section id="character-animation" tone="sun" labelledBy="character-animation-title">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
        <AnimationHeading
          id="character-animation-title"
          eyebrow="Character animation"
          eyebrowClassName="text-brand-red-dark"
          className="lg:col-span-6"
        >
          Personality you can <em className="text-brand-red-dark italic">see</em>
        </AnimationHeading>
        <Paragraphs items={characterParagraphs} className="lg:col-span-6 lg:pt-10" />
      </div>

      <div className="mt-14 grid grid-cols-1 gap-12 lg:mt-16 lg:grid-cols-12 lg:items-start lg:gap-16">
        <VideoFigure video={parkSceneVideo} className="lg:col-span-7" />
        <div className="lg:col-span-5">
          <h3 className="text-sm font-bold tracking-[0.08em] uppercase">The scene, beat by beat</h3>
          <ol className="mt-6 grid gap-6">
            {sceneBeats.map((beat, index) => (
              <li key={beat.title} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4">
                <span className="text-display flex size-10 items-center justify-center rounded-full bg-ink text-base text-white">{index + 1}</span>
                <div>
                  <h4 className="text-lg font-bold">{beat.title}</h4>
                  <p className="mt-1 leading-relaxed">{beat.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <h3 className="text-display mt-16 text-[1.9rem] leading-tight lg:mt-20">What character animation covers</h3>
      <ul className="mt-8 grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
        {characterCapabilities.map((item) => (
          <li key={item.title} className="border-t-2 border-ink pt-4">
            <h4 className="text-xl font-bold">{item.title}</h4>
            <p className="mt-1.5 leading-relaxed">{item.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

/** White: a wide showcase of rendered story scenes, then the copy and four principles. */
export function StoryAnimationSection() {
  return (
    <Section id="story-animation" labelledBy="story-animation-title" wide>
      <AnimationHeading id="story-animation-title" eyebrow="Children’s story animation" className="max-w-4xl">
        From the page to the <em className="text-brand-red italic">screen</em>
      </AnimationHeading>
      <VideoFigure video={storyVideo} className="mx-auto mt-12 max-w-[68rem] lg:mt-14" />
      <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <Paragraphs items={storyParagraphs} className="lg:col-span-6" />
        <ul className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-6">
          {storyPoints.map((item) => (
            <li key={item.title} className="border-t-2 border-ink pt-4">
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="mt-1.5 leading-relaxed text-ink-soft">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}

/** Yellow: what a book trailer is, beside the five parts of one, joined by a static line. */
export function TrailerSection() {
  return (
    <Section id="book-trailers" tone="sun" labelledBy="book-trailers-title">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <AnimationHeading id="book-trailers-title" eyebrow="Animated book trailers" eyebrowClassName="text-brand-red-dark">
            A short film for <em className="text-brand-red-dark italic">your book</em>
          </AnimationHeading>
          <Paragraphs items={trailerParagraphs} className="mt-8" />
        </div>
        <div className="lg:col-span-7">
          <h3 className="text-sm font-bold tracking-[0.08em] uppercase">The parts of a trailer</h3>
          <ol className="mt-6 grid">
            {trailerBeats.map((beat, index) => (
              <li key={beat.title} className="relative grid grid-cols-[3rem_minmax(0,1fr)] gap-x-5 pb-9 last:pb-0">
                {index < trailerBeats.length - 1 && <span aria-hidden className="absolute top-12 bottom-0 left-6 w-0.5 -translate-x-1/2 bg-ink" />}
                <span className="text-display flex size-12 items-center justify-center rounded-full bg-ink text-lg text-white">{index + 1}</span>
                <div className="rounded-lg bg-white p-6">
                  <h4 className="text-xl font-bold">{beat.title}</h4>
                  <p className="mt-1.5 leading-relaxed text-ink-soft">{beat.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  )
}

const educationIcons: LucideIcon[] = [Lightbulb, ListOrdered, Smile, BookOpen, Repeat, Shapes]

/** White: educational and explainer animation, with six capabilities in a grid. */
export function EducationSection() {
  return (
    <Section id="educational-animation" labelledBy="educational-animation-title">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
        <AnimationHeading id="educational-animation-title" eyebrow="Educational & explainer animation" className="lg:col-span-6">
          Learning, made <em className="text-brand-red italic">visible</em>
        </AnimationHeading>
        <Paragraphs items={educationParagraphs} className="lg:col-span-6 lg:pt-10" />
      </div>
      <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
        {educationCapabilities.map((item, index) => {
          const Icon = educationIcons[index]
          return (
            <li key={item.title} className="rounded-lg border border-ink/15 p-7">
              <span className="flex size-11 items-center justify-center rounded-full bg-sun">
                <Icon aria-hidden size={20} strokeWidth={2.25} />
              </span>
              <h3 className="mt-5 text-xl font-bold">{item.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{item.body}</p>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

/** Yellow: one moment as storyboard, layout and render, joined by static arrows, then six planning topics. */
export function StoryboardSection() {
  return (
    <Section id="storyboarding" tone="sun" labelledBy="storyboarding-title" wide>
      <AnimationHeading
        id="storyboarding-title"
        eyebrow="Storyboarding & visual development"
        eyebrowClassName="text-brand-red-dark"
        className="max-w-4xl"
      >
        Every shot is <em className="text-brand-red-dark italic">planned first</em>
      </AnimationHeading>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed">
        Before animation begins, the story is broken down, designed and timed. Here is one moment of a 3D sequence at three
        stages, from a pencil sketch to the finished frame.
      </p>

      <ol className="mt-12 grid grid-cols-1 items-start lg:grid-cols-[minmax(0,1fr)_2.25rem_minmax(0,1fr)_2.25rem_minmax(0,1fr)] lg:gap-x-4">
        {stages.map((stage, index) => (
          <Fragment key={stage.step}>
            {index > 0 && (
              <li aria-hidden className="flex justify-center py-4 lg:self-center lg:py-0 lg:pb-24">
                <ArrowDown size={28} strokeWidth={2.25} className="lg:hidden" />
                <ArrowRight size={28} strokeWidth={2.25} className="hidden lg:block" />
              </li>
            )}
            <li>
              <figure>
                <AnimationPicture image={stage} sizes="(min-width: 1024px) 30vw, 92vw" className="rounded-lg bg-white" />
                <figcaption className="mt-5">
                  <span className="text-display text-lg text-brand-red-dark">{stage.step}</span>
                  <span className="mt-1 block text-xl font-bold">{stage.title}</span>
                  <span className="mt-1.5 block leading-relaxed">{stage.body}</span>
                </figcaption>
              </figure>
            </li>
          </Fragment>
        ))}
      </ol>

      <h3 className="text-display mt-20 text-[1.9rem] leading-tight">What visual development covers</h3>
      <ul className="mt-8 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {developmentTopics.map((item) => (
          <li key={item.title} className="border-t-2 border-ink pt-4">
            <h4 className="text-xl font-bold">{item.title}</h4>
            <p className="mt-1.5 leading-relaxed">{item.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

/** White: sound and delivery options in two panels, framed by the agreed scope. */
export function SoundDeliverySection() {
  return (
    <Section id="sound-delivery" labelledBy="sound-delivery-title">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
        <AnimationHeading id="sound-delivery-title" eyebrow="Sound & final delivery" className="lg:col-span-6">
          Finished, and ready <em className="text-brand-red italic">to share</em>
        </AnimationHeading>
        <p className="text-lg leading-relaxed lg:col-span-6 lg:pt-10">{soundIntro}</p>
      </div>
      <div className="mt-14 grid grid-cols-1 gap-6 lg:mt-16 lg:grid-cols-2">
        {soundGroups.map((group, index) => (
          <section key={group.title} aria-labelledby={`sound-group-${index}`} className="rounded-lg bg-sun p-7 sm:p-9">
            <h3 id={`sound-group-${index}`} className="text-display text-[1.9rem] leading-tight">
              {group.title}
            </h3>
            <ul className="mt-6 grid gap-6">
              {group.items.map((item) => (
                <li key={item.title} className="border-t-2 border-ink pt-4">
                  <h4 className="text-lg font-bold">{item.title}</h4>
                  <p className="mt-1 leading-relaxed">{item.body}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Section>
  )
}
