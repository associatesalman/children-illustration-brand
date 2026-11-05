import { Info, Search, Shuffle, Trash2, X } from 'lucide-react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { categories, coloringSheets, levelLabels, levelOrder, type CategoryId, type SheetEntry } from '../../content/coloringSheets'
import { clearAllSaved } from '../../lib/coloring/session'
import { listSaved } from '../../lib/coloring/storage'
import type { Level } from '../../lib/coloring/types'
import { ButtonLink } from '../ui/Button'
import { Container } from '../ui/Container'
import { ConfirmDialog } from './ConfirmDialog'

/** Only filters that have sheets are offered, so the catalog can grow without showing empty categories. */
const categoryOptions = (Object.keys(categories) as CategoryId[]).filter((id) => coloringSheets.some((s) => s.category === id))
const levelOptions = levelOrder.filter((level) => coloringSheets.some((s) => s.level === level))

const normalize = (text: string) => text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

const haystack = new Map(coloringSheets.map((s) => [s.id, normalize([s.title, categories[s.category], ...s.tags].join(' '))]))

/** Every word typed must appear in the title, category or tags. */
function matches(sheet: SheetEntry, words: string[], category: CategoryId | null, level: Level | null) {
  if (category && sheet.category !== category) return false
  if (level && sheet.level !== level) return false
  const text = haystack.get(sheet.id)!
  return words.every((w) => text.includes(w))
}

type Saved = Map<string, { thumbUrl?: string }>

/**
 * The sheet library. Search and filters live in the address (?q=&category=&level=), replaced rather than added to
 * history, so a filtered library can be shared and Back from a sheet returns to the same results.
 */
export function ColoringLibrary({ unknownId }: { unknownId: string | null }) {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const rawCategory = params.get('category')
  const category = categoryOptions.includes(rawCategory as CategoryId) ? (rawCategory as CategoryId) : null
  const rawLevel = params.get('level')
  const level = levelOptions.includes(rawLevel as Level) ? (rawLevel as Level) : null
  const [query, setQuery] = useState(() => params.get('q') ?? '')
  const [saved, setSaved] = useState<Saved>(new Map())
  const [confirmClear, setConfirmClear] = useState(false)
  const [clearResult, setClearResult] = useState<{ ok: boolean; text: string } | null>(null)
  const [count, setCount] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const searchId = useId()

  const update = useCallback(
    (changes: Record<string, string | null>) => {
      setParams(
        (previous) => {
          const next = new URLSearchParams(previous)
          for (const [key, value] of Object.entries(changes)) {
            if (value) next.set(key, value)
            else next.delete(key)
          }
          return next
        },
        { replace: true, preventScrollReset: true },
      )
    },
    [setParams],
  )

  // Typing updates the results at once; the address follows shortly after.
  useEffect(() => {
    if ((params.get('q') ?? '') === query.trim()) return
    const timer = setTimeout(() => update({ q: query.trim() || null }), 300)
    return () => clearTimeout(timer)
  }, [query, params, update])

  const loadSaved = useCallback(() => {
    let cancelled = false
    const urls: string[] = []
    void listSaved().then((records) => {
      if (cancelled) return
      const next: Saved = new Map()
      for (const record of records) {
        const thumbUrl = record.thumb ? URL.createObjectURL(record.thumb) : undefined
        if (thumbUrl) urls.push(thumbUrl)
        next.set(record.sheetId, { thumbUrl })
      }
      setSaved(next)
    })
    return () => {
      cancelled = true
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])
  const [savedVersion, setSavedVersion] = useState(0)
  useEffect(() => loadSaved(), [loadSaved, savedVersion])

  const words = normalize(query).split(/\s+/).filter(Boolean)
  const results = coloringSheets.filter((s) => matches(s, words, category, level))
  const filterKey = `${words.join(' ')}|${category}|${level}`
  const filtered = words.length > 0 || category !== null || level !== null

  // Announce the number of results after the visitor changes the filters (not on page load).
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    const timer = setTimeout(
      () => setCount(results.length === 0 ? 'No drawings match.' : `${results.length} ${results.length === 1 ? 'drawing' : 'drawings'} shown.`),
      500,
    )
    return () => clearTimeout(timer)
  }, [filterKey]) // eslint-disable-line react-hooks/exhaustive-deps -- announce only when the filters change

  const reset = () => {
    setQuery('')
    update({ q: null, category: null, level: null })
    searchRef.current?.focus()
  }

  const surprise = () => {
    if (!results.length) return
    const pick = results[Math.floor(Math.random() * results.length)]
    navigate(`/coloring-studio?sheet=${pick.id}`)
  }

  const clearAll = async () => {
    setConfirmClear(false)
    try {
      await clearAllSaved()
      setClearResult({ ok: true, text: 'All saved coloring was removed from this device.' })
    } catch {
      setClearResult({ ok: false, text: 'Saved coloring couldn’t be cleared. Nothing was removed. Please try again.' })
    }
    setSavedVersion((v) => v + 1)
  }

  return (
    <Container className="pb-16 sm:pb-20">
      {unknownId && (
        <p role="status" className="mb-8 flex max-w-2xl items-start gap-3 rounded-lg border-2 border-sun bg-white p-4">
          <Info aria-hidden size={22} className="mt-0.5 shrink-0" />
          <span>
            We couldn&rsquo;t find a drawing called &ldquo;{unknownId.slice(0, 60)}&rdquo;. It may have been renamed. Choose
            one of the drawings below.
          </span>
        </p>
      )}

      <h2 className="sr-only">Drawings</h2>
      <div role="search" aria-label="Find a drawing" className="mb-8 flex flex-col gap-5 rounded-lg border border-ink/12 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor={searchId} className="mb-1.5 block font-medium">
              Search drawings
            </label>
            <div className="relative">
              <Search aria-hidden size={18} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-soft" />
              <input
                ref={searchRef}
                id={searchId}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try fox, castle or books"
                autoComplete="off"
                className="min-h-11 w-full rounded-md border border-ink/25 bg-white pr-3 pl-10"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={surprise}
            disabled={!results.length}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink px-5 font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:bg-ink/30"
          >
            <Shuffle aria-hidden size={18} /> Surprise me
          </button>
        </div>
        <FilterGroup
          label="Category"
          options={categoryOptions.map((id) => ({ value: id, label: categories[id] }))}
          value={category}
          onChange={(value) => update({ category: value })}
        />
        <FilterGroup
          label="Difficulty"
          options={levelOptions.map((id) => ({ value: id, label: levelLabels[id] }))}
          value={level}
          onChange={(value) => update({ level: value })}
        />
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-4">
          <p className="text-sm text-ink-soft">
            {results.length} of {coloringSheets.length} drawings{filtered ? ' match' : ''}. Surprise me picks one of them.
          </p>
          {filtered && (
            <button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 font-medium underline underline-offset-4">
              <X aria-hidden size={16} /> Reset filters
            </button>
          )}
        </div>
      </div>
      <p aria-live="polite" className="sr-only">
        {count}
      </p>

      {results.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-ink/20 p-8 text-center">
          <p className="text-lg font-semibold">No drawings match these filters.</p>
          <p className="mt-2 text-ink-soft">Try a different word, or show every drawing again.</p>
          <button type="button" onClick={reset} className="mt-5 min-h-11 rounded-md bg-ink px-5 font-medium text-white hover:bg-black">
            Reset filters
          </button>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {results.map((sheet) => {
            const progress = saved.get(sheet.id)
            return (
              <li key={sheet.id} className="flex flex-col rounded-lg border border-ink/12 bg-white">
                <div className="relative border-b border-ink/10 p-4">
                  <img
                    src={progress?.thumbUrl ?? sheet.thumb}
                    alt={progress?.thumbUrl ? `Your coloring so far: ${sheet.title}` : `Uncolored drawing: ${sheet.title}`}
                    width={480}
                    height={600}
                    className="mx-auto aspect-[4/5] h-auto w-full max-w-[18rem] object-contain"
                  />
                  {progress && (
                    <span className="absolute top-3 left-3 rounded-md bg-ink px-2.5 py-1 text-sm font-semibold text-white">In progress</span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-xl font-semibold">{sheet.title}</h3>
                    <span className="rounded-md border border-ink/20 px-2.5 py-0.5 text-sm font-semibold">
                      <span className="sr-only">Difficulty: </span>
                      {levelLabels[sheet.level]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-ink-soft">{categories[sheet.category]}</p>
                  <p className="mt-2 flex-1 text-ink-soft">{sheet.description}</p>
                  <ButtonLink href={`/coloring-studio?sheet=${sheet.id}`} variant={progress ? 'primary' : 'dark'} className="mt-5 self-start">
                    {progress ? 'Continue coloring' : 'Start coloring'}
                    <span className="sr-only">: {sheet.title}</span>
                  </ButtonLink>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {(saved.size > 0 || clearResult) && (
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-6">
          <p className="text-ink-soft">
            {saved.size > 0
              ? `Coloring in progress is saved in this browser on this device (${saved.size} ${saved.size === 1 ? 'drawing' : 'drawings'}).`
              : clearResult?.text}
          </p>
          {saved.size > 0 && (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-brand-red/60 px-4 font-medium text-brand-red-dark hover:border-brand-red-dark"
            >
              <Trash2 aria-hidden size={18} /> Clear all saved coloring
            </button>
          )}
          {clearResult && !clearResult.ok && (
            <p role="alert" className="basis-full font-semibold text-brand-red-dark">
              {clearResult.text}
            </p>
          )}
        </div>
      )}

      <ConfirmDialog
        open={confirmClear}
        title="Clear all saved coloring?"
        message={`This removes the saved coloring for ${saved.size === 1 ? 'the drawing' : `all ${saved.size} drawings`} in progress in this browser. This can’t be undone.`}
        confirmLabel="Clear everything"
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => void clearAll()}
      />
    </Container>
  )
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { value: string; label: string }[]
  value: string | null
  onChange: (value: string | null) => void
}) {
  const id = useId()
  const chip = (active: boolean) =>
    `min-h-11 rounded-md border px-4 font-medium ${active ? 'border-ink bg-sun text-ink' : 'border-ink/20 bg-white hover:border-ink'}`
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <span id={id} className="w-24 shrink-0 font-medium">
        {label}
      </span>
      <div role="group" aria-labelledby={id} className="flex flex-wrap gap-2">
        <button type="button" aria-pressed={value === null} onClick={() => onChange(null)} className={chip(value === null)}>
          All
        </button>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(value === option.value ? null : option.value)}
            className={chip(value === option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
