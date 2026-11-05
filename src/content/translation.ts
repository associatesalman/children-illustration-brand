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

const childrensBooks = toBooks([
  ['paciencia', 'Paciencia', 'Maria Posa', 'Spanish', 'The subtitle means “Listen, wait, think.” A smiling lion with folded arms stands beside a shy hippo in a jungle clearing.', 'a smiling lion with folded arms beside a shy hippo in a jungle', 342, 442],
  ['eres-una-chica-maravillosa', 'Eres una chica maravillosa', 'María García', 'Spanish', '“You’re a Wonderful Girl.” A girl in a pink hoodie sits among sunset clouds, chin resting on her knees.', 'a girl in a pink hoodie sitting among sunset clouds', 304, 425],
  ['eres-un-chico-fantastico', 'Eres un chico fantástico', 'María García', 'Spanish', '“You’re a Fantastic Boy.” A companion title in the same style: a boy with a backpack sits on a cloud at dusk.', 'a boy with a backpack sitting on a cloud at dusk', 304, 425],
])

const bestsellerBooks = toBooks([
  ['40-dias-de-viaje-en-silencio', '40 días de viaje en silencio junto a Dios', 'Lucas Valdés', 'Spanish', '“Forty days of travel in silence with God.” The subtitle describes a path to discovering God in everyday life.', 'a figure kneeling on a hilltop below three crosses at sunrise', 297, 445],
  ['caminando-a-traves-del-duelo', 'Caminando a través del duelo', 'Lola Franz', 'Spanish', '“Walking through grief.” Two figures walk hand in hand along a moonlit path beneath a shooting star.', 'two figures walking hand in hand along a moonlit path', 288, 445],
  ['el-principe-de-maquiavelo', 'El Príncipe de Maquiavelo: Edición completa en español', 'Nicolás Maquiavelo', 'Spanish', 'A complete Spanish edition of The Prince. The cover describes it as a new modern translation, translated and annotated, from Timeless Lore.', 'a painted portrait of Machiavelli holding a quill before a castle', 311, 466],
  ['between-heaven-and-earth', 'Between Heaven and Earth', 'TheFallenPoet', 'English', 'Poems about losing and finding yourself, as the subtitle says, under a classical painting of a winged figure.', 'a classical painting of a seated young man with wings', 302, 466],
  ['necesitaba-perderte-para-encontrarme', 'Necesitaba perderte para encontrarme', 'Fabian Garcia', 'Spanish', '“I needed to lose you to find myself.” The tagline adds that a story did not end; the author’s own began.', 'an ink drawing of a woman’s face with gold lettering', 311, 466],
])

const generalBooks = toBooks([
  // English
  ['les-miserables-high-school-edition', 'Les Misérables: High School Edition', 'Victor Hugo', 'English', 'An English edition for high school readers, edited and abridged by Matt Larsen, as the cover states.', 'a dark collage of faces over a French flag', 296, 445],
  ['the-stranger', 'The Stranger', 'Albert Camus', 'English', 'An English edition of Camus’s novel, the title set in a gold band across a dark red and black cover.', 'a gold title band across a dark red and black textured cover', 342, 443],
  ['swanns-way', 'Swann’s Way', 'Marcel Proust', 'English', 'In Search of Lost Time, Volume One, translated by C. K. Scott Moncrieff, as credited on the cover.', 'a plain pale blue cover with a thin gold frame', 296, 445],
  ['101-conversations-in-simple-italian', '101 Conversations in Simple Italian', 'Olly Richards', 'English', 'Short, natural dialogues for learners of Italian, with a café scene and a CEFR A2–B1 level on the spine.', 'friends talking at a café table under the sign La Casetta', 288, 445],
  ['juliette-and-the-magic-candy-store', 'Juliette and the Magic Candy Store!', 'Rosie C. Collins', 'English', 'A girl carrying a book stands beside a blue parrot outside a sweet shop marked Confiserie.', 'a girl with a book beside a blue parrot outside a sweet shop', 297, 445],
  ['italian-short-stories-for-beginners', 'Italian Short Stories for Beginners: Book 1', undefined, 'English', 'From the Learn Like a Native series: over 100 dialogues and everyday phrases for learning Italian, according to the cover.', 'two illustrated characters in Venetian dress on green and white', 279, 445],
  ['revelations-of-catalina-on-the-holy-mass', 'Revelations of Catalina on the Holy Mass', 'Catalina Rivas', 'English', 'The cover describes the story of an encounter between the Virgin Mary and the Bolivian mystic.', 'a golden chalice with a glowing host', 297, 445],
  ['the-zen-monkey-and-the-lotus-flower', 'The Zen Monkey and the Lotus Flower', 'Tenpa Yeshe', 'English', 'Subtitled “52 stories that will change your life,” with a meditating monkey among pink lotus flowers.', 'a meditating monkey among pink lotus flowers', 288, 445],
  ['momma-jackies-traditional-italian-cooking', 'Momma Jackie’s Traditional Italian Cooking', 'Jackie Vitiello', 'English', 'A cookbook of traditional Italian recipes; the author smiles behind a wooden box marked Andiamo.', 'the author behind a wooden Andiamo box above a spoon of sauce', 342, 442],
  ['the-crowd', 'The Crowd: Study of the Popular Mind', undefined, 'English', 'A historic photograph of a dense crowd in a city street frames the title plate.', 'a black-and-white photograph of a dense street crowd', 296, 445],
  ['learn-italian-fast-for-adult-beginners', 'Learn Italian Fast for Adult Beginners', undefined, 'English', 'A three-in-one textbook and workbook; the cover lists 15-minute daily lessons and a 30-day study plan.', 'Italian landmarks beneath a bold yellow title', 297, 445],
  ['italian-short-stories-language-guru', 'Italian Short Stories for Beginners and Intermediate Learners', 'Language Guru', 'English', 'Short stories for learning Italian and building vocabulary, above a photograph of Venice’s Rialto Bridge.', 'a photograph of the Rialto Bridge in Venice', 296, 445],
  ['learn-french-with-short-stories', 'Learn French with Short Stories', 'French Hacking', 'English', 'Fifteen beginner stories with parallel French and English text, as the cover describes.', 'an open book with the Eiffel Tower rising from its pages', 311, 466],
  ['the-millionaire-way', 'The Millionaire Way', 'Yoel Sardiñas', 'English', 'Labeled an agenda on the cover, with a golden bull charging through a night-time city.', 'a golden bull charging through a night city', 310, 466],
  ['freedom', 'Freedom', undefined, 'English', 'Published under the First Church name, the cover quotes John 8:32: “And you will know the truth and the truth will set you free.”', 'a plain teal cover with a framed title and a Bible quotation', 313, 385],
  // Spanish
  ['el-viaje-de-quien-se-atrevio-a-cambiar', 'El viaje de quien se atrevió a cambiar', 'Beethovens Bernardin', 'Spanish', '“The journey of someone who dared to change,” illustrated with a caterpillar and a blue butterfly.', 'a caterpillar and a blue butterfly on white', 297, 445],
  ['las-meditaciones-de-marco-aurelio', 'Las meditaciones de Marco Aurelio', 'Marco Aurelio', 'Spanish', 'A Spanish edition of the Meditations, with a marble bust of the emperor on a plain stone-colored cover.', 'a marble bust of Marcus Aurelius on a stone-colored cover', 314, 445],
  ['imitacion-de-cristo', 'Imitación de Cristo', 'Tomás de Kempis', 'Spanish', 'A Spanish edition of The Imitation of Christ, with a framed portrait of Jesus above the title.', 'a framed painted portrait of Jesus', 296, 445],
  ['el-arte-de-la-guerra', 'El arte de la guerra', 'Sun Tzu', 'Spanish', 'A special edition of The Art of War in Spanish, “with charts and illustrations,” as the cover notes.', 'a carved stone warrior’s face against a dark ember-lit background', 297, 445],
  ['primero-yo-despues-el-resto', 'Primero yo, después el resto', 'Aurora S.', 'Spanish', '“Me first, then everything else.” A woman reads in a red armchair; the subtitle lists 120 sessions of uncomfortable truths.', 'a woman reading cross-legged in a red armchair', 297, 445],
  ['el-ladron-de-mis-recuerdos', 'El ladrón de mis recuerdos', 'Alma Márquez', 'Spanish', '“The thief of my memories.” A smiling boy with white birds in his hair is framed by flowers.', 'a smiling boy with white birds in his hair among flowers', 297, 445],
  ['el-castillo-interior', 'El castillo interior: Las moradas', 'Santa Teresa de Ávila', 'Spanish', 'Teresa of Ávila’s The Interior Castle, with a photograph of a castle lit at dusk.', 'a castle on the water lit at dusk', 296, 445],
  ['el-poder-de-estar-solo', 'El poder de estar solo', 'Brian Alba', 'Spanish', '“The power of being alone,” described on the cover as a dose of motivation and ideas for a better life.', 'a single lamp against a white brick wall', 296, 445],
  ['amor-fati', 'Amor fati: Ama tu destino', 'Casimiro Ruiz', 'Spanish', '“Love your fate,” with two hands reaching toward each other, after Michelangelo.', 'two hands reaching toward each other on black', 311, 466],
  ['diario-de-un-corazon-sano', 'Diario de un corazón sano', 'Alva Behr', 'Spanish', '“Diary of a healthy heart,” signed on the cover “con amor… Dios” (with love… God).', 'hand-lettered white title on a plain deep red cover', 291, 466],
  ['te-sigo-buscando-en-las-estrellas', 'Te sigo buscando en las estrellas', 'Felipe Melendres', 'Spanish', '“I keep looking for you in the stars.” A small astronaut drifts across a starry navy sky.', 'a small astronaut drifting across a starry sky', 306, 466],
  ['como-dejar-de-pensar-demasiado', 'Cómo dejar de pensar demasiado', 'Adam Tusco', 'Spanish', '“How to stop overthinking,” described on the cover as a guide to living without anxiety.', 'a colorful illustrated brain', 291, 466],
  ['ejercicios-de-memoria-para-personas-mayores', 'Ejercicios de memoria para personas mayores', undefined, 'Spanish', '“Memory exercises for older adults,” with 200 activities in large print, as the cover states.', 'a smiling older couple doing puzzles together', 298, 385],
  ['meditaciones-marco-aurelio-en-espanol', 'Meditaciones: Diario de un emperador', 'Marco Aurelio', 'Spanish', 'Marcus Aurelius’s Meditations in Spanish, subtitled “diary of an emperor,” beside a sculpted bust.', 'a sculpted bust of Marcus Aurelius on black', 311, 466],
  ['la-taza-de-la-manana', 'La taza de la mañana', 'Camille J. Sage', 'Spanish', '“The morning cup,” described as micro-rituals of healing for starting again each day.', 'a cup of black coffee seen from above on dark wood', 311, 466],
  ['tu-eres-tu-prioridad', 'Tú eres tu prioridad', 'Jaden Finn', 'Spanish', '“You are your priority,” with 100 essential truths for loving yourself, according to the subtitle.', 'a line drawing of a woman holding a red rose', 302, 466],
  ['me-acorde-de-mi', 'Me acordé de mí… y me olvidé de ti', 'Julia Arenas', 'Spanish', '“I remembered myself… and forgot you,” described as a journey toward self-love and emotional healing.', 'a pink blossoming tree with a hummingbird', 302, 466],
  ['dosis-diaria-de-terapia', 'Dosis diaria de terapia', 'Clara Montes', 'Spanish', '“A daily dose of therapy” for coming back to yourself, with word-labeled pills in an open hand.', 'an open hand holding pills printed with words', 311, 466],
  ['46-cartas-estoicas', '46 cartas estoicas', undefined, 'Spanish', 'Seneca’s consolations on amor fati and memento mori, with the translation credited to Lucio Vega on the cover.', 'an engraving of a classical temple and a bust of Seneca', 311, 466],
  ['el-nino-que-dejo-de-ser-un-desastre', 'El niño que dejó de ser un desastre', 'James Tear', 'Spanish', '“The boy who stopped being a mess,” described as a productivity book for younger readers.', 'a frustrated boy at a desk covered in papers', 311, 466],
  ['noches-blancas', 'Noches blancas', 'Fiódor Dostoievski', 'Spanish', 'A Spanish edition of White Nights, with a couple walking along a lamp-lit river at night.', 'a couple walking along a lamp-lit river at night', 293, 466],
  ['deja-de-pensar-demasiado', 'Deja de pensar demasiado', 'Fabian Garcia', 'Spanish', '“Stop overthinking,” five books in one, with a pair of shoes standing at a fork in the road.', 'a pair of sneakers at a fork in a road', 311, 466],
  // French
  ['une-si-longue-lettre', 'Une si longue lettre', 'Mariama Bâ', 'French', 'A French edition of So Long a Letter, with a photograph of a woman writing at a desk.', 'a woman in a blue headscarf writing at a desk', 296, 445],
  ['vingt-quatre-heures-de-la-vie-dune-femme', 'Vingt-quatre heures de la vie d’une femme', 'Stefan Zweig', 'French', 'A French edition of Twenty-Four Hours in the Life of a Woman, in an ornate patterned frame.', 'a woman with an umbrella in an ornate patterned frame', 297, 445],
  ['la-fortune-des-rougon', 'La Fortune des Rougon', 'Émile Zola', 'French', 'The first novel of Zola’s Rougon-Macquart cycle, with a painting of a pine tree above a valley.', 'a painting of a pine tree over a Provençal valley', 297, 445],
  ['le-horla', 'Le Horla', 'Guy de Maupassant', 'French', 'Maupassant’s story, with a pale grey sketch of a room behind the title.', 'a pale grey sketch of a room', 298, 425],
  ['letranger', 'L’Étranger', 'Albert Camus', 'French', 'The French original of the novel also shown here in English, with a man looking out over the sea.', 'a man in a white shirt looking out over a sunlit sea', 311, 466],
  ['le-prince-de-machiavel', 'Le Prince de Machiavel: Édition complète', 'Nicolas Machiavel', 'French', 'A complete French edition of The Prince; the cover describes a new modern translation, translated and annotated.', 'a painted portrait of Machiavelli holding a quill', 311, 466],
  ['cahier-decriture-cursive', 'Cahier d’écriture cursive', undefined, 'French', 'A 120-page cursive handwriting workbook for young children, with letter-tracing pages on the cover.', 'cartoon children with pencils above letter-tracing pages', 298, 385],
  // Italian
  ['i-fantasmi-di-sambuca', 'I fantasmi di Sambuca', 'Melanie Chircop', 'Italian', 'A story in Italian for intermediate learners of the language, set against a hilltop town at night.', 'a hilltop town lit up at night', 296, 445],
  ['il-fu-mattia-pascal', 'Il fu Mattia Pascal', 'Luigi Pirandello', 'Italian', 'Part of the cover’s I classici della letteratura italiana series, with a golden view of Florence.', 'a golden sunset over Florence and a classical statue', 313, 445],
  ['incontri-in-sicilia', 'Incontri in Sicilia', 'Serena Capilli', 'Italian', 'Stories in Italian for lower-intermediate to intermediate learners, marked level A2, under a branch of lemons.', 'a branch of lemons against a blue sky', 279, 445],
  ['divina-commedia', 'Divina Commedia', 'Dante Alighieri', 'Italian', 'Dante’s Divine Comedy in Italian, with a simple red title panel on a dark painted background.', 'a red title panel on a dark painted background', 304, 466],
  ['iliade', 'Iliade', 'Omero', 'Italian', 'Homer’s Iliad in the Italian translation by Vincenzo Monti, as credited on the cover.', 'a neoclassical painting of mourners around a fallen warrior', 310, 466],
  ['gioielli-caffe-e-firenze', 'Gioielli, caffè e Firenze', 'Serena Capilli', 'Italian', 'Learn Italian with stories, at level B1 for intermediate learners, with a coffee cup before a view of Florence.', 'a coffee cup on a saucer in front of a view of Florence', 291, 466],
  ['i-promessi-sposi', 'I Promessi Sposi', undefined, 'Italian', 'A collection of color figurines from Manzoni’s novel, after Gonin’s illustrations for the first illustrated edition.', 'colorful figurines of characters in historical dress', 305, 385],
  ['il-mistero-della-casa-in-sicilia', 'Il mistero della casa in Sicilia', 'Melanie Chircop', 'Italian', 'A mystery in Italian for upper-beginner to lower-intermediate learners, set in a narrow lamp-lit street.', 'a narrow Sicilian street lit by lamps at night', 311, 466],
  // German
  ['schachnovelle', 'Schachnovelle', 'Stefan Zweig', 'German', 'Zweig’s The Royal Game in German, with a single chess king on a plain white cover.', 'a black-and-white chess king on white', 306, 466],
  ['der-zauberberg', 'Der Zauberberg', 'Thomas Mann', 'German', 'Thomas Mann’s The Magic Mountain, from the Moncreiffe Classics series, with a painted alpine valley.', 'a painted snowy alpine valley', 311, 466],
  ['meersalz-zimt-und-kuestenglueck', 'Meersalz, Zimt und Küstenglück', 'Lina Martens', 'German', '“Sea salt, cinnamon and coastal happiness,” with a thatched seaside café among flowers.', 'a thatched seaside café surrounded by flowers', 279, 445],
  ['omas-kreuzwortraetsel', 'Oma’s Kreuzworträtsel', undefined, 'German', '“Grandma’s crosswords”: 100 large-print puzzles with solutions, as the cover states.', 'a grandmother doing a crossword in an armchair by the fire', 342, 443],
  ['der-kleine-roman-fuer-zwischendurch', 'Der kleine Roman für zwischendurch', 'Anna Winterberg', 'German', '“The little novel for in between,” on a bright cover of pink hearts and blossoms.', 'pink hearts and blossoms on light blue', 291, 466],
  ['das-maedchen-mit-der-goldenen-schere', 'Das Mädchen mit der goldenen Schere', 'Julia Drosten', 'German', '“The girl with the golden scissors,” a historical novel, with a woman in a hat before a city skyline.', 'a woman in a feathered hat before an illustrated city skyline', 302, 466],
  ['slow-cooker-kochbuch', 'Slow Cooker Kochbuch', 'Easy Kochen', 'German', 'A slow-cooker cookbook with 150 recipes for working people and families, according to the cover.', 'a spread of slow-cooked dishes around the title', 342, 342],
  ['sylter-briefe', 'Sylter Briefe', 'Stefan Wollschläger', 'German', 'A crime novel set on Sylt, with a striped beach chair on the sand under a blue sky.', 'a striped beach chair on a sandy beach', 279, 445],
])

export const collections: BookCollection[] = [
  {
    id: 'childrens-books',
    title: 'Children’s Books',
    intro: 'Picture books for young readers, all three in Spanish. Short, illustrated texts like these are where every word has to fit the page and the picture.',
    books: childrensBooks,
  },
  {
    id: 'bestseller-books',
    title: 'Bestseller Books',
    intro: 'Five titles in English and Spanish, from poetry and reflections on faith and grief to a complete Spanish edition of Machiavelli’s The Prince.',
    books: bestsellerBooks,
  },
  {
    id: 'general-books',
    title: 'General Book Collection',
    intro: 'Sixty books in English, Spanish, French, Italian and German: classics, graded readers for language learners, cookbooks, puzzles and novels. Seen together, they show how titles, typography and covers change from one language to another.',
    books: generalBooks,
  },
]
