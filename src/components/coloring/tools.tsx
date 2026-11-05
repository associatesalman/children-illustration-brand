import { Brush, Eraser, Hand, PaintBucket, Pipette } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Tool } from '../../lib/coloring/types'

/** The editor's tools, in toolbar order, with their keyboard shortcuts. */
export const tools: { id: Tool; label: string; key: string; icon: ReactNode }[] = [
  { id: 'fill', label: 'Fill', key: 'F', icon: <PaintBucket aria-hidden size={20} /> },
  { id: 'brush', label: 'Brush', key: 'B', icon: <Brush aria-hidden size={20} /> },
  { id: 'eraser', label: 'Eraser', key: 'E', icon: <Eraser aria-hidden size={20} /> },
  { id: 'picker', label: 'Pick color', key: 'I', icon: <Pipette aria-hidden size={20} /> },
  { id: 'move', label: 'Move', key: 'H', icon: <Hand aria-hidden size={20} /> },
]

export const toolName = (tool: Tool) => tools.find((t) => t.id === tool)!.label

export const brushLabels = { marker: 'Marker', crayon: 'Crayon', airbrush: 'Airbrush' } as const

export const fillStyleLabels = { solid: 'Solid', fade: 'Fade', glow: 'Glow', pattern: 'Pattern' } as const

export const patternLabels = { dots: 'Dots', stripes: 'Stripes', checks: 'Checks', stars: 'Stars', hearts: 'Hearts' } as const

export const fadeLabels: Record<number, string> = { 0: 'Left to right', 45: 'Diagonal down', 90: 'Top to bottom', 135: 'Diagonal up' }

export const mirrorLabel = (ways: number) => (ways === 0 ? 'Off' : ways === 2 ? '2-way mirror (left and right)' : `${ways} ways around the centre`)
