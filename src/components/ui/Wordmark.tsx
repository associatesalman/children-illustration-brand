type WordmarkProps = {
  className?: string
}

export function Wordmark({ className = '' }: WordmarkProps) {
  return (
    <span className={`text-display text-[1.6rem] leading-none tracking-tight ${className}`}>
      Children <span className="text-brand-red italic">Book</span>
    </span>
  )
}
