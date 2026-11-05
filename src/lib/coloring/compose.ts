import { ELEMENTS, ATTRIBUTES } from './artDom'
import { defToMarkup, fillPaint } from './fills'
import type { RegionGeometry } from './geometry'
import { freeCanvas, PaintRenderer } from './paint'
import type { ArtNode, ColoringDocument, Fills, SheetData } from './types'

/**
 * Builds finished images of a sheet: the region colors, brush paint and line art in the same order as on screen
 * (colors, paint, line art with multiply blending, highlights), on white. The line art and colors are rasterized
 * from vector data at the target size, so a 4096px export stays sharp; paint is redrawn from its stroke data at the
 * same size. Used for PNG downloads, print images, library thumbnails and the color picker.
 */

const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

type FillPaint = (regionId: string) => string

function serialize(nodes: ArtNode[], paint?: FillPaint): string {
  let out = ''
  for (const [name, attrs, children] of nodes) {
    if (!ELEMENTS.has(name)) continue
    out += `<${name}`
    for (const [key, value] of Object.entries(attrs)) {
      if (!ATTRIBUTES.has(key) || key === 'data-region') continue
      if (key === 'fill' && paint && attrs['data-region']) continue
      out += ` ${key}="${escape(value)}"`
    }
    if (paint && attrs['data-region']) out += ` fill="${escape(paint(attrs['data-region']))}"`
    out += children.length ? `>${serialize(children, paint)}</${name}>` : '/>'
  }
  return out
}

/** The region layer with its fills, as SVG markup: styled fills use the same definitions as the editor. */
function serializeRegions(sheet: SheetData, fills: Readonly<Fills>, geometry: RegionGeometry): string {
  let defs = ''
  const body = serialize(sheet.regionLayer, (id) => {
    const { fill, def } = fillPaint(id, fills[id], geometry.get(id))
    if (def) defs += defToMarkup(def)
    return fill
  })
  return defs ? `<defs>${defs}</defs>${body}` : body
}

function loadSvg(sheet: SheetData, inner: string, w: number, h: number, viewBox = `0 0 ${sheet.width} ${sheet.height}`): Promise<HTMLImageElement> {
  // Explicit pixel width and height, so browsers rasterize the vector art at the target size, not a small default.
  const markup = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${viewBox}" preserveAspectRatio="none">${inner}</svg>`
  const url = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml' }))
  const img = new Image(w, h)
  img.src = url
  return img
    .decode()
    .then(() => img)
    .finally(() => URL.revokeObjectURL(url))
}

// The line art never changes, so its images are kept for a few recent sizes.
const lineImages = new Map<string, Promise<HTMLImageElement>>()

function layerImage(sheet: SheetData, layer: 'lineLayer' | 'highlightLayer', w: number, h: number) {
  const key = `${sheet.id}:${sheet.version}:${layer}:${w}x${h}`
  let image = lineImages.get(key)
  if (!image) {
    image = loadSvg(sheet, serialize(sheet[layer]), w, h)
    image.catch(() => lineImages.delete(key))
    lineImages.set(key, image)
    if (lineImages.size > 6) lineImages.delete(lineImages.keys().next().value!)
  }
  return image
}

/** A canvas of exactly w x h that the browser actually managed to allocate, or null. */
function makeCanvas(w: number, h: number): HTMLCanvasElement | null {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  if (canvas.width !== w || canvas.height !== h) return null
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  // Some browsers hand out an unusable context past their size limit instead of failing: check a corner pixel.
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(w - 1, h - 1, 1, 1)
  if (ctx.getImageData(w - 1, h - 1, 1, 1).data[3] !== 255) {
    freeCanvas(canvas)
    return null
  }
  return canvas
}

export type ComposeInput = {
  sheet: SheetData
  doc: ColoringDocument
  geometry: RegionGeometry
}

export type ComposeOptions = {
  /** Longest edge in pixels; the other edge follows the sheet's aspect ratio. */
  longEdge: number
  /** Line art only, for printing a blank sheet. */
  blank?: boolean
}

export const sizeFor = (sheet: SheetData, longEdge: number) => {
  const level = longEdge / Math.max(sheet.width, sheet.height)
  return { level, width: Math.round(sheet.width * level), height: Math.round(sheet.height * level) }
}

/** Draws the finished sheet onto a new canvas, or returns null if the browser can't make a canvas that size. */
export async function composeSheet({ sheet, doc, geometry }: ComposeInput, { longEdge, blank }: ComposeOptions): Promise<HTMLCanvasElement | null> {
  const { level, width, height } = sizeFor(sheet, longEdge)
  const canvas = makeCanvas(width, height)
  if (!canvas) return null
  const ctx = canvas.getContext('2d')!
  try {
    const [lines, highlights, regions] = await Promise.all([
      layerImage(sheet, 'lineLayer', width, height),
      sheet.highlightLayer.length ? layerImage(sheet, 'highlightLayer', width, height) : null,
      blank ? null : loadSvg(sheet, serializeRegions(sheet, doc.fills, geometry), width, height),
    ])
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)
    if (regions) ctx.drawImage(regions, 0, 0, width, height)
    if (!blank && doc.strokes.length) {
      const paint = new PaintRenderer(geometry, sheet.width, sheet.height, { maskBudget: 24_000_000 })
      try {
        if (!paint.setLevel(level)) throw new Error('Paint layer too large')
        paint.renderAll(doc.strokes)
        ctx.drawImage(paint.canvas, 0, 0, width, height)
      } finally {
        paint.dispose()
        freeCanvas(paint.canvas)
      }
    }
    ctx.globalCompositeOperation = 'multiply'
    ctx.drawImage(lines, 0, 0, width, height)
    ctx.globalCompositeOperation = 'source-over'
    if (highlights) ctx.drawImage(highlights, 0, 0, width, height)
    return canvas
  } catch (error) {
    freeCanvas(canvas)
    throw error
  }
}

const toBlob = (canvas: HTMLCanvasElement, type: string, quality?: number) =>
  new Promise<Blob | null>((resolve) => {
    try {
      canvas.toBlob(resolve, type, quality)
    } catch {
      resolve(null)
    }
  })

export type RenderedImage = { blob: Blob; width: number; height: number }

/**
 * A PNG of the whole sheet, aiming for 4096px on the longest edge and stepping down if the device can't manage it.
 * Throws if no size works; the artwork itself is never touched.
 */
export async function renderPng(input: ComposeInput, options: { sizes: number[]; blank?: boolean }): Promise<RenderedImage> {
  let lastError: unknown = new Error('No canvas size worked')
  for (const longEdge of options.sizes) {
    let canvas: HTMLCanvasElement | null = null
    try {
      canvas = await composeSheet(input, { longEdge, blank: options.blank })
      if (!canvas) continue
      const blob = await toBlob(canvas, 'image/png')
      if (blob && blob.size > 0) return { blob, width: canvas.width, height: canvas.height }
    } catch (error) {
      lastError = error
    } finally {
      if (canvas) freeCanvas(canvas)
    }
  }
  throw lastError
}

export const EXPORT_SIZES = [4096, 3072, 2048, 1536]
export const PRINT_SIZES = [3000, 2400, 1800]

/** A small colored preview for the library card. */
export async function renderThumbnail(input: ComposeInput): Promise<Blob | null> {
  const canvas = await composeSheet(input, { longEdge: 600 })
  if (!canvas) return null
  try {
    return (await toBlob(canvas, 'image/webp', 0.86)) ?? (await toBlob(canvas, 'image/png'))
  } finally {
    freeCanvas(canvas)
  }
}

/**
 * The visible color at an artwork point, as the visitor sees it: the region's fill (drawn from the same SVG as
 * exports, so fades, glows and patterns are sampled exactly), then paint (from the on-screen paint canvas), then the
 * line art with multiply.
 */
export async function sampleColor(input: ComposeInput, paintCanvas: HTMLCanvasElement, x: number, y: number): Promise<string> {
  const { sheet, doc, geometry } = input
  const [lines, highlights, regions] = await Promise.all([
    layerImage(sheet, 'lineLayer', sheet.width, sheet.height),
    sheet.highlightLayer.length ? layerImage(sheet, 'highlightLayer', sheet.width, sheet.height) : null,
    // One pixel covering one artwork unit around the point.
    loadSvg(sheet, serializeRegions(sheet, doc.fills, geometry), 1, 1, `${x - 0.5} ${y - 0.5} 1 1`),
  ])
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, 1, 1)
  ctx.drawImage(regions, 0, 0, 1, 1)
  ctx.setTransform(1, 0, 0, 1, 0.5 - x, 0.5 - y)
  ctx.drawImage(paintCanvas, 0, 0, sheet.width, sheet.height)
  ctx.globalCompositeOperation = 'multiply'
  ctx.drawImage(lines, 0, 0, sheet.width, sheet.height)
  ctx.globalCompositeOperation = 'source-over'
  if (highlights) ctx.drawImage(highlights, 0, 0, sheet.width, sheet.height)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`
}
