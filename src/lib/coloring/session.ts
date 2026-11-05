import { normalizeFill, sameFill } from './fills'
import { MIRROR_WAYS } from './paint'
import { clearAllStorage, hasContent, loadSaved, SAVE_FORMAT, SaveQueue, StorageError, writeBackup, type SavedSheet } from './storage'
import type { ColoringDocument, Command, Fills, FillValue, SheetData, Stroke } from './types'

/**
 * Undo steps kept per sheet. Only how far back undo goes is limited: the artwork itself (every fill and stroke) is
 * always kept in full, and exports redraw it from that data.
 */
export const HISTORY_LIMIT = 100

/** Brush sizes, in artwork units (sheets are 1200 x 1500). */
export const MIN_SIZE = 4
export const MAX_SIZE = 120

const COLOR = /^#[0-9a-f]{6}$/i
const MAX_POINTS = 20_000

export type SessionSnapshot = {
  canUndo: boolean
  canRedo: boolean
  filledCount: number
  strokeCount: number
  isEmpty: boolean
}

/** What changed, so the drawing updates only what's needed. */
export type Change =
  | { regions: string[] }
  /** A stroke was added on top of the paint. */
  | { stroke: Stroke }
  /** The paint must be redrawn from the document (a stroke was undone). */
  | { paint: true }
  /** Everything changed (start over, or clearing all saved coloring). */
  | { all: true }

const EMPTY: ColoringDocument = { fills: {}, strokes: [] }

let strokeCounter = 0
export const newStrokeId = () => `s${Date.now().toString(36)}${(strokeCounter++).toString(36)}${Math.random().toString(36).slice(2, 6)}`

/**
 * One sheet being colored: its document, undo/redo history and saving. Kept for the whole visit, so returning to
 * a sheet keeps its history; after a refresh the artwork comes back from the device but the history starts fresh.
 */
export class ColoringSession {
  readonly sheet: SheetData
  readonly saves: SaveQueue
  private doc: ColoringDocument
  private undoStack: Command[] = []
  private redoStack: Command[] = []
  private stateListeners = new Set<() => void>()
  private changeListeners = new Set<(change: Change) => void>()
  private readonly regionIds: Set<string>
  snapshot: SessionSnapshot

  constructor(sheet: SheetData, doc: ColoringDocument, saves: SaveQueue) {
    this.sheet = sheet
    this.doc = doc
    this.saves = saves
    this.regionIds = new Set(sheet.regions.map((r) => r.id))
    this.snapshot = this.makeSnapshot()
  }

  get fills(): Readonly<Fills> {
    return this.doc.fills
  }

  get document(): Readonly<ColoringDocument> {
    return this.doc
  }

  hasRegion(id: string) {
    return this.regionIds.has(id)
  }

  /** For useSyncExternalStore: toolbar state (undo/redo availability, whether anything is colored). */
  subscribe = (listener: () => void) => {
    this.stateListeners.add(listener)
    return () => {
      this.stateListeners.delete(listener)
    }
  }

  getSnapshot = () => this.snapshot

  /** For the drawing: what needs repainting. */
  onChange(listener: (change: Change) => void) {
    this.changeListeners.add(listener)
    return () => {
      this.changeListeners.delete(listener)
    }
  }

  /**
   * Fills a region with a solid color or a styled fill (null clears it). Returns false when nothing changed (the
   * same fill, or an unknown region or fill).
   */
  fill(regionId: string, value: FillValue | null): boolean {
    if (!this.regionIds.has(regionId)) return false
    let normalized = value === null ? null : normalizeFill(value)
    if (value !== null && normalized === null) return false
    if (normalized === '#ffffff') normalized = null
    const before = this.doc.fills[regionId] ?? null
    if (sameFill(before, normalized)) return false
    this.record({ type: 'fill', regionId, before, after: normalized })
    return true
  }

  /** Adds a finished brush or eraser stroke as one undoable action. */
  addStroke(stroke: Stroke): boolean {
    if (!validStroke(stroke, this.regionIds)) return false
    this.record({ type: 'stroke', stroke })
    return true
  }

  /** Clears every fill and stroke on this sheet. Undoable. */
  reset(): boolean {
    if (this.snapshot.isEmpty) return false
    this.record({ type: 'reset', before: this.doc })
    return true
  }

  undo(): Command | null {
    const command = this.undoStack.pop()
    if (!command) return null
    this.redoStack.push(command)
    this.apply(command, 'undo')
    return command
  }

  redo(): Command | null {
    const command = this.redoStack.pop()
    if (!command) return null
    this.undoStack.push(command)
    this.apply(command, 'redo')
    return command
  }

  /** After all saved coloring was removed from the device: start this sheet blank, with no history to undo into. */
  discardAll() {
    this.doc = EMPTY
    this.undoStack = []
    this.redoStack = []
    this.saves.unblock()
    this.notify({ all: true })
  }

  /** Saves the current state again (after a failed clear-all left it unsaved). */
  resave() {
    this.saves.save(this.record_())
  }

  private record(command: Command) {
    this.undoStack.push(command)
    if (this.undoStack.length > HISTORY_LIMIT) this.undoStack.shift()
    this.redoStack = [] // a new action clears redo
    this.apply(command, 'redo')
  }

  private apply(command: Command, direction: 'undo' | 'redo') {
    let change: Change
    if (command.type === 'fill') {
      const color = direction === 'redo' ? command.after : command.before
      const fills = { ...this.doc.fills }
      if (color) fills[command.regionId] = color
      else delete fills[command.regionId]
      this.doc = { ...this.doc, fills }
      change = { regions: [command.regionId] }
    } else if (command.type === 'stroke') {
      if (direction === 'redo') {
        this.doc = { ...this.doc, strokes: [...this.doc.strokes, command.stroke] }
        change = { stroke: command.stroke }
      } else {
        // With linear history the stroke being undone is always the last one.
        this.doc = { ...this.doc, strokes: this.doc.strokes.filter((s) => s.id !== command.stroke.id) }
        change = { paint: true }
      }
    } else {
      this.doc = direction === 'redo' ? EMPTY : command.before
      change = { all: true }
    }
    this.notify(change)
    this.saves.save(this.record_())
  }

  private notify(change: Change) {
    this.snapshot = this.makeSnapshot()
    this.changeListeners.forEach((listener) => listener(change))
    this.stateListeners.forEach((listener) => listener())
  }

  private record_(): SavedSheet {
    return { sheetId: this.sheet.id, artworkVersion: this.sheet.version, format: SAVE_FORMAT, document: this.doc, updatedAt: Date.now() }
  }

  private makeSnapshot(): SessionSnapshot {
    const filledCount = Object.keys(this.doc.fills).length
    const strokeCount = this.doc.strokes.length
    return {
      canUndo: this.undoStack.length > 0,
      canRedo: this.redoStack.length > 0,
      filledCount,
      strokeCount,
      isEmpty: filledCount === 0 && strokeCount === 0,
    }
  }
}

const BRUSHES = new Set(['marker', 'crayon', 'airbrush', 'eraser'])
const validRegion = (r: unknown, regionIds: Set<string>) => r === null || (typeof r === 'string' && regionIds.has(r))

function validStroke(s: unknown, regionIds: Set<string>): s is Stroke {
  if (!s || typeof s !== 'object') return false
  const stroke = s as Stroke
  const n = Array.isArray(stroke.points) ? stroke.points.length / 2 : 0
  const valid =
    typeof stroke.id === 'string' &&
    BRUSHES.has(stroke.tool) &&
    typeof stroke.color === 'string' &&
    COLOR.test(stroke.color) &&
    typeof stroke.size === 'number' &&
    stroke.size >= 1 &&
    stroke.size <= MAX_SIZE * 2 &&
    validRegion(stroke.region, regionIds) &&
    n >= 1 &&
    Number.isInteger(n) &&
    n <= MAX_POINTS &&
    stroke.points.every((v) => typeof v === 'number' && Number.isFinite(v))
  if (!valid) return false
  if (stroke.seed !== undefined && !(Number.isInteger(stroke.seed) && stroke.seed >= 0)) return false
  if (stroke.flow !== undefined && !(typeof stroke.flow === 'number' && stroke.flow >= 0.05 && stroke.flow <= 1)) return false
  if (stroke.times !== undefined) {
    const t = stroke.times
    if (!Array.isArray(t) || t.length !== n || !t.every((v, i) => typeof v === 'number' && Number.isFinite(v) && v >= 0 && (i === 0 || v >= t[i - 1]))) return false
  }
  if (stroke.mirror !== undefined) {
    const m = stroke.mirror
    if (!m || !MIRROR_WAYS.includes(m.ways) || !Array.isArray(m.copies) || !m.copies.length || m.copies.length > m.ways) return false
    const seen = new Set<number>()
    for (const c of m.copies) {
      if (!c || !Number.isInteger(c.k) || c.k < 0 || c.k >= m.ways || seen.has(c.k) || !validRegion(c.region, regionIds)) return false
      seen.add(c.k)
    }
  }
  return true
}

/**
 * Turns a saved record into a document for this artwork version. Accepts every format so far: 1 (solid fills only),
 * 2 (plus marker and eraser strokes) and 3 (plus styled fills, crayon, airbrush and mirror strokes). Anything that
 * doesn't match the drawing is left out, never guessed; the original record is kept as a backup first (see
 * openSession).
 */
export function restoreDocument(saved: SavedSheet, sheet: SheetData): { doc: ColoringDocument; dropped: number } {
  const ids = new Set(sheet.regions.map((r) => r.id))
  const fills: Fills = {}
  const strokes: Stroke[] = []
  let dropped = 0
  const savedFills = saved.document?.fills
  if (savedFills && typeof savedFills === 'object') {
    for (const [id, color] of Object.entries(savedFills)) {
      const value = ids.has(id) ? normalizeFill(color) : null
      if (value) fills[id] = value
      else dropped++
    }
  }
  const savedStrokes = saved.document?.strokes
  if (Array.isArray(savedStrokes)) {
    for (const stroke of savedStrokes) {
      if (validStroke(stroke, ids)) strokes.push(stroke)
      else dropped++
    }
  }
  return { doc: { fills, strokes }, dropped }
}

const sessions = new Map<string, ColoringSession>()

export type OpenResult = {
  session: ColoringSession
  /** Shown once when saved coloring had to be adjusted to an updated drawing. */
  notice?: string
}

const loadWithRetry = async (sheetId: string) => {
  try {
    return await loadSaved(sheetId)
  } catch (error) {
    if (error instanceof StorageError && error.reason === 'unavailable') throw error
    await new Promise((resolve) => setTimeout(resolve, 300))
    return loadSaved(sheetId)
  }
}

/** Returns the sheet's session for this visit, restoring saved coloring from the device the first time. */
export async function openSession(sheet: SheetData): Promise<OpenResult> {
  const existing = sessions.get(sheet.id)
  if (existing && existing.sheet.version === sheet.version && existing.saves.status.state !== 'blocked') return { session: existing }

  const saves = new SaveQueue(sheet.id)
  let doc = EMPTY
  let notice: string | undefined
  let failure: StorageError | null = null
  try {
    const saved = await loadWithRetry(sheet.id)
    if (saved && typeof saved.format === 'number' && saved.format > SAVE_FORMAT) {
      // Saved by a newer version of the studio (another tab after an update, say): don't guess, don't overwrite.
      throw new StorageError('failed', `Saved format ${saved.format} is newer than ${SAVE_FORMAT}`)
    }
    if (saved && hasContent(saved.document)) {
      const restored = restoreDocument(saved, sheet)
      doc = restored.doc
      // Before anything is written over a record that couldn't be fully used, keep the original as it was. If that
      // copy can't be made, saving stays blocked so the record isn't replaced.
      if (restored.dropped || saved.artworkVersion !== sheet.version) await writeBackup(saved)
      if (saved.artworkVersion !== sheet.version) {
        notice = restored.dropped
          ? 'This drawing has been updated since you last colored it. Your coloring was kept wherever the shapes still match.'
          : 'This drawing has been updated since you last colored it. All your coloring was kept.'
      } else if (restored.dropped) {
        notice = 'Part of your saved coloring for this drawing couldn’t be read, so it was left out. Everything else is back, and a copy of the original was kept on this device.'
      }
    }
  } catch (error) {
    failure = error instanceof StorageError ? error : new StorageError('failed', String(error))
  }
  const session = new ColoringSession(sheet, doc, saves)
  if (failure?.reason === 'unavailable') saves.setStatus({ state: 'error', reason: 'unavailable' })
  else if (failure) saves.block() // the saved coloring may still be there: don't write a blank sheet over it
  sessions.set(sheet.id, session)
  return { session, notice }
}

/**
 * Removes all saved coloring from this device and blanks every sheet opened during this visit. Can't be undone.
 * If storage can't be cleared, nothing is blanked and each open sheet is saved again as it was.
 */
export async function clearAllSaved(): Promise<void> {
  const open = [...sessions.values()]
  await Promise.all(open.map((s) => s.saves.settle()))
  try {
    await clearAllStorage()
  } catch (error) {
    open.forEach((s) => !s.snapshot.isEmpty && s.resave())
    throw error
  }
  open.forEach((s) => s.discardAll())
}
