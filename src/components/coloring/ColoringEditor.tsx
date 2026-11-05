import { AlertTriangle, ArrowLeft, Check, Loader2, Maximize, Redo2, RotateCcw, Trash2, Undo2, ZoomIn, ZoomOut } from 'lucide-react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { colorName, levelLabels, palettes, type SheetEntry } from '../../content/coloringSheets'
import { buildLayer, regionOutline } from '../../lib/coloring/artDom'
import { renderThumbnail, sampleColor, type ComposeInput } from '../../lib/coloring/compose'
import { defToElement, fillPaint } from '../../lib/coloring/fills'
import { RegionGeometry } from '../../lib/coloring/geometry'
import { loadSheet } from '../../lib/coloring/loadSheet'
import { Painter } from '../../lib/coloring/painter'
import { loadPrefs, savePrefs, SIZE_MAX, SIZE_MIN, withRecent } from '../../lib/coloring/prefs'
import { clearAllSaved, openSession, type ColoringSession } from '../../lib/coloring/session'
import { writeThumb } from '../../lib/coloring/storage'
import type { SaveStatus, Tool } from '../../lib/coloring/types'
import { MAX_ZOOM, MIN_ZOOM, Viewport, type ClientPoint, type GestureMode } from '../../lib/coloring/viewport'
import { Container } from '../ui/Container'
import { ColorPicker, type ColorSlot, type PickedColor } from './ColorPicker'
import { ConfirmDialog } from './ConfirmDialog'
import { OutputMessage, SaveMenu } from './SaveMenu'
import { fillDescription, fillValue, sizeKey, type Settings, type Update } from './settings'
import { ToolBar, ToolSettings } from './ToolPanel'
import { brushLabels, toolName, tools } from './tools'
import { useOutput, type Output } from './useOutput'

type LoadState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; session: ColoringSession; notice?: string }

type Announce = (text: string) => void

/**
 * Loads the selected sheet and its saved coloring, then shows the workspace. The sheet header stays mounted from
 * loading to ready, so keyboard focus placed on it when the sheet opens isn't lost.
 */
export function ColoringEditor({ entry }: { entry: SheetEntry }) {
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const [message, setMessage] = useState({ text: '', id: 0 })
  const [actionsSlot, setActionsSlot] = useState<HTMLDivElement | null>(null)
  const announce = useCallback<Announce>((text) => setMessage((m) => ({ text, id: m.id + 1 })), [])

  useEffect(() => {
    let cancelled = false
    loadSheet(entry)
      .then(openSession)
      .then((result) => !cancelled && setState({ status: 'ready', ...result }))
      .catch(() => !cancelled && setState({ status: 'error' }))
    return () => {
      cancelled = true
    }
  }, [entry, attempt])

  const reload = useCallback(() => {
    setState({ status: 'loading' })
    setAttempt((n) => n + 1)
  }, [])

  const session = state.status === 'ready' ? state.session : null

  return (
    <Container wide className="pb-12 sm:pb-16">
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-3">
        <a
          href="/coloring-studio"
          className="inline-flex min-h-11 items-center gap-2 rounded-md border border-ink/20 px-4 font-medium hover:border-ink"
        >
          <ArrowLeft aria-hidden size={18} /> All sheets
        </a>
        <div className="flex min-w-0 items-center gap-3">
          <h2 id="sheet-title" tabIndex={-1} className="truncate text-xl font-semibold sm:text-2xl">
            {entry.title}
          </h2>
          <span className="shrink-0 rounded-md border border-ink/20 px-2.5 py-0.5 text-sm font-semibold">
            <span className="sr-only">Difficulty: </span>
            {levelLabels[entry.level]}
          </span>
        </div>
        <div ref={setActionsSlot} className="flex w-full flex-wrap items-center gap-2 lg:ml-auto lg:w-auto" />
      </div>

      {session ? (
        <Workspace
          key={session.sheet.id}
          session={session}
          notice={state.status === 'ready' ? state.notice : undefined}
          announce={announce}
          actionsSlot={actionsSlot}
          onReload={reload}
        />
      ) : (
        <div className="flex h-[60svh] min-h-80 items-center justify-center rounded-lg border border-ink/10 bg-[#efede8] p-6 text-center">
          {state.status === 'loading' ? (
            <p role="status" className="flex items-center gap-2 text-ink-soft">
              <Loader2 aria-hidden size={20} className="motion-safe:animate-spin" /> Getting your drawing ready&hellip;
            </p>
          ) : (
            <div role="alert">
              <p className="font-medium">This drawing couldn&rsquo;t be loaded. Please check your connection.</p>
              <button type="button" onClick={reload} className="mt-4 min-h-11 rounded-md bg-ink px-5 font-medium text-white">
                Try again
              </button>
            </div>
          )}
        </div>
      )}

      {/* One persistent live region; a trailing space on alternate messages makes a repeated message re-announce. */}
      <p aria-live="polite" className="sr-only">
        {message.id % 2 ? `${message.text} ` : message.text}
      </p>
    </Container>
  )
}

const saveMessages: Record<string, string> = {
  full: 'Your device storage is full, so your latest changes aren’t saved. Nothing has been deleted. Free up space on this device (or clear saved coloring you no longer need), then try again. You can also download a PNG copy now.',
  unavailable:
    'This browser isn’t allowing saving here (for example, in some private windows). You can keep coloring, but your work won’t be kept after you leave. Download a PNG to keep a copy.',
  failed: 'Your latest change couldn’t be saved on this device. Your work is still here on the page. Try saving again.',
  blocked:
    'Your saved coloring for this drawing couldn’t be loaded, so nothing will be saved over it. Changes you make now aren’t saved. Try loading it again.',
}

function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status.state === 'saving') {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-ink-soft">
        <Loader2 aria-hidden size={16} className="motion-safe:animate-spin" /> Saving&hellip;
      </span>
    )
  }
  if (status.state === 'saved') {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-ink-soft">
        <Check aria-hidden size={16} /> Saved on this device
      </span>
    )
  }
  if (status.state === 'error' || status.state === 'blocked') {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red-dark">
        <AlertTriangle aria-hidden size={16} /> Not saved
      </span>
    )
  }
  return null
}

function ActionButton({ id, label, icon, onClick, disabled, shortcut }: { id?: string; label: string; icon: ReactNode; onClick: () => void; disabled?: boolean; shortcut?: string }) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-keyshortcuts={shortcut}
      title={shortcut ? `${label} (${shortcut.replace('Control', 'Ctrl')})` : label}
      className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-ink/20 bg-white px-2.5 text-sm font-medium hover:border-ink disabled:cursor-not-allowed disabled:border-ink/10 disabled:text-ink/35 sm:gap-2 sm:px-3.5 sm:text-base"
    >
      {icon}
      {label}
    </button>
  )
}

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

const blockedForShortcuts = (event: KeyboardEvent) =>
  isTyping(event.target) || !!document.querySelector('dialog[open]') || (event.target instanceof Element && !!event.target.closest('[role="menu"]'))

/** Undo, redo, Start Over, Save & Print and the save indicator, plus the undo/redo keyboard shortcuts. */
function Actions({ session, announce, onStartOver, output, beforeHistory }: { session: ColoringSession; announce: Announce; onStartOver: () => void; output: Output; beforeHistory: () => void }) {
  const snapshot = useSyncExternalStore(session.subscribe, session.getSnapshot)
  const saveStatus = useSyncExternalStore(session.saves.subscribe, session.saves.getStatus)

  const undo = useCallback(() => {
    beforeHistory()
    if (session.undo()) announce('Undone.')
  }, [session, announce, beforeHistory])
  const redo = useCallback(() => {
    beforeHistory()
    if (session.redo()) announce('Redone.')
  }, [session, announce, beforeHistory])

  // Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z and Ctrl/Cmd+Y, except while typing in a field or when a dialog is open.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || event.altKey || blockedForShortcuts(event)) return
      const key = event.key.toLowerCase()
      if (key === 'z' && !event.shiftKey) undo()
      else if ((key === 'z' && event.shiftKey) || key === 'y') redo()
      else return
      event.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo])

  // Tell screen reader users once when saving stops working; routine saves aren't announced.
  const lastError = useRef<string | null>(null)
  useEffect(() => {
    const reason = saveStatus.state === 'error' ? saveStatus.reason : saveStatus.state === 'blocked' ? 'blocked' : null
    if (reason && reason !== lastError.current) announce(saveMessages[reason])
    lastError.current = reason
  }, [saveStatus, announce])

  return (
    <>
      <ActionButton id="coloring-undo" label="Undo" icon={<Undo2 aria-hidden size={18} />} onClick={undo} disabled={!snapshot.canUndo} shortcut="Control+Z" />
      <ActionButton label="Redo" icon={<Redo2 aria-hidden size={18} />} onClick={redo} disabled={!snapshot.canRedo} shortcut="Control+Y" />
      <ActionButton label="Start Over" icon={<RotateCcw aria-hidden size={18} />} onClick={onStartOver} disabled={snapshot.isEmpty} />
      <SaveMenu output={output} />
      <span data-save-status className="basis-full lg:basis-auto">
        <SaveIndicator status={saveStatus} />
      </span>
    </>
  )
}

const modeFor = (tool: Tool): GestureMode =>
  tool === 'brush' ? 'draw' : tool === 'eraser' ? 'tap-draw' : tool === 'move' ? 'pan' : 'tap-pan'

const SVG_NS = 'http://www.w3.org/2000/svg'
const paletteIds = palettes.map((p) => p.id)

/** Static mirror guides in artwork units: the centre line, or spokes around the centre. Never part of any export. */
function mirrorGuide(target: SVGSVGElement, ways: number, w: number, h: number) {
  target.replaceChildren()
  if (ways < 2) return
  const line = (x2: number, y2: number) => {
    const el = document.createElementNS(SVG_NS, 'line')
    el.setAttribute('x1', String(w / 2))
    el.setAttribute('y1', String(ways === 2 ? 0 : h / 2))
    el.setAttribute('x2', String(x2))
    el.setAttribute('y2', String(y2))
    el.setAttribute('stroke', '#d62828')
    el.setAttribute('stroke-opacity', '0.55')
    el.setAttribute('stroke-width', '1.5')
    el.setAttribute('stroke-dasharray', '8 8')
    el.setAttribute('vector-effect', 'non-scaling-stroke')
    target.append(el)
  }
  if (ways === 2) {
    line(w / 2, h)
    return
  }
  const reach = Math.hypot(w, h)
  for (let k = 0; k < ways; k++) {
    const a = -Math.PI / 2 + (k * Math.PI * 2) / ways
    line(w / 2 + Math.cos(a) * reach, h / 2 + Math.sin(a) * reach)
  }
}

function Workspace({
  session,
  notice,
  announce,
  actionsSlot,
  onReload,
}: {
  session: ColoringSession
  notice?: string
  announce: Announce
  actionsSlot: HTMLElement | null
  onReload: () => void
}) {
  const { sheet } = session
  const saveStatus = useSyncExternalStore(session.saves.subscribe, session.saves.getStatus)
  const [initial] = useState(() => loadPrefs(paletteIds))
  const [settings, setSettings] = useState<Settings>(() => ({
    tool: 'fill',
    brush: initial.brush,
    sizes: initial.sizes,
    flow: initial.flow,
    color: initial.color,
    color2: initial.color2,
    stayInside: initial.stayInside,
    mirror: 0,
    fillStyle: initial.fillStyle,
    fadeAngle: initial.fadeAngle,
    pattern: initial.pattern,
    patternSize: initial.patternSize,
  }))
  const [paletteId, setPaletteId] = useState(initial.palette)
  const [recent, setRecent] = useState<PickedColor[]>(initial.recent)
  const [target, setTarget] = useState<ColorSlot>('a')
  const [returnTool, setReturnTool] = useState<Tool>('fill')
  const [lastPicked, setLastPicked] = useState<PickedColor | null>(null)
  const [selected, setSelected] = useState('')
  const [viewport, setViewport] = useState<Viewport | null>(null)
  const [hint, setHint] = useState<{ text: string; id: number } | null>(null)
  const [confirm, setConfirm] = useState<null | 'start-over' | 'clear-all'>(null)
  const [clearResult, setClearResult] = useState<{ ok: boolean; text: string } | null>(null)
  const { tool } = settings
  const update = useCallback<Update>((patch) => setSettings((s) => ({ ...s, ...patch })), [])

  const stageRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  const regionsRef = useRef<SVGSVGElement>(null)
  const paintRef = useRef<HTMLCanvasElement>(null)
  const liveRef = useRef<HTMLCanvasElement>(null)
  const linesRef = useRef<SVGSVGElement>(null)
  const highlightsRef = useRef<SVGSVGElement>(null)
  const guideRef = useRef<SVGSVGElement>(null)
  const outlineRef = useRef<SVGSVGElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const regionEls = useRef(new Map<string, SVGGraphicsElement>())
  const geometryRef = useRef<RegionGeometry | null>(null)
  const painterRef = useRef<Painter | null>(null)
  const viewportRef = useRef<Viewport | null>(null)
  const labels = useRef(new Map(sheet.regions.map((r) => [r.id, r.label])))

  const settingsRef = useRef(settings)
  useLayoutEffect(() => {
    settingsRef.current = settings
    const brushActive = tool === 'brush' || tool === 'eraser'
    if (painterRef.current) painterRef.current.brushActive = brushActive
    if (stageRef.current) stageRef.current.dataset.tool = tool
    if (!brushActive && cursorRef.current) cursorRef.current.hidden = true
  })

  // Remember tool preferences between visits (never the artwork, which is saved in IndexedDB).
  useEffect(() => {
    const timer = setTimeout(() => {
      const { brush, sizes, flow, color, color2, stayInside, fillStyle, fadeAngle, pattern, patternSize } = settings
      savePrefs({ brush, sizes, flow, color, color2, stayInside, fillStyle, fadeAngle, pattern, patternSize, palette: paletteId, recent })
    }, 300)
    return () => clearTimeout(timer)
  }, [settings, paletteId, recent])

  const twoColors = tool === 'fill' && settings.fillStyle !== 'solid'
  const pickColor = useCallback(
    (c: PickedColor) => update(twoColors && target === 'b' ? { color2: c } : { color: c }),
    [update, twoColors, target],
  )
  const rememberColor = useCallback((c: PickedColor) => setRecent((r) => (r[0]?.hex === c.hex ? r : withRecent(r, c))), [])

  const showHint = useCallback(
    (text: string) => {
      setHint((h) => ({ text, id: (h?.id ?? 0) + 1 }))
      announce(text)
    },
    [announce],
  )
  useEffect(() => {
    if (!hint) return
    const timer = setTimeout(() => setHint(null), 4000)
    return () => clearTimeout(timer)
  }, [hint])

  const returnToolRef = useRef(returnTool)
  useLayoutEffect(() => {
    returnToolRef.current = returnTool
  }, [returnTool])
  const showHintRef = useRef(showHint)
  useLayoutEffect(() => {
    showHintRef.current = showHint
  }, [showHint])

  const getInput = useCallback((): ComposeInput | null => {
    const geometry = geometryRef.current
    return geometry ? { sheet, doc: session.document, geometry } : null
  }, [sheet, session])
  const output = useOutput(getInput, announce)

  const fillRegion = useCallback(
    (id: string) => {
      const s = settingsRef.current
      if (session.fill(id, fillValue(s))) {
        announce(`${labels.current.get(id) ?? 'Shape'} filled with ${fillDescription(s)}.`)
        rememberColor(s.color)
        if (s.fillStyle !== 'solid') rememberColor(s.color2)
      }
    },
    [session, announce, rememberColor],
  )

  const setTool = useCallback(
    (next: Tool, spoken = false) => {
      const current = settingsRef.current.tool
      if (next === current) return
      viewportRef.current?.cancelGesture()
      if (next === 'picker') setReturnTool(current === 'fill' || current === 'brush' ? current : 'brush')
      update({ tool: next })
      if (spoken) announce(`${toolName(next)} selected.`)
    },
    [announce, update],
  )

  const pickAt = useCallback(
    async (x: number, y: number) => {
      const input = getInput()
      const paint = paintRef.current
      if (!input || !paint) return
      if (x < 0 || y < 0 || x > sheet.width || y > sheet.height) {
        showHint('Tap on the drawing to pick a color from it.')
        return
      }
      try {
        const hex = await sampleColor(input, paint, x, y)
        const picked = { hex, name: colorName(hex) }
        const back = returnToolRef.current
        const s = settingsRef.current
        const second = back === 'fill' && s.fillStyle !== 'solid' && target === 'b'
        update(second ? { color2: picked, tool: back } : { color: picked, tool: back })
        setLastPicked(picked)
        announce(`Picked ${picked.name}${second ? ' as Color 2' : ''}. Back to the ${toolName(back)}.`)
      } catch {
        showHint('That color couldn’t be read. Please try again.')
      }
    },
    [getInput, sheet, announce, showHint, update, target],
  )

  const onTap = useCallback(
    (point: ClientPoint) => {
      const vp = viewportRef.current
      const geometry = geometryRef.current
      if (!vp || !geometry) return
      const { x, y } = vp.clientToArt(point.clientX, point.clientY)
      const current = settingsRef.current.tool
      if (current === 'picker') {
        void pickAt(x, y)
        return
      }
      const region = geometry.regionAt(x, y)
      if (current === 'fill') {
        if (region) fillRegion(region)
      } else if (current === 'eraser') {
        if (region && session.fills[region]) {
          session.fill(region, null)
          announce(`${labels.current.get(region) ?? 'Shape'} fill cleared.`)
        } else {
          showHint('There’s no fill to clear here. Drag to erase brush paint.')
        }
      }
    },
    [session, fillRegion, pickAt, announce, showHint],
  )
  const onTapRef = useRef(onTap)
  useLayoutEffect(() => {
    onTapRef.current = onTap
  }, [onTap])

  // Build the drawing once per sheet, then repaint only what changes. React never re-renders the artwork; drawing,
  // dragging and pinching work on the DOM and canvases directly (see Viewport and Painter).
  useLayoutEffect(() => {
    const els = regionEls.current
    els.clear()
    const regionsSvg = regionsRef.current!
    buildLayer(regionsSvg, sheet.regionLayer, (id, el) => els.set(id, el))
    buildLayer(linesRef.current!, sheet.lineLayer)
    buildLayer(highlightsRef.current!, sheet.highlightLayer)
    const geometry = new RegionGeometry([...els])
    geometryRef.current = geometry
    // Styled fills (fades, glows, patterns) are definitions referenced by the region; see fills.ts.
    const defs = document.createElementNS(SVG_NS, 'defs')
    regionsSvg.prepend(defs)
    const defEls = new Map<string, SVGElement>()
    const paintFill = (id: string) => {
      const el = els.get(id)
      if (!el) return
      const { fill, def } = fillPaint(id, session.fills[id], geometry.get(id))
      defEls.get(id)?.remove()
      defEls.delete(id)
      if (def) {
        const node = defToElement(def)
        defs.append(node)
        defEls.set(id, node)
      }
      el.setAttribute('fill', fill)
    }
    els.forEach((_, id) => paintFill(id))
    const stopFills = session.onChange((change) => {
      if ('all' in change) els.forEach((_, id) => paintFill(id))
      else if ('regions' in change) change.regions.forEach(paintFill)
      if ('stroke' in change && change.stroke.tool !== 'eraser') {
        const hex = change.stroke.color
        const s = settingsRef.current
        rememberColor(s.color.hex === hex ? s.color : { hex, name: colorName(hex) })
      }
    })

    let painter: Painter | null = null
    const vp = new Viewport({
      stage: stageRef.current!,
      page: pageRef.current!,
      artWidth: sheet.width,
      artHeight: sheet.height,
      getMode: () => modeFor(settingsRef.current.tool),
      onTap: (point) => onTapRef.current(point),
      stroke: {
        start: (point, type) => painter?.start(point, type),
        move: (points) => painter?.move(points),
        end: () => painter?.end(),
        cancel: () => painter?.cancel(),
      },
      onHover: (point, type) => painter?.hover(point, type),
    })
    painter = new Painter(
      {
        session,
        geometry,
        paintCanvas: paintRef.current!,
        liveCanvas: liveRef.current!,
        cursor: cursorRef.current!,
        getSettings: () => {
          const s = settingsRef.current
          const eraser = s.tool === 'eraser'
          return { tool: eraser ? 'eraser' : s.brush, color: s.color.hex, size: s.sizes[sizeKey(s)], flow: s.flow, stayInside: s.stayInside, mirror: s.mirror }
        },
        onRejected: () =>
          showHintRef.current(
            settingsRef.current.mirror
              ? 'None of the mirrored copies would start inside a shape. Start somewhere else, or turn off “Stay inside the lines”.'
              : 'Start your stroke inside a shape. Or turn off “Stay inside the lines” to paint anywhere.',
          ),
      },
      vp,
    )
    const s = settingsRef.current
    painter.brushActive = s.tool === 'brush' || s.tool === 'eraser'
    painterRef.current = painter
    viewportRef.current = vp
    setViewport(vp)
    return () => {
      stopFills()
      vp.destroy()
      painter.destroy()
      painterRef.current = null
      viewportRef.current = null
    }
  }, [sheet, session, rememberColor])

  // Mirror guides, shown only while a stroke tool is in use with mirroring on.
  const guideWays = tool === 'brush' || tool === 'eraser' ? settings.mirror : 0
  useEffect(() => {
    if (guideRef.current) mirrorGuide(guideRef.current, guideWays, sheet.width, sheet.height)
  }, [guideWays, sheet])

  // Keyboard selection outline, drawn above everything.
  useEffect(() => {
    const outline = outlineRef.current
    if (!outline) return
    outline.replaceChildren()
    const el = selected ? regionEls.current.get(selected) : undefined
    if (el) outline.append(regionOutline(el))
  }, [selected, sheet])

  // A colored thumbnail for the library, made shortly after saving settles (and when leaving the sheet).
  useEffect(() => {
    let timer = 0
    const make = () => {
      timer = 0
      const input = getInput()
      if (!input || session.snapshot.isEmpty) return
      renderThumbnail(input)
        .then((blob) => blob && writeThumb(sheet.id, blob))
        .catch(() => {}) // a missing thumbnail only means the library shows the plain drawing
    }
    const schedule = () => {
      clearTimeout(timer)
      timer = window.setTimeout(make, 1200)
    }
    session.saves.setOnWritten(schedule)
    if (!session.snapshot.isEmpty) schedule() // e.g. coloring saved before thumbnails existed
    return () => {
      session.saves.setOnWritten(null)
      if (timer) {
        clearTimeout(timer)
        make()
      }
    }
  }, [session, sheet, getInput])

  // Tool shortcuts. Ignored while typing, in menus and dialogs, and with Ctrl, Cmd or Alt held.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && viewportRef.current?.isDrawing) {
        viewportRef.current.cancelGesture()
        announce('Stroke cancelled.')
        event.preventDefault()
        return
      }
      if (event.ctrlKey || event.metaKey || event.altKey || event.repeat || blockedForShortcuts(event)) return
      const key = event.key.toLowerCase()
      const match = tools.find((t) => t.key.toLowerCase() === key)
      const s = settingsRef.current
      if (match) setTool(match.id, true)
      else if (key === 'l') {
        update({ stayInside: !s.stayInside })
        announce(`Stay inside the lines ${s.stayInside ? 'off' : 'on'}.`)
      } else if ((key === '[' || key === ']') && (s.tool === 'brush' || s.tool === 'eraser')) {
        const k = sizeKey(s)
        const next = Math.min(SIZE_MAX, Math.max(SIZE_MIN, s.sizes[k] + (key === ']' ? 4 : -4)))
        update({ sizes: { ...s.sizes, [k]: next } })
        announce(`${s.tool === 'eraser' ? 'Eraser' : brushLabels[s.brush]} size ${next}.`)
      } else return
      event.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setTool, announce, update])

  const scale = useSyncExternalStore(viewport?.subscribe ?? noopSubscribe, () => viewport?.scale ?? 0)

  const clearAll = async () => {
    setConfirm(null)
    setClearResult(null)
    viewportRef.current?.cancelGesture()
    try {
      await clearAllSaved()
      const text = 'All saved coloring was removed from this device.'
      setClearResult({ ok: true, text })
      announce(text)
    } catch {
      const text = 'Saved coloring couldn’t be cleared. Nothing was removed, and your current drawing is still here. Please try again.'
      setClearResult({ ok: false, text })
      announce(text)
    }
  }

  const groups = Object.entries(sheet.parts)
    .map(([part, label]) => ({ part, label, regions: sheet.regions.filter((r) => r.part === part) }))
    .filter((g) => g.regions.length)
  const viewBox = `0 0 ${sheet.width} ${sheet.height}`
  const saveProblem = saveStatus.state === 'error' ? saveStatus.reason : saveStatus.state === 'blocked' ? 'blocked' : null

  return (
    <>
      {actionsSlot &&
        createPortal(
          <Actions
            session={session}
            announce={announce}
            onStartOver={() => setConfirm('start-over')}
            output={output}
            beforeHistory={() => viewportRef.current?.cancelGesture()}
          />,
          actionsSlot,
        )}

      {notice && <p className="mb-4 rounded-lg border-2 border-sun bg-white p-3">{notice}</p>}
      <OutputMessage output={output} />
      {saveProblem && (
        <div className="mb-4 flex flex-wrap items-start gap-x-4 gap-y-3 rounded-lg border-2 border-brand-red bg-white p-3">
          <p className="flex min-w-0 flex-1 basis-80 items-start gap-2">
            <AlertTriangle aria-hidden size={20} className="mt-0.5 shrink-0 text-brand-red-dark" />
            {saveMessages[saveProblem]}
          </p>
          <div className="flex flex-wrap gap-2">
            {saveProblem === 'blocked' ? (
              <button type="button" onClick={onReload} className="min-h-11 rounded-md bg-ink px-4 font-medium text-white">
                Try loading again
              </button>
            ) : (
              saveProblem !== 'unavailable' && (
                <button type="button" onClick={() => session.saves.retry()} className="min-h-11 rounded-md bg-ink px-4 font-medium text-white">
                  Try saving again
                </button>
              )
            )}
            {saveProblem !== 'blocked' && (
              <button type="button" onClick={() => void output.run('png')} className="min-h-11 rounded-md border border-ink/25 px-4 font-medium hover:border-ink">
                Download a PNG copy
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div>
          <ToolBar settings={settings} onTool={setTool} />
          {/* touch-action: none keeps drawing gestures from scrolling the page. No data-lenis-prevent here: a plain
              mouse wheel over the drawing should keep scrolling the page through Lenis (Ctrl + wheel zooms). */}
          <div
            ref={stageRef}
            tabIndex={0}
            role="group"
            aria-label={`${sheet.title} drawing`}
            aria-describedby="stage-help"
            data-tool={tool}
            className="coloring-stage relative h-[62svh] min-h-[22rem] touch-none overflow-hidden rounded-lg border border-ink/12 bg-[#efede8] select-none lg:h-[calc(100svh-22rem)] lg:min-h-[30rem]"
          >
            <div ref={pageRef} className="absolute top-0 left-0 isolate bg-white outline outline-1 outline-ink/15">
              <svg ref={regionsRef} viewBox={viewBox} preserveAspectRatio="none" aria-hidden className="absolute inset-0 size-full" />
              {/* Brush paint: above the colors, below the line art. The live canvas shows a stroke while it's drawn. */}
              <canvas ref={paintRef} aria-hidden className="pointer-events-none absolute inset-0 size-full" />
              <canvas ref={liveRef} aria-hidden className="pointer-events-none absolute inset-0 size-full" />
              <svg ref={linesRef} viewBox={viewBox} preserveAspectRatio="none" aria-hidden className="pointer-events-none absolute inset-0 size-full mix-blend-multiply" />
              <svg ref={highlightsRef} viewBox={viewBox} preserveAspectRatio="none" aria-hidden className="pointer-events-none absolute inset-0 size-full" />
              <svg ref={guideRef} viewBox={viewBox} preserveAspectRatio="none" aria-hidden className="pointer-events-none absolute inset-0 size-full" />
              <svg ref={outlineRef} viewBox={viewBox} preserveAspectRatio="none" aria-hidden className="pointer-events-none absolute inset-0 size-full" />
            </div>
            <div ref={cursorRef} hidden aria-hidden className="pointer-events-none absolute top-0 left-0 rounded-full border-[1.5px] border-ink outline outline-1 outline-white" />
            {hint && (
              <p key={hint.id} aria-hidden className="pointer-events-none absolute inset-x-3 bottom-3 mx-auto w-fit max-w-[calc(100%-1.5rem)] rounded-md bg-ink px-3 py-2 text-center text-sm text-white">
                {hint.text}
              </p>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p id="stage-help" className="max-w-xl text-sm text-ink-soft">
              Two fingers move and zoom; or hold Ctrl and scroll to zoom. Shortcuts: F fill, B brush, E eraser, I pick color, H move, [ ] size, L stay inside.
              <span className="sr-only"> When the drawing has focus: arrow keys move it, plus and minus zoom, 0 fits it to the screen.</span>
            </p>
            {viewport && <ViewControls viewport={viewport} />}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {tool !== 'eraser' && tool !== 'move' && (
            <section aria-labelledby="colors-title">
              <h3 id="colors-title" className="mb-3 text-sm font-bold tracking-[0.08em] uppercase">
                Colors
              </h3>
              <ColorPicker
                color={settings.color}
                color2={settings.color2}
                twoColors={twoColors}
                target={target}
                onTarget={setTarget}
                onPick={pickColor}
                onSwap={() => {
                  update({ color: settings.color2, color2: settings.color })
                  announce(`Colors swapped. Color 1 is ${settings.color2.name}, Color 2 is ${settings.color.name}.`)
                }}
                paletteId={paletteId}
                onPalette={setPaletteId}
                recent={recent}
              />
            </section>
          )}

          <ToolSettings settings={settings} update={update} scale={scale} returnTool={returnTool} lastPicked={lastPicked} />

          <section aria-labelledby="keyboard-title">
            <h3 id="keyboard-title" className="text-sm font-bold tracking-[0.08em] uppercase">
              Color by name
            </h3>
            <p className="mt-1 mb-3 text-sm text-ink-soft">Choose a shape from the list to outline it, then apply the current fill.</p>
            <label htmlFor="region-select" className="sr-only">
              Shape
            </label>
            <select
              id="region-select"
              value={selected}
              onChange={(event) => setSelected(event.target.value)}
              className="min-h-11 w-full rounded-md border border-ink/25 bg-white px-3"
            >
              <option value="">Choose a shape&hellip;</option>
              {groups.map((g) => (
                <optgroup key={g.part} label={g.label}>
                  {g.regions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <button
              type="button"
              disabled={!selected}
              onClick={() => fillRegion(selected)}
              className="mt-3 inline-flex min-h-11 max-w-full items-center gap-2 rounded-md bg-ink px-4 text-left font-medium text-white disabled:cursor-not-allowed disabled:bg-ink/30"
            >
              <span aria-hidden className="size-4 shrink-0 rounded-sm border border-white/70" style={{ backgroundColor: settings.color.hex }} />
              <span className="truncate">Apply {fillDescription(settings)}</span>
            </button>
          </section>

          <section aria-labelledby="saved-title" className="border-t border-ink/10 pt-6">
            <h3 id="saved-title" className="text-sm font-bold tracking-[0.08em] uppercase">
              Saved coloring
            </h3>
            <p className="mt-1 mb-3 text-sm text-ink-soft">
              Each drawing is saved separately, in this browser on this device only. Start Over clears just this drawing.
            </p>
            <button
              type="button"
              onClick={() => setConfirm('clear-all')}
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-brand-red/60 px-4 font-medium text-brand-red-dark hover:border-brand-red-dark"
            >
              <Trash2 aria-hidden size={18} /> Clear all saved coloring
            </button>
            {clearResult && (
              <p role={clearResult.ok ? undefined : 'alert'} className={`mt-3 text-sm ${clearResult.ok ? 'text-ink-soft' : 'font-semibold text-brand-red-dark'}`}>
                {clearResult.text}
              </p>
            )}
          </section>
        </div>
      </div>

      <ConfirmDialog
        open={confirm === 'start-over'}
        title={`Start over on ${sheet.title}?`}
        message="Every color and brush stroke on this drawing will be removed. Your other drawings aren’t affected. You can undo this until you leave or refresh the page."
        confirmLabel="Start over"
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          setConfirm(null)
          viewportRef.current?.cancelGesture()
          if (session.reset()) {
            announce('Drawing cleared. Press Undo to bring it back.')
            // The Start Over button is now disabled; move focus to Undo, which can bring the work back.
            requestAnimationFrame(() => document.getElementById('coloring-undo')?.focus())
          }
        }}
      />
      <ConfirmDialog
        open={confirm === 'clear-all'}
        title="Clear all saved coloring?"
        message="This removes the saved coloring for every drawing in this browser, including the one open now. This can’t be undone."
        confirmLabel="Clear everything"
        onCancel={() => setConfirm(null)}
        onConfirm={() => void clearAll()}
      />
    </>
  )
}

const noopSubscribe = () => () => {}

function ViewControls({ viewport }: { viewport: Viewport }) {
  const zoom = useSyncExternalStore(viewport.subscribe, viewport.getZoom)
  const button = 'inline-flex size-11 items-center justify-center rounded-md border border-ink/20 bg-white hover:border-ink disabled:cursor-not-allowed disabled:text-ink/35'
  return (
    <div role="group" aria-label="View" className="flex items-center gap-2">
      <button type="button" className={button} onClick={() => viewport.zoomOut()} disabled={zoom <= MIN_ZOOM} aria-label="Zoom out" title="Zoom out">
        <ZoomOut aria-hidden size={20} />
      </button>
      <output aria-label="Zoom level" className="min-w-14 text-center font-semibold tabular-nums">
        {Math.round(zoom * 100)}%
      </output>
      <button type="button" className={button} onClick={() => viewport.zoomIn()} disabled={zoom >= MAX_ZOOM} aria-label="Zoom in" title="Zoom in">
        <ZoomIn aria-hidden size={20} />
      </button>
      <button
        type="button"
        onClick={() => viewport.fitToScreen()}
        className="inline-flex min-h-11 items-center gap-2 rounded-md border border-ink/20 bg-white px-3.5 font-medium hover:border-ink"
      >
        <Maximize aria-hidden size={18} /> Fit
      </button>
    </div>
  )
}
