import { artMatrix } from './geometry'
import type { ArtNode } from './types'

const SVG_NS = 'http://www.w3.org/2000/svg'

// Same allow-list as the build script: sheets only ever become plain shapes, never markup.
export const ELEMENTS = new Set(['g', 'path', 'rect', 'circle', 'ellipse', 'polygon', 'polyline', 'line'])
export const ATTRIBUTES = new Set([
  'd', 'x', 'y', 'width', 'height', 'rx', 'ry', 'cx', 'cy', 'r', 'points', 'x1', 'y1', 'x2', 'y2', 'fill-rule',
  'stroke', 'stroke-width', 'stroke-linejoin', 'stroke-linecap', 'stroke-dasharray', 'fill', 'fill-opacity', 'transform',
  'data-region',
])

/** Builds a sheet layer into an <svg> with createElementNS. Calls onRegion for every fillable shape. */
export function buildLayer(target: SVGElement, nodes: ArtNode[], onRegion?: (id: string, el: SVGGraphicsElement) => void) {
  const build = (parent: Element, list: ArtNode[]) => {
    for (const [name, attrs, children] of list) {
      if (!ELEMENTS.has(name)) continue
      const el = document.createElementNS(SVG_NS, name) as SVGGraphicsElement
      for (const [key, value] of Object.entries(attrs)) {
        if (ATTRIBUTES.has(key)) el.setAttribute(key, value)
      }
      const region = attrs['data-region']
      if (region && onRegion) onRegion(region, el)
      parent.append(el)
      if (children.length) build(el, children)
    }
  }
  target.replaceChildren()
  build(target, nodes)
}

/**
 * An outline of one region for the keyboard selection highlight: a copy of the shape with its full transform,
 * drawn with a fixed screen-pixel outline so it stays visible at every zoom level.
 */
export function regionOutline(region: SVGGraphicsElement): SVGGElement {
  const group = document.createElementNS(SVG_NS, 'g')
  // Artwork units: the outline layer has the same viewBox, so the viewBox scaling is left out (unlike getCTM()).
  const matrix = artMatrix(region)
  group.setAttribute('transform', `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e} ${matrix.f})`)
  for (const [color, width, dash] of [['#ffffff', '7', ''], ['#d62828', '3.5', '9 6']] as const) {
    const copy = region.cloneNode() as SVGGraphicsElement
    copy.removeAttribute('transform')
    copy.removeAttribute('data-region')
    copy.setAttribute('fill', 'none')
    copy.setAttribute('stroke', color)
    copy.setAttribute('stroke-width', width)
    copy.setAttribute('stroke-linejoin', 'round')
    copy.setAttribute('vector-effect', 'non-scaling-stroke')
    if (dash) copy.setAttribute('stroke-dasharray', dash)
    group.append(copy)
  }
  return group
}
