import { correctionExamples, type CorrectionExample, type Segment } from '../../content/editing'
import { Accent, Eyebrow, Section } from '../ui/Section'
import { Figure } from './EditingSections'

const sourceBadge: Record<CorrectionExample['source'], string> = {
  document: 'Supplied sample',
  hero: 'Supplied sample',
  demonstration: 'Demonstration',
}

/**
 * Changes are never shown by color alone: removed words are struck through (and announced as "removed"),
 * added words are underlined on a yellow highlight (announced as "added"), and flagged words carry a
 * wavy underline and a numbered editor note.
 */
function Text({ segment }: { segment: Segment }) {
  if (typeof segment === 'string') return <>{segment}</>
  if ('ins' in segment) {
    return (
      <ins className="bg-sun/55 decoration-ink decoration-2 underline-offset-[5px]">
        <span className="sr-only">[added: </span>
        {segment.ins}
        <span className="sr-only">]</span>
      </ins>
    )
  }
  const note = segment.note ? <sup className="ml-0.5 font-sans text-[0.6em] font-bold text-brand-red-dark not-italic">{segment.note}</sup> : null
  if ('del' in segment) {
    return (
      <>
        <del className="text-ink/75 decoration-brand-red decoration-2">
          <span className="sr-only">[removed: </span>
          {segment.del}
          <span className="sr-only">]</span>
        </del>
        {note && <span className="sr-only"> (editor note {segment.note})</span>}
        {note}
      </>
    )
  }
  return (
    <>
      <mark className="bg-transparent text-inherit underline decoration-brand-red decoration-wavy decoration-2 underline-offset-[5px]">
        <span className="sr-only">[flagged: </span>
        {segment.flag}
        <span className="sr-only">]</span>
      </mark>
      {note && <span className="sr-only"> (editor note {segment.note})</span>}
      {note}
    </>
  )
}

function Passage({ label, paragraphs, tone }: { label: string; paragraphs: Segment[][]; tone: 'before' | 'after' }) {
  return (
    <div className={`flex flex-col rounded-lg p-6 sm:p-8 lg:p-10 ${tone === 'before' ? 'bg-paper' : 'bg-white ring-2 ring-ink'}`}>
      <p className={`self-start rounded-full px-3 py-1 text-xs font-bold tracking-[0.1em] uppercase ${tone === 'before' ? 'bg-ink/10 text-ink' : 'bg-ink text-white'}`}>
        {label}
      </p>
      <div className="mt-6 space-y-5 font-[family-name:var(--font-display)] text-[1.15rem] leading-[1.75] sm:text-[1.25rem]">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>
            {paragraph.map((segment, i) => (
              <Text key={i} segment={segment} />
            ))}
          </p>
        ))}
      </div>
    </div>
  )
}

function Example({ example, index }: { example: CorrectionExample; index: number }) {
  const titleId = `example-${example.id}`
  return (
    <article aria-labelledby={titleId} className="rounded-xl bg-white p-5 sm:p-8 lg:p-12">
      <header className="flex flex-col gap-4 border-b border-ink/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold tracking-[0.08em] text-brand-red uppercase">Example {String(index + 1).padStart(2, '0')}</p>
          <h3 id={titleId} className="mt-2">
            <span className="block text-sm font-bold tracking-[0.2em] text-ink-soft uppercase">{example.chapter}</span>
            {example.title && <span className="text-display mt-1 block text-[clamp(1.7rem,1.3rem+1.4vw,2.5rem)] leading-tight">{example.title}</span>}
          </h3>
        </div>
        <div className="max-w-sm sm:text-right">
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-bold tracking-[0.08em] uppercase ${
              example.source === 'demonstration' ? 'bg-brand-red text-white' : 'bg-sun text-ink'
            }`}
          >
            {sourceBadge[example.source]}
          </span>
          <p className="mt-2 text-sm leading-snug text-ink-soft">{example.sourceNote}</p>
        </div>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
        <Passage label="Before editing" paragraphs={example.before} tone="before" />
        <Passage label="After editing" paragraphs={example.after} tone="after" />
      </div>

      {example.editorNotes && (
        <div className="mt-6 rounded-lg border-2 border-dashed border-brand-red/60 p-5 sm:p-6">
          <h4 className="font-bold">Notes the editor wrote on the draft</h4>
          <ol className="mt-3 grid grid-cols-2 gap-x-8 gap-y-1.5 sm:grid-cols-3 lg:grid-cols-6">
            {example.editorNotes.map((note, i) => (
              <li key={note} className="flex gap-2">
                <span className="font-bold text-brand-red-dark">{i + 1}</span>
                <span>&ldquo;{note}&rdquo;</span>
              </li>
            ))}
          </ol>
          {example.generalNote && (
            <p className="mt-3 text-ink-soft">
              Written beside the whole draft: <span className="text-ink">&ldquo;{example.generalNote}&rdquo;</span>
            </p>
          )}
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className={example.originals ? 'lg:col-span-7' : 'lg:col-span-12'}>
          <h4 className="text-display text-2xl">What changed and why</h4>
          <dl className={`mt-5 grid grid-cols-1 gap-x-10 ${example.originals ? '' : 'md:grid-cols-2'}`}>
            {example.changes.map((change) => (
              <div key={change.title} className="border-t border-ink/20 py-5">
                <dt className="text-lg font-bold">{change.title}</dt>
                <dd className="mt-1.5 text-lg leading-relaxed text-ink-soft">{change.body}</dd>
              </div>
            ))}
          </dl>
        </div>
        {example.originals && (
          <div className="lg:col-span-5">
            <h4 className="text-display text-2xl">The original sample pages</h4>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <Figure image={{ ...example.originals.before, caption: 'Before' }} sizes="(min-width: 1024px) 18vw, 45vw" imgClassName="rounded-md ring-1 ring-ink/15" />
              <Figure image={{ ...example.originals.after, caption: 'After, as marked up' }} sizes="(min-width: 1024px) 18vw, 45vw" imgClassName="rounded-md ring-1 ring-ink/15" />
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

/** 04 · Five before/after passages: four supplied samples and one clearly labeled demonstration. */
export function CorrectionsSection() {
  return (
    <Section id="before-and-after" tone="sun" labelledBy="before-and-after-title" wide>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <Eyebrow className="text-ink">Before and after</Eyebrow>
          <h2 id="before-and-after-title" className="text-display text-[clamp(2.1rem,1.5rem+2.4vw,3.6rem)] leading-[1.06] text-balance">
            See what editing <Accent className="text-brand-red-dark">actually changes</Accent>
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed">
            The same passage before and after editing, set as readable text with the original pages alongside. Four
            examples come from the samples supplied for this service. The fifth was written for this page to show
            grammar, punctuation and tense fixes, and is labeled as a demonstration.
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 lg:col-span-5">
          <h3 className="font-bold">How to read the changes</h3>
          <ul className="mt-3 space-y-2 text-lg font-[family-name:var(--font-display)]">
            <li>
              <del className="text-ink/75 decoration-brand-red decoration-2">Struck through</del>
              <span className="font-sans text-base text-ink-soft"> : removed in the edit</span>
            </li>
            <li>
              <ins className="bg-sun/55 decoration-ink decoration-2 underline-offset-[5px]">Underlined and highlighted</ins>
              <span className="font-sans text-base text-ink-soft"> : added in the edit</span>
            </li>
            <li>
              <mark className="bg-transparent text-inherit underline decoration-brand-red decoration-wavy decoration-2 underline-offset-[5px]">Wavy underline</mark>
              <sup className="ml-0.5 font-sans text-[0.6em] font-bold text-brand-red-dark">1</sup>
              <span className="font-sans text-base text-ink-soft"> : flagged by the editor, with a numbered note</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-14 space-y-10 lg:mt-16 lg:space-y-14">
        {correctionExamples.map((example, index) => (
          <Example key={example.id} example={example} index={index} />
        ))}
      </div>
    </Section>
  )
}
