import { BookImage, BookOpen, Lightbulb, Palette, PenLine, Send } from 'lucide-react'
import { processSteps, type ProcessStep } from '../../content/home'
import { Accent, Section, SectionHeading } from '../ui/Section'

const icons: Record<ProcessStep['icon'], typeof Lightbulb> = {
  concept: Lightbulb,
  illustration: Palette,
  editing: PenLine,
  formatting: BookOpen,
  cover: BookImage,
  publishing: Send,
}

export function Process() {
  return (
    <Section id="process" tone="ink" labelledBy="process-title">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          id="process-title"
          eyebrow="Our book creation process"
          eyebrowClassName="text-sun"
          title={
            <>
              Six steps to a <Accent className="text-sun">finished book</Accent>
            </>
          }
        />
        <p className="max-w-sm text-lg leading-relaxed text-white/75">
          You review and approve each stage before the next one begins.
        </p>
      </div>

      {/*
        Each step reads as one row: "Step N — Title", its icon, then the description.
        On wide screens the rows share columns (subgrid): titles end beside their icons,
        icons and descriptions line up, and the red line runs through every icon.
        Narrower screens keep the icon right after the title and wrap the description below.
      */}
      <ol className="mt-14 space-y-12 lg:mt-20 xl:grid xl:grid-cols-[max-content_5rem_minmax(0,40rem)] xl:gap-x-10 xl:gap-y-12 xl:space-y-0">
        {processSteps.map((step, index) => {
          const Icon = icons[step.icon]
          const last = index === processSteps.length - 1
          return (
            <li key={step.title} className="xl:col-span-3 xl:grid xl:grid-cols-subgrid xl:items-center">
              <div className="flex items-center gap-5 xl:contents">
                <h3 className="text-display min-w-0 text-2xl leading-tight xl:text-right xl:whitespace-nowrap">
                  <span className="font-sans text-base font-bold tracking-[0.08em] text-sun">Step {index + 1}</span>
                  <span aria-hidden className="mx-2 text-sun">
                    &mdash;
                  </span>
                  {step.title}
                </h3>
                <div className="relative flex shrink-0 justify-center xl:items-center xl:self-stretch">
                  {!last && (
                    <span
                      aria-hidden
                      className="absolute top-1/2 left-1/2 hidden h-[calc(100%+3rem)] w-1 -translate-x-1/2 bg-brand-red xl:block"
                    />
                  )}
                  <div className="relative flex size-16 items-center justify-center rounded-full bg-sun text-ink ring-6 ring-brand-red xl:size-20 xl:ring-8">
                    <Icon aria-hidden size={28} strokeWidth={2} />
                  </div>
                </div>
              </div>
              <p className="mt-4 max-w-2xl leading-relaxed text-white/75 xl:mt-0">{step.body}</p>
            </li>
          )
        })}
      </ol>
    </Section>
  )
}
