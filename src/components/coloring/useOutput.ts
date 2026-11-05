import { useCallback, useRef, useState } from 'react'
import type { ComposeInput } from '../../lib/coloring/compose'
import { downloadPng, printSheet } from '../../lib/coloring/output'

export type Job = 'png' | 'print' | 'blank'

export type OutputState =
  | { state: 'idle' }
  | { state: 'busy'; job: Job }
  | { state: 'done'; text: string }
  | { state: 'error'; text: string }

export const busyText: Record<Job, string> = {
  png: 'Preparing your PNG…',
  print: 'Preparing your coloring for printing…',
  blank: 'Preparing the blank sheet for printing…',
}

/** Download and print actions with their progress and error messages. */
export function useOutput(getInput: () => ComposeInput | null, announce: (text: string) => void) {
  const [status, setStatus] = useState<OutputState>({ state: 'idle' })
  const busy = useRef(false)

  const run = useCallback(
    async (job: Job) => {
      const input = getInput()
      if (!input || busy.current) return
      busy.current = true
      setStatus({ state: 'busy', job })
      announce(busyText[job])
      try {
        if (job === 'png') {
          const result = await downloadPng(input)
          const text = `Your PNG is ready: ${result.filename} (${result.width} × ${result.height} pixels)${
            result.reduced ? ', a little smaller than usual because of this device’s limits' : ''
          }. Check your downloads.`
          setStatus({ state: 'done', text })
          announce(text)
        } else {
          await printSheet(input, job === 'blank')
          setStatus({ state: 'idle' })
        }
      } catch {
        const text =
          job === 'png'
            ? 'The PNG couldn’t be created on this device. Your coloring is safe. Please try again, or try another browser.'
            : 'The print image couldn’t be prepared. Your coloring is safe. Please try again.'
        setStatus({ state: 'error', text })
        announce(text)
      } finally {
        busy.current = false
      }
    },
    [getInput, announce],
  )

  return { status, run, dismiss: () => setStatus({ state: 'idle' }) }
}

export type Output = ReturnType<typeof useOutput>
