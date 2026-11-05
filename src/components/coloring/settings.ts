import type { BrushKind, FillStyle, FillValue, PatternKind, Tool } from '../../lib/coloring/types'
import type { PickedColor } from './ColorPicker'
import { patternLabels } from './tools'

/** Everything the tools need. Kept in the editor, partly remembered between visits (see prefs.ts). */
export type Settings = {
  tool: Tool
  brush: BrushKind
  sizes: Record<BrushKind | 'eraser', number>
  flow: number
  color: PickedColor
  color2: PickedColor
  stayInside: boolean
  /** Mirror copies for strokes (2 to 16), or 0 for off. */
  mirror: number
  fillStyle: FillStyle
  fadeAngle: number
  pattern: PatternKind
  patternSize: number
}

export type Update = (patch: Partial<Settings>) => void

export const sizeKey = (s: Pick<Settings, 'tool' | 'brush'>) => (s.tool === 'eraser' ? 'eraser' : s.brush)

/** The fill the Fill tool applies next, from the current settings. */
export function fillValue(s: Settings): FillValue {
  const a = s.color.hex
  const b = s.color2.hex
  switch (s.fillStyle) {
    case 'solid':
      return a
    case 'fade':
      return { type: 'fade', a, b, angle: s.fadeAngle }
    case 'glow':
      return { type: 'glow', a, b }
    case 'pattern':
      return { type: 'pattern', pattern: s.pattern, a, b, size: s.patternSize }
  }
}

/** A short description of the next fill, for announcements: "Sunny yellow", "Sunny yellow and Orange fade". */
export function fillDescription(s: Settings) {
  if (s.fillStyle === 'solid') return s.color.name
  const kind = s.fillStyle === 'pattern' ? `${patternLabels[s.pattern].toLowerCase()}` : s.fillStyle
  return `${s.color.name} and ${s.color2.name} ${kind}`
}

