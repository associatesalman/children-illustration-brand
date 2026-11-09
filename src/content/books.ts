/**
 * Book covers shown in the Home and Portfolio showcases. Web copies of the
 * files in public/illustration books, exported by scripts/optimize_books.py.
 *
 * The folder holds 60 files: 58 unique covers once a byte-identical copy and a
 * resized duplicate are removed. "The Owner & the Wife", an adult novel, is
 * left out, as are three adult titles removed from Home (a parenting guide and two
 * adult language-learning readers), so 54 books are listed: 30 on Portfolio and
 * 24 on Home, none on both.
 * Titles are copied from the covers; descriptions only describe what each cover
 * shows or states, with English glosses for non-English titles.
 */

const images = import.meta.glob<string>('../assets/books/*.webp', { eager: true, import: 'default' })
const image = (name: string) => images[`../assets/books/${name}.webp`]

export const bookCategories = {
  confidence: {
    label: 'Confidence & Inspiration',
    intro: 'Books that tell children they are capable and loved. Most covers put a single hopeful hero against a wide, glowing sky.',
  },
  values: {
    label: 'Values & Life Skills',
    intro: 'Honesty, patience, boundaries and good judgment, taught through characters young readers can recognize themselves in.',
  },
  faith: {
    label: 'Faith & Culture',
    intro: 'Prayer, Bible stories and family traditions, illustrated with warmth, rich color and care for the details that matter.',
  },
  animals: {
    label: 'Animal Stories',
    intro: 'Animal characters carry the feeling on these covers, through big eyes, soft fur and expressive poses.',
  },
  classics: {
    label: 'Classics & Fairy Tales',
    intro: 'New editions of timeless stories and collections of fables and fairy tales, each giving familiar characters a fresh look.',
  },
  older: {
    label: 'Stories for Older Readers',
    intro: 'Painted, cinematic covers for confident readers, where lighting and setting hint at the mystery or adventure inside.',
  },
  humor: {
    label: 'Humor & Holidays',
    intro: 'Jokes, silliness and seasonal fun, with bold shapes and expressive faces doing the comic timing.',
  },
  learning: {
    label: 'Early Learning',
    intro: 'Phonics, opposites, numbers and high-contrast pictures for babies, toddlers and brand-new readers.',
  },
  curious: {
    label: 'Curious Minds',
    intro: 'Question-and-answer books and encyclopedias, packed with labeled pictures for children who want to know how everything works.',
  },
  activity: {
    label: 'Activity & Coloring',
    intro: 'Workbooks and coloring books, where clear outlines and well-organized pages matter as much as the artwork.',
  },
  languages: {
    label: 'Languages & Bilingual',
    intro: 'Picture dictionaries and stories that pair every word or line with its translation.',
  },
} as const

export type BookCategory = keyof typeof bookCategories
export type BookCollection = 'portfolio' | 'home'

export type Book = {
  slug: string
  title: string
  category: BookCategory
  collection: BookCollection
  description: string
  /** What the cover shows, for alt text. */
  cover: string
  width: number
  height: number
}

/** Category order on each page. */
export const collectionCategories: Record<BookCollection, BookCategory[]> = {
  portfolio: ['classics', 'animals', 'faith', 'older', 'humor', 'learning', 'activity', 'languages'],
  home: ['confidence', 'values', 'classics', 'older', 'curious', 'learning', 'activity'],
}

export const books: Book[] = [
  // Portfolio: Classics & Fairy Tales
  {
    slug: 'o-pequeno-principe',
    title: 'O Pequeno Príncipe',
    category: 'classics',
    collection: 'portfolio',
    description:
      'A Portuguese edition of The Little Prince with an airy, mostly white cover. The prince rises on a string of migrating birds above a small golden planet, the hand-lettered title floating between them.',
    cover: 'the Little Prince carried upward by a flock of birds above a small golden planet',
    width: 296,
    height: 445,
  },
  {
    slug: 'le-avventure-di-pinocchio',
    title: 'Le avventure di Pinocchio',
    category: 'classics',
    collection: 'portfolio',
    description:
      'An Italian edition of Pinocchio that sets a softly lit painting inside a black frame: the long-nosed puppet in a pointed cap reaches toward a girl with bright blue hair.',
    cover: 'Pinocchio in a pointed cap facing a girl with blue hair, on a black background',
    width: 298,
    height: 445,
  },
  {
    slug: 'el-principito',
    title: 'El Principito',
    category: 'classics',
    collection: 'portfolio',
    description:
      'A Spanish edition of The Little Prince painted in soft watercolor blues. The prince and the fox stand on his tiny planet, looking toward the rose beneath its glass dome.',
    cover: 'the Little Prince and a fox on a small planet beside a rose under a glass dome',
    width: 313,
    height: 445,
  },
  {
    slug: 'favole-sbagliate',
    title: 'Favole sbagliate',
    category: 'classics',
    collection: 'portfolio',
    description:
      'The Italian title means “mixed-up fables.” Little Red Riding Hood reads a book at the center of a crowd of familiar faces: the wolf, a horned queen, a grandmother and two little pigs.',
    cover: 'Little Red Riding Hood reading among the wolf, a horned queen, a grandmother and two pigs',
    width: 365,
    height: 522,
  },

  // Portfolio: Animal Stories
  {
    slug: 'a-tail-of-twirls',
    title: 'A Tail of Twirls',
    category: 'animals',
    collection: 'portfolio',
    description:
      'A cat in a tutu and tiara pirouettes with a broom while mice and a goose spin through a lavender evening sky. The subtitle introduces Kittina and the Starlight Ballerina.',
    cover: 'a ballerina cat in a tutu dancing with a broom, with mice and a goose in a lavender sky',
    width: 342,
    height: 342,
  },
  {
    slug: 'great-grandma-loves-me',
    title: 'Great Grandma Loves Me!',
    category: 'animals',
    collection: 'portfolio',
    description:
      'An elderly bear in round glasses and a checked shawl hugs a cub close, with small red hearts floating above them. Warm golds and greens make the square cover feel like an embrace.',
    cover: 'an old bear in glasses and a checked shawl hugging a bear cub',
    width: 342,
    height: 342,
  },
  {
    slug: 'pebbles-and-the-biggest-number',
    title: 'Pebbles and the Biggest Number',
    category: 'animals',
    collection: 'portfolio',
    description:
      'A smiling caterpillar curls into a pair of orange wings beneath a speech-bubble title, while ever-larger numbers, from 1,000 to 3,000,000, drift across the night sky around it.',
    cover: 'a smiling caterpillar with orange wings surrounded by large numbers',
    width: 342,
    height: 318,
  },
  {
    slug: 'il-misterioso-ladro-di-zucche',
    title: 'Il misterioso ladro di zucche',
    category: 'animals',
    collection: 'portfolio',
    description:
      '“The Mysterious Pumpkin Thief.” A wide-eyed blue wolf pup sits on a forest path lit by grinning jack-o’-lanterns, and a paw print stands in for one letter of the chalky title.',
    cover: 'a blue wolf pup sitting among glowing jack-o’-lanterns in a forest',
    width: 348,
    height: 522,
  },

  // Portfolio: Faith & Culture
  {
    slug: 'mateo-aprende-a-orar',
    title: 'Mateo aprende a orar',
    category: 'faith',
    collection: 'portfolio',
    description:
      '“Mateo Learns to Pray.” A boy kneels with eyes closed and hands folded under a starry blue sky. Simple shapes and patterned pillows give the square cover a calm, bedtime mood.',
    cover: 'a boy with folded hands and closed eyes praying under a starry sky',
    width: 342,
    height: 342,
  },
  {
    slug: 'la-bible-pour-les-enfants',
    title: 'La Bible pour les enfants',
    category: 'faith',
    collection: 'portfolio',
    description:
      'A French children’s Bible that gathers many stories into one circular scene: Adam and Eve, Moses with his staff, Noah’s ark, the crucifixion, and Mary holding the infant Jesus.',
    cover: 'Bible figures including Adam and Eve, Moses, Noah’s ark, the crucifixion and Mary with the infant Jesus',
    width: 312,
    height: 445,
  },
  {
    slug: 'the-marigold-road',
    title: 'The Marigold Road',
    category: 'faith',
    collection: 'portfolio',
    description:
      'Día de los Muertos stories about love, memory and the real Day of the Dead. Papel picado banners and marigolds frame a path of petals leading a girl toward an ofrenda and a cemetery gate.',
    cover: 'a girl on a path of marigold petals leading to an ofrenda, framed by papel picado banners',
    width: 297,
    height: 445,
  },

  // Portfolio: Stories for Older Readers
  {
    slug: 'mystere-au-college',
    title: 'Mystère au collège: Spécial 6e',
    category: 'older',
    collection: 'portfolio',
    description:
      '“Mystery at School,” for sixth graders. Two students walk toward a gothic school building at dusk, and a round badge describes the book as an illustrated novel in full color.',
    cover: 'two students walking toward a gothic school building at dusk',
    width: 297,
    height: 445,
  },
  {
    slug: 'le-secret-de-la-cabane-interdite',
    title: 'Le secret de la cabane interdite',
    category: 'older',
    collection: 'portfolio',
    description:
      '“The Secret of the Forbidden Cabin.” Seen from behind, a girl and a boy face an old cabin deep in a shadowy wood. The tagline pitches it to readers aged 8 to 12.',
    cover: 'a girl and a boy seen from behind, facing an old cabin in a dark forest',
    width: 297,
    height: 445,
  },
  {
    slug: 'coinces-dans-une-partie-d-echecs',
    title: 'Coincés dans une partie d’échecs',
    category: 'older',
    collection: 'portfolio',
    description:
      '“Stuck in a Game of Chess.” Two children stand on a glowing chessboard, dwarfed by giant pieces that fade into a teal haze, under chalk-style lettering.',
    cover: 'two children standing among giant chess pieces on a glowing chessboard',
    width: 297,
    height: 445,
  },
  {
    slug: 'i-tre-moschettieri',
    title: 'I tre moschettieri',
    category: 'older',
    collection: 'portfolio',
    description:
      'An Italian edition of The Three Musketeers marked for ages 9 and up. Four swordsmen in plumed hats and capes are painted like an old oil canvas beneath an ornate gold title.',
    cover: 'four musketeers in plumed hats and capes painted in an old-master style',
    width: 296,
    height: 445,
  },

  // Portfolio: Humor & Holidays
  {
    slug: 'barzellette-per-bambini',
    title: 'Barzellette per bambini',
    category: 'humor',
    collection: 'portfolio',
    description:
      '“Jokes for Kids.” A crocodile rolls on its back, laughing, among confetti, balloons, laughing emoji faces and a scattering of “HA!”s.',
    cover: 'a laughing crocodile among confetti, balloons and laughing emoji faces',
    width: 279,
    height: 445,
  },
  {
    slug: 'freddie-the-farting-snowman',
    title: 'Freddie the Farting Snowman',
    category: 'humor',
    collection: 'portfolio',
    description:
      'A minimal, square cover: a snowman’s head launches off his body on a blast of green, drawn in loose ink lines on deep blue. A small badge places it in a Fart Dictionary series.',
    cover: 'a snowman whose head is launched upward by a green blast',
    width: 342,
    height: 342,
  },
  {
    slug: 'the-secret-jobs-of-christmas-creatures',
    title: 'The Secret Jobs of Christmas Creatures',
    category: 'humor',
    collection: 'portfolio',
    description:
      '“50 festive employees you never knew were on the payroll.” A reindeer, fox, hare and owls in work uniforms fill a busy scene, each tagged with a job title such as Chief Navigation Officer.',
    cover: 'a reindeer, fox, hare and owls in uniforms with job-title tags in a festive workshop',
    width: 335,
    height: 445,
  },

  // Portfolio: Early Learning
  {
    slug: 'apprendre-a-lire-methode-syllabique',
    title: 'Apprendre à lire: Méthode syllabique',
    category: 'learning',
    collection: 'portfolio',
    description:
      'A French syllable-based reading method for ages 5 to 7. The cover is a grid of sample exercises, splitting words like “vé-lo” and “ca-deau” under pictures of a bicycle and a gift.',
    cover: 'a grid of reading exercises with pictures of a bicycle, gift, boat, owl and car',
    width: 342,
    height: 442,
  },
  {
    slug: 'apprendre-a-lire-le-son-des-lettres',
    title: 'Apprendre à lire: Le son des lettres',
    category: 'learning',
    collection: 'portfolio',
    description:
      'Level 1 of a French phonics series on simple letter sounds. A boy smells a daisy beside a sheep as the letters V, M and È tumble down the page, and a girl cycles along the path behind.',
    cover: 'a boy smelling a daisy beside a sheep, with the letters V and M falling around them',
    width: 297,
    height: 445,
  },
  {
    slug: 'les-contraires',
    title: 'Les contraires!',
    category: 'learning',
    collection: 'portfolio',
    description:
      'A French book of opposites, with “more than 40 opposites inside.” A big smiling dinosaur labeled “grand” carries a small one labeled “petit” on its back.',
    cover: 'a big orange dinosaur carrying a small green dinosaur',
    width: 342,
    height: 342,
  },
  {
    slug: 'blanco-y-negro',
    title: 'Blanco y negro',
    category: 'learning',
    collection: 'portfolio',
    description:
      'A high-contrast book for babies from 0 to 12 months. Bold black and white silhouettes of a boat, a cat, a train, a pear and tiny footprints swap colors across the split cover.',
    cover: 'black and white silhouettes of a boat, balloon, cat, train, pear and footprints',
    width: 342,
    height: 342,
  },

  // Portfolio: Activity & Coloring
  {
    slug: 'activites-et-jeux-educatifs-maternelle',
    title: 'Activités et jeux éducatifs: Maternelle',
    category: 'activity',
    collection: 'portfolio',
    description:
      'Educational activities and games for preschoolers aged 4 to 5. The lower half previews the inside: shape tracing, letter practice and matching pages.',
    cover: 'rainbow lettering above previews of tracing and letter-practice worksheets',
    width: 342,
    height: 443,
  },
  {
    slug: 'cahier-d-ecriture-cursive',
    title: 'Cahier d’écriture cursive',
    category: 'activity',
    collection: 'portfolio',
    description:
      'A 120-page cursive handwriting workbook for French preschool and first grade. Traced capital and lowercase B’s and a row of g’s show exactly what the exercises look like.',
    cover: 'children reading and drawing above handwriting practice rows of B and g',
    width: 342,
    height: 443,
  },
  {
    slug: 'christmas-coloring-book-for-kids',
    title: 'Christmas Coloring Book for Kids',
    category: 'activity',
    collection: 'portfolio',
    description:
      'Santa waves from the door of a gingerbread-style house beside a reindeer, a decorated tree and a pile of gifts, all drawn with thick outlines and flat, bright color.',
    cover: 'Santa Claus and a reindeer beside a Christmas tree and gifts',
    width: 342,
    height: 443,
  },
  {
    slug: 'brainrot-coloring-book-viral-meme-edition',
    title: 'Brainrot Coloring Book: Viral Meme Edition',
    category: 'activity',
    collection: 'portfolio',
    description:
      'Neon outlines glow on black: a shark in sneakers, a waffle and a coffee cup with faces. Callouts promise 31 absurd characters and hidden interactive pages.',
    cover: 'neon cartoon shark, waffle and coffee cup characters on a black background',
    width: 342,
    height: 442,
  },

  // Portfolio: Languages & Bilingual
  {
    slug: 'my-first-italian-book',
    title: 'My First Italian Book',
    category: 'languages',
    collection: 'portfolio',
    description:
      'An Italian–English book for bilingual children with more than 300 new words. A fox, a jumping boy and a girl waving US and Italian flags surround a round title panel.',
    cover: 'a fox and two children, one holding US and Italian flags, around a round title',
    width: 342,
    height: 342,
  },
  {
    slug: 'my-first-100-words-portuguese-english',
    title: 'My First 100 Words: Portuguese English',
    category: 'languages',
    collection: 'portfolio',
    description:
      'A bilingual picture dictionary. Each object, from a car, apple and bicycle to a leaf and a dog, is labeled in Portuguese with the English word underneath.',
    cover: 'a car, apple, bicycle, tree, leaf, ice cream and dog labeled in Portuguese and English',
    width: 342,
    height: 342,
  },
  {
    slug: 'donde-esta-venezuela',
    title: '¿Dónde está Venezuela? / Where Is Venezuela?',
    category: 'languages',
    collection: 'portfolio',
    description:
      'A Spanish–English story. A grandfather walks with two children and a dog through a landscape of waterfalls and mountains, with a scarlet macaw perched on the title.',
    cover: 'a grandfather, two children and a dog walking through a landscape of waterfalls and mountains',
    width: 385,
    height: 385,
  },
  {
    slug: 'my-first-1000-words-greek',
    title: 'My First 1000 Words: Greek',
    category: 'languages',
    collection: 'portfolio',
    description:
      'A Greek–English vocabulary book for beginners. A grid of glossy, brightly colored icons, among them a monkey, a robot, a butterfly and a race car, sits above the Greek flag.',
    cover: 'a grid of colorful icons including a monkey, robot, butterfly and race car, above the Greek flag',
    width: 404,
    height: 522,
  },

  // Home: Confidence & Inspiration
  {
    slug: 'naciste-para-brillar',
    title: 'Naciste para brillar',
    category: 'confidence',
    collection: 'home',
    description:
      '“You Were Born to Shine.” A delicately drawn red-haired girl with closed eyes and flowers in her hair rests against a white background dusted with sparkles.',
    cover: 'a red-haired girl with closed eyes and flowers in her hair',
    width: 296,
    height: 445,
  },
  {
    slug: 'eres-un-chico-fantastico',
    title: 'Eres un chico fantástico',
    category: 'confidence',
    collection: 'home',
    description:
      '“You’re a Fantastic Boy.” A boy with a backpack sits on a cloud at dusk and gazes upward, beneath glowing white and gold lettering.',
    cover: 'a boy with a backpack sitting on a cloud at dusk',
    width: 319,
    height: 445,
  },
  {
    slug: 'eres-una-chica-maravillosa',
    title: 'Eres una chica maravillosa',
    category: 'confidence',
    collection: 'home',
    description:
      '“You’re a Wonderful Girl.” A companion to Eres un chico fantástico, by the same named author and in the same style: a girl in a pink hoodie sits among sunset clouds, chin resting on her knees.',
    cover: 'a girl in a pink hoodie sitting among sunset clouds',
    width: 319,
    height: 445,
  },
  {
    slug: 'tienes-9-anos-y-eres-maravillosa',
    title: 'Tienes 9 años y eres maravillosa',
    category: 'confidence',
    collection: 'home',
    description:
      '“You’re 9 and You’re Wonderful.” A girl in overalls looks up at a trail of sparkles in a purple night sky, with a large, rounded 9 leading the title.',
    cover: 'a girl in overalls looking up at a trail of sparkles in a purple sky',
    width: 348,
    height: 522,
  },
  {
    slug: 'tu-puedes',
    title: 'Tú puedes',
    category: 'confidence',
    collection: 'home',
    description:
      '“You Can: Stories to Overcome Your Fears.” Two children in hoodies look up at a starry sky, and a badge notes that activities and challenges are included.',
    cover: 'two children in hoodies looking up at a starry sky',
    width: 297,
    height: 445,
  },
  {
    slug: 'tom-veut-etre-messi',
    title: 'Tom veut être Messi',
    category: 'confidence',
    collection: 'home',
    description:
      '“Tom Wants to Be Messi,” described on the cover as a children’s book about soccer and inspiration. A boy in a red and blue jersey sits in the foreground of a packed stadium.',
    cover: 'a boy in a red and blue jersey in front of a soccer player in a packed stadium',
    width: 312,
    height: 445,
  },

  // Home: Values & Life Skills
  {
    slug: 'honesty-is-my-superpower',
    title: 'Honesty Is My Superpower',
    category: 'values',
    collection: 'home',
    description:
      'A badge calls it a kid’s book about telling the truth and overcoming lying. Two boys run hand in hand along a sunny beach, painted in soft, pale watercolor.',
    cover: 'two boys running hand in hand along a beach',
    width: 342,
    height: 342,
  },
  {
    slug: 'je-peux-dire-oui-et-je-peux-aussi-dire-non',
    title: 'Je peux dire oui et je peux aussi dire non',
    category: 'values',
    collection: 'home',
    description:
      '“I Can Say Yes, and I Can Also Say No,” for ages 2 and up. Speech-bubble shapes in yellow and red carry the words “oui” and “non,” watched by a small koala.',
    cover: 'yellow and red speech bubbles with the words oui and non, beside a koala',
    width: 342,
    height: 342,
  },
  {
    slug: 'paciencia',
    title: 'Paciencia',
    category: 'values',
    collection: 'home',
    description:
      '“Patience: Listen, Wait, Think.” A grinning lion with folded arms stands beside a shy hippo in a jungle clearing, painted in warm, saturated color.',
    cover: 'a smiling lion with folded arms beside a shy hippo in a jungle',
    width: 404,
    height: 522,
  },

  // Home: Classics & Fairy Tales
  {
    slug: 'le-avventure-di-pinocchio-storia-di-un-burattino',
    title: 'Le avventure di Pinocchio: Storia di un burattino',
    category: 'classics',
    collection: 'home',
    description:
      'A vintage-style edition: an old engraving of Pinocchio, hand on hip, sits behind a tall terracotta title band set sideways, like a bookplate.',
    cover: 'a vintage engraving of Pinocchio with his hand on his hip',
    width: 298,
    height: 445,
  },
  {
    slug: 'favole-per-bambini',
    title: 'Favole per bambini',
    category: 'classics',
    collection: 'home',
    description:
      '“Fables for Children,” three volumes in one with more than 50 stories. A rainbow arcs over a castle, with a princess, a pirate, an archer in green and a mermaid lined up below.',
    cover: 'a princess, pirate, archer and mermaid beneath a rainbow and a castle',
    width: 297,
    height: 445,
  },
  {
    slug: 'fiabe-per-bambini',
    title: 'Fiabe per bambini',
    category: 'classics',
    collection: 'home',
    description:
      '“Fairy Tales for Children.” A wizard in a starry hat leans from a tree over two gnome children and a sleeping fox, while fairies drift past a crescent moon.',
    cover: 'a wizard leaning over two gnome children and a sleeping fox under a crescent moon',
    width: 342,
    height: 443,
  },

  // Home: Stories for Older Readers
  {
    slug: 'el-ladron-de-mis-recuerdos',
    title: 'El ladrón de mis recuerdos',
    category: 'older',
    collection: 'home',
    description:
      '“The Thief of My Memories.” A smiling boy, painted in flat, gouache-like strokes, is framed by red flowers, daisies and white doves against a dark sky with a pale moon.',
    cover: 'a smiling boy framed by red flowers, daisies and white doves',
    width: 297,
    height: 445,
  },
  {
    slug: 'la-magia-del-futbol',
    title: 'La magia del fútbol',
    category: 'older',
    collection: 'home',
    description:
      '“The Magic of Soccer.” A wide-eyed boy looks up inside a floodlit stadium, and a soccer ball replaces the O in “fútbol.” A gold seal marks a new edition.',
    cover: 'a wide-eyed boy looking up in a floodlit soccer stadium',
    width: 297,
    height: 445,
  },
  {
    slug: 'corazon',
    title: 'Corazón',
    category: 'older',
    collection: 'home',
    description:
      'A Spanish edition of De Amicis’s classic school story. A boy writes at an old wooden desk in an empty classroom, lit by warm light from tall windows.',
    cover: 'a boy writing at a wooden school desk in a sunlit classroom',
    width: 335,
    height: 445,
  },

  // Home: Curious Minds
  {
    slug: '100000-whys',
    title: '100,000 Whys',
    category: 'curious',
    collection: 'home',
    description:
      'A full-color illustrated encyclopedia for ages 6 to 13. Children marvel at an open book as a dinosaur, a rocket, an astronaut, a volcano and a parrot spill out around them.',
    cover: 'children marveling at an open book surrounded by a dinosaur, rocket, astronaut and parrot',
    width: 335,
    height: 445,
  },
  {
    slug: '100000-whys-for-teens',
    title: '100,000 Whys for Teens: The Big Journey',
    category: 'curious',
    collection: 'home',
    description:
      'The teen follow-up on a deep navy cover. Doodled icons for confidence, money, cooking and digital life circle a bold yellow and white title.',
    cover: 'doodled icons for money, cooking, sport and technology around a bold title',
    width: 342,
    height: 442,
  },
  {
    slug: 'le-livre-des-enfants-curieux',
    title: 'Le livre des enfants curieux',
    category: 'curious',
    collection: 'home',
    description:
      'A French encyclopedia covering dinosaurs, science and more. Labeled pictures of a rocket, Earth, the sun, a T. rex, an elephant, a heart and the Eiffel Tower surround the title.',
    cover: 'labeled pictures of a rocket, Earth, the sun, a T. rex, an elephant and the Eiffel Tower',
    width: 342,
    height: 442,
  },
  {
    slug: 'captivating-stories-for-curious-kids',
    title: 'Captivating Stories for Curious Kids',
    category: 'curious',
    collection: 'home',
    description:
      'A caricature of a wild-haired scientist reads an open book while people, animals and inventions swirl out of its pages into a starry sky.',
    cover: 'a caricature of a wild-haired scientist reading a book as figures swirl out of it',
    width: 298,
    height: 445,
  },

  // Home: Early Learning
  {
    slug: 'mon-premier-livre-de-lecture-cp',
    title: 'Mon premier livre de lecture CP',
    category: 'learning',
    collection: 'home',
    description:
      '“My First Reading Book” for first grade: 20 short stories to read alone, at three levels of difficulty. Mia and Tomy the dog wave hello from a sunny living room.',
    cover: 'a girl named Mia and a dog named Tomy waving in a living room',
    width: 342,
    height: 442,
  },
  {
    slug: 'premieres-lectures-les-sons',
    title: 'Premières lectures: Les sons',
    category: 'learning',
    collection: 'home',
    description:
      '“First Readings: Sounds,” for ages 3 to 6 to read alone. A tiger’s wide-open mouth fills the cover with the letters “rrr” inside, in a bold, flat graphic style.',
    cover: 'a tiger’s open mouth with the letters rrr inside',
    width: 385,
    height: 385,
  },

  // Home: Activity & Coloring
  {
    slug: 'mon-cahier-d-activites',
    title: 'Mon cahier d’activités',
    category: 'activity',
    collection: 'home',
    description:
      '“My Activity Book,” 110 pages for ages 3 and up. A boy in an oversized blue cap, sketched in soft pencil and watercolor, points to color-coded labels for writing, coloring, drawing and thinking.',
    cover: 'a boy in a big blue cap pointing at labels for writing, coloring, drawing and thinking',
    width: 342,
    height: 443,
  },
  {
    slug: 'mi-primer-libro-de-colorear',
    title: 'Mi primer libro de colorear',
    category: 'activity',
    collection: 'home',
    description:
      '“My First Coloring Book,” 110 sheets for babies and children from age 1. A teddy bear, a toy train and a striped zebra in thick outlines show the simple shapes inside.',
    cover: 'a teddy bear, toy train and striped zebra drawn in thick outlines',
    width: 342,
    height: 342,
  },
  {
    slug: 'brainrot-coloring-book',
    title: 'Brainrot Coloring Book',
    category: 'activity',
    collection: 'home',
    description:
      'Unlike the neon Viral Meme Edition, this cover uses surreal painted panels: a shark in sneakers, a crocodile fused with a plane, a tree with an elephant’s head and a cat inside a watermelon.',
    cover: 'surreal painted panels of a shark in sneakers, a crocodile plane and a watermelon cat',
    width: 322,
    height: 445,
  },
]

export const bookImage = (book: Book) => ({
  src: image(book.slug),
  small: book.width > 220 ? image(`${book.slug}-220`) : undefined,
})
