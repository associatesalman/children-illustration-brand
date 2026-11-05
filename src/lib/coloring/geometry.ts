/**
 * Region shapes as canvas paths in artwork units, built from the region layer once it is in the page. Used to find
 * the region under a point and to keep brush strokes inside one region.
 *
 * Regions are painted back to front, so the visible part of a region is its shape minus every region drawn after
 * it. regionAt() returns the topmost region at a point, and laterOverlapping() lists the shapes that cover parts of
 * a region, which the paint renderer cuts away when clipping a stroke.
 */
export type Box = { x: number; y: number; w: number; h: number }

export type RegionShape = {
  id: string
  index: number
  path: Path2D
  rule: CanvasFillRule
  box: Box
  /** Local-to-artwork transform of the shape (used to anchor styled fills). */
  matrix: DOMMatrixReadOnly
}

const intersects = (a: Box, b: Box) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h

const num = (el: Element, name: string) => parseFloat(el.getAttribute(name) ?? '0') || 0

/** The element's own shape, before transforms. */
function shapePath(el: SVGGraphicsElement): Path2D | null {
  const p = new Path2D()
  switch (el.localName) {
    case 'path':
      return new Path2D(el.getAttribute('d') ?? '')
    case 'rect': {
      const [x, y, w, h] = [num(el, 'x'), num(el, 'y'), num(el, 'width'), num(el, 'height')]
      let rx = el.hasAttribute('rx') ? num(el, 'rx') : num(el, 'ry')
      let ry = el.hasAttribute('ry') ? num(el, 'ry') : rx
      rx = Math.min(rx, w / 2)
      ry = Math.min(ry, h / 2)
      if (rx > 0 && ry > 0) p.roundRect(x, y, w, h, [{ x: rx, y: ry }])
      else p.rect(x, y, w, h)
      return p
    }
    case 'circle':
      p.arc(num(el, 'cx'), num(el, 'cy'), num(el, 'r'), 0, Math.PI * 2)
      return p
    case 'ellipse':
      p.ellipse(num(el, 'cx'), num(el, 'cy'), num(el, 'rx'), num(el, 'ry'), 0, 0, Math.PI * 2)
      return p
    case 'polygon': {
      const values = (el.getAttribute('points') ?? '').trim().split(/[\s,]+/).map(Number)
      for (let i = 0; i + 1 < values.length; i += 2) {
        if (i === 0) p.moveTo(values[i], values[i + 1])
        else p.lineTo(values[i], values[i + 1])
      }
      p.closePath()
      return p
    }
    default:
      return null
  }
}

/** The element's transform combined with its groups' transforms, in artwork units (excluding the viewBox). */
export function artMatrix(el: Element): DOMMatrix {
  let matrix = new DOMMatrix()
  for (let node: Element | null = el; node && node.localName !== 'svg'; node = node.parentElement) {
    const own = (node as SVGGraphicsElement).transform?.baseVal.consolidate()
    if (own) matrix = DOMMatrix.fromMatrix(own.matrix).multiply(matrix)
  }
  return matrix
}

export class RegionGeometry {
  readonly shapes: RegionShape[] = []
  private readonly byId = new Map<string, RegionShape>()
  private readonly hit: CanvasRenderingContext2D

  /** elements: the region layer's shapes in painting order (back to front). */
  constructor(elements: [string, SVGGraphicsElement][]) {
    this.hit = document.createElement('canvas').getContext('2d')!
    for (const [id, el] of elements) {
      const own = shapePath(el)
      if (!own) continue
      const matrix = artMatrix(el)
      const path = new Path2D()
      path.addPath(own, matrix)
      const local = el.getBBox()
      const corners = [
        matrix.transformPoint({ x: local.x, y: local.y }),
        matrix.transformPoint({ x: local.x + local.width, y: local.y }),
        matrix.transformPoint({ x: local.x, y: local.y + local.height }),
        matrix.transformPoint({ x: local.x + local.width, y: local.y + local.height }),
      ]
      const xs = corners.map((c) => c.x)
      const ys = corners.map((c) => c.y)
      const box = { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) }
      const ruleSource = el.closest('[fill-rule]')
      const rule: CanvasFillRule = ruleSource?.getAttribute('fill-rule') === 'evenodd' ? 'evenodd' : 'nonzero'
      const shape = { id, index: this.shapes.length, path, rule, box, matrix }
      this.shapes.push(shape)
      this.byId.set(id, shape)
    }
  }

  get(id: string) {
    return this.byId.get(id)
  }

  /** The topmost region at an artwork point, or null outside every region (off the page). */
  regionAt(x: number, y: number): string | null {
    for (let i = this.shapes.length - 1; i >= 0; i--) {
      const s = this.shapes[i]
      if (x < s.box.x || y < s.box.y || x > s.box.x + s.box.w || y > s.box.y + s.box.h) continue
      if (this.hit.isPointInPath(s.path, x, y, s.rule)) return s.id
    }
    return null
  }

  /** Regions drawn above this one whose bounds overlap it: the parts that aren't visible as this region. */
  laterOverlapping(id: string): RegionShape[] {
    const shape = this.byId.get(id)
    if (!shape) return []
    return this.shapes.slice(shape.index + 1).filter((s) => intersects(s.box, shape.box))
  }
}
