import { CharacterCta } from '../components/character/CharacterCta'
import { CharacterFaq } from '../components/character/CharacterFaq'
import { CharacterHero } from '../components/character/CharacterHero'
import {
  CreationSection,
  DevelopmentSection,
  ExpressionsSection,
  SheetsSection,
} from '../components/character/CharacterSections'
import { usePageMeta } from '../lib/pageMeta'

export function CharacterDesignPage() {
  usePageMeta(
    'Character Design',
    "Character design for children's books: main character creation, expressions, character sheets and character development, shaped by personality, emotion, age group and your story.",
  )

  return (
    <>
      <CharacterHero />
      <CreationSection />
      <ExpressionsSection />
      <SheetsSection />
      <DevelopmentSection />
      <CharacterFaq />
      <CharacterCta />
    </>
  )
}
