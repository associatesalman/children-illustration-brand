import { ArrowDown, ArrowDownLeft, ArrowDownRight, ArrowRight } from 'lucide-react'
import { useId, type ReactNode } from 'react'
import { defToElement, FADE_ANGLES, fillPaint, PATTERN_MAX, PATTERN_MIN, PATTERNS } from '../../lib/coloring/fills'
import { MIRROR_WAYS } from '../../lib/coloring/paint'
import { FLOW_MIN, SIZE_MAX, SIZE_MIN } from '../../lib/coloring/prefs'
import type { BrushKind, FillStyle, Tool } from '../../lib/coloring/types'
import type { PickedColor } from './ColorPicker'
import { fillValue, sizeKey, type Settings, type Update } from './settings'
import { brushLabels, fadeLabels, fillStyleLabels, mirrorLabel, patternLabels, toolName, tools } from './tools'

const Dot = () => (
  <span aria-hidden className="text-ink/40">
    ·
  </span>
)

const Chip = ({ hex }: { hex: string }) => <span aria-hidden className="size-5 shrink-0 rounded-sm border border-ink/30" style={{ backgroundColor: hex }} />

/** The tool buttons, with the active tool and its main settings always visible next to them. */
export function ToolBar({ settings, onTool }: { settings: Settings; onTool: (tool: Tool) => void }) {
  const { tool } = settings
  const twoColors = tool === 'fill' && settings.fillStyle !== 'solid'
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <div role="group" aria-label="Tools" className="grid w-full grid-cols-5 gap-1 rounded-lg border border-ink/12 bg-white p-1 sm:flex sm:w-auto">
        {tools.map((t) => {
          const active = t.id === tool
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={active}
              aria-keyshortcuts={t.key}
              title={`${t.label} (${t.key})`}
              onClick={() => onTool(t.id)}
              className={`flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-md px-1 text-xs font-semibold sm:min-h-11 sm:flex-row sm:gap-2 sm:px-3.5 sm:text-base sm:font-medium ${
                active ? 'bg-sun text-ink ring-1 ring-ink/70' : 'text-ink hover:bg-paper'
              }`}
            >
              {t.icon}
              <span className="leading-tight">{t.label}</span>
            </button>
          )
        })}
      </div>
      {/* Not a live region: tool, color and size changes are announced where they happen. */}
      <p className="flex min-h-8 flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        <span className="font-semibold">
          {tool === 'brush' ? brushLabels[settings.brush] : tool === 'fill' ? `${fillStyleLabels[settings.fillStyle]} fill` : toolName(tool)}
        </span>
        {(tool === 'fill' || tool === 'brush') && (
          <>
            <Dot />
            <Chip hex={settings.color.hex} />
            <span>{settings.color.name}</span>
            {twoColors && (
              <>
                <span className="text-ink-soft">and</span>
                <Chip hex={settings.color2.hex} />
                <span>{settings.color2.name}</span>
              </>
            )}
          </>
        )}
        {(tool === 'brush' || tool === 'eraser') && (
          <>
            <Dot />
            <span>Size {settings.sizes[sizeKey(settings)]}</span>
            {settings.mirror > 0 && (
              <>
                <Dot />
                <span>Mirror {settings.mirror === 2 ? '2-way' : `${settings.mirror} ways`}</span>
              </>
            )}
          </>
        )}
      </p>
    </div>
  )
}

type SettingsProps = {
  settings: Settings
  update: Update
  /** CSS pixels per artwork unit, for the size previews. */
  scale: number
  returnTool: Tool
  lastPicked: PickedColor | null
}

const help: Record<Tool, string> = {
  fill: 'Tap or click a shape to fill it; drag to move the page. New settings apply to the next shape you fill.',
  brush: 'Draw with the current color. Two fingers move and zoom the page without painting.',
  eraser: 'Drag to erase brush paint. Tap a filled shape once to clear its fill. Fills and outlines aren’t touched by dragging.',
  picker: '',
  move: 'Drag to move the page. Pinch, or hold Ctrl and scroll, to zoom. Nothing on the drawing changes.',
}

/** Settings for the selected tool only. */
export function ToolSettings(props: SettingsProps) {
  const { tool } = props.settings
  return (
    <section aria-labelledby="tool-settings-title">
      <h3 id="tool-settings-title" className="mb-3 text-sm font-bold tracking-[0.08em] uppercase">
        {toolName(tool)} settings
      </h3>
      {tool === 'picker' ? <PickerHelp {...props} /> : <p className="text-sm text-ink-soft">{help[tool]}</p>}
      {tool === 'fill' && <FillOptions {...props} />}
      {tool === 'brush' && <BrushType {...props} />}
      {(tool === 'brush' || tool === 'eraser') && (
        <>
          <SizeControl {...props} />
          {tool === 'brush' && props.settings.brush === 'airbrush' && <FlowControl {...props} />}
          <StayInside {...props} />
          <MirrorControl {...props} />
        </>
      )}
    </section>
  )
}

/** A row of mutually exclusive buttons (a toggle group): each button says whether it's the chosen one. */
function Choice<T extends string | number>({
  label,
  value,
  options,
  onChange,
  columns,
}: {
  label: string
  value: T
  options: { value: T; label: string; icon?: ReactNode }[]
  onChange: (value: T) => void
  columns: string
}) {
  const id = useId()
  return (
    <div className="mt-4">
      <p id={id} className="mb-2 font-medium">
        {label}
      </p>
      <div role="group" aria-labelledby={id} className={`grid gap-1.5 ${columns}`}>
        {options.map((o) => {
          const active = o.value === value
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o.value)}
              className={`flex min-h-11 items-center justify-center gap-1.5 rounded-md border px-2 text-sm font-medium ${
                active ? 'border-ink bg-sun ring-1 ring-ink' : 'border-ink/20 bg-white hover:border-ink'
              }`}
            >
              {o.icon}
              {o.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function BrushType({ settings, update }: SettingsProps) {
  const notes: Record<BrushKind, string> = {
    marker: 'Smooth, solid color.',
    crayon: 'Waxy, with a paper-grain texture.',
    airbrush: 'Soft spray that builds up the longer you hold it in one place.',
  }
  return (
    <>
      <Choice
        label="Brush"
        value={settings.brush}
        options={(['marker', 'crayon', 'airbrush'] as const).map((b) => ({ value: b, label: brushLabels[b] }))}
        onChange={(brush) => update({ brush })}
        columns="grid-cols-3"
      />
      <p className="mt-2 text-sm text-ink-soft">{notes[settings.brush]}</p>
    </>
  )
}

const fadeIcons: Record<number, ReactNode> = {
  0: <ArrowRight aria-hidden size={18} />,
  45: <ArrowDownRight aria-hidden size={18} />,
  90: <ArrowDown aria-hidden size={18} />,
  135: <ArrowDownLeft aria-hidden size={18} />,
}

function FillOptions(props: SettingsProps) {
  const { settings, update } = props
  const notes: Record<FillStyle, string> = {
    solid: 'One color across the whole shape.',
    fade: 'Blends from Color 1 to Color 2 across the shape.',
    glow: 'Color 1 in the middle of the shape, fading out to Color 2 at its edges.',
    pattern: 'Color 1 shapes on a Color 2 background. Patterns line up across neighbouring shapes.',
  }
  return (
    <>
      <Choice
        label="Fill style"
        value={settings.fillStyle}
        options={(['solid', 'fade', 'glow', 'pattern'] as const).map((f) => ({ value: f, label: fillStyleLabels[f] }))}
        onChange={(fillStyle) => update({ fillStyle })}
        columns="grid-cols-4"
      />
      <p className="mt-2 text-sm text-ink-soft">{notes[settings.fillStyle]}</p>
      {settings.fillStyle === 'fade' && (
        <div className="mt-4">
          <p id="fade-direction" className="mb-2 font-medium">
            Direction
          </p>
          <div role="group" aria-labelledby="fade-direction" className="grid grid-cols-4 gap-1.5">
            {FADE_ANGLES.map((angle) => {
              const active = settings.fadeAngle === angle
              return (
                <button
                  key={angle}
                  type="button"
                  aria-pressed={active}
                  aria-label={fadeLabels[angle]}
                  title={fadeLabels[angle]}
                  onClick={() => update({ fadeAngle: angle })}
                  className={`flex min-h-11 items-center justify-center rounded-md border ${active ? 'border-ink bg-sun ring-1 ring-ink' : 'border-ink/20 bg-white hover:border-ink'}`}
                >
                  {fadeIcons[angle]}
                </button>
              )
            })}
          </div>
          <p className="mt-2 text-sm text-ink-soft">{fadeLabels[settings.fadeAngle]}. Swap the colors to reverse it.</p>
        </div>
      )}
      {settings.fillStyle === 'pattern' && <PatternOptions {...props} />}
    </>
  )
}

/** The pattern drawn at its real size on screen at the current zoom, with the same definitions the drawing uses. */
function PatternPreview({ settings, scale }: { settings: Settings; scale: number }) {
  const box = 72
  const units = box / Math.max(scale, 0.05)
  const ref = (svg: SVGSVGElement | null) => {
    if (!svg) return
    const { fill, def } = fillPaint('preview', fillValue(settings), { box: { x: 0, y: 0, w: units, h: units }, matrix: new DOMMatrix() })
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
    if (def) defs.append(defToElement(def))
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('width', String(units))
    rect.setAttribute('height', String(units))
    rect.setAttribute('fill', fill)
    svg.replaceChildren(defs, rect)
  }
  return (
    <svg
      key={`${settings.pattern}-${settings.patternSize}-${settings.color.hex}-${settings.color2.hex}-${Math.round(units)}`}
      ref={ref}
      aria-hidden
      viewBox={`0 0 ${units} ${units}`}
      className="size-[4.5rem] shrink-0 rounded-md border border-ink/12"
    />
  )
}

function PatternOptions({ settings, update, scale }: SettingsProps) {
  const id = useId()
  return (
    <>
      <Choice
        label="Pattern"
        value={settings.pattern}
        options={PATTERNS.map((p) => ({ value: p, label: patternLabels[p] }))}
        onChange={(pattern) => update({ pattern })}
        columns="grid-cols-3"
      />
      <div className="mt-4">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor={id} className="font-medium">
            Pattern size
          </label>
          <output htmlFor={id} className="font-semibold tabular-nums">
            {settings.patternSize}
          </output>
        </div>
        <div className="mt-2 flex items-center gap-4">
          <input
            id={id}
            type="range"
            min={PATTERN_MIN}
            max={PATTERN_MAX}
            step={4}
            value={settings.patternSize}
            onChange={(event) => update({ patternSize: Number(event.target.value) })}
            className="coloring-range min-h-11 flex-1"
          />
          <PatternPreview settings={settings} scale={scale} />
        </div>
        <p className="mt-1 text-sm text-ink-soft">Preview shown at the current zoom.</p>
      </div>
    </>
  )
}

function PickerHelp({ returnTool, lastPicked }: SettingsProps) {
  return (
    <>
      <p className="text-sm text-ink-soft">
        Tap or click anywhere on the drawing to use the color you see there. Afterwards you&rsquo;ll go back to the{' '}
        {toolName(returnTool)}. Drag to move the page.
      </p>
      {lastPicked && (
        <p className="mt-3 flex items-center gap-2 text-sm">
          <span aria-hidden className="size-6 rounded-sm border border-ink/30" style={{ backgroundColor: lastPicked.hex }} />
          Last picked: <span className="font-semibold">{lastPicked.name}</span>
        </p>
      )}
    </>
  )
}

const PREVIEW = 72

function SizeControl({ settings, update, scale }: SettingsProps) {
  const id = useId()
  const key = sizeKey(settings)
  const size = settings.sizes[key]
  const eraser = key === 'eraser'
  const onScreen = size * scale
  const shown = Math.max(2, Math.min(PREVIEW, onScreen))
  const look = eraser
    ? { className: 'border-2 border-dashed border-ink/60 bg-white' }
    : key === 'airbrush'
      ? { className: '', style: { background: `radial-gradient(circle, ${settings.color.hex} 0%, ${settings.color.hex}b3 35%, ${settings.color.hex}38 70%, transparent 100%)` } }
      : { className: 'border border-ink/20', style: { backgroundColor: settings.color.hex } }
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="font-medium">
          {eraser ? 'Eraser size' : 'Brush size'}
        </label>
        <output htmlFor={id} className="font-semibold tabular-nums">
          {size}
        </output>
      </div>
      <div className="mt-2 flex items-center gap-4">
        <input
          id={id}
          type="range"
          min={SIZE_MIN}
          max={SIZE_MAX}
          step={2}
          value={size}
          onChange={(event) => update({ sizes: { ...settings.sizes, [key]: Number(event.target.value) } })}
          aria-describedby={`${id}-hint`}
          className="coloring-range min-h-11 flex-1"
        />
        <span aria-hidden className="flex size-[4.75rem] shrink-0 items-center justify-center rounded-md border border-ink/12 bg-white">
          <span className={`rounded-full ${look.className}`} style={{ width: shown, height: shown, ...look.style }} />
        </span>
      </div>
      <p id={`${id}-hint`} className="mt-1 text-sm text-ink-soft">
        {onScreen > PREVIEW ? 'Preview shown smaller than actual size at this zoom.' : 'Preview shown at the current zoom.'} Keys: [ and ].
      </p>
    </div>
  )
}

function FlowControl({ settings, update }: SettingsProps) {
  const id = useId()
  const percent = Math.round(settings.flow * 100)
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="font-medium">
          Flow
        </label>
        <output htmlFor={id} className="font-semibold tabular-nums">
          {percent}%
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={Math.round(FLOW_MIN * 100)}
        max={100}
        step={5}
        value={percent}
        aria-valuetext={`${percent}%`}
        aria-describedby={`${id}-hint`}
        onChange={(event) => update({ flow: Number(event.target.value) / 100 })}
        className="coloring-range mt-2 min-h-11 w-full"
      />
      <p id={`${id}-hint`} className="mt-1 text-sm text-ink-soft">
        How much paint each pass adds. Lower flow builds color up gently.
      </p>
    </div>
  )
}

function StayInside({ settings, update }: SettingsProps) {
  const id = useId()
  const { stayInside, tool } = settings
  return (
    <div className="mt-5 border-t border-ink/10 pt-4">
      <div className="flex items-center justify-between gap-4">
        <span id={`${id}-label`} className="font-medium">
          Stay inside the lines
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={stayInside}
          aria-labelledby={`${id}-label`}
          aria-describedby={`${id}-help`}
          aria-keyshortcuts="L"
          onClick={() => update({ stayInside: !stayInside })}
          className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border-2 ${stayInside ? 'border-ink bg-ink' : 'border-ink/40 bg-white'}`}
        >
          <span aria-hidden className={`absolute size-5 rounded-full ${stayInside ? 'left-7 bg-sun' : 'left-1 bg-ink/50'}`} />
        </button>
      </div>
      <p id={`${id}-help`} className="mt-2 text-sm text-ink-soft">
        {stayInside
          ? `On: each stroke stays inside the shape where it starts${tool === 'eraser' ? ', so erasing only affects that shape' : ''}.`
          : `Off: ${tool === 'eraser' ? 'erase' : 'paint'} freely across shapes. The outlines always stay on top.`}{' '}
        Key: L.
      </p>
    </div>
  )
}

function MirrorControl({ settings, update }: SettingsProps) {
  const id = useId()
  const { mirror } = settings
  return (
    <div className="mt-5 border-t border-ink/10 pt-4">
      <label htmlFor={id} className="font-medium">
        Mirror strokes
      </label>
      <select
        id={id}
        value={mirror}
        onChange={(event) => update({ mirror: Number(event.target.value) })}
        aria-describedby={`${id}-help`}
        className="mt-2 min-h-11 w-full rounded-md border border-ink/25 bg-white px-3"
      >
        {[0, ...MIRROR_WAYS].map((ways) => (
          <option key={ways} value={ways}>
            {mirrorLabel(ways)}
          </option>
        ))}
      </select>
      <p id={`${id}-help`} className="mt-2 text-sm text-ink-soft">
        {mirror === 0
          ? 'Paint copies of each stroke: reflected left and right, or repeated around the centre of the page.'
          : mirror === 2
            ? 'Each stroke is copied as a reflection across the dashed line down the middle of the page.'
            : `Each stroke is repeated ${mirror} times around the centre of the page, along the dashed guides.`}{' '}
        Strokes only: filling a shape or tapping to clear one still affects just that shape.
        {settings.stayInside && mirror > 0 && ' Each copy stays inside the shape where it starts.'}
      </p>
    </div>
  )
}
