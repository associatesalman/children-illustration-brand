import { BookCollections, ReaderLanguageSection, StoryVoiceSection, TranslationHero } from '../components/translation/TranslationSections'
import { usePageMeta } from '../lib/pageMeta'

export function ChildrensBookTranslationPage() {
  usePageMeta(
    'Children’s Book Translation',
    'Children’s book translation that keeps the story’s meaning, the author’s voice, natural language for the reading age, read-aloud rhythm and text that fits the illustrations.',
  )

  return (
    <>
      <TranslationHero />
      <StoryVoiceSection />
      <ReaderLanguageSection />
      {/* Children's Books, then Bestseller Books, then the General Book Collection */}
      <BookCollections />
    </>
  )
}
