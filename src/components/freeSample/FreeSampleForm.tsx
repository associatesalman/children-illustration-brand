import { ArrowLeft, ArrowRight, Check, Pencil } from 'lucide-react'
import { type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react'
import {
  checkFiles,
  type Errors,
  fileKeysFor,
  formatBytes,
  isRequiredField,
  sectionsFor,
  serviceById,
  services,
  summarize,
  validateRequest,
  type Value,
  type Values,
} from '../../lib/freeSample'
import { fieldId } from './fieldId'
import { FieldControl, type FileStatus } from './FormFields'

type Step = 1 | 2 | 3
type Status = 'idle' | 'sending' | 'failed' | 'rate-limited' | 'too-large' | 'files'

const steps: { number: Step; label: string }[] = [
  { number: 1, label: 'Select Services' },
  { number: 2, label: 'Project & Service Details' },
  { number: 3, label: 'Contact & Review' },
]

const initialValues: Values = { 'contact.contactMethod': 'Email' }

const without = (errors: Errors, key: string) => Object.fromEntries(Object.entries(errors).filter(([k]) => k !== key))

const stepOfKey = (key: string): Step => (key === 'services' ? 1 : key.startsWith('contact.') ? 3 : 2)

/**
 * The Free Sample request form: three steps, one set of answers. Everything typed stays in state while the
 * visitor moves between steps, and answers for a deselected service are kept (but neither validated nor sent)
 * so they come back if the service is chosen again. Submission is a single multipart request with the files.
 */
export function FreeSampleForm() {
  const [step, setStep] = useState<Step>(1)
  const [selected, setSelected] = useState<string[]>([])
  const [values, setValues] = useState<Values>(initialValues)
  const [files, setFiles] = useState<Record<string, File[]>>({})
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [serverMessage, setServerMessage] = useState('')
  const [progress, setProgress] = useState<number | null>(null)
  const [honeypot, setHoneypot] = useState('')
  const sending = useRef(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  /** Element id to focus after the next render (a step heading, a section heading or an invalid field). */
  const pendingFocus = useRef<string | null>(null)
  const [focusTick, setFocusTick] = useState(0)

  useEffect(() => {
    const id = pendingFocus.current
    if (!id) return
    pendingFocus.current = null
    const element = document.getElementById(id)
    if (!element) return
    element.focus({ preventScroll: true })
    element.scrollIntoView({ block: id === 'fs-step-heading' ? 'start' : 'center' })
  }, [focusTick])

  const focusLater = (id: string) => {
    pendingFocus.current = id
    setFocusTick((tick) => tick + 1)
  }

  const goTo = (next: Step, focusId = 'fs-step-heading') => {
    setStep(next)
    focusLater(focusId)
  }

  const activeFileKeys = fileKeysFor(selected)
  const activeFiles = activeFileKeys.flatMap((key) => files[key] ?? [])
  const fileStatus: FileStatus = status === 'sending' ? 'sending' : status === 'idle' ? 'ready' : 'kept'

  const resetStatus = () => {
    if (status !== 'sending' && status !== 'idle') {
      setStatus('idle')
      setServerMessage('')
    }
  }

  /* ---------------------------------------------------------------- changes */

  const onChange = (key: string, value: Value) => {
    const next = { ...values, [key]: value }
    setValues(next)
    resetStatus()
    // Once a field has shown an error, re-check it (and the phone, whose need depends on the contact method).
    const recheck = [key, ...(key === 'contact.contactMethod' ? ['contact.phone'] : [])].filter((k) => errors[k])
    if (recheck.length) {
      const fresh = validateRequest({ services: selected, values: next }).errors
      setErrors((current) => {
        const updated = { ...current }
        for (const k of recheck) {
          if (fresh[k]) updated[k] = fresh[k]
          else delete updated[k]
        }
        return updated
      })
    }
  }

  const toggleService = (id: string, checked: boolean) => {
    const next = services.map((service) => service.id).filter((sid) => (sid === id ? checked : selected.includes(sid)))
    setSelected(next)
    resetStatus()
    if (errors.services && next.length) setErrors((current) => without(current, 'services'))
  }

  const addFiles = (key: string, added: File[]) => {
    const problem = checkFiles([...activeFiles, ...added])
    setErrors((current) => {
      const updated = { ...current }
      if (problem) updated[key] = problem
      else delete updated[key]
      return updated
    })
    if (!problem) setFiles((current) => ({ ...current, [key]: [...(current[key] ?? []), ...added] }))
    resetStatus()
  }

  const removeFile = (key: string, index: number) => {
    setFiles((current) => ({ ...current, [key]: (current[key] ?? []).filter((_, i) => i !== index) }))
    setErrors((current) => without(current, key))
    resetStatus()
  }

  /* ---------------------------------------------------------------- validation */

  /** All current problems, keyed by field (file problems under their field key). */
  const collectErrors = (): Errors => {
    const found = { ...validateRequest({ services: selected, values }).errors }
    const fileProblem = checkFiles(activeFiles)
    if (fileProblem) found[activeFileKeys.find((key) => files[key]?.length) ?? activeFileKeys[0]] = fileProblem
    return found
  }

  const firstInvalidId = (found: Errors, onStep?: Step) => {
    // Field order on the page: services, then each section's fields in order.
    const order = ['services', ...sectionsFor(selected).flatMap((section) => section.fields.map((field) => field.key))]
    const key = order.find((k) => found[k] && (!onStep || stepOfKey(k) === onStep))
    if (!key) return null
    return key === 'services' ? 'fs-services' : fieldId(key)
  }

  /** Checks the current step; shows its errors and focuses the first one. */
  const stepIsValid = (current: Step) => {
    const found = collectErrors()
    const onStep = Object.fromEntries(Object.entries(found).filter(([key]) => stepOfKey(key) === current))
    setErrors((existing) => ({
      ...Object.fromEntries(Object.entries(existing).filter(([key]) => stepOfKey(key) !== current)),
      ...onStep,
    }))
    const target = firstInvalidId(onStep, current)
    if (target) focusLater(target)
    return !target
  }

  const next = () => {
    if (stepIsValid(step)) goTo((step + 1) as Step)
  }

  /* ---------------------------------------------------------------- submission */

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (step !== 3) return next()
    if (sending.current) return

    const found = collectErrors()
    setErrors(found)
    const target = firstInvalidId(found)
    if (target) {
      const firstStep = stepOfKey(Object.keys(found).sort((a, b) => stepOfKey(a) - stepOfKey(b))[0])
      setStep(firstStep)
      focusLater(target)
      return
    }

    const { values: clean } = validateRequest({ services: selected, values })
    const body = new FormData()
    body.append('payload', JSON.stringify({ services: selected, values: clean, website: honeypot }))
    for (const key of activeFileKeys) for (const file of files[key] ?? []) body.append(`file:${key}`, file, file.name)

    sending.current = true
    setStatus('sending')
    setServerMessage('')
    setProgress(activeFiles.length ? 0 : null)

    // XMLHttpRequest rather than fetch, for real upload progress.
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/free-sample')
    xhr.responseType = 'json'
    xhr.timeout = 180_000
    xhr.upload.onprogress = (progressEvent) => {
      if (progressEvent.lengthComputable) setProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100))
    }
    const finish = (outcome: Status, message = '') => {
      sending.current = false
      setProgress(null)
      setStatus(outcome)
      setServerMessage(message)
    }
    xhr.onload = () => {
      const response = (xhr.response ?? null) as { ok?: boolean; error?: string; errors?: Errors; message?: string } | null
      if (xhr.status === 200 && response?.ok === true) {
        sending.current = false
        setProgress(null)
        setStatus('idle')
        dialogRef.current?.showModal()
        return
      }
      if (xhr.status === 422 && response?.error === 'validation' && response.errors) {
        finish('idle')
        setErrors(response.errors)
        const serverTarget = firstInvalidId(response.errors)
        const firstKey = Object.keys(response.errors).sort((a, b) => stepOfKey(a) - stepOfKey(b))[0]
        if (firstKey) setStep(stepOfKey(firstKey))
        if (serverTarget) focusLater(serverTarget)
        return
      }
      if (xhr.status === 422 && response?.error === 'files') return finish('files', response.message ?? '')
      if (xhr.status === 413) return finish('too-large')
      if (xhr.status === 429) return finish('rate-limited')
      finish('failed')
    }
    xhr.onerror = () => finish('failed')
    xhr.ontimeout = () => finish('failed')
    xhr.send(body)
  }

  /** After the success dialog closes: start a fresh request at step 1. */
  const onDialogClose = () => {
    setSelected([])
    setValues(initialValues)
    setFiles({})
    setErrors({})
    setStatus('idle')
    goTo(1)
  }

  /* ---------------------------------------------------------------- render */

  const statusMessage: Partial<Record<Status, string>> = {
    failed: 'We couldn’t send your request just now. Everything you entered is still here, so please try again in a moment.',
    'rate-limited': 'You’ve sent several requests in a short time. Please wait a few minutes, then try again.',
    'too-large': 'Your files are too large to send together. Please remove or compress some, then try again.',
    files: `${serverMessage || 'One of your files could not be accepted.'} Please remove it, then try again.`,
  }

  return (
    <>
      <div ref={cardRef} className="scroll-mt-24 rounded-2xl bg-white text-ink shadow-[0_1px_0_rgba(22,20,18,0.08)]">
        <StepIndicator step={step} onBack={(target) => goTo(target)} />

        <form noValidate onSubmit={onSubmit} aria-busy={status === 'sending'} className="px-5 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          <h2 id="fs-step-heading" tabIndex={-1} className="text-display scroll-mt-28 text-[clamp(1.9rem,1.5rem+1.4vw,2.75rem)] leading-tight outline-none">
            <span className="sr-only">Step {step} of 3: </span>
            {steps[step - 1].label}
          </h2>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-soft">
            {step === 1 && 'Choose one or more services. We’ll review your request and follow up about a sample or the next steps for each one.'}
            {step === 2 && 'Tell us about your project once, then add the details for each service you chose. All fields are required unless marked optional.'}
            {step === 3 && 'How can we reach you? Then check your request before you send it.'}
          </p>

          {step === 1 && <ServicePicker selected={selected} error={errors.services} onToggle={toggleService} />}

          {step === 2 && (
            <div className="mt-10">
              {selected.length > 1 && <SectionJumps selected={selected} onJump={(id) => focusLater(`fs-section-${id}`)} />}
              {sectionsFor(selected)
                .filter((section) => section.id !== 'contact')
                .map((section, index) => (
                  <section key={section.id} aria-labelledby={`fs-section-${section.id}`} className={index ? 'mt-14 border-t-2 border-ink pt-10' : ''}>
                    <p className="text-sm font-bold tracking-[0.08em] text-brand-red-dark uppercase">
                      {section.id === 'shared' ? 'About your project' : `Service ${index} of ${selected.length}`}
                    </p>
                    <h3 id={`fs-section-${section.id}`} tabIndex={-1} className="text-display mt-2 scroll-mt-28 text-[1.75rem] leading-tight outline-none">
                      {section.title}
                    </h3>
                    {section.id !== 'shared' && serviceById[section.id].note && (
                      <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">{serviceById[section.id].note}</p>
                    )}
                    <div className="mt-7 grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2">
                      {section.fields.map(({ key, def }) => (
                        <FieldControl
                          key={key}
                          fieldKey={key}
                          def={def}
                          value={values[key]}
                          required={isRequiredField(key, def, selected, values)}
                          error={errors[key]}
                          onChange={onChange}
                          sharedValue={def.ref ? String(values[def.ref] ?? '') : undefined}
                          files={files[key]}
                          fileStatus={fileStatus}
                          onAddFiles={addFiles}
                          onRemoveFile={removeFile}
                        />
                      ))}
                    </div>
                  </section>
                ))}
            </div>
          )}

          {step === 3 && (
            <>
              <section aria-labelledby="fs-section-contact" className="mt-10">
                <h3 id="fs-section-contact" tabIndex={-1} className="text-display scroll-mt-28 text-[1.75rem] leading-tight outline-none">
                  Contact information
                </h3>
                <div className="mt-7 grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2">
                  {sectionsFor(selected)
                    .find((section) => section.id === 'contact')!
                    .fields.map(({ key, def }) => (
                      <FieldControl
                        key={key}
                        fieldKey={key}
                        def={def}
                        value={values[key]}
                        required={isRequiredField(key, def, selected, values)}
                        error={errors[key]}
                        onChange={onChange}
                      />
                    ))}
                </div>
              </section>
              <Review
                selected={selected}
                values={values}
                files={files}
                onEdit={(sectionId) => {
                  if (sectionId === 'services') goTo(1)
                  else if (sectionId === 'contact') focusLater(fieldId('contact.fullName'))
                  else goTo(2, `fs-section-${sectionId}`)
                }}
              />
            </>
          )}

          {/* Honeypot: hidden from people and assistive technology; bots that fill it are ignored. */}
          <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="fs-website">Leave this field empty</label>
            <input id="fs-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
          </div>

          <div className="mt-12 border-t border-ink/15 pt-8">
            <div aria-live="assertive" role="alert">
              {statusMessage[status] && <p className="mb-6 rounded-md bg-brand-red/10 px-4 py-3 font-medium text-brand-red-dark">{statusMessage[status]}</p>}
            </div>
            <p aria-live="polite" className="sr-only">
              {status === 'sending' ? (progress === null ? 'Sending your request.' : `Uploading, ${progress} percent.`) : ''}
            </p>
            <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => goTo((step - 1) as Step)}
                  disabled={status === 'sending'}
                  className="inline-flex items-center justify-center gap-2 rounded-md px-5 py-3.5 font-medium text-ink underline decoration-2 underline-offset-[6px] hover:decoration-brand-red disabled:opacity-50"
                >
                  <ArrowLeft aria-hidden size={18} /> Back
                </button>
              ) : (
                <span className="hidden sm:block" />
              )}
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                {status === 'sending' && progress !== null && (
                  <p className="text-sm text-ink-soft sm:mr-2" aria-hidden>
                    Uploading {progress}% of {formatBytes(activeFiles.reduce((sum, file) => sum + file.size, 0))}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-red px-7 py-3.5 text-base font-medium text-white hover:bg-brand-red-dark disabled:cursor-wait disabled:bg-brand-red-dark"
                >
                  {step < 3 ? (
                    <>
                      Continue <ArrowRight aria-hidden size={18} />
                    </>
                  ) : status === 'sending' ? (
                    'Submitting…'
                  ) : status === 'idle' ? (
                    'Submit My Request'
                  ) : (
                    'Try Again'
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="fs-success-title"
        aria-describedby="fs-success-text"
        onClose={onDialogClose}
        className="m-auto w-[min(30rem,calc(100%-2.5rem))] rounded-2xl bg-white p-8 text-center text-ink backdrop:bg-ink/60 sm:p-10"
        data-lenis-prevent
      >
        <span aria-hidden className="mx-auto flex size-14 items-center justify-center rounded-full bg-sun">
          <Check size={28} strokeWidth={3} />
        </span>
        <h2 id="fs-success-title" className="text-display mt-5 text-[1.9rem] leading-tight">
          Request Submitted Successfully
        </h2>
        <p id="fs-success-text" className="mt-4 text-lg leading-relaxed text-ink-soft">
          Thank you for sharing your project details. We’ve received your request and will be in touch.
        </p>
        <form method="dialog" className="mt-8">
          <button type="submit" autoFocus className="inline-flex items-center justify-center rounded-md bg-ink px-7 py-3 font-medium text-white hover:bg-black">
            Close
          </button>
        </form>
      </dialog>
    </>
  )
}

/* ------------------------------------------------------------------ steps */

function StepIndicator({ step, onBack }: { step: Step; onBack: (step: Step) => void }) {
  return (
    <nav aria-label="Form progress" className="border-b border-ink/15 px-5 py-5 sm:px-10 lg:px-14">
      <ol className="grid grid-cols-3 gap-3 sm:gap-6">
        {steps.map(({ number, label }) => {
          const done = number < step
          const current = number === step
          const circle = (
            <span
              aria-hidden
              className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                current ? 'bg-brand-red text-white' : done ? 'bg-ink text-white' : 'border-2 border-ink/25 text-ink-soft'
              }`}
            >
              {done ? <Check size={16} strokeWidth={3} /> : number}
            </span>
          )
          const text = (
            <span className={`text-xs leading-tight font-semibold sm:text-sm ${current ? 'text-ink' : done ? 'text-ink' : 'text-ink-soft'}`}>
              <span className="sr-only">Step {number}: </span>
              {label}
              {done && <span className="sr-only"> (completed, go back to this step)</span>}
            </span>
          )
          return (
            <li key={number} aria-current={current ? 'step' : undefined} className={`border-t-4 pt-3 ${current ? 'border-brand-red' : done ? 'border-ink' : 'border-ink/15'}`}>
              {done ? (
                <button type="button" onClick={() => onBack(number)} className="flex flex-col items-start gap-2 text-left hover:underline sm:flex-row sm:items-center sm:gap-3">
                  {circle}
                  {text}
                </button>
              ) : (
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                  {circle}
                  {text}
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/* ------------------------------------------------------------------ step 1 */

function ServicePicker({ selected, error, onToggle }: { selected: string[]; error?: string; onToggle: (id: string, checked: boolean) => void }) {
  return (
    <fieldset className="mt-10" aria-describedby={error ? 'fs-services-error' : 'fs-services-count'} aria-required>
      <legend className="text-xl font-bold">Which services are you interested in?</legend>
      <p id="fs-services-count" aria-live="polite" className="mt-1.5 text-ink-soft">
        {selected.length ? `${selected.length} selected` : 'Choose at least one.'}
      </p>
      {error && (
        <p id="fs-services-error" className="mt-2 font-semibold text-brand-red-dark">
          {error}
        </p>
      )}
      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <li key={service.id}>
            <label className="group flex h-full cursor-pointer gap-4 rounded-lg border-2 border-ink/15 bg-white p-5 has-[:checked]:border-ink has-[:checked]:bg-sun has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink">
              <input
                type="checkbox"
                id={index === 0 ? 'fs-services' : undefined}
                name="services"
                value={service.id}
                checked={selected.includes(service.id)}
                onChange={(event) => onToggle(service.id, event.target.checked)}
                aria-invalid={error ? true : undefined}
                className="sr-only"
              />
              <span
                aria-hidden
                className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md border-2 border-ink/40 bg-white text-transparent group-has-[:checked]:border-ink group-has-[:checked]:bg-ink group-has-[:checked]:text-white"
              >
                <Check size={15} strokeWidth={3} />
              </span>
              <span>
                <span className="block text-lg leading-snug font-bold">{service.name}</span>
                <span className="mt-1.5 block leading-relaxed text-ink-soft group-has-[:checked]:text-ink">{service.description}</span>
              </span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  )
}

/* ------------------------------------------------------------------ step 2 */

/** With several services, a short list of links to each group keeps the long step easy to move through. */
function SectionJumps({ selected, onJump }: { selected: string[]; onJump: (id: string) => void }) {
  return (
    <nav aria-label="Sections in this step" className="mb-10 rounded-lg bg-paper px-5 py-4">
      <p className="text-sm font-bold tracking-[0.08em] uppercase">In this step</p>
      <ul className="mt-2.5 flex flex-wrap gap-2">
        {['shared', ...selected].map((id) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => onJump(id)}
              className="rounded-full border border-ink/25 bg-white px-3.5 py-1.5 text-sm font-medium hover:border-ink"
            >
              {id === 'shared' ? 'Project details' : serviceById[id].name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/* ------------------------------------------------------------------ step 3 */

function Review({
  selected,
  values,
  files,
  onEdit,
}: {
  selected: string[]
  values: Values
  files: Record<string, File[]>
  onEdit: (sectionId: string) => void
}) {
  const fileNames = Object.fromEntries(
    fileKeysFor(selected).map((key) => [key, (files[key] ?? []).map((file) => `${file.name} (${formatBytes(file.size)})`)]),
  )
  const { values: clean } = validateRequest({ services: selected, values })
  const sections = summarize(selected, clean, fileNames)

  const block = (id: string, title: string, children: ReactNode, editLabel: string) => (
    <div key={id} className="border-t border-ink/15 py-6 first:border-t-0">
      <div className="flex items-start justify-between gap-4">
        <h4 className="text-lg font-bold">{title}</h4>
        <button
          type="button"
          onClick={() => onEdit(id)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-sm font-semibold underline decoration-2 underline-offset-4 hover:decoration-brand-red"
        >
          <Pencil aria-hidden size={14} /> Edit <span className="sr-only">{editLabel}</span>
        </button>
      </div>
      {children}
    </div>
  )

  return (
    <section aria-labelledby="fs-review-title" className="mt-14 rounded-xl bg-paper px-5 py-6 sm:px-8 sm:py-8">
      <h3 id="fs-review-title" className="text-display text-[1.75rem] leading-tight">
        Review your request
      </h3>
      <p className="mt-2 leading-relaxed text-ink-soft">Check your answers. Use Edit to change anything before you submit.</p>
      <div className="mt-4">
        {block(
          'services',
          'Selected services',
          <ul className="mt-3 flex flex-wrap gap-2">
            {selected.map((id) => (
              <li key={id} className="rounded-full bg-sun px-3.5 py-1.5 text-sm font-semibold">
                {serviceById[id].name}
              </li>
            ))}
          </ul>,
          'selected services',
        )}
        {sections.map((section) =>
          block(
            section.id,
            section.title,
            section.rows.length ? (
              <dl className="mt-3 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
                {section.rows.map((row) => (
                  <div key={row.label} className="contents">
                    <dt className="text-sm font-semibold text-ink-soft sm:text-base">{row.label}</dt>
                    <dd className="mb-2 break-words whitespace-pre-line sm:mb-0">{row.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-2 text-ink-soft">Nothing added yet.</p>
            ),
            section.title.toLowerCase(),
          ),
        )}
      </div>
    </section>
  )
}
