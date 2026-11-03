import { authorChallenges } from '../../content/about'
import { Accent, Section, SectionHeading } from '../ui/Section'

export function WhyWeExist() {
  return (
    <Section id="why-we-exist" tone="ink" labelledBy="why-title">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
        <div>
          <SectionHeading
            id="why-title"
            eyebrow="Why we exist"
            eyebrowClassName="text-sun"
            title={
              <>
                A children&rsquo;s book shouldn&rsquo;t need <Accent className="text-sun">five separate hires</Accent>
              </>
            }
          />
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/75">
            Many authors start with a strong story, then spend months looking for an illustrator, an editor, a designer,
            and someone who understands publishing platforms. Each hire brings a new brief, a new schedule, and new
            expectations.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-[0.08em] text-sun uppercase">What authors tell us gets in the way</h3>
          <ul className="mt-5 divide-y divide-white/15 border-y border-white/15">
            {authorChallenges.map((challenge) => (
              <li key={challenge} className="py-4 text-lg text-white/90">
                {challenge}
              </li>
            ))}
          </ul>

          <h3 className="text-display mt-12 text-3xl">One team, one plan</h3>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/75">
            We bring those specialists together under one project coordinator. Your book gets one brief, one schedule,
            and one point of contact, and each stage builds on the one before it.
          </p>
        </div>
      </div>
    </Section>
  )
}
