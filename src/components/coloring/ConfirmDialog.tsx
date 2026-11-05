import { useEffect, useId, useRef } from 'react'

type Props = {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Native modal dialog: traps focus, closes on Escape, and returns focus to the control that opened it (or, if that
 * control is gone, leaves it to the caller).
 */
export function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onCancel }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const id = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      dialog.showModal()
      cancelRef.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
      const target = opener.current
      opener.current = null
      if (target?.isConnected && !(target as HTMLButtonElement).disabled) target.focus()
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-message`}
      onCancel={(event) => {
        event.preventDefault()
        onCancel()
      }}
      className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-lg border border-ink/15 bg-white p-6 text-ink backdrop:bg-ink/40"
      data-lenis-prevent
    >
      <h2 id={`${id}-title`} className="text-xl font-semibold">
        {title}
      </h2>
      <p id={`${id}-message`} className="mt-3 text-ink-soft">
        {message}
      </p>
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button ref={cancelRef} type="button" onClick={onCancel} className="min-h-11 rounded-md border border-ink/25 px-5 font-medium hover:border-ink">
          Cancel
        </button>
        <button type="button" onClick={onConfirm} className="min-h-11 rounded-md bg-brand-red px-5 font-medium text-white hover:bg-brand-red-dark">
          {confirmLabel}
        </button>
      </div>
    </dialog>
  )
}
