import bgInterior from '../assets/storybook/background-interior-717.webp'
import bgVillage from '../assets/storybook/background-village-499.webp'
import fullMockup640 from '../assets/storybook/full-page-mockup-640.webp'
import fullMockup735 from '../assets/storybook/full-page-mockup-735.webp'
import heroBook1159 from '../assets/storybook/hero-meadow-book-1159.webp'
import heroBook640 from '../assets/storybook/hero-meadow-book-640.webp'
import heroSpread1159 from '../assets/storybook/hero-meadow-spread-1159.webp'
import heroSpread640 from '../assets/storybook/hero-meadow-spread-640.webp'
import bedtimePage from '../assets/storybook/scene-bedtime-page-444.webp'
import byTheWater from '../assets/storybook/scene-by-the-water-717.webp'
import yarnToWater from '../assets/storybook/spread-yarn-to-water-736.webp'
import coverToCover from '../assets/storybook/spreads-cover-to-cover.mp4'
import coverToCoverPoster from '../assets/storybook/spreads-cover-to-cover-poster-720.webp'
import forestFriend from '../assets/storybook/spreads-forest-friend.mp4'
import forestFriendPoster from '../assets/storybook/spreads-forest-friend-poster-540.webp'
import type { StyleImage, StyleVideoAsset } from './illustrationStyles'

/*
 * Storybook Illustration page copy. Every description refers to what the adjacent artwork visibly shows.
 * The artwork comes from public/storybook illustration/ (see scripts/optimize_storybook.py and
 * src/assets/artwork/ASSETS.md). The pieces are third-party examples, not studio or client work, so
 * no story, client or result is attributed to them.
 */

const set = (...pairs: [string, number][]) => pairs.map(([src, w]) => `${src} ${w}w`).join(', ')

export type CategoryCopy = {
  id: string
  number: string
  name: string
  heading: [string, string]
  lead: string
}

export type Point = { title: string; body: string }

// ---------------------------------------------------------------- Hero

export const heroImages: { book: StyleImage; spread: StyleImage } = {
  book: {
    src: heroBook1159,
    srcSet: set([heroBook640, 640], [heroBook1159, 1159]),
    width: 1159,
    height: 537,
    alt: 'An open picture book on a painted meadow, a page turning to reveal a curly-haired boy holding a map',
    caption: '',
  },
  spread: {
    src: heroSpread1159,
    srcSet: set([heroSpread640, 640], [heroSpread1159, 1159]),
    width: 1159,
    height: 600,
    alt: 'An open picture book on a meadow: a pink hillside full of small figures and music notes on the left page, text on the right',
    caption: '',
  },
}

// ---------------------------------------------------------------- 01 Full Page Illustrations

export const fullPage: CategoryCopy = {
  id: 'full-page-illustrations',
  number: '01',
  name: 'Full Page Illustrations',
  heading: ['One page, one moment,', 'told in full'],
  lead: 'A full-page illustration gives a single story moment the whole page. It is where a reader slows down, looks closely and feels what the character feels.',
}

export const fullPageMedia: { mockup: StyleImage } = {
  mockup: {
    src: fullMockup735,
    srcSet: set([fullMockup640, 640], [fullMockup735, 735]),
    width: 735,
    height: 1103,
    alt: 'A picture book shown in eight photographs: the front and back covers, then open pages where a large blue bear fills single pages and whole spreads, with short lines of text set beside the artwork',
    caption: 'One picture book from cover to cover: the blue bear carries page after page, with the text placed in the open space around him.',
  },
}

export const fullPagePoints: Point[] = [
  {
    title: 'Bringing a key moment to life',
    body: 'We choose the instant that carries the most meaning, then give it room. In the sunrise page there is no clutter competing with the boy, just a hilltop, distant mountains and a sky that opens around him.',
  },
  {
    title: 'Placement, composition and focus',
    body: 'Where a character stands decides where the eye goes first. Here the boy is centered under the sun, and the light rays, cloud edges and hill line all point back to him and the glow in his hands.',
  },
  {
    title: 'Emotion that reads at a glance',
    body: 'Closed eyes, a wide smile and a hand pressed to his chest tell young readers how he feels before a single word is read. Expression and posture do the storytelling.',
  },
]

export const fullPageBalance: { title: string; body: string[] } = {
  title: 'Balancing the artwork with text',
  body: [
    'Not every full page is wordless. On the map page the boy stands to the left while the scene fades into soft cream on the right, giving the text a calm, readable area without boxing it in.',
    'We plan that space at the sketch stage, with your manuscript in hand, so the words are never squeezed into whatever area happens to be left over.',
  ],
}

export const fullPageContinuity: Point = {
  title: 'Continuity with the surrounding pages',
  body: 'A full page has to belong to the pages around it. The two examples here keep the same boy, the same curly hair, overalls and rounded features, and the same warm sunrise palette, so the moment feels like part of one journey.',
}

export const fullPageOffer = {
  items: [
    'Selecting the moments that deserve a full page',
    'Thumbnail compositions before detailed sketches',
    'Text areas planned around your manuscript',
    'Consistent characters, palette and lighting across pages',
    'Full-bleed artwork prepared for your trim size',
    'Wordless pages or pages designed to carry text',
  ],
  cta: 'Plan your full-page illustrations',
}

// ---------------------------------------------------------------- 02 Double Page Spreads

export const spreads: CategoryCopy = {
  id: 'double-page-spreads',
  number: '02',
  name: 'Double Page Spreads',
  heading: ['Two facing pages,', 'one continuous picture'],
  lead: 'A spread runs a single illustration across both pages of an open book. It is the widest view a picture book has, ideal for big places, journeys and turning points.',
}

export const spreadMedia: { yarn: StyleImage; video: StyleVideoAsset; coverToCover: StyleVideoAsset } = {
  yarn: {
    src: yarnToWater,
    width: 736,
    height: 506,
    alt: 'A two-page spread: a woman knitting in a chair on the left, her knitting turning into a stream of weedy water that crosses the fold and ends with a snorkeling boy swimming on the right',
    caption: 'One line carries the reader across both pages: the knitting becomes water, passes the fold and ends with the swimmer on the right.',
  },
  video: {
    src: forestFriend,
    label: 'Spreads from a square owl-and-bunny picture book',
    caption: 'Spreads from one square picture book: owl, bunny and child characters, text and soft background shapes arranged across each opening.',
    poster: { src: forestFriendPoster, width: 540, height: 960 },
  },
  coverToCover: {
    src: coverToCover,
    label: 'A square picture book shown cover to cover, spread by spread',
    caption: 'A square picture book from cover to back cover: wide forest and city spreads, with the text set into open areas of the artwork on either side of the fold.',
    poster: { src: coverToCoverPoster, width: 720, height: 720 },
  },
}

export const spreadPoints: Point[] = [
  {
    title: 'An expansive scene with a clear path',
    body: 'A spread gives us width, and width becomes a journey. In the knitting spread the eye starts with the woman at top left, follows the flowing water down and across, and arrives at the boy swimming on the right.',
  },
  {
    title: 'Planning text around the picture',
    body: 'The columns of text in the same spread sit in the open paper around the flowing water, so the artwork and the words share the pages without either one covering the other.',
  },
  {
    title: 'Respecting the center gutter',
    body: 'The fold swallows part of the page when a book is bound. Faces, hands, text and small details belong away from it. In the knitting spread, both figures sit well clear of the center, and only the water, weeds and lily pads, which can lose a little without harm, cross it.',
  },
  {
    title: 'Storytelling across the complete spread',
    body: 'We sketch every spread at full width, never as two separate pages, so the composition, light and color still work as one picture when the book lies open.',
  },
]

export const spreadOffer = {
  items: [
    'Full-width sketches showing both pages together',
    'Gutter-safe placement of faces, text and key details',
    'Text areas planned for your layout',
    'Bleed and trim guides for your printer',
    'Spreads that flow with the pages around them',
    'Files supplied as one spread or as split pages',
  ],
  cta: 'Discuss your spreads',
}

// ---------------------------------------------------------------- 03 Scene Illustrations

export const scenes: CategoryCopy = {
  id: 'scene-illustrations',
  number: '03',
  name: 'Scene Illustrations',
  heading: ['Story events,', 'drawn so children can read them'],
  lead: 'A scene illustration turns a line of the manuscript into something a child can understand without help: who is there, what is happening and how it feels.',
}

export const sceneMedia: { water: StyleImage; bedtime: StyleImage } = {
  water: {
    src: byTheWater,
    width: 717,
    height: 394,
    alt: 'A two-page scene: a girl with a long dark ponytail and a yellow raincoat stands on a log over still water, framed by large leaves, with text on the right page',
    caption: 'A quiet outdoor scene: one character, a still pose and open sky on the right page where the text sits.',
  },
  bedtime: {
    src: bedtimePage,
    width: 444,
    height: 315,
    alt: 'A book page: a boy asleep in bed in a dim, warm bedroom, a toy rabbit on the dresser and moon pictures on the wall, beside a block of text',
    caption: 'A bedtime scene: low, warm light and a sleeping boy slow the pace before the adventure starts.',
  },
}

export const scenePoints: Point[] = [
  {
    title: 'Readable action and body language',
    body: 'Children read posture before detail. The girl stands still on the log, turned toward the open right page: a calm, thoughtful pause rather than action, and it reads instantly.',
  },
  {
    title: 'Expressions that match the text',
    body: 'Faces carry the emotional line of the story. A sleeping face, a wide-eyed look or a shared laugh has to match what the words say on that page, so we sketch expressions with the manuscript beside us.',
  },
  {
    title: 'Character interaction',
    body: 'When two or more characters share a scene, their spacing, eye lines and gestures show the relationship: who is leading, who is listening, who needs help. We stage those moments so the connection is clear even to pre-readers.',
  },
]

export const sceneCamera: { title: string; body: string[] } = {
  title: 'Camera angle, perspective and pacing',
  body: [
    'Every scene has a point of view. The bedroom is seen close, at the level of the bed, which makes it feel private; the water scene is a wider view that shows the girl together with the water, leaves and trees around her.',
    'Changing the distance and angle from page to page sets the rhythm of the book. Quiet pages like the bedtime scene slow the reader down; wider, busier views pick the pace back up.',
  ],
}

export const sceneConsistency: Point = {
  title: 'Consistent characters and settings',
  body: 'We keep a reference for every character and recurring place, from hair and clothing to the color of a bedroom wall, so the girl in the yellow raincoat or the boy in overalls looks like themselves on every page.',
}

export const sceneOffer = {
  items: [
    'A scene list drawn from your manuscript',
    'Staging, camera angle and composition sketches',
    'Expressions and poses matched to the text',
    'Character and setting references kept for the whole book',
    'Pacing planned across quiet and busy pages',
    'Your feedback built in at the sketch stage',
  ],
  cta: 'Talk about your story’s scenes',
}

// ---------------------------------------------------------------- 04 Background Design

export const backgrounds: CategoryCopy = {
  id: 'background-design',
  number: '04',
  name: 'Background Design',
  heading: ['Settings that hold', 'the whole story together'],
  lead: 'Backgrounds tell readers where and when the story happens. A well-designed setting supports the characters, sets the mood and stays recognizable each time the story returns to it.',
}

export const backgroundMedia: { interior: StyleImage; village: StyleImage } = {
  interior: {
    src: bgInterior,
    width: 717,
    height: 394,
    alt: 'A spread showing an interior with no characters: an old wooden chest with an oval mirror, a pink vase with a dried flower and an open book, with text on the right page',
    caption: 'An indoor setting with no characters: the chest, mirror, vase and open book set the scene for the words beside them.',
  },
  village: {
    src: bgVillage,
    width: 499,
    height: 274,
    alt: 'A spread showing an autumn village of terracotta-roofed houses with glowing windows among golden trees on a hillside',
    caption: 'An outdoor setting from the same book: an autumn village with warm, lit windows among the trees.',
  },
}

export const backgroundIntro: Point[] = [
  {
    title: 'Indoor rooms',
    body: 'Bedrooms, kitchens, classrooms and attics, furnished with the objects that matter to the story, like the chest, mirror and book in the interior above.',
  },
  {
    title: 'Outdoor places and landscapes',
    body: 'Villages, forests, meadows and coastlines, from the terracotta rooftops of the autumn village to wide hills and open sky.',
  },
  {
    title: 'Imagined worlds',
    body: 'Places that exist only in the story, designed with their own rules, plants, buildings and light, so they feel believable to a child.',
  },
]

export const backgroundCraft: Point[] = [
  {
    title: 'Perspective',
    body: 'A clear horizon and consistent perspective let children understand the space and where the characters can go.',
  },
  {
    title: 'Lighting and atmosphere',
    body: 'Light sets the time and the mood. In the village, glowing windows and golden leaves suggest a warm autumn evening without a word.',
  },
  {
    title: 'Color',
    body: 'A setting’s palette supports the feeling of the page. Both settings here share the same warm, muted oranges and soft paper texture.',
  },
]

export const backgroundBalance: { title: string; body: string[] } = {
  title: 'Detail that supports the characters',
  body: [
    'A background should reward a second look without stealing the first. We keep the most detail away from where characters will stand, and soften contrast behind faces so they stay the clearest thing on the page.',
    'When a page has no characters at all, as in the interior spread, the setting can carry the moment, and every object in it is chosen for the story.',
  ],
}

export const backgroundContinuity: Point = {
  title: 'Setting continuity through the book',
  body: 'The interior, the village and the water scene in the Scene Illustrations section come from one book. The palette, the paper texture and the drawing style stay the same, so every place feels like part of the same world. We build that consistency with location references for each recurring setting.',
}

export const backgroundOffer = {
  items: [
    'Indoor, outdoor and imagined settings',
    'Location references for recurring places',
    'Perspective and layout planned around the characters',
    'Lighting and color for the mood of each page',
    'Detail levels matched to your readers’ age',
    'Backgrounds supplied as layered files on request',
  ],
  cta: 'Plan your book’s settings',
}

// ---------------------------------------------------------------- Process and FAQ

export const process: Point[] = [
  {
    title: 'Manuscript and readers',
    body: 'We read your manuscript and talk through the age group, the book format, the tone you want and any characters you already have.',
  },
  {
    title: 'Page plan',
    body: 'We break the text into pages and decide where a full page, a spread, a scene or a setting will tell the story best.',
  },
  {
    title: 'Characters and settings',
    body: 'Character designs and key locations are agreed first, so every later page draws from the same references.',
  },
  {
    title: 'Sketches with text placement',
    body: 'Rough sketches show composition, camera angle and where the words will sit, including the gutter on every spread.',
  },
  {
    title: 'Color and final art',
    body: 'Approved sketches are taken to finished illustrations, with light, palette and detail kept consistent across the book.',
  },
  {
    title: 'Print-ready files',
    body: 'Pages and spreads are prepared for your trim size and printing method, with bleed and safe areas checked.',
  },
]

export const storybookFaqs: Point[] = [
  {
    title: 'How do you decide between a full page, a spread and a smaller scene?',
    body: 'It depends on the moment. Big places and turning points often suit a spread; a single emotional beat suits a full page; quieter moments can share the page with more text. We suggest a page plan from your manuscript, and you decide.',
  },
  {
    title: 'Do I need to know where the text will go before illustration starts?',
    body: 'It helps to have the final or near-final text. We plan text areas in the sketches, so changes to the wording are easiest before the artwork is finished.',
  },
  {
    title: 'How do you keep faces and text out of the gutter?',
    body: 'Every spread is sketched at full width with the fold marked. Faces, hands, text and small details are placed away from it, and only artwork that can lose a little, like sky, water or grass, crosses the center.',
  },
  {
    title: 'Can you illustrate my existing characters?',
    body: 'Yes. Share your character references and we will keep their features, clothing and proportions consistent in every scene and setting.',
  },
  {
    title: 'Can you design backgrounds without characters?',
    body: 'Yes. Settings can be designed on their own, for example to establish a place, for endpapers, or as references for later pages.',
  },
  {
    title: 'Are the books on this page your client projects?',
    body: 'No. They are examples that show what full pages, spreads, scenes and settings can look like in a picture book. We are happy to discuss relevant work for your project.',
  },
]
