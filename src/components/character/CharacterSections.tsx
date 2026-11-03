import { ArrowRight, Maximize2 } from 'lucide-react'
import {
  creation,
  creationMedia,
  creationOffer,
  creationTone,
  creationTopics,
  development,
  developmentMedia,
  developmentOffer,
  developmentTopics,
  expressionKey,
  expressionMedia,
  expressionOffer,
  expressionReference,
  expressions,
  expressionTopics,
  sheetContents,
  sheetMedia,
  sheetOffer,
  sheetQuestions,
  sheets,
  sheetTopics,
} from '../../content/characterDesign'
import { Figure, VideoFigure } from '../styles/StyleParts'
import { ButtonLink } from '../ui/Button'
import { Checklist } from '../ui/Checklist'
import { CharacterShell, OfferBand, Paragraphs, SectionIntro, SubHeading, Topics } from './CharacterParts'

/** 01 · The annotated hero character leads, then the cast of concepts across the full width. */
export function CreationSection() {
  return (
    <CharacterShell copy={creation} tone="white">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
        <SectionIntro copy={creation} className="lg:col-span-7" />
        <Paragraphs items={creation.intro} className="lg:col-span-5" />
      </div>

      <div className="mt-14 grid grid-cols-1 gap-10 lg:mt-20 lg:grid-cols-12 lg:items-start lg:gap-14">
        <Figure image={creationMedia.details} sizes="(min-width: 1024px) 60vw, 100vw" className="lg:col-span-8" />
        <Topics items={creationTopics.slice(0, 3)} className="lg:col-span-4" />
      </div>

      <div className="mt-16 lg:mt-24">
        <Figure image={creationMedia.cast} sizes="(min-width: 1440px) 1296px, 100vw" />
        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <Topics items={creationTopics.slice(3)} className="lg:col-span-5" />
          <div className="lg:col-span-7">
            <SubHeading>{creationTone.title}</SubHeading>
            <Paragraphs items={creationTone.body} className="mt-4" />
          </div>
        </div>
      </div>

      <OfferBand {...creationOffer} panel="sun" className="mt-16 lg:mt-20" />
    </CharacterShell>
  )
}

/** 02 · Video beside the introduction, the expression sheet at full width with a key, then consistency. */
export function ExpressionsSection() {
  return (
    <CharacterShell copy={expressions} tone="sun">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-6">
          <SectionIntro copy={expressions} />
          <Paragraphs items={expressions.intro} className="mt-6" />
        </div>
        <VideoFigure video={expressionMedia.video} className="mx-auto w-full max-w-3xl lg:col-span-6" />
      </div>

      <div className="mt-16 lg:mt-24">
        <Figure image={expressionMedia.sketches} sizes="(min-width: 1440px) 1200px, 100vw" className="mx-auto max-w-[1200px]" />
        <div className="mx-auto mt-10 max-w-[1200px]">
          <SubHeading>The expressions shown here</SubHeading>
          <dl className="mt-6 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {expressionKey.map((item) => (
              <div key={item.name} className="border-t border-ink/25 pt-4">
                <dt className="font-bold">{item.name}</dt>
                <dd className="mt-1 leading-relaxed text-ink-soft">{item.where}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Topics items={expressionTopics} variant="grid" />
          <div className="mt-12 rounded-lg bg-white p-7 sm:p-9">
            <SubHeading>{expressionReference.title}</SubHeading>
            <Paragraphs items={expressionReference.body} className="mt-4 text-base sm:text-lg" />
          </div>
        </div>
        <Figure image={expressionMedia.sequence} sizes="(min-width: 1024px) 34vw, 100vw" className="mx-auto w-full max-w-[540px] lg:col-span-5" />
      </div>

      <OfferBand {...expressionOffer} panel="white" className="mt-16 lg:mt-20" />
    </CharacterShell>
  )
}

/** 03 · The full sheet as large as the page allows, its parts listed, then the turnaround and the brief. */
export function SheetsSection() {
  const full = sheetMedia.full
  return (
    <CharacterShell copy={sheets} tone="white">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
        <SectionIntro copy={sheets} className="lg:col-span-6" />
        <Paragraphs items={sheets.intro} className="lg:col-span-6" />
      </div>

      {/* Never cropped: the whole sheet, up to its full 1200px, with a link to inspect it on its own. */}
      <div className="mx-auto mt-14 max-w-[1200px] lg:mt-20">
        <Figure image={full} sizes="(min-width: 1440px) 1200px, 100vw" className="rounded-lg ring-1 ring-ink/10" />
        <a
          href={full.src}
          target="_blank"
          rel="noopener"
          className="mt-2 inline-flex items-center gap-2 py-2 text-sm font-bold underline decoration-2 underline-offset-4 hover:text-brand-red"
        >
          <Maximize2 aria-hidden size={15} /> Open the full sheet<span className="sr-only"> (opens in a new tab)</span>
        </a>
        <ul className="mt-8 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {sheetContents.map((item) => (
            <li key={item.title} className="border-t-2 border-brand-red pt-4">
              <h3 className="font-bold">{item.title}</h3>
              <p className="mt-1 leading-relaxed text-ink-soft">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-10 lg:mt-24 lg:grid-cols-12 lg:items-start lg:gap-14">
        <Figure image={sheetMedia.turnaround} sizes="(min-width: 1024px) 58vw, 100vw" className="lg:col-span-7" />
        <Topics items={sheetTopics} className="lg:col-span-5" />
      </div>

      <div className="on-dark mt-16 grid grid-cols-1 gap-8 rounded-lg bg-ink p-7 text-white sm:p-10 lg:mt-20 lg:grid-cols-12 lg:gap-12 lg:p-12">
        <div className="lg:col-span-5">
          <SubHeading>Requesting a character sheet</SubHeading>
          <p className="mt-3 leading-relaxed text-white/80">{sheetOffer.intro} When you get in touch, it helps to discuss:</p>
        </div>
        <div className="lg:col-span-7">
          <Checklist items={sheetQuestions} className="text-white/90" marker="bg-sun" />
          <ButtonLink href="/contact" className="mt-8">
            {sheetOffer.cta} <ArrowRight aria-hidden size={18} />
          </ButtonLink>
        </div>
      </div>
    </CharacterShell>
  )
}

/** 04 · The Buddies sequence (one project at two stages), then sketch-to-color beside the process notes. */
export function DevelopmentSection() {
  const { group, posesA, posesB, sketchFinal } = developmentMedia
  return (
    <CharacterShell copy={development} tone="sun">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
        <SectionIntro copy={development} className="lg:col-span-7" />
        <Paragraphs items={development.intro} className="lg:col-span-5" />
      </div>

      <div className="mt-14 lg:mt-20">
        <SubHeading>One cast, from pose sketches to finished characters</SubHeading>
        <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-5 lg:gap-6">
          {[group, posesA, posesB].map((image) => (
            <Figure key={image.src} image={image} sizes="(min-width: 640px) 33vw, 100vw" />
          ))}
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-16">
        <Figure image={sketchFinal} sizes="(min-width: 1024px) 30vw, 100vw" className="mx-auto w-full max-w-md lg:col-span-4 lg:max-w-none" />
        <Topics items={developmentTopics} variant="grid" className="content-start lg:col-span-8" />
      </div>

      <OfferBand {...developmentOffer} panel="white" className="mt-16 lg:mt-20" />
    </CharacterShell>
  )
}
