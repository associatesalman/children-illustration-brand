import { AlertTriangle, Check, ChevronDown, Download, FileImage, Loader2, Printer } from 'lucide-react'
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { busyText, type Job, type Output } from './useOutput'

/** "Save & Print": a menu button with Download PNG, Print My Coloring and Print Blank Sheet. */
export function SaveMenu({ output }: { output: Output }) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const id = useId()
  const busy = output.status.state === 'busy'

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false)
    if (returnFocus) buttonRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return
    menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
    const onPointer = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) close(false)
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [open, close])

  const choose = (job: Job) => {
    close(true)
    void output.run(job)
  }

  const onMenuKey = (event: KeyboardEvent) => {
    const items = [...(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])]
    const index = items.indexOf(document.activeElement as HTMLElement)
    let next = -1
    if (event.key === 'ArrowDown') next = (index + 1) % items.length
    else if (event.key === 'ArrowUp') next = (index - 1 + items.length) % items.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = items.length - 1
    else if (event.key === 'Escape') {
      event.preventDefault()
      close(true)
      return
    } else if (event.key === 'Tab') {
      close(false)
      return
    } else return
    event.preventDefault()
    items[next]?.focus()
  }

  const item = (job: Job, icon: ReactNode, label: string, hint: string) => (
    <button
      type="button"
      role="menuitem"
      onClick={() => choose(job)}
      className="flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left hover:bg-paper focus-visible:bg-paper"
    >
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span>
        <span className="block font-medium">{label}</span>
        <span className="block text-sm text-ink-soft">{hint}</span>
      </span>
    </button>
  )

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `${id}-menu` : undefined}
        // Not disabled while busy: disabling a focused button would drop keyboard focus. Repeat requests are ignored.
        aria-busy={busy}
        onClick={() => !busy && setOpen((o) => !o)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' && !open) {
            event.preventDefault()
            setOpen(true)
          }
        }}
        className="inline-flex min-h-11 items-center gap-2 rounded-md bg-ink px-3 text-sm font-medium text-white hover:bg-black aria-busy:cursor-wait aria-busy:bg-ink/70 sm:px-4 sm:text-base"
      >
        {busy ? <Loader2 aria-hidden size={18} className="motion-safe:animate-spin" /> : <Download aria-hidden size={18} />}
        Save &amp; Print
        <ChevronDown aria-hidden size={16} />
      </button>
      {open && (
        <div
          ref={menuRef}
          id={`${id}-menu`}
          role="menu"
          aria-label="Save and print"
          onKeyDown={onMenuKey}
          data-lenis-prevent
          className="absolute left-0 z-30 mt-2 w-[min(19rem,calc(100vw-2.5rem))] lg:right-0 lg:left-auto rounded-lg border border-ink/15 bg-white p-1.5 shadow-sm"
        >
          {item('png', <Download aria-hidden size={20} />, 'Download PNG', 'The whole sheet, about 4096 px tall')}
          {item('print', <Printer aria-hidden size={20} />, 'Print My Coloring', 'Your colors on one page')}
          {item('blank', <FileImage aria-hidden size={20} />, 'Print Blank Sheet', 'Just the outlines, to color by hand')}
        </div>
      )}
    </div>
  )
}

/** Progress and results for downloads and printing, shown under the editor's actions. */
export function OutputMessage({ output }: { output: Output }) {
  const { status } = output
  if (status.state === 'idle') return null
  const tone = status.state === 'error' ? 'border-brand-red' : 'border-ink/15'
  return (
    <div className={`mb-4 flex items-start gap-2 rounded-lg border-2 bg-white p-3 ${tone}`}>
      {status.state === 'busy' && <Loader2 aria-hidden size={20} className="mt-0.5 shrink-0 motion-safe:animate-spin" />}
      {status.state === 'done' && <Check aria-hidden size={20} className="mt-0.5 shrink-0" />}
      {status.state === 'error' && <AlertTriangle aria-hidden size={20} className="mt-0.5 shrink-0 text-brand-red-dark" />}
      <p className="flex-1">{status.state === 'busy' ? busyText[status.job] : status.text}</p>
      {status.state !== 'busy' && (
        <button type="button" onClick={output.dismiss} className="min-h-11 shrink-0 rounded-md px-3 font-medium underline underline-offset-4 sm:min-h-0 sm:py-1">
          Dismiss
        </button>
      )}
    </div>
  )
}
