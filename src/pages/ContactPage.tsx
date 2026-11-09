import { MapPin } from 'lucide-react'
import { InquiryForm } from '../components/contact/InquiryForm'
import { ArtImage } from '../components/ui/ArtImage'
import { Accent, Eyebrow } from '../components/ui/Section'
import { artwork } from '../content/artwork'
import { officeAddress } from '../content/site'
import { usePageMeta } from '../lib/pageMeta'

// Aligns each column's outer edge with the shared 90rem container used elsewhere on the site.
const outerLeft = 'px-5 sm:px-8 lg:pr-14 lg:pl-[calc(max(0px,(100vw-90rem)/2)+3rem)]'
const outerRight = 'px-5 sm:px-8 lg:pl-14 lg:pr-[calc(max(0px,(100vw-90rem)/2)+3rem)]'

export function ContactPage() {
  usePageMeta(
    'Contact',
    'Tell Klutzbookpublishers about your children’s book. Ask about illustration, editing, design, publishing, or marketing, and we’ll reply by email.',
  )

  return (
    <section aria-labelledby="contact-title" className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <div className={`flex flex-col gap-10 bg-sun lg:justify-center lg:gap-14 pt-14 pb-10 sm:pt-20 lg:py-20 ${outerLeft}`}>
        <div className="max-w-lg">
          <Eyebrow className="text-ink">Contact</Eyebrow>
          <h1 id="contact-title" className="text-display text-[clamp(2.5rem,1.7rem+2.8vw,4.25rem)] leading-[1.04]">
            Let&rsquo;s talk about <Accent>your book.</Accent>
          </h1>
          <p className="mt-6 text-lg leading-relaxed">
            Whether you have an idea, a manuscript, or a finished book that needs help reaching readers, tell us where
            you are. We&rsquo;ll read every detail and reply by email.
          </p>
          <address className="mt-8 not-italic">
            <p className="text-sm font-bold tracking-[0.08em] uppercase">Visit us</p>
            <a
              href={officeAddress.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${officeAddress.text} (opens Google Maps in a new tab)`}
              className="mt-2 inline-flex items-start gap-2 text-lg font-medium underline-offset-4 hover:underline"
            >
              <MapPin aria-hidden size={22} className="mt-1 shrink-0 text-brand-red-dark" />
              <span>
                {officeAddress.lines[0]}
                <br />
                {officeAddress.lines[1]}
              </span>
            </a>
          </address>
        </div>
        <ArtImage artwork={artwork.contact} priority className="mx-auto max-w-md lg:max-w-lg" />
      </div>

      <div className={`bg-white py-14 sm:py-20 ${outerRight}`}>
        <div className="max-w-2xl">
          <h2 className="text-display text-3xl">Send an inquiry</h2>
          <p className="mt-3 mb-10 text-ink-soft">
            Fields marked optional can be left blank. Everything else helps us understand your project.
          </p>
          <InquiryForm />
        </div>
      </div>
    </section>
  )
}
