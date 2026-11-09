import { ArrowDown, ArrowRight } from 'lucide-react'
import { Fragment, type ReactNode } from 'react'
import {
  advertisingCopy,
  advertisingImage,
  advertisingTypes,
  amazonBoardImage,
  amazonFocus,
  amazonIntro,
  amazonTrademarkNote,
  aplusIntro,
  aplusModules,
  aplusSamples,
  aplusSamplesIntro,
  brandBoardImage,
  brandingCopy,
  brandingPoints,
  brandReelVideo,
  contentCopy,
  contentPoints,
  campaignIntro,
  campaignSteps,
  ecosystemVideo,
  illustratedPageImage,
  launchCopy,
  listingAreas,
  listingIntro,
  launchStages,
  marketYourStoryImage,
  promotionCopy,
  promotionPoints,
  serviceIndex,
  socialCopy,
  socialPoints,
  socialNote,
  socialPhases,
  toolkitVideo,
  websiteApproach,
  websiteCopy,
  websiteSamples,
  workbookImage,
} from '../../content/marketing'
import { StyleVideo } from '../styles/StyleVideo'
import { Section } from '../ui/Section'
import { ctaClass, ListLabel, MediaImage, Paragraphs, PointList, ServiceHeading } from './MarketingParts'

const [amazon, launch, branding, social, promotion, advertising, content, website] = serviceIndex
const titleId = (id: string) => `${id}-title`

/** Yellow: "Marketing Services Overview", an index of the eight sections that follow. */
export function ServicesOverviewSection() {
  return (
    <Section id="marketing-services" tone="sun" labelledBy="marketing-services-title" className="!py-16 sm:!py-20">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
        <div className="lg:col-span-5">
          <h2 id="marketing-services-title" className="text-display text-[clamp(2.2rem,1.5rem+2.4vw,3.6rem)] leading-[1.05]">
            Marketing Services Overview
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed">
            Eight services that can be combined into one plan or chosen on their own, depending on where your book is today.
          </p>
        </div>
        <nav aria-label="Marketing services" className="lg:col-span-7">
          <ol className="grid grid-cols-1 border-t-2 border-ink sm:grid-cols-2">
            {serviceIndex.map((service, index) => (
              <li key={service.id} className="border-b border-ink/25">
                <a href={`#${service.id}`} className="flex items-baseline gap-4 py-3.5 text-lg font-bold">
                  <span className="text-display text-base text-brand-red-dark">{String(index + 1).padStart(2, '0')}</span>
                  {service.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </Section>
  )
}

/** Eyebrow and display subheading for the four blocks inside the Amazon section. */
function AmazonBlockHeading({ eyebrow, children }: { eyebrow: string; children: ReactNode }) {
  return (
    <>
      <p className="text-sm font-bold tracking-[0.08em] text-brand-red-dark uppercase">{eyebrow}</p>
      <h3 className="text-display mt-3 text-[clamp(1.8rem,1.3rem+1.6vw,2.75rem)] leading-[1.08] tracking-[-0.015em] text-balance">{children}</h3>
    </>
  )
}

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * 1. White, in four blocks: the introduction beside the "Market your story" poster; Amazon's brand animation
 * beside the four campaign-management steps (yellow panel); the listing copy beside the Amazon Marketing
 * board; and the five A+ Content panels, each shown whole beside what it demonstrates (yellow panel).
 */
export function AmazonServiceSection() {
  return (
    <Section id={amazon.id} labelledBy={titleId(amazon.id)}>
      {/* Introduction */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-7">
          <ServiceHeading id={titleId(amazon.id)} number={1}>
            {amazon.title}
          </ServiceHeading>
          <Paragraphs items={amazonIntro} />
          <dl className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {amazonFocus.map((item) => (
              <div key={item.title} className="border-t-2 border-ink pt-4">
                <dt className="text-lg font-bold">{item.title}</dt>
                <dd className="mt-1.5 leading-relaxed text-ink-soft">{item.body}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-9">
            <a href="#amazon-detail" className="inline-flex items-center gap-2 font-bold underline underline-offset-4">
              See the full Amazon service <ArrowRight aria-hidden size={17} />
            </a>
          </p>
        </div>
        <MediaImage
          image={marketYourStoryImage}
          sizes="(min-width: 1024px) 34vw, (min-width: 640px) 28rem, 100vw"
          className="mx-auto max-w-md rounded-lg lg:col-span-5 lg:max-w-none"
        />
      </div>

      {/* Advertising: the brand animation beside the four management steps */}
      <div className="-mx-5 mt-20 bg-sun px-5 py-10 sm:mx-0 sm:rounded-lg sm:p-10 lg:mt-28 lg:p-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          <figure className="mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none">
            <StyleVideo video={ecosystemVideo} className="w-full" />
            <figcaption className="mt-3 text-sm leading-relaxed">{ecosystemVideo.caption}</figcaption>
          </figure>
          <div className="lg:col-span-7">
            <AmazonBlockHeading eyebrow="Amazon advertising">Campaigns that are set up, watched and refined</AmazonBlockHeading>
            <p className="mt-5 text-lg leading-relaxed">{campaignIntro}</p>
            <ol className="mt-8 grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
              {campaignSteps.map((step, index) => (
                <li key={step.title} className="border-t-2 border-ink pt-4">
                  <p className="text-display text-lg text-brand-red-dark">{pad(index + 1)}</p>
                  <h4 className="mt-1 text-xl font-bold">{step.title}</h4>
                  <p className="mt-1.5 leading-relaxed">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Listing and discoverability beside the Amazon Marketing board */}
      <div className="mt-20 grid grid-cols-1 gap-12 lg:mt-28 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-7">
          <AmazonBlockHeading eyebrow="Listing and discoverability">
            A book page built for the adults who choose children’s books
          </AmazonBlockHeading>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed">{listingIntro}</p>
          <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
            {listingAreas.map((area) => (
              <li key={area.title} className="border-t-2 border-ink pt-4">
                <h4 className="text-xl font-bold">{area.title}</h4>
                <p className="mt-1.5 leading-relaxed text-ink-soft">{area.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <MediaImage
          image={amazonBoardImage}
          sizes="(min-width: 1024px) 36vw, (min-width: 640px) 32rem, 100vw"
          className="mx-auto max-w-lg lg:col-span-5 lg:max-w-none"
        />
      </div>

      {/* A+ Content: what it is, the four kinds of panel, then the five samples shown whole */}
      <div className="-mx-5 mt-20 bg-sun px-5 py-10 sm:mx-0 sm:rounded-lg sm:p-10 lg:mt-28 lg:p-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <AmazonBlockHeading eyebrow="Amazon A+ Content">The illustrated part of your book page</AmazonBlockHeading>
            {aplusIntro.map((text) => (
              <p key={text.slice(0, 32)} className="mt-5 text-lg leading-relaxed">
                {text}
              </p>
            ))}
          </div>
          <ul className="grid grid-cols-1 content-start gap-4 sm:grid-cols-2 lg:col-span-6">
            {aplusModules.map((module) => (
              <li key={module.title} className="rounded-lg bg-white p-6">
                <h4 className="text-lg font-bold">{module.title}</h4>
                <p className="mt-1.5 leading-relaxed text-ink-soft">{module.body}</p>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-14 max-w-3xl border-l-4 border-ink pl-5 text-lg leading-relaxed">{aplusSamplesIntro}</p>
        <ol aria-label="A+ Content samples" className="mt-10 grid gap-12 lg:gap-14">
          {aplusSamples.map((sample, index) => (
            <li key={sample.title} className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center lg:gap-10">
              <div className="rounded-lg bg-white p-1.5 sm:p-3 lg:col-span-8">
                <MediaImage image={sample.image} sizes="(min-width: 1280px) 800px, (min-width: 1024px) 56vw, 92vw" className="rounded" />
              </div>
              <div className="lg:col-span-4">
                <p className="text-sm font-bold tracking-[0.08em] text-brand-red-dark uppercase">
                  {pad(index + 1)} · {sample.kind}
                </p>
                <h4 className="text-display mt-2 text-[1.65rem] leading-tight">{sample.title}</h4>
                <p className="mt-3 leading-relaxed">{sample.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-12 max-w-3xl text-sm leading-relaxed text-ink-soft">{amazonTrademarkNote}</p>
    </Section>
  )
}

/** 2. Yellow, text-led (no supplied asset matches a launch): three launch stages. */
export function LaunchServiceSection() {
  return (
    <Section id={launch.id} tone="sun" labelledBy={titleId(launch.id)}>
      <div className="max-w-3xl">
        <ServiceHeading id={titleId(launch.id)} number={2}>
          {launch.title}
        </ServiceHeading>
        <p className="mt-5 text-lg leading-relaxed">{launchCopy}</p>
      </div>
      <ol className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3 lg:mt-14 lg:gap-6">
        {launchStages.map((stage, index) => (
          <li key={stage.title} className="rounded-lg bg-white p-7 lg:p-8">
            <p className="text-sm font-bold tracking-[0.08em] text-brand-red-dark uppercase">
              {String(index + 1).padStart(2, '0')} · {stage.stage}
            </p>
            <h3 className="text-display mt-3 text-3xl">{stage.title}</h3>
            <PointList items={stage.points} className="mt-6" />
          </li>
        ))}
      </ol>
    </Section>
  )
}

/** 3. White: copy and list, with the branded-website reel above the identity board and the illustrated page. */
export function BrandingServiceSection() {
  return (
    <Section id={branding.id} labelledBy={titleId(branding.id)}>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5 lg:pt-4">
          <ServiceHeading id={titleId(branding.id)} number={3}>
            {branding.title}
          </ServiceHeading>
          <Paragraphs items={brandingCopy} />
          <ListLabel>What we offer</ListLabel>
          <PointList items={brandingPoints} />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:col-span-7">
          <StyleVideo video={brandReelVideo} className="col-span-2 w-full" />
          <MediaImage image={brandBoardImage} sizes="(min-width: 1024px) 26vw, 46vw" className="rounded-lg" />
          <MediaImage image={illustratedPageImage} sizes="(min-width: 1024px) 26vw, 46vw" className="rounded-lg ring-1 ring-ink/10" />
        </div>
      </div>
    </Section>
  )
}

/**
 * 4. Yellow: copy and list, then the nine supplied slides as a three-phase process. Each phase is a row
 * of three numbered stages; a static connector line and arrow run between the stage numbers (above the
 * images, so they never cross a picture or text), and a downward arrow links one phase to the next.
 * Below lg the stages stack, each followed by a downward arrow.
 */
export function SocialServiceSection() {
  return (
    <Section id={social.id} tone="sun" labelledBy={titleId(social.id)}>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <ServiceHeading id={titleId(social.id)} number={4}>
            {social.title}
          </ServiceHeading>
          <Paragraphs items={socialCopy} />
        </div>
        <div className="lg:col-span-5 lg:pt-14">
          <ListLabel>What we offer</ListLabel>
          <PointList items={socialPoints} onSun />
        </div>
      </div>

      <ol aria-label="Social media marketing process" className="mt-14 lg:mt-16">
        {socialPhases.map((phase, phaseIndex) => (
          <li key={phase.title}>
            {phaseIndex > 0 && <DownArrow className="py-5 lg:py-7" />}
            <div className="rounded-lg bg-white/55 p-5 sm:p-8 lg:p-10">
              <div className="border-l-4 border-ink pl-5">
                <p className="text-sm font-bold tracking-[0.08em] text-brand-red-dark uppercase">
                  Phase {phaseIndex + 1} of {socialPhases.length}
                </p>
                <h3 className="text-display mt-1 text-[clamp(1.6rem,1.3rem+1vw,2.2rem)] leading-tight">{phase.title}</h3>
                <p className="mt-1 text-lg leading-relaxed">{phase.summary}</p>
              </div>

              <ol className="mt-8 grid grid-cols-1 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_2.25rem_minmax(0,1fr)_2.25rem_minmax(0,1fr)]">
                {phase.stages.map((stage, index) => {
                  const stageNumber = socialPhases.slice(0, phaseIndex).reduce((n, p) => n + p.stages.length, 0) + index + 1
                  const last = index === phase.stages.length - 1
                  return (
                    <Fragment key={stage.title}>
                      <li className="md:grid md:grid-cols-2 md:items-start md:gap-8 lg:block">
                        <div className="flex items-center gap-3 md:col-span-2 lg:col-span-1">
                          <span className="text-display flex size-12 shrink-0 items-center justify-center rounded-full bg-ink text-lg text-white">
                            {String(stageNumber).padStart(2, '0')}
                          </span>
                          <span className="text-sm font-bold tracking-[0.08em] text-brand-red-dark uppercase">{stage.deliverable}</span>
                          {!last && <span aria-hidden className="ml-1 hidden h-0.5 flex-1 bg-ink lg:block" />}
                        </div>
                        <figure className="mt-5">
                          <MediaImage
                            image={stage.image}
                            sizes="(min-width: 1024px) 29vw, (min-width: 768px) 44vw, 100vw"
                            className="rounded-lg ring-1 ring-ink/10"
                          />
                          <figcaption className="mt-2">
                            <a href={stage.image.src} target="_blank" rel="noreferrer" className="text-sm font-bold underline underline-offset-4">
                              View slide full size<span className="sr-only">: {stage.title} (opens in a new tab)</span>
                            </a>
                          </figcaption>
                        </figure>
                        <div className="mt-5">
                          <h4 className="text-xl leading-snug font-bold">
                            <span className="sr-only">Stage {stageNumber}: </span>
                            {stage.title}
                          </h4>
                          <p className="mt-2 leading-relaxed">{stage.body}</p>
                          {stage.next && (
                            <p className="mt-3 flex items-start gap-2 font-bold">
                              <ArrowRight aria-hidden size={18} strokeWidth={2.5} className="mt-0.5 shrink-0 text-brand-red-dark" />
                              {stage.next}
                            </p>
                          )}
                        </div>
                      </li>
                      {!last && (
                        <li aria-hidden className="flex justify-center py-5 lg:h-12 lg:items-center lg:py-0">
                          <ArrowDown size={26} strokeWidth={2.5} className="lg:hidden" />
                          <ArrowRight size={26} strokeWidth={2.5} className="hidden lg:block" />
                        </li>
                      )}
                    </Fragment>
                  )
                })}
              </ol>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-10 max-w-3xl border-l-4 border-brand-red pl-5 leading-relaxed">{socialNote}</p>
    </Section>
  )
}

/** A static downward connector: a short line ending in an arrow, centered. */
function DownArrow({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`flex flex-col items-center ${className}`}>
      <span className="h-6 w-0.5 bg-ink" />
      <ArrowDown size={26} strokeWidth={2.5} className="-mt-1" />
    </div>
  )
}

/** 5. White: the workbook tablets mockup beside the copy. */
export function PromotionServiceSection() {
  return (
    <Section id={promotion.id} labelledBy={titleId(promotion.id)}>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="mx-auto w-full max-w-[32rem] lg:col-span-5 lg:max-w-none">
          <MediaImage image={workbookImage} sizes="(min-width: 1024px) 38vw, 32rem" className="rounded-lg" />
        </div>
        <div className="lg:col-span-7">
          <ServiceHeading id={titleId(promotion.id)} number={5}>
            {promotion.title}
          </ServiceHeading>
          <Paragraphs items={promotionCopy} />
          <ListLabel>What we offer</ListLabel>
          <PointList items={promotionPoints} className="sm:grid-cols-2 sm:gap-x-8" />
        </div>
      </div>
    </Section>
  )
}

/** 6. Yellow: the "Types of Advertising" mockup beside the same six types written out. */
export function AdvertisingServiceSection() {
  return (
    <Section id={advertising.id} tone="sun" labelledBy={titleId(advertising.id)}>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-7">
          <ServiceHeading id={titleId(advertising.id)} number={6}>
            {advertising.title}
          </ServiceHeading>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed">{advertisingCopy}</p>
          <ul className="mt-9 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
            {advertisingTypes.map((type) => (
              <li key={type.title} className="border-t border-ink/30 py-4">
                <h3 className="text-lg font-bold">{type.title}</h3>
                <p className="mt-1 leading-relaxed">{type.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="mx-auto w-full max-w-[32rem] lg:col-span-5 lg:max-w-none">
          <MediaImage image={advertisingImage} sizes="(min-width: 1024px) 38vw, 32rem" className="rounded-lg" />
        </div>
      </div>
    </Section>
  )
}

/** 7. White: the content toolkit video beside the copy. */
export function ContentServiceSection() {
  return (
    <Section id={content.id} labelledBy={titleId(content.id)}>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-7">
          <ServiceHeading id={titleId(content.id)} number={7}>
            {content.title}
          </ServiceHeading>
          <Paragraphs items={contentCopy} />
          <ListLabel>What we create</ListLabel>
          <PointList items={contentPoints} className="sm:grid-cols-2 sm:gap-x-8" />
        </div>
        <div className="mx-auto w-full max-w-[30rem] lg:col-span-5 lg:max-w-none">
          <StyleVideo video={toolkitVideo} className="w-full" />
        </div>
      </div>
    </Section>
  )
}

/** One frame for all four website samples (they range from 4:3 to 16:9). Samples marked `fill` cover it; the rest are shown whole. */
const sampleFrame = { aspectRatio: '16 / 10' }

/**
 * 8. Yellow: author websites. The four supplied samples in two rows of two (stacked on mobile), each with
 * its description beneath, then how our approach differs from a template. Shared playback keeps at most two
 * videos running and attaches a file only near the viewport, so the four never load at once.
 */
export function WebsiteServiceSection() {
  return (
    <Section id={website.id} tone="sun" labelledBy={titleId(website.id)}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <ServiceHeading id={titleId(website.id)} number={8}>
            {website.title}
          </ServiceHeading>
        </div>
        <div className="lg:col-span-6">
          <Paragraphs items={websiteCopy} className="first:mt-0" />
        </div>
      </div>

      <ul aria-label="Website samples" className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:mt-16 lg:gap-x-10 lg:gap-y-16">
        {websiteSamples.map((sample, index) => (
          <li key={sample.video.src}>
            <StyleVideo
              video={sample.video}
              contain={!sample.fill}
              objectPosition={sample.fill?.position}
              style={sampleFrame}
              className="w-full shadow-[0_1px_0_rgba(0,0,0,0.08)]"
            />
            <p className="mt-6 text-sm font-bold tracking-[0.08em] text-brand-red-dark uppercase">Sample {index + 1}</p>
            <h3 className="mt-2 text-2xl font-bold">{sample.title}</h3>
            <p className="mt-3 max-w-[40rem] text-lg leading-relaxed">{sample.body}</p>
          </li>
        ))}
      </ul>

      <div className="mt-16 grid grid-cols-1 gap-8 rounded-lg bg-white p-8 sm:p-10 lg:mt-20 lg:grid-cols-12 lg:gap-16 lg:p-14">
        <h3 className="text-display text-[clamp(1.8rem,1.4rem+1.3vw,2.6rem)] leading-[1.1] text-balance lg:col-span-5">
          {websiteApproach.title}
        </h3>
        <div className="lg:col-span-7">
          {websiteApproach.body.map((text, index) => (
            <p key={text.slice(0, 32)} className={`text-lg leading-relaxed ${index ? 'mt-5' : ''}`}>
              {text}
            </p>
          ))}
          <a href="/contact" className={ctaClass}>
            Plan your author website <ArrowRight aria-hidden size={18} />
          </a>
        </div>
      </div>
    </Section>
  )
}
