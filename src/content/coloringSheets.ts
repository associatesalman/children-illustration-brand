import type { Level } from '../lib/coloring/types'

// Every sheet's artwork and thumbnail as URLs. The artwork itself is only fetched when a sheet is opened.
const dataUrls = import.meta.glob<string>('../assets/coloring/sheets/*.json', { query: '?url', import: 'default', eager: true })
const thumbUrls = import.meta.glob<string>('../assets/coloring/thumbs/*.svg', { query: '?url', import: 'default', eager: true })

const asset = (urls: Record<string, string>, folder: string, id: string, ext: string) => {
  const url = urls[`../assets/coloring/${folder}/${id}.${ext}`]
  if (!url) throw new Error(`Coloring sheet ${id} is missing its ${folder} file`)
  return url
}

/** Library categories, in the order they're shown. Only categories with at least one sheet appear as filters. */
export const categories = {
  animals: 'Animals',
  storybook: 'Storybook Characters',
  'books-reading': 'Books & Reading',
  'nature-seasons': 'Nature & Seasons',
  'vehicles-places': 'Vehicles & Places',
  'learn-play': 'Learn & Play',
} as const

export type CategoryId = keyof typeof categories

export type SheetEntry = {
  /** Used in the address: /coloring-studio?sheet=<id>. Never change it once published. */
  id: string
  title: string
  level: Level
  category: CategoryId
  /** Extra search words: what's in the drawing. */
  tags: string[]
  description: string
  thumb: string
  dataUrl: string
}

type SheetInfo = Omit<SheetEntry, 'thumb' | 'dataUrl'>

/**
 * Coloring Studio library. To add a sheet: draw it in scripts/build_coloring_sheets.py, run the script, then add an
 * entry here; its artwork and thumbnail are found by id.
 */
const sheets: SheetInfo[] = [
  // Animals
  {
    id: 'leo-the-fox',
    title: 'Leo the Fox',
    level: 'easy',
    category: 'animals',
    tags: ['fox', 'meadow', 'flowers', 'butterfly', 'sun', 'clouds', 'nature'],
    description: 'Leo sits in a sunny meadow with flowers and a butterfly. Big, simple shapes.',
  },
  {
    id: 'sleepy-owl',
    title: 'Sleepy Owl',
    level: 'easy',
    category: 'animals',
    tags: ['owl', 'bird', 'night', 'moon', 'stars', 'nightcap', 'bedtime', 'tree', 'branch'],
    description: 'A drowsy owl in a nightcap dozes on a branch under the moon and stars.',
  },
  {
    id: 'pond-friends',
    title: 'Pond Friends',
    level: 'medium',
    category: 'animals',
    tags: ['frog', 'turtle', 'duck', 'ducklings', 'fish', 'dragonfly', 'pond', 'lily pad', 'water', 'reeds'],
    description: 'A frog on a lily pad, a turtle on a rock, a duck family, a jumping fish and a dragonfly.',
  },
  {
    id: 'farmyard',
    title: 'Farmyard',
    level: 'detailed',
    category: 'animals',
    tags: ['farm', 'barn', 'cow', 'pig', 'chicken', 'chicks', 'silo', 'hay', 'fence', 'field'],
    description: 'A barn and silo with a cow, a pig, chickens and chicks. Lots of planks, panels and little details.',
  },
  // Storybook Characters
  {
    id: 'robot-friend',
    title: 'Robot Friend',
    level: 'easy',
    category: 'storybook',
    tags: ['robot', 'balloon', 'heart', 'toys', 'ball', 'block', 'friend'],
    description: 'A friendly robot waves hello with a heart balloon. Big, simple shapes.',
  },
  {
    id: 'friendly-dragon',
    title: 'Friendly Dragon',
    level: 'medium',
    category: 'storybook',
    tags: ['dragon', 'fairy tale', 'book', 'reading', 'mountains', 'castle', 'wings', 'meadow'],
    description: 'A gentle dragon sits in a meadow reading a book, with mountains and a castle tower behind.',
  },
  {
    id: 'little-wizard',
    title: 'Little Wizard',
    level: 'medium',
    category: 'storybook',
    tags: ['wizard', 'magic', 'mia', 'girl', 'hat', 'wand', 'cape', 'moon', 'stars', 'potion', 'spell book'],
    description: 'Mia dresses up as a wizard with a starry hat, a cape and a wand under the night sky.',
  },
  {
    id: 'storybook-castle',
    title: 'Storybook Castle',
    level: 'detailed',
    category: 'storybook',
    tags: ['castle', 'kingdom', 'fairy tale', 'mia', 'fox', 'river', 'bridge', 'trees', 'hills', 'birds', 'path'],
    description: 'A castle on the hill, a winding path, a river and bridge, apple trees and lots of little details.',
  },
  // Books & Reading
  {
    id: 'open-book-adventure',
    title: 'Open Book Adventure',
    level: 'easy',
    category: 'books-reading',
    tags: ['book', 'rainbow', 'stars', 'balloons', 'clouds', 'imagination', 'story'],
    description: 'A rainbow, balloons and stars rise out of an open book. Big, simple shapes.',
  },
  {
    id: 'book-stack',
    title: 'Book Stack',
    level: 'easy',
    category: 'books-reading',
    tags: ['books', 'stack', 'apple', 'glasses', 'pencils', 'clock', 'school', 'desk'],
    description: 'A tall stack of books with an apple and glasses on top, a pencil cup and a clock.',
  },
  {
    id: 'reading-corner',
    title: 'Reading Corner',
    level: 'medium',
    category: 'books-reading',
    tags: ['reading', 'books', 'bookshelf', 'bookcase', 'girl', 'mia', 'window', 'fox', 'room'],
    description: 'Mia reads beside a bookcase, a window and a stack of books, with Leo on the rug.',
  },
  {
    id: 'bookshelf',
    title: 'Bookshelf',
    level: 'detailed',
    category: 'books-reading',
    tags: ['bookshelf', 'bookcase', 'books', 'library', 'cat', 'globe', 'plant', 'lamp', 'clock', 'room'],
    description: 'A bookcase packed with books, a globe, a plant and a clock, with a cat asleep on top.',
  },
  // Nature & Seasons
  {
    id: 'spring-garden',
    title: 'Spring Garden',
    level: 'easy',
    category: 'nature-seasons',
    tags: ['spring', 'garden', 'flowers', 'tulips', 'daisy', 'snail', 'ladybird', 'ladybug', 'watering can', 'fence'],
    description: 'Tulips and a big daisy by the garden fence, with a watering can, a snail and a ladybird.',
  },
  {
    id: 'autumn-leaves',
    title: 'Autumn Leaves',
    level: 'medium',
    category: 'nature-seasons',
    tags: ['autumn', 'fall', 'leaves', 'tree', 'hedgehog', 'pumpkins', 'acorns', 'rake'],
    description: 'Leaves drift down onto a leaf pile, with a hedgehog, pumpkins, acorns and a rake.',
  },
  {
    id: 'snowy-day',
    title: 'Snowy Day',
    level: 'medium',
    category: 'nature-seasons',
    tags: ['winter', 'snow', 'snowman', 'snowflakes', 'pine trees', 'cottage', 'robin', 'sled'],
    description: 'A snowman in a top hat and scarf, snowy pine trees, a cottage, a robin and a sled.',
  },
  {
    id: 'under-the-sea',
    title: 'Under the Sea',
    level: 'detailed',
    category: 'nature-seasons',
    tags: ['ocean', 'sea', 'fish', 'turtle', 'octopus', 'jellyfish', 'crab', 'starfish', 'coral', 'treasure', 'bubbles'],
    description: 'A busy reef with fish, a turtle, an octopus, jellyfish, a crab, coral and a treasure chest.',
  },
  // Vehicles & Places
  {
    id: 'rocket-trip',
    title: 'Rocket Trip',
    level: 'easy',
    category: 'vehicles-places',
    tags: ['rocket', 'space', 'planet', 'moon', 'stars', 'spaceship'],
    description: 'A rocket zooms past a ringed planet, the moon and the stars. Big, simple shapes.',
  },
  {
    id: 'hot-air-balloons',
    title: 'Hot-Air Balloons',
    level: 'easy',
    category: 'vehicles-places',
    tags: ['hot-air balloon', 'balloons', 'sky', 'clouds', 'sun', 'hills', 'birds', 'flying'],
    description: 'Three hot-air balloons float over the hills. The panels are perfect for stripes and patterns.',
  },
  {
    id: 'harbour-lighthouse',
    title: 'Harbour Lighthouse',
    level: 'medium',
    category: 'vehicles-places',
    tags: ['lighthouse', 'harbour', 'harbor', 'sailboat', 'boats', 'sea', 'pier', 'seagulls', 'cliff', 'buoy'],
    description: 'A striped lighthouse on a cliff above the harbour, with sailboats, a pier and seagulls.',
  },
  {
    id: 'busy-street',
    title: 'Busy Street',
    level: 'detailed',
    category: 'vehicles-places',
    tags: ['town', 'city', 'street', 'bus', 'car', 'shops', 'buildings', 'traffic light', 'windows'],
    description: 'A town street lined with shops and tall buildings, with a bus, a car and traffic lights.',
  },
  // Learn & Play
  {
    id: 'alphabet-blocks',
    title: 'Alphabet Blocks',
    level: 'easy',
    category: 'learn-play',
    tags: ['alphabet', 'letters', 'abc', 'blocks', 'toys', 'ball', 'spinning top'],
    description: 'Toy blocks with the letters A, B and C, a ball and a spinning top. Big, simple shapes.',
  },
  {
    id: 'shape-train',
    title: 'Shape Train',
    level: 'medium',
    category: 'learn-play',
    tags: ['shapes', 'train', 'circle', 'triangle', 'square', 'star', 'heart', 'diamond', 'railway'],
    description: 'A steam train pulls three cars carrying a circle, triangle, square, star, heart and diamond.',
  },
  {
    id: 'music-time',
    title: 'Music Time',
    level: 'medium',
    category: 'learn-play',
    tags: ['music', 'instruments', 'guitar', 'drum', 'xylophone', 'maracas', 'tambourine', 'notes'],
    description: 'A guitar, a drum, a xylophone, maracas and a tambourine, with music notes and bunting.',
  },
  {
    id: 'pattern-flower',
    title: 'Pattern Flower',
    level: 'detailed',
    category: 'learn-play',
    tags: ['pattern', 'mandala', 'symmetry', 'flower', 'petals', 'shapes', 'circle', 'mirror'],
    description: 'Rings of petals, points and dots around a centre. Try Mirror strokes and the Pattern fill.',
  },
]

export const coloringSheets: SheetEntry[] = sheets.map((sheet) => ({
  ...sheet,
  thumb: asset(thumbUrls, 'thumbs', sheet.id, 'svg'),
  dataUrl: asset(dataUrls, 'sheets', sheet.id, 'json'),
}))

export const levelLabels: Record<Level, string> = { easy: 'Easy', medium: 'Medium', detailed: 'Detailed' }

export const levelOrder: Level[] = ['easy', 'medium', 'detailed']

export const findSheet = (id: string | null) => coloringSheets.find((sheet) => sheet.id === id)

export type NamedColor = { name: string; hex: string }

const set = (pairs: [string, string][]): NamedColor[] => pairs.map(([name, hex]) => ({ name, hex }))

/** Palette sets, each color with a name for screen readers and the "current color" label. */
export const palettes: { id: string; label: string; colors: NamedColor[] }[] = [
  {
    id: 'classic',
    label: 'Classic',
    colors: set([
      ['Cherry red', '#d62828'], ['Coral', '#f26d5b'], ['Orange', '#f4862a'], ['Sunny yellow', '#ffc72c'], ['Lemon', '#fff07a'],
      ['Lime green', '#a3d65c'], ['Grass green', '#3fa34d'], ['Forest green', '#1f6b3a'], ['Teal', '#2bb3a3'], ['Sky blue', '#7cc6ee'],
      ['Ocean blue', '#2f6fb5'], ['Navy', '#1d3557'], ['Lavender', '#b9a4e6'], ['Purple', '#7b3fb0'], ['Pink', '#ff8fb8'],
      ['Peach', '#ffd0a8'], ['Tan', '#d9a066'], ['Brown', '#8a5a3b'], ['Dark brown', '#4e3424'], ['Light gray', '#d4d4d4'],
      ['Gray', '#8a8a8a'], ['Charcoal', '#3a3a3a'], ['Black', '#161412'], ['White', '#ffffff'],
    ]),
  },
  {
    id: 'pastel',
    label: 'Pastel',
    colors: set([
      ['Blush', '#f9c6cf'], ['Rose', '#f4b6c2'], ['Apricot', '#fbc99d'], ['Peach cream', '#ffd9b8'], ['Butter', '#fff1a8'],
      ['Pistachio', '#d9ecb0'], ['Mint', '#c7f0d2'], ['Seafoam', '#b5e8e0'], ['Baby blue', '#bfdcf5'], ['Periwinkle', '#c9c8f2'],
      ['Lilac', '#e0c8f0'], ['Cloud', '#eef0f4'],
    ]),
  },
  {
    id: 'bright',
    label: 'Bright',
    colors: set([
      ['Fire red', '#ff2d2d'], ['Sunset coral', '#ff5e57'], ['Tangerine', '#ff8a00'], ['Lemon zest', '#ffe600'], ['Neon lime', '#9bea00'],
      ['Kelly green', '#00b84a'], ['Aqua', '#00d1d1'], ['Electric blue', '#0a7cff'], ['Royal blue', '#2a3fd6'], ['Violet', '#8b2cff'],
      ['Magenta', '#e600e6'], ['Hot pink', '#ff3ea5'],
    ]),
  },
  {
    id: 'earth',
    label: 'Earth',
    colors: set([
      ['Sand', '#e3cfa4'], ['Wheat', '#d8b56f'], ['Ochre', '#c48a2c'], ['Terracotta', '#b85c38'], ['Rust', '#8e3b1f'],
      ['Clay', '#a8705a'], ['Olive', '#7d8a3a'], ['Moss', '#5a6e34'], ['Pine', '#2f4a32'], ['Bark', '#5b4030'],
      ['Stone', '#9a9184'], ['Slate', '#5d6268'],
    ]),
  },
  {
    id: 'ocean',
    label: 'Ocean',
    colors: set([
      ['Sea foam white', '#e6f7f7'], ['Shallow water', '#9fe3e0'], ['Lagoon', '#3cc0c4'], ['Deep teal', '#1f8a8a'], ['Turquoise', '#2bc4d8'],
      ['Wave blue', '#3a8fd1'], ['Deep blue', '#1e5aa8'], ['Midnight sea', '#13315c'], ['Coral pink', '#ff7f6e'], ['Sea glass', '#a6d5b4'],
      ['Kelp', '#4f7f3a'], ['Shell', '#f6e3cf'],
    ]),
  },
  {
    id: 'skin-hair',
    label: 'Skin & Hair',
    colors: set([
      ['Porcelain', '#fbe5d6'], ['Light peach', '#f5d0b5'], ['Sand beige', '#e8b98f'], ['Honey', '#d49a6a'], ['Caramel', '#b97a4a'],
      ['Bronze', '#9a5b36'], ['Chestnut', '#6e3f24'], ['Espresso', '#42291b'], ['Blonde', '#f0d27a'], ['Ginger', '#c8602d'],
      ['Auburn', '#8a3324'], ['Black hair', '#1f1a17'],
    ]),
  },
  {
    id: 'grayscale',
    label: 'Grayscale',
    colors: set([
      ['White', '#ffffff'], ['Paper white', '#f2f2f2'], ['Silver', '#d4d4d4'], ['Pale gray', '#b5b5b5'], ['Gray', '#8a8a8a'],
      ['Steel gray', '#6b6b6b'], ['Dim gray', '#4f4f4f'], ['Charcoal', '#3a3a3a'], ['Graphite', '#262626'], ['Black', '#161412'],
    ]),
  },
]

/** The name of a palette color, or a readable fallback for any other color. */
export function colorName(hex: string, fallback = `Picked color ${hex}`) {
  for (const p of palettes) {
    const match = p.colors.find((c) => c.hex === hex)
    if (match) return match.name
  }
  return fallback
}
