/** Coloring Studio data shapes. Sheets are produced by scripts/build_coloring_sheets.py. */

export type Level = 'easy' | 'medium' | 'detailed'

/** One SVG element as plain data: [element name, attributes, children]. Built into the page with createElementNS. */
export type ArtNode = [string, Record<string, string>, ArtNode[]]

export type RegionInfo = {
  /** Stable for a given artwork version, e.g. "leo-03". */
  id: string
  /** Part of the drawing it belongs to (key of SheetData.parts). */
  part: string
  /** Readable name for the keyboard region picker and announcements, e.g. "Sun ray 3". */
  label: string
}

export type SheetData = {
  id: string
  version: number
  title: string
  level: Level
  alt: string
  width: number
  height: number
  parts: Record<string, string>
  regions: RegionInfo[]
  /** Fillable shapes, back to front, unstroked. */
  regionLayer: ArtNode[]
  /** The finished line art, drawn over the colors with multiply blending. */
  lineLayer: ArtNode[]
  /** Small white details drawn on ink (eye shine), on top. */
  highlightLayer: ArtNode[]
}

export type PatternKind = 'dots' | 'stripes' | 'checks' | 'stars' | 'hearts'

/**
 * A styled region fill. Colors are #rrggbb. Everything needed to redraw it is stored, so undo, reload, thumbnails,
 * downloads and prints reproduce it exactly. Fades and glows follow the region's own bounds; patterns are anchored
 * to the drawing's coordinates (artwork units), so their size and position never depend on the zoom or output size.
 */
export type FillSpec =
  /** Linear blend from a to b. angle in degrees: 0 left to right, 90 top to bottom. */
  | { type: 'fade'; a: string; b: string; angle: number }
  /** Radial blend: a at the centre, b at the edges. */
  | { type: 'glow'; a: string; b: string }
  /** Motif in a on a background of b; size is one pattern tile in artwork units. */
  | { type: 'pattern'; pattern: PatternKind; a: string; b: string; size: number }

/** A solid color (#rrggbb, the only kind saved by earlier versions) or a styled fill. */
export type FillValue = string | FillSpec

export type FillStyle = 'solid' | FillSpec['type']

/** Region id to fill. Regions without an entry are white. */
export type Fills = Record<string, FillValue>

export type BrushKind = 'marker' | 'crayon' | 'airbrush'

/**
 * Mirror drawing: one gesture painted as several copies. ways 2 reflects across the page's vertical centre line;
 * higher counts are evenly spaced rotations around the page centre. copies lists the copies actually painted (k is
 * the copy number, 0 = the original) with the region each one is kept inside, or null when painting freely.
 */
export type Mirror = { ways: number; copies: { k: number; region: string | null }[] }

/**
 * One brush or eraser stroke, kept as vector data in artwork units so it can be redrawn at any size (the screen at
 * any zoom, a 4096px export, a library thumbnail). Strokes are immutable once recorded.
 */
export type Stroke = {
  id: string
  /** 'marker' and 'eraser' are the only kinds saved before the crayon and airbrush existed. */
  tool: BrushKind | 'eraser'
  /** #rrggbb; ignored for the eraser. */
  color: string
  /** Diameter in artwork units. */
  size: number
  /** Region the stroke is clipped to ("Stay inside the lines"), or null for freehand. With mirror, see Mirror. */
  region: string | null
  /** Flat [x0, y0, x1, y1, ...] in artwork units, rounded to 0.1. */
  points: number[]
  /** Crayon: offsets the paper grain, so the texture is the same every time the stroke is drawn. */
  seed?: number
  /** Airbrush: paint per spray, 0.05 to 1. */
  flow?: number
  /** Airbrush: milliseconds since the stroke started, one per point, so paint builds up the same way every time. */
  times?: number[]
  mirror?: Mirror
}

/**
 * Everything a visitor has made on one sheet: region fills, then brush paint above them (eraser strokes remove
 * brush paint only), with the line art always on top. Documents are treated as immutable: every change makes a new
 * object, so undo snapshots can share unchanged parts.
 */
export type ColoringDocument = {
  fills: Fills
  strokes: Stroke[]
}

/** Undoable editing actions. View changes (zoom, pan) and tool choices are never recorded. */
export type Command =
  | { type: 'fill'; regionId: string; before: FillValue | null; after: FillValue | null }
  | { type: 'stroke'; stroke: Stroke }
  | { type: 'reset'; before: ColoringDocument }

export type Tool = 'fill' | 'brush' | 'eraser' | 'picker' | 'move'

export type StorageFailure = 'full' | 'unavailable' | 'failed'

export type SaveStatus =
  | { state: 'idle' }
  | { state: 'saving' }
  | { state: 'saved' }
  | { state: 'error'; reason: StorageFailure }
  /** Saved coloring exists but couldn't be read, so nothing is written over it until it loads. */
  | { state: 'blocked' }
