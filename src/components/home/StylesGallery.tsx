import { styles } from '../../content/home'
import { ArtImage } from '../ui/ArtImage'
import { Accent, Section, SectionHeading } from '../ui/Section'

export function StylesGallery() {
  return (
    <Section id="illustration" labelledBy="styles-title">
      <SectionHeading
        id="styles-title"
        eyebrow="Illustration styles"
        title={
          <>
            One character, <Accent>six styles</Accent>
          </>
        }
        intro="The right style depends on your story and your readers. Here is Mia, one of our sample characters, drawn six different ways."
      />

      <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:mt-16 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
        {styles.map((style) => (
          <li key={style.name}>
            <ArtImage artwork={style.artwork} className="rounded-sm" />
            <h3 className="mt-4 text-lg font-bold sm:text-xl">{style.name}</h3>
            <p className="mt-1 text-sm text-ink-soft sm:text-base">{style.note}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
