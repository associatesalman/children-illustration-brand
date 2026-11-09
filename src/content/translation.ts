import spreads480 from '../assets/translation/bear-and-mouse-spreads-480.webp'
import spreads736 from '../assets/translation/bear-and-mouse-spreads-736.webp'
import videoPoster from '../assets/translation/dutch-picture-books-poster.webp'
import video from '../assets/translation/dutch-picture-books.mp4'
import hero1672 from '../assets/translation/hero-translating-picture-books-1672.webp'
import hero960 from '../assets/translation/hero-translating-picture-books-960.webp'
import type { StyleImage, StyleVideoAsset } from './illustrationStyles'

/*
 * Children's Book Translation page. Media comes only from public/children book translation/ (web copies built by
 * scripts/optimize_translation.py). Book titles and authors are copied from the covers; descriptions only state
 * what a cover shows or says. Nothing here claims we translated or published these books, and no languages,
 * credentials, results or rankings are stated.
 */

const set = (...pairs: [string, number][]) => pairs.map(([src, w]) => `${src} ${w}w`).join(', ')

// ---------------------------------------------------------------- Hero

export const heroImage: StyleImage = {
  src: hero1672,
  srcSet: set([hero960, 960], [hero1672, 1672]),
  width: 1672,
  height: 941,
  alt: 'The Art of Translating Picture Books: a child drawn in white chalk rides a giant pencil toward yellow stars across a painted blue sky, above a dark rooftop with a cat',
  caption: '',
}

// ---------------------------------------------------------------- Service: the story and its voice (mockup)

export const spreadsImage: StyleImage = {
  src: spreads736,
  srcSet: set([spreads480, 480], [spreads736, 736]),
  width: 736,
  height: 1104,
  alt: 'Three open spreads of a picture book about Benny the Little Bear and Max the Little Mouse: a cottage among daisies, the friends sharing tea on a tree stump, and the pair resting in a sunset meadow, with the story text set in the open sky and grass around the pictures',
  caption: '',
}

export const storyIntro = [
  'A children’s book is a small, carefully balanced thing. Every sentence has to carry the story, sound right when it is read aloud and sit comfortably beside the pictures. Translating one means rebuilding that balance in a new language, not swapping one word for another.',
  'We read the whole book first, pictures included, so we understand what the story is about, who the characters are and how the author wants it to feel. Every decision after that serves the original book.',
]

export type ServicePoint = { title: string; body: string; points: string[] }

export const storyPoints: ServicePoint[] = [
  {
    title: 'The meaning and the author’s voice',
    body: 'We translate what the story means and how it is told: a gentle bedtime tone stays gentle, and a playful one stays playful. Where a literal phrase would lose the feeling, we find the wording that keeps it, and we flag any passage where a choice changes the text noticeably.',
    points: ['The full story read before translation begins', 'The author’s tone, humor and warmth carried across', 'Notes on any passage that needed a freer rendering'],
  },
  {
    title: 'Dialogue, characters and tone',
    body: 'Characters should sound like themselves in every language. In the spreads shown, Max the Little Mouse “squeaked excitedly” while Benny strums his guitar and answers thoughtfully. Those differences in voice are part of who the characters are, so they are kept consistent from the first page to the last.',
    points: ['A distinct voice for each character', 'Natural, speakable dialogue', 'Names and recurring phrases kept consistent'],
  },
  {
    title: 'Text that fits the pictures and the page',
    body: 'Translated text often runs longer or shorter than the original, and it has to sit in the same open space beside the illustrations. We check that the words still match what each picture shows, and keep line length and page breaks in mind so the layout works without crowding the art.',
    points: ['Words that agree with every illustration', 'Text length planned for the available space', 'Page turns kept where the story needs them'],
  },
]

// ---------------------------------------------------------------- Service: natural language for young readers (video)

export const readerVideo: StyleVideoAsset = {
  src: video,
  label: 'Hands paging through Dutch-language picture books, Wens and Samen: a white rabbit with a red ribbon in a green forest, and a smiling sloth',
  caption: '',
  poster: { src: videoPoster, width: 540, height: 960 },
}

export const readerIntro =
  'A translated picture book should feel as if it were written in its new language. The video pages through Dutch-language picture books, Wens (“wish”) and Samen (“together”): stories a Dutch-speaking child simply reads as their own. That is the goal for every translation we work on.'

export const readerPoints: ServicePoint[] = [
  {
    title: 'Natural language for the reading age',
    body: 'Vocabulary, sentence length and grammar are matched to the children the book is written for. A board book for toddlers, a picture book read aloud by a parent and a chapter book for confident readers each need a different level of language.',
    points: ['Words young readers know or can learn from context', 'Sentence length suited to the age group', 'No adult phrasing slipping into a children’s text'],
  },
  {
    title: 'Cultural references, adapted with care',
    body: 'Food, holidays, games, school life and idioms do not always travel. When a reference would puzzle young readers, we suggest a thoughtful option, from keeping it with gentle context to finding a close local equivalent, and we agree the approach with you, especially where an illustration shows the original.',
    points: ['Idioms rendered by meaning, not word by word', 'Options explained before anything is changed', 'Pictures and text kept in agreement'],
  },
  {
    title: 'Rhythm, repetition and read-aloud flow',
    body: 'Many picture books are written to be heard. Repeated lines, refrains, rhymes and the pause before a page turn are part of the storytelling, so we keep them working in the new language and read the translation aloud to check how it sounds.',
    points: ['Refrains and repeated patterns preserved', 'Rhyme and rhythm handled deliberately', 'Every text read aloud before delivery'],
  },
]

// ---------------------------------------------------------------- Book collections

export type BookLanguage = 'English' | 'Spanish' | 'French' | 'Italian' | 'German'

export type TranslationBook = {
  slug: string
  title: string
  author?: string
  language: BookLanguage
  description: string
  /** What the cover shows, for alt text. */
  cover: string
  width: number
  height: number
}

export type BookCollection = { id: string; title: string; intro: string; books: TranslationBook[] }

const covers = import.meta.glob<string>('../assets/translation/books/*.webp', { eager: true, import: 'default' })
export const coverSrc = (slug: string) => {
  const src = covers[`../assets/translation/books/${slug}.webp`]
  if (!src) throw new Error(`Missing cover: ${slug}`)
  return src
}

/** English first, then Spanish, then the other languages in this order. */
const languageOrder: BookLanguage[] = ['English', 'Spanish', 'French', 'Italian', 'German']
const byLanguage = (list: TranslationBook[]) =>
  [...list].sort((a, b) => languageOrder.indexOf(a.language) - languageOrder.indexOf(b.language))

type Entry = [slug: string, title: string, author: string | undefined, language: BookLanguage, description: string, cover: string, width: number, height: number]
const toBooks = (entries: Entry[]) =>
  byLanguage(entries.map(([slug, title, author, language, description, cover, width, height]) => ({ slug, title, author, language, description, cover, width, height })))

/*
 * Only the children's titles from the supplied list are shown: Paciencia, Eres una chica maravillosa, Eres un chico
 * fantástico, El niño que dejó de ser un desastre, Cahier d’écriture cursive, Les Misérables: High School Edition and
 * Juliette and the Magic Candy Store!. Wens and Samen, the other two on the list, have no cover files; they appear in
 * the reader video above. Adult titles were removed.
 */
const childrensBooks = toBooks([
  // English
  ['juliette-and-the-magic-candy-store', 'Juliette and the Magic Candy Store!', 'Rosie C. Collins', 'English', 'A girl carrying a book stands beside a blue parrot outside a sweet shop marked Confiserie.', 'a girl with a book beside a blue parrot outside a sweet shop', 297, 445],
  ['les-miserables-high-school-edition', 'Les Misérables: High School Edition', 'Victor Hugo', 'English', 'An English edition for high school readers, edited and abridged by Matt Larsen, as the cover states.', 'a dark collage of faces over a French flag', 296, 445],
  // Spanish
  ['paciencia', 'Paciencia', 'Maria Posa', 'Spanish', 'The subtitle means “Listen, wait, think.” A smiling lion with folded arms stands beside a shy hippo in a jungle clearing.', 'a smiling lion with folded arms beside a shy hippo in a jungle', 342, 442],
  ['eres-una-chica-maravillosa', 'Eres una chica maravillosa', 'María García', 'Spanish', '“You’re a Wonderful Girl.” A girl in a pink hoodie sits among sunset clouds, chin resting on her knees.', 'a girl in a pink hoodie sitting among sunset clouds', 304, 425],
  ['eres-un-chico-fantastico', 'Eres un chico fantástico', 'María García', 'Spanish', '“You’re a Fantastic Boy.” A companion title in the same style: a boy with a backpack sits on a cloud at dusk.', 'a boy with a backpack sitting on a cloud at dusk', 304, 425],
  ['el-nino-que-dejo-de-ser-un-desastre', 'El niño que dejó de ser un desastre', 'James Tear', 'Spanish', '“The boy who stopped being a mess,” described as a productivity book for younger readers.', 'a frustrated boy at a desk covered in papers', 311, 466],
  // French
  ['cahier-decriture-cursive', 'Cahier d’écriture cursive', undefined, 'French', 'A 120-page cursive handwriting workbook for young children, with letter-tracing pages on the cover.', 'cartoon children with pencils above letter-tracing pages', 298, 385],
])

export const collections: BookCollection[] = [
  {
    id: 'childrens-books',
    title: 'Children’s Books',
    intro: 'Seven books for young readers in English, Spanish and French, from picture books and a magic candy store story to a cursive handwriting workbook. Seen together, they show how titles, typography and covers change from one language to another.',
    books: childrensBooks,
  },
]
