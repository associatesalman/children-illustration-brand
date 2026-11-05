import type { Box } from './geometry'
import type { FillSpec, FillValue, PatternKind } from './types'

/**
 * Region fills as SVG paint, shared by the editor (built into the page), exports, print images, thumbnails and the
 * color picker (serialized), so every one of them draws a fill the same way.
 *
 * Solid fills are plain colors. Fades and glows are gradients across the region's bounds; patterns repeat on a grid
 * anchored to the drawing's own coordinates. All definitions are written in artwork units and mapped into the
 * region's local coordinates with the inverse of its transform, so rotated or scaled shapes still line up.
 */

const COLOR = /^#[0-9a-f]{6}$/
export const PATTERNS: PatternKind[] = ['dots', 'stripes', 'checks', 'stars', 'hearts']
export const PATTERN_MIN = 16
export const PATTERN_MAX = 120
export const FADE_ANGLES = [0, 45, 90, 135]

const isColor = (v: unknown): v is string => typeof v === 'string' && COLOR.test(v)

/** A cleaned-up copy of a saved or new fill, or null if it isn't a fill this version understands. */
export function normalizeFill(value: unknown): FillValue | null {
  if (typeof value === 'string') {
    const hex = value.toLowerCase()
    return COLOR.test(hex) ? hex : null
  }
  if (!value || typeof value !== 'object') return null
  const v = value as Record<string, unknown>
  const a = typeof v.a === 'string' ? v.a.toLowerCase() : null
  const b = typeof v.b === 'string' ? v.b.toLowerCase() : null
  if (!isColor(a) || !isColor(b)) return null
  if (v.type === 'fade' && typeof v.angle === 'number' && Number.isFinite(v.angle)) {
    return { type: 'fade', a, b, angle: ((Math.round(v.angle) % 360) + 360) % 360 }
  }
  if (v.type === 'glow') return { type: 'glow', a, b }
  if (v.type === 'pattern' && PATTERNS.includes(v.pattern as PatternKind) && typeof v.size === 'number' && Number.isFinite(v.size)) {
    const size = Math.min(PATTERN_MAX, Math.max(PATTERN_MIN, Math.round(v.size)))
    return { type: 'pattern', pattern: v.pattern as PatternKind, a, b, size }
  }
  return null
}

export const sameFill = (a: FillValue | null | undefined, b: FillValue | null | undefined) =>
  (a ?? null) === (b ?? null) || (typeof a === 'object' && typeof b === 'object' && JSON.stringify(a) === JSON.stringify(b))

/** The fill's main color: used for announcements, swatches and the region outline. */
export const mainColor = (value: FillValue) => (typeof value === 'string' ? value : value.a)

/** Plain SVG element data for a fill definition: [name, attributes, children]. Built only from validated values. */
export type DefNode = [string, Record<string, string>, DefNode[]]

export type FillTarget = {
  /** Region bounds in artwork units. */
  box: Box
  /** The region's local-to-artwork transform. */
  matrix: DOMMatrixReadOnly
}

const n = (v: number) => String(Math.round(v * 1000) / 1000)
const matrixAttr = (m: DOMMatrixReadOnly) => `matrix(${[m.a, m.b, m.c, m.d, m.e, m.f].map(n).join(' ')})`

export const fillId = (regionId: string) => `csf-${regionId}`

function star(cx: number, cy: number, outer: number, inner: number) {
  let d = ''
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? inner : outer
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    d += `${i ? 'L' : 'M'}${n(cx + Math.cos(a) * r)} ${n(cy + Math.sin(a) * r)}`
  }
  return `${d}Z`
}

function heart(cx: number, cy: number, s: number) {
  // A heart about s wide, centred on (cx, cy).
  const k = s / 2
  return (
    `M${n(cx)} ${n(cy + k * 0.85)}` +
    `C${n(cx - k * 1.1)} ${n(cy + k * 0.1)} ${n(cx - k * 1.05)} ${n(cy - k * 0.85)} ${n(cx - k * 0.5)} ${n(cy - k * 0.85)}` +
    `C${n(cx - k * 0.2)} ${n(cy - k * 0.85)} ${n(cx)} ${n(cy - k * 0.6)} ${n(cx)} ${n(cy - k * 0.38)}` +
    `C${n(cx)} ${n(cy - k * 0.6)} ${n(cx + k * 0.2)} ${n(cy - k * 0.85)} ${n(cx + k * 0.5)} ${n(cy - k * 0.85)}` +
    `C${n(cx + k * 1.05)} ${n(cy - k * 0.85)} ${n(cx + k * 1.1)} ${n(cy + k * 0.1)} ${n(cx)} ${n(cy + k * 0.85)}Z`
  )
}

function patternTile(spec: Extract<FillSpec, { type: 'pattern' }>): DefNode[] {
  const s = spec.size
  const bg: DefNode = ['rect', { x: '0', y: '0', width: n(s), height: n(s), fill: spec.b }, []]
  const a = spec.a
  switch (spec.pattern) {
    case 'dots':
      return [bg, ['circle', { cx: n(s / 2), cy: n(s / 2), r: n(s * 0.22), fill: a }, []]]
    case 'stripes':
      return [bg, ['rect', { x: '0', y: '0', width: n(s), height: n(s / 2), fill: a }, []]]
    case 'checks':
      return [
        bg,
        ['rect', { x: '0', y: '0', width: n(s / 2), height: n(s / 2), fill: a }, []],
        ['rect', { x: n(s / 2), y: n(s / 2), width: n(s / 2), height: n(s / 2), fill: a }, []],
      ]
    case 'stars':
      return [bg, ['path', { d: star(s / 2, s * 0.53, s * 0.36, s * 0.15), fill: a }, []]]
    case 'hearts':
      return [bg, ['path', { d: heart(s / 2, s / 2, s * 0.62), fill: a }, []]]
  }
}

/**
 * The SVG paint for one region: the value for its fill attribute, plus a definition to place in <defs> for styled
 * fills (referenced by id).
 */
export function fillPaint(regionId: string, value: FillValue | undefined, target: FillTarget | undefined): { fill: string; def: DefNode | null } {
  if (!value) return { fill: '#ffffff', def: null }
  if (typeof value === 'string') return { fill: value, def: null }
  if (!target) return { fill: value.a, def: null }
  const id = fillId(regionId)
  const toLocal = matrixAttr(target.matrix.inverse())
  const { x, y, w, h } = target.box
  const cx = x + w / 2
  const cy = y + h / 2
  if (value.type === 'fade') {
    const rad = (value.angle * Math.PI) / 180
    const dx = Math.cos(rad)
    const dy = Math.sin(rad)
    const half = (Math.abs(w * dx) + Math.abs(h * dy)) / 2
    return {
      fill: `url(#${id})`,
      def: [
        'linearGradient',
        { id, gradientUnits: 'userSpaceOnUse', gradientTransform: toLocal, x1: n(cx - dx * half), y1: n(cy - dy * half), x2: n(cx + dx * half), y2: n(cy + dy * half) },
        [
          ['stop', { offset: '0', 'stop-color': value.a }, []],
          ['stop', { offset: '1', 'stop-color': value.b }, []],
        ],
      ],
    }
  }
  if (value.type === 'glow') {
    return {
      fill: `url(#${id})`,
      def: [
        'radialGradient',
        { id, gradientUnits: 'userSpaceOnUse', gradientTransform: toLocal, cx: n(cx), cy: n(cy), r: n(Math.max(1, Math.hypot(w, h) / 2)) },
        [
          ['stop', { offset: '0', 'stop-color': value.a }, []],
          ['stop', { offset: '0.15', 'stop-color': value.a }, []],
          ['stop', { offset: '1', 'stop-color': value.b }, []],
        ],
      ],
    }
  }
  // Stripes run diagonally: the tile is rotated about the drawing's origin, so they still line up across regions.
  const tile = value.pattern === 'stripes' ? `${toLocal} rotate(45)` : toLocal
  return {
    fill: `url(#${id})`,
    def: ['pattern', { id, patternUnits: 'userSpaceOnUse', patternTransform: tile, x: '0', y: '0', width: n(value.size), height: n(value.size) }, patternTile(value)],
  }
}

const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function defToMarkup([name, attrs, children]: DefNode): string {
  const a = Object.entries(attrs)
    .map(([k, v]) => ` ${k}="${escape(v)}"`)
    .join('')
  return children.length ? `<${name}${a}>${children.map(defToMarkup).join('')}</${name}>` : `<${name}${a}/>`
}

const SVG_NS = 'http://www.w3.org/2000/svg'

export function defToElement([name, attrs, children]: DefNode): SVGElement {
  const el = document.createElementNS(SVG_NS, name)
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
  for (const child of children) el.append(defToElement(child))
  return el
}
