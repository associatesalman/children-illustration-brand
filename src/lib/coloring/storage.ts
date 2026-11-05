import type { ColoringDocument, SaveStatus, StorageFailure } from './types'

/**
 * Local-only saving with IndexedDB, kept on the visitor's device. Nothing is sent anywhere.
 *
 *  - "sheets": one record per sheet with its editable artwork (fills and strokes as vector data).
 *  - "thumbs": a small colored preview per sheet for the library (added in database version 2).
 *  - "backups": untouched copies of saved records that couldn't be fully restored (damaged data, or coloring made
 *    on an older version of a drawing), written before anything replaces them (added in database version 3).
 *
 * Records written by the first version of the studio have no `format` and a document with fills only; they are
 * read as-is and upgraded in memory (see session.ts), then written in the new format with the next change. Saved
 * coloring is never deleted to make room: if storage is full the visitor is told and can decide what to do.
 */
const DB_NAME = 'klutz-coloring'
const DB_VERSION = 3
const SHEETS = 'sheets'
const THUMBS = 'thumbs'
const BACKUPS = 'backups'

/** 3: styled fills and crayon, airbrush and mirror strokes. 2: marker and eraser strokes. Missing: solid fills only. */
export const SAVE_FORMAT = 3

export type SavedSheet = {
  sheetId: string
  /** Artwork version the coloring was made on, so a later artwork update can be matched up safely. */
  artworkVersion: number
  /** See SAVE_FORMAT; missing on records from the first version (fills only). */
  format?: number
  /** Unknown shape until validated: older or damaged records are checked when loaded. */
  document: Partial<ColoringDocument> & Record<string, unknown>
  updatedAt: number
}

export type SavedThumb = { sheetId: string; blob: Blob; updatedAt: number }

export class StorageError extends Error {
  reason: StorageFailure
  constructor(reason: StorageFailure, message: string) {
    super(message)
    this.reason = reason
  }
}

let dbPromise: Promise<IDBDatabase> | null = null

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise
  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new StorageError('unavailable', 'IndexedDB is not available'))
      return
    }
    let request: IDBOpenDBRequest
    try {
      request = indexedDB.open(DB_NAME, DB_VERSION)
    } catch {
      reject(new StorageError('unavailable', 'IndexedDB could not be opened'))
      return
    }
    // Upgrading only ever adds stores; existing saved coloring is left untouched.
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(SHEETS)) db.createObjectStore(SHEETS, { keyPath: 'sheetId' })
      if (!db.objectStoreNames.contains(THUMBS)) db.createObjectStore(THUMBS, { keyPath: 'sheetId' })
      if (!db.objectStoreNames.contains(BACKUPS)) db.createObjectStore(BACKUPS, { keyPath: 'key' })
    }
    request.onsuccess = () => {
      const db = request.result
      db.onversionchange = () => {
        db.close()
        dbPromise = null
      }
      resolve(db)
    }
    request.onerror = () => reject(new StorageError('unavailable', request.error?.message ?? 'IndexedDB open failed'))
    // "blocked" means another tab still has an older version open; it closes on versionchange, then this request succeeds.
  })
  dbPromise.catch(() => {
    dbPromise = null
  })
  return dbPromise
}

export const toStorageError = (error: unknown) => {
  if (error instanceof StorageError) return error
  const name = error instanceof DOMException ? error.name : ''
  if (name === 'QuotaExceededError') return new StorageError('full', 'Storage is full')
  if (name === 'InvalidStateError' || name === 'SecurityError') return new StorageError('unavailable', name)
  return new StorageError('failed', error instanceof Error ? error.message : String(error))
}

async function run<T>(stores: string[], mode: IDBTransactionMode, work: (tx: IDBTransaction) => IDBRequest<T> | void): Promise<T> {
  const db = await openDb()
  return new Promise<T>((resolve, reject) => {
    let request: IDBRequest<T> | void
    let tx: IDBTransaction
    try {
      tx = db.transaction(stores, mode)
      request = work(tx)
    } catch (error) {
      reject(toStorageError(error))
      return
    }
    // Resolve only once the transaction has committed, so "Saved" is never shown early.
    tx.oncomplete = () => resolve(request ? request.result : (undefined as T))
    tx.onabort = () => reject(toStorageError(tx.error ?? (request ? request.error : null)))
    tx.onerror = () => reject(toStorageError(tx.error ?? (request ? request.error : null)))
  })
}

export async function loadSaved(sheetId: string): Promise<SavedSheet | undefined> {
  return run([SHEETS], 'readonly', (tx) => tx.objectStore(SHEETS).get(sheetId) as IDBRequest<SavedSheet | undefined>)
}

export type SavedSummary = { sheetId: string; updatedAt: number; thumb?: Blob }

/** Sheets with saved coloring, with their thumbnails, for the library. Empty if storage can't be read. */
export async function listSaved(): Promise<SavedSummary[]> {
  try {
    const [records, thumbs] = await Promise.all([
      run([SHEETS], 'readonly', (tx) => tx.objectStore(SHEETS).getAll() as IDBRequest<SavedSheet[]>),
      run([THUMBS], 'readonly', (tx) => tx.objectStore(THUMBS).getAll() as IDBRequest<SavedThumb[]>),
    ])
    const thumbById = new Map(thumbs.map((t) => [t.sheetId, t]))
    return records
      .filter((r) => hasContent(r.document))
      .map((r) => {
        const thumb = thumbById.get(r.sheetId)
        // A thumbnail older than the artwork it shows is stale (e.g. its last write failed): don't show it.
        return { sheetId: r.sheetId, updatedAt: r.updatedAt, thumb: thumb && thumb.updatedAt >= r.updatedAt - 5000 ? thumb.blob : undefined }
      })
  } catch {
    return []
  }
}

export const hasContent = (doc: Partial<ColoringDocument> | undefined) =>
  !!doc && ((doc.fills && Object.keys(doc.fills).length > 0) || (Array.isArray(doc.strokes) && doc.strokes.length > 0))

const writeSaved = (record: SavedSheet) => run([SHEETS], 'readwrite', (tx) => void tx.objectStore(SHEETS).put(record))

const deleteSaved = (sheetId: string) =>
  run([SHEETS, THUMBS], 'readwrite', (tx) => {
    tx.objectStore(SHEETS).delete(sheetId)
    tx.objectStore(THUMBS).delete(sheetId)
  })

/** Thumbnails are a convenience: a failed write is reported to the caller but never counts as unsaved artwork. */
export const writeThumb = (sheetId: string, blob: Blob) =>
  run([THUMBS], 'readwrite', (tx) => void tx.objectStore(THUMBS).put({ sheetId, blob, updatedAt: Date.now() } satisfies SavedThumb))

/** Keeps an untouched copy of a saved record before it is replaced. One copy per record version. */
export const writeBackup = (record: SavedSheet) =>
  run([BACKUPS], 'readwrite', (tx) => void tx.objectStore(BACKUPS).put({ key: `${record.sheetId}@${record.updatedAt}`, savedAt: Date.now(), record }))

/** Removes every sheet's saved coloring, thumbnail and backup from this device. */
export async function clearAllStorage(): Promise<void> {
  await run([SHEETS, THUMBS, BACKUPS], 'readwrite', (tx) => {
    tx.objectStore(SHEETS).clear()
    tx.objectStore(THUMBS).clear()
    tx.objectStore(BACKUPS).clear()
  })
}

/**
 * Serialized saving for one sheet: writes run one at a time and only the newest pending state is written next, so
 * an older save can never land after a newer one. Status changes are reported for the save indicator.
 */
export class SaveQueue {
  private pending: SavedSheet | null = null
  private last: SavedSheet | null = null
  private running: Promise<void> | null = null
  private blocked = false
  private listeners = new Set<(status: SaveStatus) => void>()
  status: SaveStatus = { state: 'idle' }
  private readonly sheetId: string
  private onWritten: (() => void) | null = null

  constructor(sheetId: string) {
    this.sheetId = sheetId
  }

  /** For useSyncExternalStore. */
  subscribe = (listener: (status: SaveStatus) => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  getStatus = () => this.status

  /** Called after each successful write of a non-empty sheet (used to refresh the thumbnail). */
  setOnWritten(callback: (() => void) | null) {
    this.onWritten = callback
  }

  setStatus(status: SaveStatus) {
    this.status = status
    this.listeners.forEach((listener) => listener(status))
  }

  /** Saved coloring couldn't be read: write nothing, so it isn't replaced, until the sheet is reopened. */
  block() {
    this.blocked = true
    this.setStatus({ state: 'blocked' })
  }

  /** Storage was cleared, so there's nothing left to protect: saving can resume. */
  unblock() {
    this.blocked = false
    this.setStatus({ state: 'idle' })
  }

  save(record: SavedSheet) {
    this.last = record
    if (this.blocked) return
    this.pending = record
    if (!this.running) this.running = this.flush()
  }

  /** Writes the latest state again after a failure. */
  retry() {
    if (this.last && !this.blocked) this.save(this.last)
  }

  /** Drops anything not yet written and waits for the write in progress, e.g. before clearing all storage. */
  async settle() {
    this.pending = null
    this.last = null
    await this.running
  }

  private async flush() {
    while (this.pending) {
      const record = this.pending
      this.pending = null
      this.setStatus({ state: 'saving' })
      try {
        // An empty sheet needs no record: delete it so "In progress" disappears after starting over.
        const empty = !hasContent(record.document)
        if (empty) await deleteSaved(this.sheetId)
        else await writeSaved(record)
        if (!this.pending) {
          this.setStatus({ state: 'saved' })
          if (!empty) this.onWritten?.()
        }
      } catch (error) {
        if (!this.pending) this.setStatus({ state: 'error', reason: toStorageError(error).reason })
      }
    }
    this.running = null
  }
}
