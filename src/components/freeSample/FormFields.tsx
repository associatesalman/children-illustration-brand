import { Check, ChevronDown, FileText, HelpCircle, Paperclip, X } from 'lucide-react'
import type { ChangeEvent, ComponentProps, ReactNode } from 'react'
import style3d from '../../assets/free-sample/style-3d-320.webp'
import styleCartoon from '../../assets/free-sample/style-cartoon-320.webp'
import styleDigital from '../../assets/free-sample/style-digital-painting-320.webp'
import styleMinimal from '../../assets/free-sample/style-minimal-320.webp'
import styleWatercolor from '../../assets/free-sample/style-watercolor-320.webp'
import { type FieldDef, fileRules, formatBytes, notApplicable, type Value } from '../../lib/freeSample'
import { fieldId } from './fieldId'


const inputClass =
  'block w-full rounded-md border border-ink/25 bg-white px-4 py-3 text-base text-ink placeholder:text-ink/45 aria-[invalid=true]:border-brand-red aria-[invalid=true]:border-2 disabled:bg-paper disabled:text-ink-soft'

const styleImages: Record<string, string> = {
  Cartoon: styleCartoon,
  Watercolor: styleWatercolor,
  'Digital Painting': styleDigital,
  '3D': style3d,
  Minimal: styleMinimal,
}

export type FileStatus = 'ready' | 'sending' | 'kept'

type FieldControlProps = {
  fieldKey: string
  def: FieldDef
  value: Value | undefined
  required: boolean
  error?: string
  onChange: (key: string, value: Value) => void
  /** For "shared" fields: the answer they echo. */
  sharedValue?: string
  files?: File[]
  fileStatus?: FileStatus
  onAddFiles?: (key: string, files: File[]) => void
  onRemoveFile?: (key: string, index: number) => void
}

/** One labeled field of any kind, with its hint, error and "optional" marker. */
export function FieldControl(props: FieldControlProps) {
  const { fieldKey, def, required, error } = props
  const id = fieldId(fieldKey)
  const hintId = def.hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined
  const wide = !def.half || def.kind === 'shared'
  const isGroup = def.kind === 'radio' || def.kind === 'checkboxes'

  const label = (
    <>
      {def.label}
      {!required && def.kind !== 'shared' && <span className="ml-1.5 font-normal text-ink-soft">(optional)</span>}
    </>
  )
  const help = (
    <>
      {def.hint && (
        <p id={hintId} className="mt-1.5 text-sm leading-relaxed text-ink-soft">
          {def.hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-2 text-sm font-semibold text-brand-red-dark">
          {error}
        </p>
      )}
    </>
  )

  if (isGroup) {
    return (
      <fieldset className={wide ? 'sm:col-span-2' : undefined} aria-describedby={describedBy} aria-required={required || undefined}>
        <legend className="mb-1 font-semibold">{label}</legend>
        {/* Hint before the options, error after the legend so both are read with the group. */}
        {def.hint && (
          <p id={hintId} className="mb-3 text-sm leading-relaxed text-ink-soft">
            {def.hint}
          </p>
        )}
        {error && (
          <p id={errorId} className="mb-3 text-sm font-semibold text-brand-red-dark">
            {error}
          </p>
        )}
        <div className={def.hint || error ? '' : 'mt-3'}>
          {def.kind === 'radio' ? <RadioOptions {...props} id={id} /> : <CheckboxOptions {...props} id={id} />}
        </div>
      </fieldset>
    )
  }

  if (def.kind === 'shared') {
    return (
      <div className="rounded-md bg-paper px-4 py-3 sm:col-span-2">
        <p className="text-sm font-semibold">{def.label}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">
          {props.sharedValue ? (
            <>
              From your project details: <span className="font-semibold text-ink">{props.sharedValue}</span>
            </>
          ) : (
            'Add this under Project details above, so it is asked only once.'
          )}
        </p>
      </div>
    )
  }

  if (def.kind === 'files') {
    return (
      <div className="sm:col-span-2">
        <FileField {...props} id={id} label={label} describedBy={describedBy} help={help} />
      </div>
    )
  }

  const value = typeof props.value === 'string' ? props.value : ''
  const na = def.allowNotApplicable && value === notApplicable
  const common = {
    id,
    name: fieldKey,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    'aria-required': required || undefined,
    required,
  }
  const onText = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => props.onChange(fieldKey, event.target.value)

  let control: ReactNode
  if (def.kind === 'select') {
    control = (
      <Select {...common} value={value} onChange={onText}>
        <option value="">Choose an option</option>
        {def.options?.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </Select>
    )
  } else if (def.kind === 'textarea') {
    control = (
      <textarea
        {...common}
        value={na ? '' : value}
        onChange={onText}
        disabled={na}
        placeholder={na ? notApplicable : def.placeholder}
        maxLength={def.maxLength ?? 3000}
        rows={4}
        className={`${inputClass} min-h-32 resize-y`}
      />
    )
  } else {
    control = (
      <input
        {...common}
        type={def.inputType ?? 'text'}
        inputMode={def.inputType === 'tel' ? 'tel' : def.inputType === 'email' ? 'email' : undefined}
        autoComplete={def.autoComplete ?? 'off'}
        value={na ? '' : value}
        onChange={onText}
        disabled={na}
        placeholder={na ? notApplicable : def.placeholder}
        maxLength={def.maxLength ?? 200}
        className={inputClass}
      />
    )
  }

  return (
    <div className={wide ? 'sm:col-span-2' : undefined}>
      <label htmlFor={id} className="mb-2 block font-semibold">
        {label}
      </label>
      {control}
      {def.allowNotApplicable && (
        <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(na)}
            onChange={(event) => props.onChange(fieldKey, event.target.checked ? notApplicable : '')}
            className="size-4 accent-ink"
          />
          Not applicable
        </label>
      )}
      {help}
    </div>
  )
}

const optionCard =
  'flex h-full cursor-pointer items-start gap-3 rounded-md border-2 border-ink/15 bg-white px-4 py-3 has-[:checked]:border-ink has-[:checked]:bg-sun has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink'

function RadioOptions({ fieldKey, def, value, onChange, error, id }: FieldControlProps & { id: string }) {
  if (def.visual === 'styles') {
    return (
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {def.options?.map((option, index) => (
          <li key={option}>
            <label className="group block h-full cursor-pointer overflow-hidden rounded-md border-2 border-ink/15 bg-white has-[:checked]:border-ink has-[:checked]:bg-sun has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink">
              <input
                type="radio"
                id={index === 0 ? id : undefined}
                name={fieldKey}
                value={option}
                checked={value === option}
                onChange={() => onChange(fieldKey, option)}
                aria-invalid={error ? true : undefined}
                className="sr-only"
              />
              {styleImages[option] ? (
                <img src={styleImages[option]} alt="" width={320} height={240} loading="lazy" decoding="async" className="block aspect-[4/3] w-full object-cover" />
              ) : (
                <span aria-hidden className="flex aspect-[4/3] w-full items-center justify-center bg-paper text-ink-soft">
                  <HelpCircle size={36} strokeWidth={1.75} />
                </span>
              )}
              <span className="flex items-center justify-between gap-2 px-3 py-2.5 font-semibold">
                {option}
                <span aria-hidden className="hidden size-5 items-center justify-center rounded-full bg-ink text-white group-has-[:checked]:flex">
                  <Check size={13} strokeWidth={3} />
                </span>
              </span>
            </label>
          </li>
        ))}
      </ul>
    )
  }
  return (
    <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
      {def.options?.map((option, index) => (
        <li key={option}>
          <label className={optionCard}>
            <input
              type="radio"
              id={index === 0 ? id : undefined}
              name={fieldKey}
              value={option}
              checked={value === option}
              onChange={() => onChange(fieldKey, option)}
              aria-invalid={error ? true : undefined}
              className="mt-0.5 size-4.5 shrink-0 accent-ink"
            />
            <span className="leading-snug">{option}</span>
          </label>
        </li>
      ))}
    </ul>
  )
}

function CheckboxOptions({ fieldKey, def, value, onChange, error, id }: FieldControlProps & { id: string }) {
  const list = Array.isArray(value) ? value : []
  const toggle = (option: string, checked: boolean) =>
    // Keep the options in their listed order.
    onChange(fieldKey, def.options?.filter((item) => (item === option ? checked : list.includes(item))) ?? [])
  return (
    <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
      {def.options?.map((option, index) => (
        <li key={option}>
          <label className={optionCard}>
            <input
              type="checkbox"
              id={index === 0 ? id : undefined}
              name={fieldKey}
              value={option}
              checked={list.includes(option)}
              onChange={(event) => toggle(option, event.target.checked)}
              aria-invalid={error ? true : undefined}
              className="mt-0.5 size-4.5 shrink-0 accent-ink"
            />
            <span className="leading-snug">{option}</span>
          </label>
        </li>
      ))}
    </ul>
  )
}

const fileStatusText: Record<FileStatus, string> = {
  ready: 'Ready to send with your request',
  sending: 'Uploading…',
  kept: 'Not sent yet. Kept for your next try',
}

function FileField({
  fieldKey,
  files = [],
  fileStatus = 'ready',
  onAddFiles,
  onRemoveFile,
  error,
  id,
  label,
  describedBy,
  help,
}: FieldControlProps & { id: string; label: ReactNode; describedBy?: string; help: ReactNode }) {
  const busy = fileStatus === 'sending'
  return (
    <div>
      <p className="mb-2 font-semibold" id={`${id}-label`}>
        {label}
      </p>
      <div className="rounded-md border-2 border-dashed border-ink/25 bg-paper/60 px-5 py-5">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <label
            className={`inline-flex cursor-pointer items-center gap-2 rounded-md bg-ink px-4 py-2.5 font-medium text-white has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink ${busy ? 'pointer-events-none opacity-60' : ''}`}
          >
            <Paperclip aria-hidden size={17} />
            Choose files
            <input
              id={id}
              type="file"
              multiple
              accept={fileRules.accept}
              disabled={busy}
              aria-labelledby={`${id}-label`}
              aria-describedby={[describedBy, `${id}-rules`].filter(Boolean).join(' ')}
              aria-invalid={error ? true : undefined}
              onChange={(event) => {
                const chosen = [...(event.target.files ?? [])]
                event.target.value = ''
                if (chosen.length) onAddFiles?.(fieldKey, chosen)
              }}
              className="sr-only"
            />
          </label>
          <p id={`${id}-rules`} className="text-sm leading-relaxed text-ink-soft">
            {fileRules.summary}
          </p>
        </div>
        {files.length > 0 && (
          <ul className="mt-4 grid gap-2" aria-label="Attached files">
            {files.map((file, index) => (
              <li key={`${file.name}-${file.size}-${file.lastModified}`} className="flex items-center gap-3 rounded-md bg-white px-3.5 py-2.5">
                <FileText aria-hidden size={20} className="shrink-0 text-ink-soft" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-sm text-ink-soft">
                    {formatBytes(file.size)} · {fileStatusText[fileStatus]}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveFile?.(fieldKey, index)}
                  disabled={busy}
                  aria-label={`Remove ${file.name}`}
                  className="flex size-9 shrink-0 items-center justify-center rounded-md text-ink-soft hover:bg-paper hover:text-ink disabled:opacity-50"
                >
                  <X aria-hidden size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {help}
    </div>
  )
}

export function Select({ children, ...props }: ComponentProps<'select'>) {
  return (
    <div className="relative">
      <select {...props} className={`${inputClass} appearance-none pr-11`}>
        {children}
      </select>
      <ChevronDown aria-hidden size={18} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink-soft" />
    </div>
  )
}
