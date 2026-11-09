import { EXPORT_SIZES, PRINT_SIZES, renderPng, type ComposeInput } from './compose'

/** PNG downloads and printing. Both build a fresh image from the artwork data and never change the artwork. */

export const pngFilename = (sheetId: string) => `klutzbookpublishers-${sheetId}-coloring.png`

export type DownloadResult = { filename: string; width: number; height: number; reduced: boolean }

export async function downloadPng(input: ComposeInput): Promise<DownloadResult> {
  const { blob, width, height } = await renderPng(input, { sizes: EXPORT_SIZES })
  const filename = pngFilename(input.sheet.id)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.hidden = true
  document.body.append(link)
  link.click()
  link.remove()
  // Some browsers start reading the file after click() returns; give them time before releasing it.
  setTimeout(() => URL.revokeObjectURL(url), 60_000)
  return { filename, width, height, reduced: Math.max(width, height) < EXPORT_SIZES[0] }
}

const PRINT_CLASS = 'printing-coloring'

/**
 * Prints only the sheet: the image is fully prepared and decoded first, then shown in a print-only container (the
 * rest of the page is hidden by the print styles in index.css) and the print dialog opens. Resolves once the dialog
 * has closed, whether the visitor printed or cancelled.
 */
export async function printSheet(input: ComposeInput, blank: boolean): Promise<void> {
  const { blob } = await renderPng(input, { sizes: PRINT_SIZES, blank })
  const url = URL.createObjectURL(blob)
  const img = new Image()
  img.alt = ''
  img.src = url
  try {
    await img.decode()
  } catch (error) {
    URL.revokeObjectURL(url)
    throw error
  }

  let root = document.getElementById('coloring-print')
  if (!root) {
    root = document.createElement('div')
    root.id = 'coloring-print'
    root.className = 'coloring-print'
    root.setAttribute('aria-hidden', 'true')
    document.body.append(root)
  }
  root.replaceChildren(img)
  document.documentElement.classList.add(PRINT_CLASS)

  const cleanup = () => {
    document.documentElement.classList.remove(PRINT_CLASS)
    root.replaceChildren()
    URL.revokeObjectURL(url)
  }

  await new Promise<void>((resolve) => {
    let finished = false
    const done = () => {
      if (finished) return
      finished = true
      window.removeEventListener('afterprint', done)
      // Let the print dialog finish with the image before it's removed.
      setTimeout(() => {
        cleanup()
        resolve()
      }, 0)
    }
    window.addEventListener('afterprint', done)
    window.print()
    // Browsers where print() returns immediately still fire afterprint; this is only a safety net so the page is
    // never left in print mode. The image stays until then.
    setTimeout(done, 600_000)
  })
}
