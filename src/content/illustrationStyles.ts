import render3d640 from '../assets/style-services/3d-render-640.webp'
import render3d736 from '../assets/style-services/3d-render-736.webp'
import walk3d from '../assets/style-services/3d-walk.mp4'
import walk3dPoster from '../assets/style-services/3d-walk-poster-720.webp'
import bee360 from '../assets/style-services/cartoon-bee-tablet-360.webp'
import girl640 from '../assets/style-services/cartoon-character-640.webp'
import girl735 from '../assets/style-services/cartoon-character-735.webp'
import sketches640 from '../assets/style-services/cartoon-expression-sketches-640.webp'
import sketches995 from '../assets/style-services/cartoon-expression-sketches-995.webp'
import fox1200 from '../assets/style-services/cartoon-fox-vector-1200.webp'
import fox640 from '../assets/style-services/cartoon-fox-vector-640.webp'
import sheet1024 from '../assets/style-services/cartoon-structure-sheet-1024.webp'
import sheet640 from '../assets/style-services/cartoon-structure-sheet-640.webp'
import turnaround from '../assets/style-services/cartoon-turnaround.mp4'
import turnaroundPoster from '../assets/style-services/cartoon-turnaround-poster-720.webp'
import vectorFace from '../assets/style-services/cartoon-vector-face.mp4'
import vectorFacePoster from '../assets/style-services/cartoon-vector-face-poster-576.webp'
import landscapeDetail from '../assets/style-services/digital-landscape-detail-500.webp'
import landscapeFinished from '../assets/style-services/digital-landscape-finished-500.webp'
import landscape from '../assets/style-services/digital-landscape.mp4'
import landscapePoster from '../assets/style-services/digital-landscape-poster-500.webp'
import heroTall from '../assets/style-services/hero-puzzle-tall-800.webp'
import heroWide1440 from '../assets/style-services/hero-puzzle-wide-1440.webp'
import heroWide760 from '../assets/style-services/hero-puzzle-wide-760.webp'
import minimalShadows from '../assets/style-services/minimal-shadows-960.webp'
import minimalStory from '../assets/style-services/minimal-story.mp4'
import minimalStoryPoster from '../assets/style-services/minimal-story-poster-960.webp'
import minimalStreet from '../assets/style-services/minimal-street-960.webp'
import bench from '../assets/style-services/watercolor-bench.mp4'
import benchPoster from '../assets/style-services/watercolor-bench-poster-540.webp'
import family530 from '../assets/style-services/watercolor-characters-530.webp'
import sea640 from '../assets/style-services/watercolor-sea-life-640.webp'
import sea890 from '../assets/style-services/watercolor-sea-life-890.webp'

/**
 * Illustration Styles service page (/services/illustration-styles).
 *
 * Every section image and video comes from the supplied folder `public/illustration style service/`,
 * exported by scripts/optimize_style_services.py. The hero puzzle uses six separate Pixabay
 * illustrations (scripts/build_styles_hero.py) that do not appear elsewhere on the page. Assets were assigned by what they show: the fox
 * and bee files are named "digital painting" but are outlined vector cartoon art, so they appear
 * under Cartoon Style. They are style examples, not client projects; captions describe what each
 * one shows. Sources and crops are listed in src/assets/artwork/ASSETS.md.
 */

export type StyleImage = {
  src: string
  /** Width-described candidates; omitted when only one size exists. */
  srcSet?: string
  width: number
  height: number
  alt: string
  caption: string
}

export type StyleVideoAsset = {
  src: string
  label: string
  caption: string
  poster: { src: string; width: number; height: number }
}

export type StyleCopy = {
  id: string
  number: string
  name: string
  heading: [string, string]
  lead: string
  /** What the style is and how it looks. */
  look: string[]
  /** Visual characteristics and storytelling strengths. */
  strengths: { title: string; body: string }[]
  /** How characters, scenes, color and detail work in this style. */
  craft: { title: string; body: string }[]
  fit: { formats: string[]; subjects: string[]; readers: string }
  offerIntro: string
  offers: string[]
  cta: string
}

const set = (...pairs: [string, number][]) => pairs.map(([src, w]) => `${src} ${w}w`).join(', ')

export const hero = {
  wide: {
    src: heroWide1440,
    srcSet: set([heroWide760, 760], [heroWide1440, 1440]),
    width: 1440,
    height: 960,
  },
  tall: { src: heroTall, width: 800, height: 1200 },
  alt: 'Six illustrations fitted together like jigsaw pieces: a painted night sky with a girl standing on a glowing star, two cartoon children in raincoats with their dog, a 3D mushroom cottage, a soft hand-drawn bear in a winter coat, a minimal girl swinging from a street lamp, and a watercolor and ink winter village.',
}

/* ------------------------------------------------------------------ media, by section */

export const cartoonMedia = {
  sheet: {
    src: sheet1024,
    srcSet: set([sheet640, 640], [sheet1024, 1024]),
    width: 1024,
    height: 1535,
    alt: 'Character construction sheet for a cartoon girl with round glasses and headphones: front, three-quarter, side and back views with height guides, simplified shape studies, a perspective pose, a small yellow chick companion and a color palette. Labels are in Spanish.',
    caption: 'Construction sheet: front, three-quarter, side and back views, simplified shapes, a perspective pose and the palette.',
  },
  sketches: {
    src: sketches995,
    srcSet: set([sketches640, 640], [sketches995, 995]),
    width: 995,
    height: 1270,
    alt: 'Pencil sketches of a cartoon girl with a fringe in four expressions and head angles',
    caption: 'Pencil expression studies, worked out before any color.',
  },
  girl: {
    src: girl735,
    srcSet: set([girl640, 640], [girl735, 735]),
    width: 735,
    height: 1097,
    alt: 'Full-color cartoon girl with a long blonde braid, a green pinafore dress and a small bag with daisies, glancing over her shoulder',
    caption: 'Finished character: clean line, flat color and a clear, readable pose.',
  },
  fox: {
    src: fox1200,
    srcSet: set([fox640, 640], [fox1200, 1200]),
    width: 1200,
    height: 1200,
    alt: 'Vector cartoon fox in a yellow raincoat and blue boots shown on a tablet, with its pencil sketch, a seven-color autumn palette and a repeat pattern made from the character',
    caption: 'From sketch and palette to a finished vector character, then reused in a pattern.',
  },
  bee: {
    src: bee360,
    width: 360,
    height: 640,
    alt: 'Cartoon bee with a happy, closed-eye smile hugging a white daisy, drawn on a tablet with a stylus',
    caption: 'A simple, expressive character drawn on a tablet.',
  },
  turnaround: {
    src: turnaround,
    label: 'Cartoon character turnaround',
    caption: 'Turnaround: the same character from the front and back, the reference that keeps her consistent.',
    poster: { src: turnaroundPoster, width: 720, height: 900 },
  },
  vectorFace: {
    src: vectorFace,
    label: 'Drawing a cartoon face in vector',
    caption: 'A cartoon face drawn and colored shape by shape in a vector program.',
    poster: { src: vectorFacePoster, width: 576, height: 1024 },
  },
} satisfies Record<string, StyleImage | StyleVideoAsset>

export const watercolorMedia = {
  bench: {
    src: bench,
    label: 'Watercolor-style illustration from pencil to color',
    caption: 'Pencil drawing to layered, textured color: a man on a park bench with his pigeons.',
    poster: { src: benchPoster, width: 540, height: 960 },
  },
  family: {
    src: family530,
    width: 530,
    height: 575,
    alt: 'Soft watercolor of a smiling mother in a pink cape hugging two laughing children in superhero shirts',
    caption: 'Soft washes and warm pinks for an affectionate family moment.',
  },
  sea: {
    src: sea890,
    srcSet: set([sea640, 640], [sea890, 890]),
    width: 890,
    height: 690,
    alt: 'Watercolor painting of a jellyfish and a whale in blues on textured paper, beside a brush and small bowls of paint',
    caption: 'Sea life in transparent blues, with the paper texture showing through.',
  },
} satisfies Record<string, StyleImage | StyleVideoAsset>

export const digitalMedia = {
  landscape: {
    src: landscape,
    label: 'Digital painting of a mountain landscape',
    caption: 'One landscape painted on a tablet and repainted under different light.',
    poster: { src: landscapePoster, width: 500, height: 662 },
  },
  finished: {
    src: landscapeFinished,
    width: 500,
    height: 662,
    alt: 'Digitally painted mountain lit orange by low sun above a lake, with trees on the banks and a small cloaked figure standing on a rock in the water',
    caption: 'Warm light, misty depth and a tiny figure that gives the scene its scale.',
  },
  detail: {
    src: landscapeDetail,
    width: 500,
    height: 662,
    alt: 'Close view of a digital painting: a leafy tree and a large rock in the foreground with the mountain behind',
    caption: 'Foreground detail: loose, visible brushwork in leaves, rock and grass.',
  },
} satisfies Record<string, StyleImage | StyleVideoAsset>

export const threeDMedia = {
  render: {
    src: render3d736,
    srcSet: set([render3d640, 640], [render3d736, 736]),
    width: 736,
    height: 1104,
    alt: 'Glossy blue 3D form with soft highlights behind a frosted glass card on a deep blue background',
    caption: 'Rendered form: smooth volume, soft light and glossy reflections.',
  },
  walk: {
    src: walk3d,
    label: '3D character walk cycle',
    caption: 'A stylized 3D character walking: the coat folds and sneakers turn in perspective with every step.',
    poster: { src: walk3dPoster, width: 720, height: 1280 },
  },
} satisfies Record<string, StyleImage | StyleVideoAsset>

export const minimalMedia = {
  story: {
    src: minimalStory,
    label: 'Short story animated in a minimal, flat style',
    caption: 'A short animated story told in flat shapes and a limited teal and orange palette.',
    poster: { src: minimalStoryPoster, width: 960, height: 540 },
  },
  street: {
    src: minimalStreet,
    width: 960,
    height: 540,
    alt: 'Flat, minimal scene seen from above: a vintage car on a street at night, a man in a suit, and long shadows cast by a lit window',
    caption: 'A high viewpoint and long shadows tell the scene with very few shapes.',
  },
  shadows: {
    src: minimalShadows,
    width: 960,
    height: 540,
    alt: 'Flat, minimal scene of a boy sitting on the floor surrounded by tall shadow silhouettes of people',
    caption: 'Silhouettes and a limited palette carry the emotion of the moment.',
  },
} satisfies Record<string, StyleImage | StyleVideoAsset>

/* ------------------------------------------------------------------ copy, in page order */

export const styles: StyleCopy[] = [
  {
    id: 'cartoon-style',
    number: '01',
    name: 'Cartoon Style',
    heading: ['Characters with big personalities and', 'shapes children recognize'],
    lead: 'Cartoon style is built for expression. Clear outlines, playful proportions and bright, flat color turn your characters into friends young readers spot instantly and remember long after the book is closed.',
    look: [
      'A cartoon character starts as a handful of simple shapes: a round head, an oversized pair of eyes, a body that is a little shorter or bouncier than real life. Those shapes are tidied into a confident outline and filled with flat color and simple shading, so every figure reads clearly even when it is small on the page.',
      'Under the playful surface is careful planning. The construction sheet and turnaround on this page show how a character is mapped from the front, side, three-quarter view and back before a single page is drawn. That groundwork is what keeps a character looking like themselves from the first spread to the last.',
    ],
    strengths: [
      {
        title: 'Readable silhouettes',
        body: 'Strong outer shapes, a signature hairstyle or accessory, and distinct proportions let a child recognize a character from across the room or as a tiny figure in a busy scene.',
      },
      {
        title: 'Emotion at a glance',
        body: 'Large eyes, flexible brows and clear mouths make feelings obvious. Children read a character’s mood before the words are read aloud, which is why cartoon art is so good at humor and at naming big feelings.',
      },
      {
        title: 'Clear, lively action',
        body: 'Poses are pushed a little further than life, with a clear line of action, so running, jumping, surprise and mischief all read instantly on the page.',
      },
    ],
    craft: [
      {
        title: 'Characters and expressions',
        body: 'We design each lead from simple shapes, then build an expression range in loose pencil, like the studies shown here, before final line and color.',
      },
      {
        title: 'Scenes and backgrounds',
        body: 'Backgrounds are kept simpler than the characters, with fewer details and softer contrast, so the action in front always stays the focus.',
      },
      {
        title: 'Color',
        body: 'A small, bright palette is chosen per character and per book. Flat fills and simple shading keep the art cheerful and keep colors consistent on every page.',
      },
      {
        title: 'Detail',
        body: 'Detail goes where it helps the story, such as a daisy on a bag or a pair of headphones, and is left out where it would only add clutter.',
      },
    ],
    fit: {
      formats: ['Picture books', 'Early readers', 'Chapter-book spot art', 'Series and recurring characters'],
      subjects: ['Funny and mischievous stories', 'Adventures full of movement', 'Feelings and friendship', 'Animal characters'],
      readers: 'Especially strong for ages 3 to 8, and for read-aloud books where children follow the story through the pictures.',
    },
    offerIntro: 'We create the characters and the book art together, so your cast stays consistent from the first sketch to the final page.',
    offers: [
      'Original cartoon character design from your descriptions',
      'Construction and turnaround sheets for every main character',
      'Expression and pose studies',
      'Full-page and double-page storybook illustrations',
      'Scenes and backgrounds drawn to support the action',
      'Vector artwork where your formats call for it',
    ],
    cta: 'Discuss a cartoon style book',
  },
  {
    id: 'watercolor-style',
    number: '02',
    name: 'Watercolor Style',
    heading: ['Soft washes and gentle color for', 'stories told with warmth'],
    lead: 'Watercolor style brings the look of paint on paper to your pages: transparent layers of color, soft edges and visible texture that make every scene feel hand-made, calm and personal.',
    look: [
      'Watercolor is built in layers. Pale washes come first, then richer color, then small accents, and the light parts of the picture are left as bare paper. Where colors meet they blend softly, and the grain of the paper shows through, as you can see in the sea-life painting below.',
      'The result is gentle rather than loud. Characters sit inside their world instead of on top of it, edges are relaxed, and the whole page shares the same light. The process video shows the same idea in a character illustration: a light pencil drawing first, then textured color laid in shape by shape.',
    ],
    strengths: [
      {
        title: 'Atmosphere first',
        body: 'Soft transitions and textured color set a mood before a word is read: warm and safe, quiet and thoughtful, or bright and fresh like a spring morning.',
      },
      {
        title: 'A timeless, hand-made feel',
        body: 'Visible texture and loose edges connect your book with the classic picture books many parents and grandparents remember.',
      },
      {
        title: 'Tender emotional moments',
        body: 'Gentle color and soft focus suit hugs, bedtime, missing someone and growing up, the moments where a softer image says more than a sharp one.',
      },
    ],
    craft: [
      {
        title: 'Characters and expressions',
        body: 'Faces are kept simple, with a few soft lines and warm cheeks, as in the mother-and-children painting. Feeling comes from posture, closeness and color as much as from features.',
      },
      {
        title: 'Scenes and backgrounds',
        body: 'Backgrounds can fade into white or be suggested with a few washes, which leaves calm space for text and keeps the reader’s eye on the characters.',
      },
      {
        title: 'Color',
        body: 'Palettes are harmonious and light: warm pinks and peaches for family stories, blues and greens for the sea and nature. We agree the palette early so every page shares the same light.',
      },
      {
        title: 'Detail',
        body: 'Texture is the detail. Granulated paint, paper grain and soft blooms give surfaces richness without crowding the page with lines.',
      },
    ],
    fit: {
      formats: ['Picture books', 'Bedtime and lullaby books', 'Gift books', 'Poetry collections'],
      subjects: ['Family and love', 'Nature, animals and the sea', 'Seasons and gentle adventures', 'Feelings and new experiences'],
      readers: 'Well suited to the youngest listeners and to read-aloud books shared by a parent and child, roughly ages 2 to 8.',
    },
    offerIntro: 'We plan each watercolor book so its soft look stays consistent and its text stays easy to read.',
    offers: [
      'Watercolor-style characters with a consistent painted finish',
      'Full-page and double-page painted scenes',
      'Soft backgrounds with space planned for your text',
      'Nature, sea, garden and seasonal settings',
      'An agreed palette and texture for the whole book',
      'Cover artwork in the same style as the interior',
    ],
    cta: 'Discuss a watercolor style book',
  },
  {
    id: 'digital-painting',
    number: '03',
    name: 'Digital Painting',
    heading: ['Painterly light and depth for', 'worlds readers can step into'],
    lead: 'Digital painting uses the language of a painter, with brushwork, light and atmosphere, on a digital canvas. It creates rich, immersive scenes where the setting is as memorable as the characters.',
    look: [
      'In digital painting, form is described with color and light rather than outlines. In the landscape on this page, the mountain is built from planes of warm light and cool shadow, the distance fades into haze, and the water picks up reflections from the sky.',
      'Because the painting lives in layers, it stays flexible. The process video shows one scene repainted under different light, from a cool dusk to a warm golden glow. That flexibility lets us adjust mood, time of day and emphasis with you before the details are finished.',
    ],
    strengths: [
      {
        title: 'Light that tells the story',
        body: 'A warm glow can mean safety or wonder; cold light can mean night, distance or danger. Light also guides the eye to what matters on the page.',
      },
      {
        title: 'Depth and scale',
        body: 'Layered foregrounds, misty distances and a small figure against a big landscape make a world feel vast and worth exploring.',
      },
      {
        title: 'Character-focused moments',
        body: 'Detail and contrast are concentrated on the characters and the story point, so even a rich, painted scene never loses its focus.',
      },
    ],
    craft: [
      {
        title: 'Characters and expressions',
        body: 'Characters are painted with soft modeling and lighting that matches their surroundings, so they truly belong in the scene.',
      },
      {
        title: 'Scenes and backgrounds',
        body: 'Environments are a strength of this style: mountains, forests, water and skies are painted with foreground, middle ground and distance for real depth.',
      },
      {
        title: 'Color',
        body: 'Color follows the light. We plan the mood of key scenes early, so the book moves through its emotional moments with a consistent look.',
      },
      {
        title: 'Detail',
        body: 'Detail is controlled. Brushwork stays loose and visible in leaves, rock and grass, while focal areas receive finer finishing.',
      },
    ],
    fit: {
      formats: ['Picture books', 'Illustrated chapter books', 'Book covers', 'Fantasy and adventure series'],
      subjects: ['Fantasy and quests', 'Nature and landscapes', 'Journeys and exploration', 'Myths, legends and retold tales'],
      readers: 'A strong choice for ages 5 to 12 and for older readers who enjoy lingering over detailed, atmospheric scenes.',
    },
    offerIntro: 'We paint characters and settings together, so your world and the people in it share the same light and mood.',
    offers: [
      'Digitally painted characters and scenes',
      'Environment and landscape painting',
      'Lighting and mood planning for key scenes',
      'Full-page and double-page illustrations',
      'Cover paintings with space planned for the title',
      'Adjustments to color and light before final detailing',
    ],
    cta: 'Discuss a digitally painted book',
  },
  {
    id: '3d-style',
    number: '04',
    name: '3D Style',
    heading: ['Dimensional characters with', 'form, light and depth'],
    lead: '3D style presents characters and objects as solid forms with real volume, lit like a film set. It gives a book a polished, modern look that children know from animated movies.',
    look: [
      'In 3D illustration, a form is built and then lit. Light wraps around rounded surfaces, highlights catch the edges, and soft shadows ground everything in its space. The rendered shape on this page shows those qualities clearly: smooth volume, glossy reflections and gentle falloff from light to shadow.',
      '3D also comes in many looks, from glossy and realistic to stylized and graphic. The walking character shown here uses a stylized, flat-shaded finish, yet the coat folds and the sneakers turn in perspective with every step because the figure has real three-dimensional form.',
    ],
    strengths: [
      {
        title: 'Solid, tangible form',
        body: 'Volume and lighting make characters feel present, almost like toys a child could pick up, which is a big part of 3D’s appeal for young readers.',
      },
      {
        title: 'Consistency from every angle',
        body: 'A character built in 3D keeps its proportions in any pose and from any viewpoint, which suits action-filled books and long series.',
      },
      {
        title: 'Consistent scene presentation',
        body: 'Lighting and camera choices can be repeated across scenes, so every page of the book feels part of the same polished world.',
      },
    ],
    craft: [
      {
        title: 'Characters and expressions',
        body: 'Characters are designed for appeal in 3D: rounded, readable shapes and expressions that hold up from the front, the side and in motion.',
      },
      {
        title: 'Scenes and backgrounds',
        body: 'Scenes can be full environments or simple, bold backdrops like the orange setting in the walk cycle, which keeps all attention on the character.',
      },
      {
        title: 'Color',
        body: 'Clean, saturated color and lighting work together. Strong contrasts, such as a blue coat against orange, make characters pop off the page.',
      },
      {
        title: 'Detail',
        body: 'Materials carry the detail: glossy, matte, soft fabric or plastic. Highlights and shadows describe them without extra lines.',
      },
    ],
    fit: {
      formats: ['Picture books', 'Character-led series', 'Covers and promotional art', 'Books planned alongside animation'],
      subjects: ['Toys, robots and gadgets', 'Lovable animal characters', 'STEM and discovery topics', 'Modern, everyday adventures'],
      readers: 'Appealing to ages 3 to 9 and to children who already love animated films.',
    },
    offerIntro: 'We develop 3D-style characters and scenes that stay consistent across the whole book.',
    offers: [
      '3D-style character creation from your descriptions',
      'Character poses and expressions',
      'Environments and simple, bold backdrops',
      'Lighting and material choices for your book’s look',
      'Rendered storybook scenes',
      'Consistent character appearance on every page',
    ],
    cta: 'Discuss a 3D style book',
  },
  {
    id: 'minimal-style',
    number: '05',
    name: 'Minimal Style',
    heading: ['Simple shapes and thoughtful color', 'that say more with less'],
    lead: 'Minimal style reduces each picture to what matters: clear shapes, restrained detail and a carefully chosen palette. The result is calm, modern and instantly easy to understand.',
    look: [
      'Minimal illustration is built from flat shapes and a small number of colors. There are few lines and little texture, and forms are simplified until only the meaningful parts remain. The animation on this page uses a deep teal and a warm orange almost everywhere, and that restraint is what gives it such a strong, unified look.',
      'With so little on the page, composition does the storytelling. A high viewpoint, a strong silhouette or a long shadow can set the whole mood of a scene, as the stills from the video show.',
    ],
    strengths: [
      {
        title: 'Clear compositions',
        body: 'One focal point per image and plenty of open space make each picture easy to read, even for the youngest children.',
      },
      {
        title: 'Easy visual recognition',
        body: 'Simple, consistent shapes and colors create characters and objects children recognize instantly, page after page.',
      },
      {
        title: 'A distinctive, modern identity',
        body: 'A tight palette and a consistent shape language give a book, or a whole series, a look that stands out on the shelf.',
      },
    ],
    craft: [
      {
        title: 'Characters and expressions',
        body: 'Characters are reduced to a few shapes. Expression comes from posture, silhouette and small details rather than from rendering.',
      },
      {
        title: 'Scenes and backgrounds',
        body: 'Settings are suggested with a handful of shapes such as a window, a street or a horizon, and light and shadow become graphic shapes in their own right.',
      },
      {
        title: 'Color',
        body: 'We choose a small palette for the whole book and use it consistently. Color can carry meaning, marking a character or the mood of a scene.',
      },
      {
        title: 'Detail',
        body: 'Detail is restrained on purpose. Every element earns its place, which keeps pages calm and leaves generous room for text.',
      },
    ],
    fit: {
      formats: ['Board books', 'Concept books', 'Early readers', 'Educational and nonfiction titles'],
      subjects: ['First words, colors and shapes', 'Counting and early learning', 'Simple, symbolic stories', 'Design-led gift books'],
      readers: 'Ideal for babies, toddlers and early readers, and for older readers who enjoy a clean, modern look.',
    },
    offerIntro: 'We build a simple, consistent visual system for your book: shapes, palette and characters that work together.',
    offers: [
      'Characters built from simple, consistent shapes',
      'A defined, limited palette for the whole book',
      'Clean, flat-color illustrations',
      'Simplified scenes and backgrounds',
      'Layouts with generous space for text',
      'Educational and early-reader illustrations',
    ],
    cta: 'Discuss a minimal style book',
  },
]

export const styleById = Object.fromEntries(styles.map((style) => [style.id, style])) as Record<string, StyleCopy>

/* ------------------------------------------------------------------ choosing a style */

export const styleMatches = [
  { need: 'Humor, energy and characters children will quote and copy', id: 'cartoon-style' },
  { need: 'A gentle, heartfelt story that should feel calm and timeless', id: 'watercolor-style' },
  { need: 'A rich world, a journey or a fantasy setting full of light and depth', id: 'digital-painting' },
  { need: 'A polished, modern look with characters that feel solid and real', id: '3d-style' },
  { need: 'First concepts, early learning or a clean, design-led story', id: 'minimal-style' },
]

export const choosingQuestions = [
  {
    title: 'Who is reading?',
    body: 'Very young children read simple shapes and strong contrast most easily. Older readers enjoy more detail and atmosphere.',
  },
  {
    title: 'How should it feel?',
    body: 'Funny, cozy, epic, polished or calm: the feeling of your story points strongly toward one or two styles.',
  },
  {
    title: 'Where does it happen?',
    body: 'If the setting is a character in its own right, choose a style that paints environments well. If the idea matters most, keep pages clear.',
  },
  {
    title: 'What comes next?',
    body: 'Planning a series, merchandise or animation? Some styles are easier to keep consistent and to reuse across formats.',
  },
]

export const styleFaqs = [
  {
    title: 'I am not sure which style fits my book. Can you help me choose?',
    body: 'Yes. Share your manuscript or a short summary, your readers’ age and a few books you love. We will recommend a style, explain why, and talk through how it would work for your characters and scenes.',
  },
  {
    title: 'Are the images and videos on this page from client books?',
    body: 'No. They are examples chosen to show what each style looks like. Your illustrations are created for your story and your characters.',
  },
  {
    title: 'Can you combine styles or adapt one to my story?',
    body: 'Yes. Styles are starting points, not fixed templates. A cartoon book can borrow watercolor texture, or a minimal book can take on a warmer palette. We agree the direction with you before page artwork begins.',
  },
  {
    title: 'Do I need reference images for my characters?',
    body: 'No. A written description is enough to begin. Photos, sketches or pictures you like are helpful but optional.',
  },
  {
    title: 'How do you keep characters consistent across the book?',
    body: 'Main characters are developed on reference sheets, with views, expressions and colors like the cartoon construction sheet on this page, and every page is drawn against them.',
  },
  {
    title: 'Can the same style continue across a series?',
    body: 'Yes. The character references, palette and style decisions from your first book become the guide for the next one, so the series looks like a family.',
  },
]
