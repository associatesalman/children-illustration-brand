import { ChevronDown } from 'lucide-react'
import { type ChangeEvent, type FormEvent, type ReactNode, useId, useRef, useState } from 'react'
import {
  emptyInquiry,
  fieldLimits,
  type InquiryErrors,
  type InquiryField,
  type InquiryValues,
  mainServices,
  projectStages,
  serviceCatalog,
  validateInquiry,
} from '../../lib/inquiry'

type Status = 'idle' | 'sending' | 'failed' | 'rate-limited'

const fieldOrder: InquiryField[] = ['fullName', 'email', 'phone', 'country', 'mainService', 'specificService', 'projectStage', 'details']

export function InquiryForm() {
  const [values, setValues] = useState<InquiryValues>(emptyInquiry)
  const [errors, setErrors] = useState<InquiryErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [honeypot, setHoneypot] = useState('')
  const sending = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const id = useId()

  const specificOptions = serviceCatalog[values.mainService] ?? []

  const update = (field: InquiryField) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const next = { ...values, [field]: event.target.value }
    // A specific service only makes sense for the main service it belongs to.
    if (field === 'mainService') next.specificService = ''
    setValues(next)
    if (status !== 'sending') setStatus('idle')
    // Once a field has shown an error, re-check it as the visitor corrects it.
    if (errors[field] || (field === 'mainService' && errors.specificService)) {
      const fresh = validateInquiry(next).errors
      setErrors((current) => ({
        ...current,
        [field]: fresh[field],
        ...(field === 'mainService' ? { specificService: undefined } : {}),
      }))
    }
  }

  const focusFirstError = (found: InquiryErrors) => {
    const first = fieldOrder.find((field) => found[field])
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (sending.current) return

    const checked = validateInquiry(values)
    setErrors(checked.errors)
    if (Object.keys(checked.errors).length) {
      setStatus('idle')
      focusFirstError(checked.errors)
      return
    }

    sending.current = true
    setStatus('sending')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...checked.values, website: honeypot }),
      })
      const body = (await response.json().catch(() => null)) as { ok?: boolean; errors?: InquiryErrors } | null

      if (response.ok && body?.ok === true) {
        setValues(emptyInquiry)
        setErrors({})
        setStatus('idle')
        dialogRef.current?.showModal()
      } else if (response.status === 422 && body?.errors) {
        setErrors(body.errors)
        setStatus('idle')
        focusFirstError(body.errors)
      } else {
        setStatus(response.status === 429 ? 'rate-limited' : 'failed')
      }
    } catch {
      setStatus('failed')
    } finally {
      sending.current = false
    }
  }

  const field = (name: InquiryField) => ({
    id: `${id}-${name}`,
    name,
    value: values[name],
    onChange: update(name),
    maxLength: fieldLimits[name],
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': [errors[name] && `${id}-${name}-error`, hints[name] && `${id}-${name}-hint`].filter(Boolean).join(' ') || undefined,
  })

  const hints: Partial<Record<InquiryField, string>> = {
    phone: 'Include your country code if you are outside the US.',
    details: 'Your story, your readers, and what you need help with.',
  }

  const sharedProps = { idBase: id, errors, hints }

  return (
    <>
      <form ref={formRef} noValidate onSubmit={onSubmit} aria-busy={status === 'sending'} className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
        <Field {...sharedProps} name="fullName" label="Full name">
          <input {...field('fullName')} type="text" autoComplete="name" required aria-required className={inputClass} />
        </Field>
        <Field {...sharedProps} name="email" label="Email address">
          <input {...field('email')} type="email" autoComplete="email" required aria-required className={inputClass} />
        </Field>
        <Field {...sharedProps} name="phone" label="Phone number" optional>
          <input {...field('phone')} type="tel" inputMode="tel" autoComplete="tel" placeholder="+1 555 123 4567" className={inputClass} />
        </Field>
        <Field {...sharedProps} name="country" label="Country" optional>
          <input {...field('country')} type="text" autoComplete="country-name" className={inputClass} />
        </Field>

        <Field {...sharedProps} name="mainService" label="Main service" optional>
          <Select {...field('mainService')}>
            <option value="">Choose a service</option>
            {mainServices.map((service) => (
              <option key={service}>{service}</option>
            ))}
          </Select>
        </Field>
        <Field {...sharedProps} name="specificService" label="Specific service" optional>
          <Select {...field('specificService')} disabled={!specificOptions.length}>
            <option value="">{specificOptions.length ? 'Choose an option' : 'Choose a main service first'}</option>
            {specificOptions.map((service) => (
              <option key={service}>{service}</option>
            ))}
          </Select>
        </Field>

        <Field {...sharedProps} name="projectStage" label="Project stage" optional wide>
          <Select {...field('projectStage')}>
            <option value="">Where is your book today?</option>
            {projectStages.map((stage) => (
              <option key={stage}>{stage}</option>
            ))}
          </Select>
        </Field>

        <Field {...sharedProps} name="details" label="Project details" optional wide>
          <textarea {...field('details')} rows={6} className={`${inputClass} min-h-40 resize-y`} />
        </Field>

        {/* Honeypot: hidden from people and assistive technology; bots that fill it are ignored. */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={`${id}-website`}>Leave this field empty</label>
          <input
            id={`${id}-website`}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <div aria-live="assertive" role="alert">
            {status === 'failed' && (
              <p className="mb-5 rounded-md bg-brand-red/10 px-4 py-3 text-brand-red-dark">
                We couldn&rsquo;t send your inquiry just now. Your details are still here, so please try again in a moment.
              </p>
            )}
            {status === 'rate-limited' && (
              <p className="mb-5 rounded-md bg-brand-red/10 px-4 py-3 text-brand-red-dark">
                You&rsquo;ve sent several inquiries in a short time. Please wait a few minutes, then try again.
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={status === 'sending'}
            className="inline-flex w-full items-center justify-center rounded-md bg-brand-red px-6 py-3.5 text-base font-medium text-white hover:bg-brand-red-dark disabled:cursor-wait disabled:bg-brand-red-dark sm:w-auto"
          >
            {status === 'sending' ? 'Sending…' : status === 'failed' ? 'Try again' : 'Submit inquiry'}
          </button>
        </div>
      </form>

      <dialog
        ref={dialogRef}
        aria-labelledby={`${id}-thanks`}
        className="m-auto w-[min(28rem,calc(100%-2.5rem))] rounded-lg bg-white p-8 text-center text-ink backdrop:bg-ink/60"
        data-lenis-prevent
      >
        <p id={`${id}-thanks`} className="text-display text-3xl leading-tight">
          Thanks for submitting! We&rsquo;ll be in touch.
        </p>
        <form method="dialog" className="mt-7">
          <button
            type="submit"
            autoFocus
            className="inline-flex items-center justify-center rounded-md bg-ink px-6 py-3 font-medium text-white hover:bg-black"
          >
            Close
          </button>
        </form>
      </dialog>
    </>
  )
}

const inputClass =
  'block w-full rounded-md border border-ink/25 bg-white px-4 py-3 text-base text-ink placeholder:text-ink/40 aria-[invalid=true]:border-brand-red disabled:bg-paper disabled:text-ink/50'

type FieldProps = {
  idBase: string
  name: InquiryField
  label: string
  optional?: boolean
  wide?: boolean
  errors: InquiryErrors
  hints: Partial<Record<InquiryField, string>>
  children: ReactNode
}

function Field({ idBase, name, label, optional = false, wide = false, errors, hints, children }: FieldProps) {
  return (
    <div className={wide ? 'sm:col-span-2' : undefined}>
      <label htmlFor={`${idBase}-${name}`} className="mb-2 block font-semibold">
        {label}
        {optional && <span className="ml-1.5 font-normal text-ink-soft">(optional)</span>}
      </label>
      {children}
      {hints[name] && (
        <p id={`${idBase}-${name}-hint`} className="mt-1.5 text-sm text-ink-soft">
          {hints[name]}
        </p>
      )}
      {errors[name] && (
        <p id={`${idBase}-${name}-error`} className="mt-1.5 text-sm font-medium text-brand-red-dark">
          {errors[name]}
        </p>
      )}
    </div>
  )
}

function Select({ children, ...props }: React.ComponentProps<'select'>) {
  return (
    <div className="relative">
      <select {...props} className={`${inputClass} appearance-none pr-11`}>
        {children}
      </select>
      <ChevronDown aria-hidden size={18} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink-soft" />
    </div>
  )
}
