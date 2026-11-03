type ChecklistProps = {
  items: string[]
  className?: string
  /** Marker color class for the small square bullet. */
  marker?: string
}

export function Checklist({ items, className = '', marker = 'bg-brand-red' }: ChecklistProps) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden className={`mt-[0.6em] size-2 shrink-0 ${marker}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
