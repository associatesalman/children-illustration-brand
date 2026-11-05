import { FADE_ANGLES, PATTERN_MAX, PATTERN_MIN, PATTERNS } from './fills'
import type { BrushKind, FillStyle, PatternKind } from './types'

/**
 * Tool preferences kept between visits in localStorage: brush, sizes, colors, fill style and "Stay inside the lines".
 * Only settings live here; artwork is always saved in IndexedDB (see storage.ts). Anything missing or unreadable
 * falls back to the defaults, so a damaged or old value can never stop the studio from opening.
 */
export type NamedColor = { hex: string; name: string }

export type Prefs = {
  brush: BrushKind
  sizes: Record<BrushKind | 'eraser', number>
  /** Airbrush flow, 0.05 to 1. */
  flow: number
  color: NamedColor
  color2: NamedColor
  stayInside: boolean
  fillStyle: FillStyle
  fadeAngle: number
  pattern: PatternKind
  patternSize: number
  palette: string
  recent: NamedColor[]
}

export const SIZE_MIN = 4
export const SIZE_MAX = 120
export const FLOW_MIN = 0.05
export const RECENT_MAX = 10

export const DEFAULT_PREFS: Prefs = {
  brush: 'marker',
  sizes: { marker: 24, crayon: 28, airbrush: 60, eraser: 40 },
  flow: 0.4,
  color: { hex: '#ffc72c', name: 'Sunny yellow' },
  color2: { hex: '#f4862a', name: 'Orange' },
  stayInside: true,
  fillStyle: 'solid',
  fadeAngle: 90,
  pattern: 'dots',
  patternSize: 40,
  palette: 'classic',
  recent: [],
}

const KEY = 'klutz-coloring-prefs'
const COLOR = /^#[0-9a-f]{6}$/

const color = (v: unknown, fallback: NamedColor): NamedColor => {
  const c = v as NamedColor | null
  return c && typeof c === 'object' && typeof c.hex === 'string' && COLOR.test(c.hex) && typeof c.name === 'string' && c.name.length < 60
    ? { hex: c.hex, name: c.name }
    : fallback
}
const num = (v: unknown, min: number, max: number, fallback: number) => (typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback)
const oneOf = <T extends string>(v: unknown, list: readonly T[], fallback: T): T => (list.includes(v as T) ? (v as T) : fallback)

export function loadPrefs(paletteIds: readonly string[]): Prefs {
  let raw: Record<string, unknown> = {}
  try {
    const text = localStorage.getItem(KEY)
    if (text) raw = JSON.parse(text) ?? {}
  } catch {
    // Storage blocked or damaged: use the defaults.
  }
  const d = DEFAULT_PREFS
  const sizes = (raw.sizes ?? {}) as Record<string, unknown>
  const size = (k: keyof Prefs['sizes']) => Math.round(num(sizes[k], SIZE_MIN, SIZE_MAX, d.sizes[k]))
  return {
    brush: oneOf(raw.brush, ['marker', 'crayon', 'airbrush'] as const, d.brush),
    sizes: { marker: size('marker'), crayon: size('crayon'), airbrush: size('airbrush'), eraser: size('eraser') },
    flow: num(raw.flow, FLOW_MIN, 1, d.flow),
    color: color(raw.color, d.color),
    color2: color(raw.color2, d.color2),
    stayInside: typeof raw.stayInside === 'boolean' ? raw.stayInside : d.stayInside,
    fillStyle: oneOf(raw.fillStyle, ['solid', 'fade', 'glow', 'pattern'] as const, d.fillStyle),
    fadeAngle: FADE_ANGLES.includes(raw.fadeAngle as number) ? (raw.fadeAngle as number) : d.fadeAngle,
    pattern: oneOf(raw.pattern, PATTERNS, d.pattern),
    patternSize: Math.round(num(raw.patternSize, PATTERN_MIN, PATTERN_MAX, d.patternSize)),
    palette: oneOf(raw.palette, paletteIds, d.palette),
    recent: Array.isArray(raw.recent)
      ? raw.recent
          .map((c) => color(c, { hex: '', name: '' }))
          .filter((c) => c.hex)
          .slice(0, RECENT_MAX)
      : [],
  }
}

export function savePrefs(prefs: Prefs) {
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs))
  } catch {
    // Preferences are a convenience: if they can't be kept, the defaults come back next time.
  }
}

/** The color first, then earlier recent colors without it. */
export const withRecent = (recent: NamedColor[], c: NamedColor) => [c, ...recent.filter((r) => r.hex !== c.hex)].slice(0, RECENT_MAX)
