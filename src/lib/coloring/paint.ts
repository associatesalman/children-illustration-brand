import type { RegionGeometry } from './geometry'
import type { Stroke } from './types'

/**
 * Draws brush and eraser strokes onto a canvas at any resolution ("level" = canvas pixels per artwork unit). The
 * same code draws the screen, exports, thumbnails and print images, so they always match.
 *
 * Paint sits on its own canvas between the region colors and the line art: eraser strokes remove paint with
 * destination-out and can never touch the fills or the outlines. Strokes are drawn on a scratch canvas when they
 * need extra steps (the crayon's paper grain, or being kept inside a region), then composited.
 *
 * Brushes:
 *  - marker: a smooth, solid, round-ended line.
 *  - crayon: the same line with a paper-grain texture cut out of it. The grain is one fixed texture anchored to the
 *    drawing's coordinates and shifted by the stroke's saved seed, so a stroke looks identical every time it's drawn.
 *  - airbrush: soft round sprays placed along the stroke. A spray is added for every bit of distance moved and for
 *    every bit of time spent (from the stroke's saved timings), so paint builds up the same way on any device.
 *
 * Mirror drawing paints several transformed copies of the same stroke, each kept inside its own region.
 */

type Mask = { canvas: HTMLCanvasElement; x: number; y: number; pixels: number }
type Rect = { x: number; y: number; w: number; h: number }
type Map2 = (x: number, y: number) => [number, number]

const newCanvas = (w = 1, h = 1) => {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  return canvas
}

/** Releases a canvas's memory right away (Safari keeps it until garbage collection otherwise). */
export const freeCanvas = (canvas: HTMLCanvasElement) => {
  canvas.width = 0
  canvas.height = 0
}

// ------------------------------------------------------------------ mirror copies

export const MIRROR_WAYS = [2, 4, 6, 8, 12, 16]

/** Where point (x, y) lands in mirror copy k: a reflection for 2 ways, otherwise a rotation about the page centre. */
export function mirrorMap(k: number, ways: number, artWidth: number, artHeight: number): Map2 {
  if (k === 0) return (x, y) => [x, y]
  if (ways === 2) return (x, y) => [artWidth - x, y]
  const angle = (k * Math.PI * 2) / ways
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const cx = artWidth / 2
  const cy = artHeight / 2
  return (x, y) => [cx + (x - cx) * cos - (y - cy) * sin, cy + (x - cx) * sin + (y - cy) * cos]
}

export type StrokeStyle = Pick<Stroke, 'tool' | 'color' | 'size' | 'region' | 'seed' | 'flow' | 'mirror'>

type Copy = { k: number; region: string | null; map: Map2 }

// ------------------------------------------------------------------ path pieces (marker, crayon, eraser)

const mid = (pts: number[], a: number, b: number): [number, number] => [(pts[a * 2] + pts[b * 2]) / 2, (pts[a * 2 + 1] + pts[b * 2 + 1]) / 2]

/**
 * A smooth path through the points (quadratic curves through the midpoints), in canvas pixels. Built from
 * "pieces" so a live stroke can be drawn a little at a time and still match the finished stroke: piece i (i >= 1)
 * runs from the midpoint before point i-1 to the midpoint between i-1 and i, curving through point i-1; the tail
 * runs from the last midpoint to the last point.
 */
function buildPath(pts: number[], level: number, first: number, last: number, tail: boolean): Path2D {
  const n = pts.length / 2
  const path = new Path2D()
  const at = (x: number, y: number): [number, number] => [x * level, y * level]
  let started = false
  const start = (x: number, y: number) => {
    if (!started) path.moveTo(...at(x, y))
    started = true
  }
  for (let i = Math.max(1, first); i <= last && i < n; i++) {
    if (i === 1) {
      start(pts[0], pts[1])
      path.lineTo(...at(...mid(pts, 0, 1)))
    } else {
      start(...mid(pts, i - 2, i - 1))
      const [mx, my] = mid(pts, i - 1, i)
      path.quadraticCurveTo(pts[(i - 1) * 2] * level, pts[(i - 1) * 2 + 1] * level, mx * level, my * level)
    }
  }
  if (tail && n >= 2) {
    start(...mid(pts, n - 2, n - 1))
    path.lineTo(pts[(n - 1) * 2] * level, pts[(n - 1) * 2 + 1] * level)
  }
  return path
}

/** Canvas-pixel bounds of the points with a margin, or null if empty or off the canvas. */
function bounds(pts: ArrayLike<number>, radius: number, level: number, cw: number, ch: number): Rect | null {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (let i = 0; i < pts.length; i += 2) {
    minX = Math.min(minX, pts[i])
    maxX = Math.max(maxX, pts[i])
    minY = Math.min(minY, pts[i + 1])
    maxY = Math.max(maxY, pts[i + 1])
  }
  const x = Math.max(0, Math.floor((minX - radius) * level) - 2)
  const y = Math.max(0, Math.floor((minY - radius) * level) - 2)
  const x2 = Math.min(cw, Math.ceil((maxX + radius) * level) + 2)
  const y2 = Math.min(ch, Math.ceil((maxY + radius) * level) + 2)
  return x2 > x && y2 > y ? { x, y, w: x2 - x, h: y2 - y } : null
}

const intersect = (a: Rect, b: Rect): Rect | null => {
  const x = Math.max(a.x, b.x)
  const y = Math.max(a.y, b.y)
  const x2 = Math.min(a.x + a.w, b.x + b.w)
  const y2 = Math.min(a.y + a.h, b.y + b.h)
  return x2 > x && y2 > y ? { x, y, w: x2 - x, h: y2 - y } : null
}

const mapPoints = (pts: number[], from: number, to: number, map: Map2) => {
  const out = new Array<number>((to - from) * 2)
  for (let i = from; i < to; i++) {
    const [x, y] = map(pts[i * 2], pts[i * 2 + 1])
    out[(i - from) * 2] = x
    out[(i - from) * 2 + 1] = y
  }
  return out
}

// ------------------------------------------------------------------ airbrush sprays

/** Sprays per millisecond while the airbrush is held still. */
const SPRAY_RATE = 0.05
const MAX_SPRAYS = 60_000
export const sprayAlpha = (flow: number) => 0.03 + flow * 0.12
const spraySpacing = (size: number) => Math.max(0.75, size * 0.1)

/**
 * Turns airbrush points and timings into spray positions. Points are added one at a time while drawing and all at
 * once when redrawing, with the same result: a spray every `spacing` units travelled and every 1/SPRAY_RATE ms.
 */
export class SprayTrack {
  readonly sprays: number[] = []
  private u = 0
  private px = 0
  private py = 0
  private pt = 0
  private started = false
  private readonly spacing: number

  constructor(size: number) {
    this.spacing = spraySpacing(size)
  }

  add(x: number, y: number, t: number) {
    if (!this.started) {
      this.started = true
      this.px = x
      this.py = y
      this.pt = t
      this.sprays.push(x, y)
      return
    }
    const du = Math.hypot(x - this.px, y - this.py) / this.spacing + Math.min(1000, Math.max(0, t - this.pt)) * SPRAY_RATE
    if (du > 0) {
      const total = this.u + du
      const count = Math.min(Math.floor(total), 4000)
      for (let j = 1; j <= count && this.sprays.length < MAX_SPRAYS * 2; j++) {
        const s = (j - this.u) / du
        this.sprays.push(this.px + (x - this.px) * s, this.py + (y - this.py) * s)
      }
      this.u = total - Math.floor(total)
    }
    this.px = x
    this.py = y
    this.pt = t
  }

  static of(points: number[], times: number[] | undefined, size: number) {
    const track = new SprayTrack(size)
    for (let i = 0; i < points.length / 2; i++) track.add(points[i * 2], points[i * 2 + 1], times?.[i] ?? 0)
    return track
  }
}

// ------------------------------------------------------------------ crayon grain

/** Grain texture resolution: tile pixels per artwork unit. The tile covers TILE / GRAIN_RES artwork units. */
const GRAIN_RES = 1
const TILE = 256
let grainTile: HTMLCanvasElement | null = null

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * A seamless paper-grain tile: black where wax is missing (holes), transparent where it isn't. Always built from the
 * same seed, so it is identical in every session and on every device.
 */
function grain(): HTMLCanvasElement {
  if (grainTile) return grainTile
  const random = mulberry32(0x6b6c7574)
  const lattice = (cells: number) => Float32Array.from({ length: cells * cells }, random)
  const octaves = [
    { cells: 64, weight: 0.45, data: lattice(64) },
    { cells: 128, weight: 0.3, data: lattice(128) },
  ]
  const canvas = newCanvas(TILE, TILE)
  const ctx = canvas.getContext('2d')!
  const image = ctx.createImageData(TILE, TILE)
  for (let y = 0; y < TILE; y++) {
    for (let x = 0; x < TILE; x++) {
      let v = 0
      for (const o of octaves) {
        const fx = (x / TILE) * o.cells
        const fy = (y / TILE) * o.cells
        const x0 = Math.floor(fx)
        const y0 = Math.floor(fy)
        const tx = fx - x0
        const ty = fy - y0
        const at = (ix: number, iy: number) => o.data[(iy % o.cells) * o.cells + (ix % o.cells)]
        const top = at(x0, y0) * (1 - tx) + at(x0 + 1, y0) * tx
        const bottom = at(x0, y0 + 1) * (1 - tx) + at(x0 + 1, y0 + 1) * tx
        v += (top * (1 - ty) + bottom * ty) * o.weight
      }
      v += random() * 0.25
      // Roughly a quarter of the paper shows through, with soft but short transitions.
      const hole = Math.min(1, Math.max(0, (v - 0.56) / 0.1))
      image.data[(y * TILE + x) * 4 + 3] = Math.round(hole * 235)
    }
  }
  ctx.putImageData(image, 0, 0)
  grainTile = canvas
  return canvas
}

// ------------------------------------------------------------------ renderer

export class PaintRenderer {
  readonly canvas: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D
  private level = 1
  private readonly masks = new Map<string, Mask>()
  private maskPixels = 0
  private readonly maskBudget: number
  private scratch: HTMLCanvasElement | null = null
  private readonly sprites = new Map<string, HTMLCanvasElement>()
  private readonly geometry: RegionGeometry
  private readonly artWidth: number
  private readonly artHeight: number

  constructor(geometry: RegionGeometry, artWidth: number, artHeight: number, options: { canvas?: HTMLCanvasElement; maskBudget?: number } = {}) {
    this.geometry = geometry
    this.artWidth = artWidth
    this.artHeight = artHeight
    this.canvas = options.canvas ?? newCanvas()
    const ctx = this.canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas is not available')
    this.ctx = ctx
    this.maskBudget = options.maskBudget ?? 6_000_000
  }

  getLevel() {
    return this.level
  }

  /** Resizes the canvas for a new level. Returns false if the browser couldn't create a canvas that big. */
  setLevel(level: number): boolean {
    const w = Math.max(1, Math.round(this.artWidth * level))
    const h = Math.max(1, Math.round(this.artHeight * level))
    this.level = level
    this.clearMasks()
    this.clearSprites()
    this.canvas.width = w
    this.canvas.height = h
    return this.canvas.width === w && this.canvas.height === h
  }

  /** Redraws all paint from the document. */
  renderAll(strokes: readonly Stroke[]) {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.ctx.globalCompositeOperation = 'source-over'
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    for (const stroke of strokes) this.renderStroke(stroke)
  }

  /** Adds one finished stroke on top of what's drawn. */
  renderStroke(stroke: Stroke, ctx: CanvasRenderingContext2D = this.ctx) {
    if (stroke.tool === 'airbrush') {
      const sprays = SprayTrack.of(stroke.points, stroke.times, stroke.size).sprays
      this.drawSprays(ctx, stroke, sprays, 0, sprays.length / 2)
    } else {
      this.drawPieces(ctx, stroke, stroke.points, 1, Infinity, true)
    }
  }

  dispose() {
    this.clearMasks()
    this.clearSprites()
    if (this.scratch) freeCanvas(this.scratch)
    this.scratch = null
  }

  /** The copies of a stroke to paint: just the stroke itself, or its mirror copies. */
  copies(style: StrokeStyle): Copy[] {
    if (!style.mirror) return [{ k: 0, region: style.region, map: (x, y) => [x, y] }]
    const { ways, copies } = style.mirror
    return copies.map((c) => ({ k: c.k, region: c.region, map: mirrorMap(c.k, ways, this.artWidth, this.artHeight) }))
  }

  /**
   * Draws pieces first..last of a marker, crayon or eraser stroke's path (plus the tail when tail is true) onto ctx:
   * this renderer's canvas or the live overlay, which has the same size. See buildPath.
   */
  drawPieces(ctx: CanvasRenderingContext2D, style: StrokeStyle, pts: number[], first: number, last: number, tail: boolean) {
    const n = pts.length / 2
    if (!n) return
    const level = this.level
    const dot = n === 1
    if (dot && (first > 1 || !tail)) return
    const from = dot ? 0 : Math.max(0, Math.min(first, n) - 2)
    const to = tail ? n : Math.min(n, last + 1)
    for (const copy of this.copies(style)) {
      const sub = mapPoints(pts, from, to, copy.map)
      const box = bounds(sub, style.size / 2, level, this.canvas.width, this.canvas.height)
      if (!box) continue
      this.composite(ctx, style, copy.region, box, (target) => {
        target.fillStyle = style.color
        target.strokeStyle = style.color
        if (dot) {
          target.beginPath()
          target.arc(sub[0] * level, sub[1] * level, (style.size / 2) * level, 0, Math.PI * 2)
          target.fill()
          return
        }
        target.lineWidth = style.size * level
        target.lineCap = 'round'
        target.lineJoin = 'round'
        target.stroke(buildPath(sub, level, first - from, last - from, tail))
      })
    }
  }

  /**
   * Draws airbrush sprays [from, to) onto ctx, for every mirror copy. Where copies would spray the same spot (a stroke
   * crossing the mirror line or the centre), the spray is painted once, so mirroring never doubles the paint.
   */
  drawSprays(ctx: CanvasRenderingContext2D, style: StrokeStyle, sprays: number[], from: number, to: number) {
    if (to <= from) return
    const level = this.level
    const copies = this.copies(style)
    const d = style.size * level
    const sprite = this.sprite(style.color, d)
    const alpha = sprayAlpha(style.flow ?? 0.5)
    const near = (style.size * 0.25) ** 2
    const perCopy: number[][] = copies.map(() => [])
    const placed: number[] = []
    for (let i = from; i < to; i++) {
      placed.length = 0
      for (let c = 0; c < copies.length; c++) {
        const [x, y] = copies[c].map(sprays[i * 2], sprays[i * 2 + 1])
        let duplicate = false
        for (let j = 0; j < placed.length && !duplicate; j += 2) duplicate = (placed[j] - x) ** 2 + (placed[j + 1] - y) ** 2 < near
        if (duplicate) continue
        placed.push(x, y)
        perCopy[c].push(x, y)
      }
    }
    copies.forEach((copy, c) => {
      const pts = perCopy[c]
      if (!pts.length) return
      const box = bounds(pts, style.size / 2, level, this.canvas.width, this.canvas.height)
      if (!box) return
      this.composite(ctx, style, copy.region, box, (target) => {
        target.globalAlpha = alpha
        for (let i = 0; i < pts.length; i += 2) target.drawImage(sprite, pts[i] * level - d / 2, pts[i + 1] * level - d / 2, d, d)
        target.globalAlpha = 1
      })
    })
  }

  /**
   * Paints onto ctx through the steps a stroke needs. Plain marker and eraser strokes go straight onto ctx; crayon
   * strokes and strokes kept inside a region are painted on a scratch canvas first (grain cut out, region masked).
   * paint() draws in canvas pixels of the full paint canvas.
   */
  private composite(ctx: CanvasRenderingContext2D, style: StrokeStyle, region: string | null, box: Rect, paint: (target: CanvasRenderingContext2D) => void) {
    const erase = style.tool === 'eraser'
    const crayon = style.tool === 'crayon'
    if (!region && !crayon) {
      ctx.save()
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.globalCompositeOperation = erase ? 'destination-out' : 'source-over'
      paint(ctx)
      ctx.restore()
      return
    }
    let area: Rect | null = box
    const mask = region ? this.mask(region) : null
    if (region) area = mask && intersect(box, { x: mask.x, y: mask.y, w: mask.canvas.width, h: mask.canvas.height })
    if (!area) return
    const scratch = this.scratchFor(area.w, area.h)
    const s = scratch.getContext('2d')!
    s.setTransform(1, 0, 0, 1, 0, 0)
    s.globalCompositeOperation = 'source-over'
    s.globalAlpha = 1
    s.clearRect(0, 0, area.w, area.h)
    s.setTransform(1, 0, 0, 1, -area.x, -area.y)
    paint(s)
    if (crayon) {
      const pattern = s.createPattern(grain(), 'repeat')
      if (pattern) {
        const seed = style.seed ?? 0
        const ox = (seed % 997) * 0.37
        const oy = (Math.floor(seed / 997) % 991) * 0.41
        pattern.setTransform(new DOMMatrix().scale(this.level).translate(-ox, -oy).scale(1 / GRAIN_RES))
        s.globalCompositeOperation = 'destination-out'
        s.fillStyle = pattern
        s.fillRect(area.x, area.y, area.w, area.h)
      }
    }
    s.setTransform(1, 0, 0, 1, 0, 0)
    if (mask) {
      s.globalCompositeOperation = 'destination-in'
      s.drawImage(mask.canvas, mask.x - area.x, mask.y - area.y)
    }
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.globalCompositeOperation = erase ? 'destination-out' : 'source-over'
    ctx.drawImage(scratch, 0, 0, area.w, area.h, area.x, area.y, area.w, area.h)
    ctx.restore()
  }

  /** A soft round spray in one color, d canvas pixels across. Cached for the current level. */
  private sprite(color: string, d: number) {
    const size = Math.max(4, Math.ceil(d))
    const key = `${color}:${size}`
    let sprite = this.sprites.get(key)
    if (!sprite) {
      sprite = newCanvas(size, size)
      const s = sprite.getContext('2d')!
      const r = size / 2
      const gradient = s.createRadialGradient(r, r, 0, r, r, r)
      const [red, green, blue] = [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16))
      const rgba = (a: number) => `rgba(${red},${green},${blue},${a})`
      gradient.addColorStop(0, rgba(1))
      gradient.addColorStop(0.35, rgba(0.7))
      gradient.addColorStop(0.7, rgba(0.22))
      gradient.addColorStop(1, rgba(0))
      s.fillStyle = gradient
      s.fillRect(0, 0, size, size)
      this.sprites.set(key, sprite)
      if (this.sprites.size > 24) {
        const [oldKey, old] = this.sprites.entries().next().value!
        this.sprites.delete(oldKey)
        freeCanvas(old)
      }
    }
    return sprite
  }

  private scratchFor(w: number, h: number) {
    if (!this.scratch) this.scratch = newCanvas(w, h)
    if (this.scratch.width < w || this.scratch.height < h) {
      this.scratch.width = Math.max(this.scratch.width, w)
      this.scratch.height = Math.max(this.scratch.height, h)
    }
    return this.scratch
  }

  /** The visible part of a region at the current level, cropped to its bounds. Cached, least recently used first out. */
  private mask(regionId: string): Mask | null {
    const cached = this.masks.get(regionId)
    if (cached) {
      this.masks.delete(regionId)
      this.masks.set(regionId, cached)
      return cached
    }
    const shape = this.geometry.get(regionId)
    if (!shape) return null
    const level = this.level
    const page = { x: 0, y: 0, w: this.canvas.width, h: this.canvas.height }
    const area = intersect(page, {
      x: Math.floor(shape.box.x * level) - 2,
      y: Math.floor(shape.box.y * level) - 2,
      w: Math.ceil(shape.box.w * level) + 4,
      h: Math.ceil(shape.box.h * level) + 4,
    })
    if (!area) return null
    const canvas = newCanvas(area.w, area.h)
    const ctx = canvas.getContext('2d')!
    ctx.setTransform(level, 0, 0, level, -area.x, -area.y)
    ctx.fillStyle = '#000000'
    ctx.fill(shape.path, shape.rule)
    ctx.globalCompositeOperation = 'destination-out'
    for (const above of this.geometry.laterOverlapping(regionId)) ctx.fill(above.path, above.rule)
    const mask = { canvas, x: area.x, y: area.y, pixels: area.w * area.h }
    this.masks.set(regionId, mask)
    this.maskPixels += mask.pixels
    for (const [id, old] of this.masks) {
      if (this.maskPixels <= this.maskBudget || old === mask) break
      this.masks.delete(id)
      this.maskPixels -= old.pixels
      freeCanvas(old.canvas)
    }
    return mask
  }

  private clearMasks() {
    this.masks.forEach((m) => freeCanvas(m.canvas))
    this.masks.clear()
    this.maskPixels = 0
  }

  private clearSprites() {
    this.sprites.forEach(freeCanvas)
    this.sprites.clear()
  }
}
