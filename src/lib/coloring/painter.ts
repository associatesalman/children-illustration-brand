import type { RegionGeometry } from './geometry'
import { mirrorMap, PaintRenderer, SprayTrack } from './paint'
import { newStrokeId, type ColoringSession } from './session'
import type { BrushKind, Mirror, Stroke } from './types'
import type { ClientPoint, StrokeHandler, Viewport } from './viewport'

/**
 * Brush and eraser drawing, outside React: pointer points go straight from the viewport to a live canvas, drawn
 * once per animation frame. When the stroke ends it is recorded in the session as one undoable action (with all its
 * mirror copies) and drawn onto the paint canvas from its data; a cancelled stroke (two-finger pinch, interrupted
 * gesture, Escape) simply disappears.
 *
 * The paint canvases are sized for the current zoom and screen density (redrawn from stroke data when that changes
 * enough), with a memory cap so very deep zoom stays responsive on phones.
 */
export type BrushSettings = {
  tool: BrushKind | 'eraser'
  color: string
  size: number
  /** Airbrush flow, 0.05 to 1. */
  flow: number
  stayInside: boolean
  /** Mirror copies (2 to 16), or 0 for off. */
  mirror: number
}

const LEVELS = [0.25, 0.35, 0.5, 0.7, 1, 1.4, 2, 2.8]
/** Pixels per paint canvas. Three canvases this size exist at most (paint, live, scratch). */
const MAX_AREA = 6_000_000
/** While the airbrush is held still, a timing sample is recorded this often (ms) so paint keeps building up. */
const HOLD_SAMPLE = 24

const round = (v: number) => Math.round(v * 10) / 10

type PainterOptions = {
  session: ColoringSession
  geometry: RegionGeometry
  paintCanvas: HTMLCanvasElement
  liveCanvas: HTMLCanvasElement
  cursor: HTMLElement
  getSettings: () => BrushSettings
  /** A stroke couldn't start (outside every shape with "Stay inside the lines" on). */
  onRejected: () => void
}

type Live = {
  style: Omit<Stroke, 'id' | 'points' | 'times'>
  points: number[]
  times: number[] | null
  spray: SprayTrack | null
  started: number
  /** Path pieces, or sprays for the airbrush, already on the live canvas. */
  drawn: number
  pointerType: string
  minDistance: number
}

export class Painter implements StrokeHandler {
  readonly renderer: PaintRenderer
  private readonly liveCtx: CanvasRenderingContext2D
  private live: Live | null = null
  private frame = 0
  private levelTimer = 0
  private maxArea = MAX_AREA
  private readonly stopSession: () => void
  private readonly stopViewport: () => void
  /** Set after construction, once the viewport exists. */
  viewport!: Viewport

  private readonly o: PainterOptions

  constructor(options: PainterOptions, viewport: Viewport) {
    this.o = options
    const o = options
    this.viewport = viewport
    const { sheet } = o.session
    this.renderer = new PaintRenderer(o.geometry, sheet.width, sheet.height, { canvas: o.paintCanvas })
    this.liveCtx = o.liveCanvas.getContext('2d')!
    this.updateLevel(true)
    this.stopSession = o.session.onChange((change) => {
      if ('stroke' in change) this.renderer.renderStroke(change.stroke)
      else if ('paint' in change || 'all' in change) this.renderer.renderAll(o.session.document.strokes)
    })
    this.stopViewport = viewport.subscribe(() => {
      clearTimeout(this.levelTimer)
      this.levelTimer = window.setTimeout(() => this.updateLevel(false), 160)
    })
  }

  destroy() {
    this.cancel()
    clearTimeout(this.levelTimer)
    this.stopSession()
    this.stopViewport()
    this.renderer.dispose()
  }

  /** Brush-size preview that follows a hovering mouse or pen. */
  hover(point: ClientPoint | null, pointerType: string) {
    const { cursor } = this.o
    const settings = this.o.getSettings()
    const show = point && pointerType !== 'touch' && this.brushActive
    if (!show) {
      cursor.hidden = true
      return
    }
    const stage = cursor.offsetParent as HTMLElement | null
    const rect = stage?.getBoundingClientRect()
    if (!rect) return
    const d = Math.max(4, settings.size * this.viewport.scale)
    cursor.hidden = false
    cursor.style.width = `${d}px`
    cursor.style.height = `${d}px`
    cursor.style.transform = `translate3d(${point.clientX - rect.left - d / 2}px, ${point.clientY - rect.top - d / 2}px, 0)`
  }

  brushActive = false

  // ------------------------------------------------------------------ StrokeHandler

  start = (point: ClientPoint, pointerType: string) => {
    this.cancel()
    const settings = this.o.getSettings()
    const { sheet } = this.o.session
    const { x, y } = this.viewport.clientToArt(point.clientX, point.clientY)
    const { geometry } = this.o
    let region: string | null = null
    let mirror: Mirror | undefined
    if (settings.mirror >= 2) {
      // Each copy is kept inside the region where it starts. Copies that start off the drawing (or outside every
      // shape with "Stay inside the lines" on) aren't painted, so nothing appears where it wasn't expected.
      const copies: Mirror['copies'] = []
      for (let k = 0; k < settings.mirror; k++) {
        const [cx, cy] = mirrorMap(k, settings.mirror, sheet.width, sheet.height)(x, y)
        const at = geometry.regionAt(cx, cy)
        if (settings.stayInside) {
          if (at) copies.push({ k, region: at })
        } else if (k === 0 || at) copies.push({ k, region: null })
      }
      if (!copies.length) {
        this.o.onRejected()
        return
      }
      mirror = { ways: settings.mirror, copies }
      region = copies[0].k === 0 ? copies[0].region : null
    } else if (settings.stayInside) {
      region = geometry.regionAt(x, y)
      if (!region) {
        this.o.onRejected()
        return
      }
    }
    const airbrush = settings.tool === 'airbrush'
    const style: Live['style'] = { tool: settings.tool, color: settings.color, size: settings.size, region }
    if (airbrush) style.flow = Math.round(settings.flow * 100) / 100
    if (settings.tool === 'crayon') style.seed = Math.floor(Math.random() * 2 ** 31)
    if (mirror) style.mirror = mirror
    const live: Live = {
      style,
      points: [round(x), round(y)],
      times: airbrush ? [0] : null,
      spray: airbrush ? new SprayTrack(settings.size) : null,
      started: performance.now(),
      drawn: 0,
      pointerType,
      // About one screen pixel: finer detail than that can't be seen and only makes saved strokes bigger.
      minDistance: Math.max(0.3, 0.8 / this.viewport.scale),
    }
    live.spray?.add(live.points[0], live.points[1], 0)
    this.live = live
    const { liveCanvas, paintCanvas } = this.o
    this.liveCtx.globalCompositeOperation = 'source-over'
    this.liveCtx.clearRect(0, 0, liveCanvas.width, liveCanvas.height)
    if (settings.tool === 'eraser') {
      // Erase on a copy shown in place of the paint, so a cancelled stroke leaves the paint untouched.
      this.liveCtx.drawImage(paintCanvas, 0, 0)
      paintCanvas.style.visibility = 'hidden'
    }
    this.schedule()
  }

  move = (points: ClientPoint[]) => {
    const live = this.live
    if (!live) return
    const t = Math.round(performance.now() - live.started)
    for (const p of points) {
      const { x, y } = this.viewport.clientToArt(p.clientX, p.clientY)
      this.addPoint(live, x, y, t)
    }
    const last = points[points.length - 1]
    if (last) this.hover(last, live.pointerType)
    this.schedule()
  }

  end = () => {
    const live = this.live
    if (!live) return
    if (live.spray) this.holdSample(live) // time held since the last movement still counts
    this.live = null
    cancelAnimationFrame(this.frame)
    this.frame = 0
    const stroke: Stroke = { id: newStrokeId(), ...live.style, points: live.points }
    if (live.times) stroke.times = live.times
    if (stroke.mirror) stroke.mirror = { ...stroke.mirror, copies: distinctCopies(stroke, this.o.session.sheet.width, this.o.session.sheet.height) }
    // Recording the stroke draws it onto the paint canvas (see the session listener); then the live copy goes.
    this.o.session.addStroke(stroke)
    this.clearLive()
  }

  cancel = () => {
    if (!this.live) return
    this.live = null
    cancelAnimationFrame(this.frame)
    this.frame = 0
    this.clearLive()
  }

  // ------------------------------------------------------------------ internals

  private addPoint(live: Live, x: number, y: number, t: number) {
    const n = live.points.length
    const far = Math.hypot(x - live.points[n - 2], y - live.points[n - 1]) >= live.minDistance
    // The airbrush also records time spent in one place, so paint keeps building up while it's held still.
    const held = live.times !== null && t - live.times[live.times.length - 1] >= HOLD_SAMPLE
    if (!far && !held) return
    const px = far ? round(x) : live.points[n - 2]
    const py = far ? round(y) : live.points[n - 1]
    live.points.push(px, py)
    live.times?.push(t)
    live.spray?.add(px, py, t)
  }

  private holdSample(live: Live) {
    const n = live.points.length
    this.addPoint(live, live.points[n - 2], live.points[n - 1], Math.round(performance.now() - live.started))
  }

  private clearLive() {
    const { liveCanvas, paintCanvas } = this.o
    this.liveCtx.globalCompositeOperation = 'source-over'
    this.liveCtx.clearRect(0, 0, liveCanvas.width, liveCanvas.height)
    paintCanvas.style.visibility = ''
    // A zoom change while drawing was postponed; apply it now.
    this.updateLevel(false)
  }

  private schedule() {
    if (!this.frame) this.frame = requestAnimationFrame(this.draw)
  }

  private draw = () => {
    this.frame = 0
    const live = this.live
    if (!live) return
    if (live.spray) {
      this.holdSample(live)
      const total = live.spray.sprays.length / 2
      this.renderer.drawSprays(this.liveCtx, live.style, live.spray.sprays, live.drawn, total)
      live.drawn = total
      this.schedule() // keep spraying while held still
      return
    }
    const n = live.points.length / 2
    if (n === 1 && live.drawn === 0 && live.style.tool !== 'eraser') {
      this.renderer.drawPieces(this.liveCtx, live.style, live.points, 1, 0, true) // a dot right away
    } else if (n - 1 > live.drawn) {
      this.renderer.drawPieces(this.liveCtx, live.style, live.points, live.drawn + 1, n - 1, false)
      live.drawn = n - 1
    }
  }

  private updateLevel(force: boolean) {
    if (this.live) return
    const { sheet } = this.o.session
    const desired = this.viewport.scale * (window.devicePixelRatio || 1)
    const cap = Math.sqrt(this.maxArea / (sheet.width * sheet.height))
    const level = Math.min(LEVELS.find((l) => l >= desired * 0.95) ?? LEVELS[LEVELS.length - 1], cap)
    if (!force && Math.abs(level - this.renderer.getLevel()) < 0.001) return
    if (!this.renderer.setLevel(level)) {
      // The device refused a canvas this large: settle for less detail rather than no paint.
      if (this.maxArea <= 500_000) return
      this.maxArea = Math.max(500_000, this.maxArea / 2)
      this.updateLevel(true)
      return
    }
    const { liveCanvas, paintCanvas } = this.o
    liveCanvas.width = paintCanvas.width
    liveCanvas.height = paintCanvas.height
    this.renderer.renderAll(this.o.session.document.strokes)
  }
}

/**
 * Drops mirror copies that would paint exactly over an earlier copy (a stroke drawn along the mirror line, or a dot
 * on the centre), so they don't add paint twice.
 */
function distinctCopies(stroke: Stroke, artWidth: number, artHeight: number): Mirror['copies'] {
  const mirror = stroke.mirror!
  const kept: { copy: Mirror['copies'][number]; pts: number[] }[] = []
  const n = stroke.points.length / 2
  const step = Math.max(1, Math.floor(n / 64)) // compare a sample of points: enough to tell copies apart
  for (const copy of mirror.copies) {
    const map = mirrorMap(copy.k, mirror.ways, artWidth, artHeight)
    const pts: number[] = []
    for (let i = 0; i < n; i += step) pts.push(...map(stroke.points[i * 2], stroke.points[i * 2 + 1]))
    const same = kept.some((other) => other.copy.region === copy.region && other.pts.every((v, i) => Math.abs(v - pts[i]) < 0.75))
    if (!same) kept.push({ copy, pts })
  }
  return kept.map((k) => k.copy)
}
