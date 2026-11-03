import { Globe, HandCoins, Headset, ReceiptText, Rocket, ShieldCheck } from 'lucide-react'
import { features, type Feature } from '../../content/home'
import { Accent, Section, SectionHeading } from '../ui/Section'

const icons: Record<Feature['icon'], typeof Rocket> = {
  launch: Rocket,
  royalty: HandCoins,
  readers: Globe,
  ownership: ShieldCheck,
  charges: ReceiptText,
  support: Headset,
}

export function Features() {
  const hasPendingClaims = features.some((feature) => feature.claim && !feature.claim.confirmed)

  return (
    <Section id="features" tone="paper" labelledBy="features-title">
      <SectionHeading
        id="features-title"
        eyebrow="Features"
        className="mx-auto text-center [&>p:last-child]:mx-auto"
        title={
          <>
            Top features of our <Accent>kids publishing agency</Accent>
          </>
        }
        intro="Here’s what you get with just one request to “Publish my child’s book”:"
      />

      <ul className="mx-auto mt-14 grid max-w-6xl gap-x-12 gap-y-14 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = icons[feature.icon]
          const pending = feature.claim && !feature.claim.confirmed
          return (
            <li key={feature.title} className="text-center">
              <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-sun text-ink">
                <Icon aria-hidden size={28} strokeWidth={2} />
              </span>
              <h3 className="text-display mt-5 text-2xl">{feature.title}</h3>
              <p className="mx-auto mt-3 max-w-xs leading-relaxed text-ink-soft">{feature.body}</p>
              {pending && (
                <p className="mt-4 inline-block bg-white px-2.5 py-1 text-xs font-bold tracking-[0.06em] text-brand-red-dark uppercase">
                  Pending confirmation: {feature.claim?.note}
                </p>
              )}
            </li>
          )
        })}
      </ul>

      {hasPendingClaims && (
        <p className="mx-auto mt-14 max-w-2xl text-center text-sm text-ink-soft">
          Items marked &ldquo;pending confirmation&rdquo; come from the reference document. They are not yet verified
          policies of Children Book and must be confirmed before launch.
        </p>
      )}
    </Section>
  )
}
