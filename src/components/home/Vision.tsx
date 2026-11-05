import { brand } from '../../content/site'
import { ButtonLink } from '../ui/Button'
import { Accent, Eyebrow, Section } from '../ui/Section'

const aims = [
  {
    title: 'Ideas, developed with care',
    body: 'We work with authors to shape early concepts into characters, scenes and pages that suit their story.',
  },
  {
    title: 'Stories made for young minds',
    body: 'Engaging, age-appropriate words and pictures that invite imagination and curiosity.',
  },
  {
    title: 'One coordinated process',
    body: 'Illustration, editorial support, publishing and promotion planned together rather than in separate pieces.',
  },
  {
    title: 'Reaching readers and families',
    body: 'Helping meaningful stories find their way to the children and families they were written for.',
  },
]

export function Vision() {
  return (
    <Section id="vision" tone="white" labelledBy="vision-title">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <Eyebrow>Our vision</Eyebrow>
          <h2 id="vision-title" className="text-display text-[clamp(2.1rem,1.5rem+2.4vw,3.6rem)] leading-[1.06]">
            Bringing stories to life <Accent>for young readers</Accent>
          </h2>
        </div>

        <div className="max-w-2xl lg:col-span-7">
          <p className="text-lg leading-relaxed sm:text-xl">
            Every children&rsquo;s book begins with an idea worth sharing: a character, a lesson, a memory or a question a
            child might ask. Our vision is to help authors develop those ideas into thoughtfully illustrated books that
            young readers want to return to.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
            A good children&rsquo;s book is made with care at every stage. That is why we bring illustration, editorial
            support, publishing and promotion together in one coordinated process, so the story stays clear and
            consistent from the first sketch to the finished book.
          </p>

          <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {aims.map((aim) => (
              <li key={aim.title} className="border-t-2 border-sun pt-4">
                <h3 className="font-bold">{aim.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{aim.body}</p>
              </li>
            ))}
          </ul>

          <ButtonLink href="/about" variant="quiet" className="mt-10">
            About {brand.name}
          </ButtonLink>
        </div>
      </div>
    </Section>
  )
}
