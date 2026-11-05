import { Container } from '../ui/Container'

/** A quiet service note below the studio, outside the editor. */
export function ColoringCta() {
  return (
    <aside aria-labelledby="coloring-cta-title" className="border-t border-ink/10 bg-paper">
      <Container className="flex flex-col gap-3 py-8 sm:py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div>
          <h2 id="coloring-cta-title" className="font-semibold">
            Creating a coloring or activity book?
          </h2>
          <p className="mt-1 text-ink-soft">Our illustrators draw pages like these for authors and publishers.</p>
        </div>
        <ul className="flex flex-wrap gap-x-6 font-medium">
          <li>
            <a href="/services/activity-book-illustration" className="inline-flex min-h-11 items-center underline decoration-2 underline-offset-4 hover:text-brand-red">
              Activity Book Illustration
            </a>
          </li>
          <li>
            <a href="/services/illustration-styles" className="inline-flex min-h-11 items-center underline decoration-2 underline-offset-4 hover:text-brand-red">
              Illustration Styles
            </a>
          </li>
          <li>
            <a href="/free-sample" className="inline-flex min-h-11 items-center underline decoration-2 underline-offset-4 hover:text-brand-red">
              Request a free sample
            </a>
          </li>
        </ul>
      </Container>
    </aside>
  )
}
