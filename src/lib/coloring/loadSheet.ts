import type { SheetEntry } from '../../content/coloringSheets'
import type { ArtNode, SheetData } from './types'

const cache = new Map<string, Promise<SheetData>>()

const isNodeList = (value: unknown): value is ArtNode[] =>
  Array.isArray(value) &&
  value.every((n) => Array.isArray(n) && typeof n[0] === 'string' && typeof n[1] === 'object' && isNodeList(n[2]))

/** Fetches one sheet's full artwork, once per page load. Only the opened sheet is ever fetched. */
export function loadSheet(entry: SheetEntry): Promise<SheetData> {
  let promise = cache.get(entry.id)
  if (!promise) {
    promise = fetch(entry.dataUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`Sheet ${entry.id}: HTTP ${response.status}`)
        return response.json() as Promise<SheetData>
      })
      .then((data) => {
        const valid =
          data.id === entry.id &&
          Number.isInteger(data.version) &&
          data.width > 0 &&
          data.height > 0 &&
          Array.isArray(data.regions) &&
          isNodeList(data.regionLayer) &&
          isNodeList(data.lineLayer) &&
          isNodeList(data.highlightLayer)
        if (!valid) throw new Error(`Sheet ${entry.id}: unexpected data`)
        return data
      })
    promise.catch(() => cache.delete(entry.id)) // allow a retry after a network error
    cache.set(entry.id, promise)
  }
  return promise
}
