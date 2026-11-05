/**
 * Zoom, pan and fit for the drawing, plus pointer gestures. Works directly on the DOM (no React renders while
 * drawing, dragging or pinching). Viewing never changes the artwork and is never part of undo history.
 *
 * The page is sized in real pixels for the current zoom (not CSS-scaled), so the SVG layers are redrawn crisply
 * at every zoom level. Zoom is relative to "fit": 100% means the whole page fits the workspace.
 *
 * What one finger, pen or mouse does depends on the tool (see GestureMode). Two fingers always pan and zoom, and
 * cancel a stroke in progress so pinching never leaves a mark.
 */
export const MIN_ZOOM = 0.5
export const MAX_ZOOM = 6
const STEP = 1.25
const KEY_PAN = 48
const MIN_VISIBLE = 72

/**
 * - tap-pan: a tap acts (fill, pick a color), a drag moves the page.
 * - draw: drawing starts as soon as the pointer goes down (marker).
 * - tap-draw: a tap acts (clear a fill), a drag draws (eraser).
 * - pan: every drag moves the page; taps do nothing.
 */
export type GestureMode = 'tap-pan' | 'draw' | 'tap-draw' | 'pan'

export type ClientPoint = { clientX: number; clientY: number }

export type StrokeHandler = {
  start: (point: ClientPoint, pointerType: string) => void
  move: (points: ClientPoint[]) => void
  end: () => void
  /** Discard the stroke in progress: a second finger arrived, the gesture was interrupted, or Escape. */
  cancel: () => void
}

type Options = {
  stage: HTMLElement
  page: HTMLElement
  artWidth: number
  artHeight: number
  getMode: () => GestureMode
  onTap: (point: ClientPoint, pointerType: string) => void
  stroke: StrokeHandler
  /** Pointer hovering (mouse or pen, not pressed), or null when it leaves: for the brush-size preview. */
  onHover?: (point: ClientPoint | null, pointerType: string) => void
}

type Pointer = { x: number; y: number; type: string }

type Gesture =
  | { kind: 'none' }
  | { kind: 'pending'; id: number; mode: GestureMode; type: string; startX: number; startY: number; origin: ClientPoint; buffered: ClientPoint[] }
  | { kind: 'pan'; id: number; lastX: number; lastY: number }
  | { kind: 'draw'; id: number; type: string }
  | { kind: 'pinch'; distance: number; zoom: number; artX: number; artY: number }
  | { kind: 'done' }

const coalesced = (event: PointerEvent): ClientPoint[] => {
  const list = event.getCoalescedEvents?.()
  return list && list.length ? list : [event]
}

export class Viewport {
  zoom = 1
  private fit = 1
  private x = 0
  private y = 0
  private width = 0
  private height = 0
  private fitted = false
  private readonly o: Options
  private readonly pointers = new Map<number, Pointer>()
  private gesture: Gesture = { kind: 'none' }
  private readonly listeners = new Set<() => void>()
  private readonly resizeObserver: ResizeObserver

  constructor(options: Options) {
    this.o = options
    const { stage } = options
    stage.addEventListener('pointerdown', this.onPointerDown)
    stage.addEventListener('pointermove', this.onPointerMove)
    stage.addEventListener('pointerup', this.onPointerUp)
    stage.addEventListener('pointercancel', this.onPointerCancel)
    stage.addEventListener('lostpointercapture', this.onLostCapture)
    stage.addEventListener('pointerleave', this.onPointerLeave)
    stage.addEventListener('wheel', this.onWheel, { passive: false })
    stage.addEventListener('keydown', this.onKeyDown)
    this.resizeObserver = new ResizeObserver(() => this.onResize())
    this.resizeObserver.observe(stage)
    this.onResize()
  }

  destroy() {
    const { stage } = this.o
    this.cancelGesture()
    stage.removeEventListener('pointerdown', this.onPointerDown)
    stage.removeEventListener('pointermove', this.onPointerMove)
    stage.removeEventListener('pointerup', this.onPointerUp)
    stage.removeEventListener('pointercancel', this.onPointerCancel)
    stage.removeEventListener('lostpointercapture', this.onLostCapture)
    stage.removeEventListener('pointerleave', this.onPointerLeave)
    stage.removeEventListener('wheel', this.onWheel)
    stage.removeEventListener('keydown', this.onKeyDown)
    this.resizeObserver.disconnect()
    this.listeners.clear()
  }

  /** For useSyncExternalStore and the paint layer: notified when the zoom or the fitted size changes. */
  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  getZoom = () => this.zoom

  /** CSS pixels per artwork unit at the current zoom. */
  get scale() {
    return this.fit * this.zoom
  }

  get isDrawing() {
    return this.gesture.kind === 'draw'
  }

  /** Client (screen) coordinates to artwork units, through the current zoom and pan. */
  clientToArt(clientX: number, clientY: number) {
    const rect = this.o.page.getBoundingClientRect()
    return {
      x: ((clientX - rect.left) / rect.width) * this.o.artWidth,
      y: ((clientY - rect.top) / rect.height) * this.o.artHeight,
    }
  }

  fitToScreen() {
    this.zoom = 1
    const scale = this.fit
    this.x = (this.width - this.o.artWidth * scale) / 2
    this.y = (this.height - this.o.artHeight * scale) / 2
    this.apply(true)
  }

  zoomIn() {
    this.zoomAround(this.zoom * STEP, this.width / 2, this.height / 2)
  }

  zoomOut() {
    this.zoomAround(this.zoom / STEP, this.width / 2, this.height / 2)
  }

  panBy(dx: number, dy: number) {
    this.x += dx
    this.y += dy
    this.apply(false)
  }

  /** Ends any gesture without acting on it; a stroke in progress is discarded. */
  cancelGesture() {
    if (this.gesture.kind === 'draw') this.o.stroke.cancel()
    for (const id of this.pointers.keys()) {
      if (this.o.stage.hasPointerCapture(id)) this.o.stage.releasePointerCapture(id)
    }
    this.pointers.clear()
    this.gesture = { kind: 'none' }
    delete this.o.stage.dataset.panning
  }

  // -------------------------------------------------------------- internals

  /** Zoom so the artwork point under (sx, sy), in stage pixels, stays put. */
  private zoomAround(zoom: number, sx: number, sy: number) {
    const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom))
    const artX = (sx - this.x) / this.scale
    const artY = (sy - this.y) / this.scale
    this.zoom = next
    this.x = sx - artX * this.scale
    this.y = sy - artY * this.scale
    this.apply(true)
  }

  private onResize() {
    const rect = this.o.stage.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const centerArtX = (this.width / 2 - this.x) / this.scale
    const centerArtY = (this.height / 2 - this.y) / this.scale
    this.width = rect.width
    this.height = rect.height
    const pad = Math.min(32, Math.max(12, rect.width * 0.03))
    this.fit = Math.min((rect.width - pad * 2) / this.o.artWidth, (rect.height - pad * 2) / this.o.artHeight)
    if (!this.fitted) {
      this.fitted = true
      this.fitToScreen()
      return
    }
    // Keep the same part of the drawing in the middle after a resize or rotation.
    this.x = this.width / 2 - centerArtX * this.scale
    this.y = this.height / 2 - centerArtY * this.scale
    this.apply(true)
  }

  private apply(zoomChanged: boolean) {
    const w = this.o.artWidth * this.scale
    const h = this.o.artHeight * this.scale
    // Keep part of the page on screen so it can't be lost.
    this.x = Math.min(this.width - MIN_VISIBLE, Math.max(MIN_VISIBLE - w, this.x))
    this.y = Math.min(this.height - MIN_VISIBLE, Math.max(MIN_VISIBLE - h, this.y))
    const { page } = this.o
    page.style.width = `${w}px`
    page.style.height = `${h}px`
    page.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`
    if (zoomChanged) this.listeners.forEach((listener) => listener())
  }

  private local(event: PointerEvent | WheelEvent) {
    const rect = this.o.stage.getBoundingClientRect()
    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  private startPinch() {
    const [a, b] = [...this.pointers.values()]
    const midX = (a.x + b.x) / 2
    const midY = (a.y + b.y) / 2
    this.gesture = {
      kind: 'pinch',
      distance: Math.hypot(a.x - b.x, a.y - b.y) || 1,
      zoom: this.zoom,
      artX: (midX - this.x) / this.scale,
      artY: (midY - this.y) / this.scale,
    }
  }

  private onPointerDown = (event: PointerEvent) => {
    const middle = event.pointerType === 'mouse' && event.button === 1
    if (event.pointerType === 'mouse' && event.button !== 0 && !middle) return
    const g = this.gesture
    // Palm rejection: while a pen is on the page, touches are ignored.
    if (event.pointerType === 'touch' && (g.kind === 'draw' || g.kind === 'pending') && g.type === 'pen') return
    if (this.pointers.size >= 2) return
    if (middle) event.preventDefault() // no auto-scroll
    this.o.stage.setPointerCapture(event.pointerId)
    const p = this.local(event)
    this.pointers.set(event.pointerId, { ...p, type: event.pointerType })
    this.o.onHover?.(null, event.pointerType)

    if (this.pointers.size === 2) {
      // A second finger: navigation only. Discard any stroke the first finger started.
      if (g.kind === 'draw') this.o.stroke.cancel()
      this.startPinch()
      return
    }
    const mode = middle ? 'pan' : this.o.getMode()
    if (mode === 'pan') {
      this.gesture = { kind: 'pan', id: event.pointerId, lastX: p.x, lastY: p.y }
      this.o.stage.dataset.panning = 'true'
    } else if (mode === 'draw') {
      this.gesture = { kind: 'draw', id: event.pointerId, type: event.pointerType }
      this.o.stroke.start(event, event.pointerType)
    } else {
      this.gesture = {
        kind: 'pending',
        id: event.pointerId,
        mode,
        type: event.pointerType,
        startX: p.x,
        startY: p.y,
        origin: { clientX: event.clientX, clientY: event.clientY },
        buffered: [],
      }
    }
  }

  private onPointerMove = (event: PointerEvent) => {
    const known = this.pointers.get(event.pointerId)
    if (!known) {
      if (!this.pointers.size && event.pointerType !== 'touch') this.o.onHover?.(event, event.pointerType)
      return
    }
    const p = this.local(event)
    known.x = p.x
    known.y = p.y
    const g = this.gesture
    if (g.kind === 'pending' && g.id === event.pointerId) {
      const slop = event.pointerType === 'touch' ? 10 : 5
      if (Math.hypot(p.x - g.startX, p.y - g.startY) <= slop) {
        g.buffered.push(...coalesced(event).map(({ clientX, clientY }) => ({ clientX, clientY })))
        return
      }
      if (g.mode === 'tap-draw') {
        this.gesture = { kind: 'draw', id: g.id, type: g.type }
        this.o.stroke.start(g.origin, g.type)
        this.o.stroke.move([...g.buffered, ...coalesced(event)])
      } else {
        this.gesture = { kind: 'pan', id: g.id, lastX: p.x, lastY: p.y }
        this.o.stage.dataset.panning = 'true'
        this.panBy(p.x - g.startX, p.y - g.startY)
      }
    } else if (g.kind === 'draw' && g.id === event.pointerId) {
      this.o.stroke.move(coalesced(event))
    } else if (g.kind === 'pan' && g.id === event.pointerId) {
      this.panBy(p.x - g.lastX, p.y - g.lastY)
      g.lastX = p.x
      g.lastY = p.y
    } else if (g.kind === 'pinch' && this.pointers.size >= 2) {
      const [a, b] = [...this.pointers.values()]
      const midX = (a.x + b.x) / 2
      const midY = (a.y + b.y) / 2
      const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, (g.zoom * Math.hypot(a.x - b.x, a.y - b.y)) / g.distance))
      this.zoom = zoom
      this.x = midX - g.artX * this.scale
      this.y = midY - g.artY * this.scale
      this.apply(true)
    }
  }

  private finish(pointerId: number) {
    this.pointers.delete(pointerId)
    // After a pinch, the remaining finger must not pan, draw or tap until every finger is lifted.
    this.gesture = this.pointers.size ? { kind: 'done' } : { kind: 'none' }
    if (!this.pointers.size) delete this.o.stage.dataset.panning
  }

  private onPointerUp = (event: PointerEvent) => {
    if (!this.pointers.has(event.pointerId)) return
    const g = this.gesture
    if (g.kind === 'pending' && g.id === event.pointerId) this.o.onTap(g.origin, g.type)
    else if (g.kind === 'draw' && g.id === event.pointerId) this.o.stroke.end()
    this.finish(event.pointerId)
  }

  /** The browser took the pointer away (a system gesture, an alert, the window losing focus): never act on it. */
  private onPointerCancel = (event: PointerEvent) => {
    if (!this.pointers.has(event.pointerId)) return
    const g = this.gesture
    if (g.kind === 'draw' && g.id === event.pointerId) this.o.stroke.cancel()
    this.finish(event.pointerId)
  }

  private onLostCapture = (event: PointerEvent) => {
    // Normally pointerup has already handled the pointer; if not, the gesture was interrupted.
    if (this.pointers.has(event.pointerId)) this.onPointerCancel(event)
  }

  private onPointerLeave = (event: PointerEvent) => {
    if (!this.pointers.size) this.o.onHover?.(null, event.pointerType)
  }

  /** Ctrl/Cmd + wheel and trackpad pinch zoom; a plain wheel keeps scrolling the page. */
  private onWheel = (event: WheelEvent) => {
    if (!event.ctrlKey && !event.metaKey) return
    event.preventDefault()
    const p = this.local(event)
    const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY
    this.zoomAround(this.zoom * Math.exp(-delta * 0.0025), p.x, p.y)
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (event.target !== this.o.stage || event.altKey || event.ctrlKey || event.metaKey) return
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [KEY_PAN, 0], ArrowRight: [-KEY_PAN, 0], ArrowUp: [0, KEY_PAN], ArrowDown: [0, -KEY_PAN],
    }
    if (moves[event.key]) this.panBy(...moves[event.key])
    else if (event.key === '+' || event.key === '=') this.zoomIn()
    else if (event.key === '-' || event.key === '_') this.zoomOut()
    else if (event.key === '0') this.fitToScreen()
    else return
    event.preventDefault()
  }
}
