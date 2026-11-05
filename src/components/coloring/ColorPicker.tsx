import { ArrowLeftRight, Check } from 'lucide-react'
import { useId } from 'react'
import { palettes, type NamedColor } from '../../content/coloringSheets'

export type PickedColor = NamedColor
export type ColorSlot = 'a' | 'b'

/** Perceived lightness, so the check mark and outlines stay visible on light and dark swatches. */
const isLight = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  return r * 0.299 + g * 0.587 + b * 0.114 > 160
}

type Props = {
  color: PickedColor
  color2: PickedColor
  /** Show both colors (Fade, Glow and Pattern fills use two). */
  twoColors: boolean
  /** Which color a palette choice changes. */
  target: ColorSlot
  onTarget: (slot: ColorSlot) => void
  onPick: (color: PickedColor) => void
  onSwap: () => void
  paletteId: string
  onPalette: (id: string) => void
  recent: PickedColor[]
}

function Swatch({ swatch, selected, other, onPick }: { swatch: PickedColor; selected: boolean; other: boolean; onPick: (c: PickedColor) => void }) {
  const light = isLight(swatch.hex)
  return (
    <button
      type="button"
      aria-label={swatch.name}
      aria-pressed={selected}
      title={swatch.name}
      onClick={() => onPick(swatch)}
      className={`relative flex aspect-square min-h-11 w-full items-center justify-center rounded-md border ${light ? 'border-ink/30' : 'border-transparent'} ${
        selected ? 'ring-2 ring-ink ring-offset-2' : other ? 'ring-2 ring-ink/35 ring-offset-1' : ''
      }`}
      style={{ backgroundColor: swatch.hex }}
    >
      {selected && <Check aria-hidden size={20} strokeWidth={3} className={light ? 'text-ink' : 'text-white'} />}
    </button>
  )
}

function SlotButton({ label, color, active, onClick }: { label: string; color: PickedColor; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex min-h-12 min-w-0 flex-1 items-center gap-2 rounded-md border px-2 text-left ${active ? 'border-ink bg-sun/25 ring-1 ring-ink' : 'border-ink/20 bg-white hover:border-ink'}`}
    >
      <span aria-hidden className="size-8 shrink-0 rounded-md border border-ink/25" style={{ backgroundColor: color.hex }} />
      <span className="min-w-0">
        <span className="block text-xs text-ink-soft">{label}</span>
        <span className="block truncate text-sm font-semibold">{color.name}</span>
      </span>
    </button>
  )
}

export function ColorPicker({ color, color2, twoColors, target, onTarget, onPick, onSwap, paletteId, onPalette, recent }: Props) {
  const selectId = useId()
  const set = palettes.find((p) => p.id === paletteId) ?? palettes[0]
  const active = twoColors && target === 'b' ? color2 : color
  const other = twoColors ? (target === 'b' ? color : color2) : null
  const isCustom = !palettes.some((p) => p.colors.some((c) => c.hex === active.hex))

  return (
    <div>
      {twoColors ? (
        <div role="group" aria-label="Fill colors" className="flex items-stretch gap-2">
          <SlotButton label="Color 1" color={color} active={target === 'a'} onClick={() => onTarget('a')} />
          <button
            type="button"
            onClick={onSwap}
            aria-label="Swap colors"
            title="Swap colors"
            className="inline-flex w-11 shrink-0 items-center justify-center rounded-md border border-ink/20 bg-white hover:border-ink"
          >
            <ArrowLeftRight aria-hidden size={18} />
          </button>
          <SlotButton label="Color 2" color={color2} active={target === 'b'} onClick={() => onTarget('b')} />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <span aria-hidden className="size-10 shrink-0 rounded-md border border-ink/25" style={{ backgroundColor: color.hex }} />
          <p>
            <span className="block text-sm text-ink-soft">Current color</span>
            <span className="font-semibold">{color.name}</span>
          </p>
        </div>
      )}
      {twoColors && <p className="mt-2 text-sm text-ink-soft">Choosing a color below changes {target === 'a' ? 'Color 1' : 'Color 2'}.</p>}

      <div className="mt-4 flex items-center justify-between gap-3">
        <label htmlFor={selectId} className="font-medium">
          Palette
        </label>
        <select
          id={selectId}
          value={set.id}
          onChange={(event) => onPalette(event.target.value)}
          className="min-h-11 min-w-0 flex-1 rounded-md border border-ink/25 bg-white px-3 sm:max-w-48"
        >
          {palettes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div role="group" aria-label={`${set.label} colors`} className="mt-3 grid grid-cols-6 gap-2 sm:grid-cols-8 lg:grid-cols-6">
        {set.colors.map((swatch) => (
          <Swatch key={swatch.hex} swatch={swatch} selected={swatch.hex === active.hex} other={swatch.hex === other?.hex} onPick={onPick} />
        ))}
      </div>

      {recent.length > 0 && (
        <div className="mt-4">
          <h4 id={`${selectId}-recent`} className="mb-2 text-sm font-medium">
            Recently used
          </h4>
          <div role="group" aria-labelledby={`${selectId}-recent`} className="grid grid-cols-6 gap-2 sm:grid-cols-10 lg:grid-cols-6">
            {recent.map((swatch) => (
              <Swatch key={swatch.hex} swatch={swatch} selected={swatch.hex === active.hex} other={swatch.hex === other?.hex} onPick={onPick} />
            ))}
          </div>
        </div>
      )}

      <label className="mt-4 flex min-h-11 cursor-pointer items-center gap-3">
        <input
          type="color"
          value={active.hex}
          onChange={(event) => onPick({ hex: event.target.value.toLowerCase(), name: `Custom ${event.target.value.toLowerCase()}` })}
          className={`h-11 w-14 cursor-pointer rounded-md border bg-white p-1 ${isCustom ? 'border-ink ring-2 ring-ink ring-offset-2' : 'border-ink/25'}`}
        />
        <span>
          <span className="block font-medium">Custom color</span>
          <span className="block text-sm text-ink-soft">{isCustom ? `Selected: ${active.hex}` : 'Pick any color'}</span>
        </span>
      </label>
    </div>
  )
}
