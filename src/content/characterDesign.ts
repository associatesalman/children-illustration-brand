import buddiesGroup from '../assets/character-design/buddies-group-600.webp'
import buddiesPosesA from '../assets/character-design/buddies-poses-a-600.webp'
import buddiesPosesB from '../assets/character-design/buddies-poses-b-600.webp'
import castFaces1308 from '../assets/character-design/cast-faces-1308.webp'
import castFaces760 from '../assets/character-design/cast-faces-760.webp'
import details1200 from '../assets/character-design/creation-details-1200.webp'
import details640 from '../assets/character-design/creation-details-640.webp'
import sketchFinal640 from '../assets/character-design/development-sketch-final-640.webp'
import sketchFinal736 from '../assets/character-design/development-sketch-final-736.webp'
import sequence540 from '../assets/character-design/expression-sequence-540.webp'
import sketches1200 from '../assets/character-design/expression-sketches-1200.webp'
import sketches640 from '../assets/character-design/expression-sketches-640.webp'
import expressions3d from '../assets/character-design/expressions-3d.mp4'
import expressions3dPoster from '../assets/character-design/expressions-3d-poster-736.webp'
import hero1394 from '../assets/character-design/hero-lineup-1394.webp'
import hero697 from '../assets/character-design/hero-lineup-697.webp'
import ellis1200 from '../assets/character-design/sheet-ellis-1200.webp'
import ellis640 from '../assets/character-design/sheet-ellis-640.webp'
import turnaround1200 from '../assets/character-design/sheet-turnaround-1200.webp'
import turnaround640 from '../assets/character-design/sheet-turnaround-640.webp'
import type { StyleImage, StyleVideoAsset } from './illustrationStyles'

/**
 * Character Design service page (/services/character-design).
 *
 * Media comes from the supplied folder `public/character design/`, exported by
 * scripts/optimize_character_design.py, and is placed by what each file shows (see that script and
 * src/assets/artwork/ASSETS.md). The pieces are third-party examples, not studio or client work, so
 * captions describe what each one shows and never present it as one of our projects.
 */

const set = (...pairs: [string, number][]) => pairs.map(([src, w]) => `${src} ${w}w`).join(', ')

export const hero = {
  src: hero1394,
  srcSet: set([hero697, 697], [hero1394, 1394]),
  width: 1394,
  height: 812,
  alt: 'Six flat-color characters standing side by side: a woman in a green blouse with arms crossed beside a sitting dog, a man in a cap and polo waving and holding a toolbox, a young woman hugging a clipboard, a man in a green sweatshirt with hands in his pockets, and a woman in a red top mid-step.',
}

export type SectionCopy = {
  id: string
  number: string
  name: string
  heading: [string, string]
  lead: string
  intro: string[]
}

// ---------------------------------------------------------------- 01 Main Character Creation

export const creation: SectionCopy = {
  id: 'main-character-creation',
  number: '01',
  name: 'Main Character Creation',
  heading: ['The hero of your story,', 'drawn from the inside out'],
  lead: 'Before anyone draws a line, we get to know your main character: who they are, what they want, and who will be reading about them.',
  intro: [
    'A central character carries the whole book. Young readers follow them from the first page to the last, so the design has to tell them, at a glance, what kind of person this is. A shy reader, a fearless explorer and a mischievous little brother should each look like themselves before a single word is read.',
    'That is why character creation starts with your manuscript rather than with a style. Your story tells us the character’s role, their age, the world they live in and the feeling the book should leave behind. The visual design grows out of those answers.',
  ],
}

export const creationMedia: Record<'details' | 'cast', StyleImage> = {
  details: {
    src: details1200,
    srcSet: set([details640, 640], [details1200, 1200]),
    width: 1200,
    height: 824,
    alt: 'A painted boy in round glasses, a striped red-and-cream T-shirt, blue shorts and red sneakers, with handwritten notes pointing to his brown eyes, glasses, favorite color red, backpack, wrist watch and favorite sneakers. Beside him is a pencil sketch of the same boy in profile.',
    caption:
      'A character callout: each note on the left ties a visible detail to who the boy is, and the profile sketch on the right checks his shape from the side.',
  },
  cast: {
    src: castFaces1308,
    srcSet: set([castFaces760, 760], [castFaces1308, 1308]),
    width: 1308,
    height: 282,
    alt: 'Six 3D cartoon children in a row: a freckled girl with braids, a boy with tousled hair, a boy holding up a pencil, a curly-haired girl in a yellow cap making a peace sign, a blue-eyed boy with a backpack, and a laughing red-haired girl waving.',
    caption:
      'Six children, six readable silhouettes: braids, a cap, curls and bright red hair separate them even before you notice their faces.',
  },
}

export const creationTopics = [
  {
    title: 'Role, personality and audience',
    body: 'We begin with what the character does in the story and how they feel about it. Are they brave or anxious, curious or careful? Are they five or eleven? A picture book for toddlers calls for simple, rounded shapes and big readable faces; a chapter book for older readers can carry more detail and subtler acting.',
  },
  {
    title: 'Appearance and proportions',
    body: 'Head size, body shape and posture do a lot of quiet storytelling. A large head and short limbs read as young and lovable; a taller, leaner figure feels older or more grown-up. We set proportions early so the character stays believable in every pose.',
  },
  {
    title: 'Clothing and distinguishing features',
    body: 'Clothes and small details are how children recognize a character on a busy page. In the boy’s callout, the round glasses, the striped red shirt, the backpack, the wrist watch and the favorite sneakers each say something about the boy, and each one can be repeated in every scene.',
  },
  {
    title: 'Concepts and visual references',
    body: 'We gather references for the setting, era and mood you describe, then explore concept options so you can compare directions side by side. Seeing several faces and silhouettes together, as in the row of children above, makes it easier to choose the one that feels right.',
  },
]

export const creationTone = {
  title: 'Designed for the tone of your manuscript',
  body: [
    'A bedtime story, a slapstick adventure and a gentle book about a big feeling each need a different kind of hero. Color, line quality and proportions all shift the tone: soft edges and warm colors feel calm, while bold shapes and saturated color feel energetic.',
    'We match those choices to your text, so the character supports the story you wrote instead of pulling it in another direction.',
  ],
}

export const creationOffer = {
  intro: 'Main character creation for authors who want a hero their readers will recognize from the cover onward.',
  items: [
    'A conversation about your manuscript, readers and the character’s role',
    'Reference gathering and concept options to compare',
    'Appearance, proportions and outfit design',
    'Distinguishing details that can repeat on every page',
    'A design that fits the illustration style of your book',
    'Room to discuss changes before the character is finalized',
  ],
  cta: 'Talk about your main character',
}

// ---------------------------------------------------------------- 02 Character Expressions

export const expressions: SectionCopy = {
  id: 'character-expressions',
  number: '02',
  name: 'Character Expressions',
  heading: ['Feelings children', 'can read at a glance'],
  lead: 'Young readers often read faces before they read words. Clear, consistent expressions let them follow what a character feels on every page.',
  intro: [
    'In a picture book, much of the emotional story lives in the illustrations. A raised eyebrow, a wide grin or a sideways glance can say what the text leaves unsaid, and it gives early readers a way into the story even before they can decode every sentence.',
    'Expression design makes sure those moments are clear and that the character still looks like themselves when they laugh, shout or go quiet.',
  ],
}

export const expressionMedia: { video: StyleVideoAsset; sketches: StyleImage; sequence: StyleImage } = {
  video: {
    src: expressions3d,
    label: 'A 3D boy changing expressions',
    caption:
      'One 3D character moving through a range of expressions: a bored look, a scowl, a grin, a shout, surprise, a sly sideways smile and an open, happy laugh.',
    poster: { src: expressions3dPoster, width: 736, height: 414 },
  },
  sketches: {
    src: sketches1200,
    srcSet: set([sketches640, 640], [sketches1200, 1200]),
    width: 1200,
    height: 732,
    alt: 'An expression sheet for a girl with an ornate hairstyle and tassel earrings: a colored portrait with a gentle smile, and pencil sketches of her laughing, shouting angrily, looking up in profile while reaching out, smiling as she leans on her arms, and resting with her eyes closed.',
    caption:
      'An expression sheet: the colored portrait sets the design, and the pencil studies test laughter, anger, curiosity, a playful smile and a quiet, eyes-closed moment on the same face.',
  },
  sequence: {
    src: sequence540,
    width: 540,
    height: 945,
    alt: 'Four comic panels of the same girl and boy at sunset above a city: holding hands, a close-up of their joined hands, the girl smiling shyly, and the two resting their foreheads together.',
    caption:
      'Four panels, one emotional beat. The girl’s headband, hair clips and features stay the same while her expression softens from panel to panel.',
  },
}

/** Only the expressions that actually appear in the artwork above. */
export const expressionKey = [
  { name: 'Happy', where: 'The grin and the open laugh in the 3D video, and the laughing sketch on the expression sheet.' },
  { name: 'Angry', where: 'The scowl in the video and the shouting sketch, with lowered brows and a wide, square mouth.' },
  { name: 'Surprised', where: 'The raised brows and open mouth in the video, where the eyes widen before the mouth does.' },
  { name: 'Curious', where: 'The profile sketch looking up with lips parted, one hand raised toward something out of view.' },
  { name: 'Playful', where: 'The sly sideways smile in the video and the leaning, smiling sketch.' },
  { name: 'Calm or wistful', where: 'The eyes-closed sketch and the shy smile in the comic panels: quieter feelings that still read clearly.' },
]

export const expressionTopics = [
  {
    title: 'Faces, eyes and brows',
    body: 'Most of an expression lives in the eyebrows, the eyelids and the mouth. Watch the video: the scowl comes from brows pulled down and together, surprise from brows lifted high, and the sly smile from eyes sliding to the side while the mouth stays small.',
  },
  {
    title: 'Eye direction',
    body: 'Where a character looks tells readers where to look. A glance toward the next page pulls the eye forward; a look back over the shoulder suggests worry or doubt. We plan eye direction together with the page layout.',
  },
  {
    title: 'Gestures and body language',
    body: 'An expression is stronger when the whole body agrees with it. In the expression sheet, the girl reaches out as she looks up and leans on folded arms as she smiles. Shoulders, hands and posture carry the feeling to readers who are still learning to read faces.',
  },
  {
    title: 'Consistency across scenes',
    body: 'A character can laugh on one page and cry on the next, but they must always be recognizable. The comic panels show how: the same headband, hair clips and facial structure hold steady while lighting, framing and expression change around them.',
  },
]

export const expressionReference = {
  title: 'Why expression references matter',
  body: [
    'An expression reference sheet records how your character looks when they feel different things. It becomes the guide for every illustration in the book, so a happy face on page 4 and a happy face on page 28 clearly belong to the same child.',
    'If your story needs an emotion that is not shown on this page, such as sadness, fear or embarrassment, we design it as part of your character’s set. Every expression is drawn for your character and your story.',
  ],
}

export const expressionOffer = {
  intro: 'Expression development for characters whose feelings move the story.',
  items: [
    'Expression studies chosen from the emotions in your manuscript',
    'Attention to brows, eyes, mouth and eye direction',
    'Gesture and posture that support each feeling',
    'A labeled expression reference for your book',
    'Checks that the character stays recognizable in every mood',
  ],
  cta: 'Discuss your character’s expressions',
}

// ---------------------------------------------------------------- 03 Character Sheets

export const sheets: SectionCopy = {
  id: 'character-sheets',
  number: '03',
  name: 'Character Sheets',
  heading: ['One reference', 'for every page'],
  lead: 'A character sheet collects everything about how a character looks into a single page, so they stay the same from the first spread to the last book in a series.',
  intro: [
    'Across a 32-page picture book, a character might be drawn dozens of times: running, sitting, from the front, from behind, close up and far away. Without a shared reference, small details drift. A sleeve changes length, a stripe changes color, a face grows a little older.',
    'The character sheet prevents that. It shows the character from several angles, in typical poses and with their key expressions, so every illustration starts from the same source.',
  ],
}

export const sheetMedia: Record<'full' | 'turnaround', StyleImage> = {
  full: {
    src: ellis1200,
    srcSet: set([ellis640, 640], [ellis1200, 1200]),
    width: 1200,
    height: 675,
    alt: 'A character sheet for a young woman named Ellis with long auburn hair: a full-length front view in a navy patterned sweater and green trousers holding a flashlight, a seated pose reading a book, an alternate outfit with a bag and an axe, four small full-length outfit variations, a written character description, and six head studies showing worry, a sideways look, shouting, delight, a pout and uncertainty.',
    caption:
      'A complete sheet: front view, a seated pose, outfit options, a written profile and six expression heads, all on one page.',
  },
  turnaround: {
    src: turnaround1200,
    srcSet: set([turnaround640, 640], [turnaround1200, 1200]),
    width: 1200,
    height: 786,
    alt: 'A 3D turnaround of a small boy in an aviator hat, striped scarf, denim jacket, red mittens and gray boots, holding a slate: shown in left profile, in three-quarter view looking worried, in right profile and from the back.',
    caption:
      'A turnaround: left profile, three-quarter view, right profile and back, with every prop and pattern kept in place.',
  },
}

export const sheetContents = [
  {
    title: 'Views from every side',
    body: 'Front, side, three-quarter and back views. The turnaround shows profile, three-quarter, opposite profile and back; the full sheet adds a clear front view.',
  },
  {
    title: 'Poses',
    body: 'Typical poses for the story, from standing to sitting and reading, show how the character moves and how their clothes fold.',
  },
  {
    title: 'Expression references',
    body: 'Head studies for the feelings the story needs. The sheet above includes six, from delight to worry.',
  },
  {
    title: 'Outfits, colors and details',
    body: 'Every outfit, pattern, accessory and prop the character uses, in their final colors, so nothing changes by accident.',
  },
]

export const sheetTopics = [
  {
    title: 'Consistent proportions',
    body: 'Height, head size and limb length are fixed on the sheet, so the character keeps the same build whether they fill a page or appear small in a crowd.',
  },
  {
    title: 'Recognizable details',
    body: 'In the turnaround, the stripes on the scarf, the patch on the jacket and the slate under the arm stay in place from every angle. Those are the details children notice and look for.',
  },
  {
    title: 'A guide for the whole book',
    body: 'The sheet is used for every spread. It keeps the art consistent from the first sketch to the last spread, and it lets anyone else involved in your book see exactly what the character should look like.',
  },
  {
    title: 'Ready for a series',
    body: 'If your book becomes a series, the sheet travels with it. New books, covers and promotional art can all start from the same reference.',
  },
]

export const sheetQuestions = [
  'Which views your story needs, such as front, side, three-quarter or back',
  'The poses and actions that come up most often in the manuscript',
  'Which expressions to include on the sheet',
  'Every outfit, accessory and prop the character uses',
  'Whether you plan more than one book with this character',
]

export const sheetOffer = {
  intro: 'Character sheets for authors who want their characters to stay the same on every page.',
  cta: 'Request a character sheet',
}

// ---------------------------------------------------------------- 04 Character Development

export const development: SectionCopy = {
  id: 'character-development',
  number: '04',
  name: 'Character Development',
  heading: ['From first sketch', 'to a lasting character'],
  lead: 'Character development turns an approved concept into a dependable visual identity: refined, tested in action, and ready for every scene.',
  intro: [
    'The first drawing of a character is a starting point. Development is where personality becomes visible in the way they stand, move and react, and where the design is refined until it works on every page and alongside every other character.',
  ],
}

export const developmentMedia: Record<'group' | 'posesA' | 'posesB' | 'sketchFinal', StyleImage> = {
  group: {
    src: buddiesGroup,
    width: 600,
    height: 338,
    alt: 'A finished illustration titled Buddies: three older men around a card table. One in a wheelchair throws his arms up as cards fly, a tall thin man stands behind leaning on the table, and a heavyset man in a red polo holds his cards and grins.',
    caption: 'Three friends, three clearly different silhouettes, and a relationship you can read in one scene.',
  },
  posesA: {
    src: buddiesPosesA,
    width: 600,
    height: 336,
    alt: 'Four pencil pose sketches of the heavyset man, scratching his head, walking, pointing and crouching, beside the finished color version of him pointing with both hands.',
    caption: 'Pose sketches for the heavyset friend, then the finished character in one of those gestures.',
  },
  posesB: {
    src: buddiesPosesB,
    width: 600,
    height: 336,
    alt: 'Four pencil pose sketches of the tall, thin man with a cane, standing, sitting, walking and leaning, beside the finished color version of him walking with the cane.',
    caption: 'The same process for the tall friend: his cane and lanky build shape every pose.',
  },
  sketchFinal: {
    src: sketchFinal736,
    srcSet: set([sketchFinal640, 640], [sketchFinal736, 736]),
    width: 736,
    height: 1308,
    alt: 'A full-length figure of a young woman with dark hair in a bun, a fitted dark top, a laced corset belt, a flowing side drape, loose trousers and tall boots, finished in muted color. Beside her is the pencil drawing of the same figure in the same pose.',
    caption:
      'One figure at two stages: the pencil drawing on the right and the refined color version on the left, with costume details resolved and line work cleaned up.',
  },
}

export const developmentTopics = [
  {
    title: 'Refining personality and visual direction',
    body: 'We compare the drawing against your story and adjust until the character feels right: a softer face for a gentle hero, a sharper silhouette for a bold one. The sketch-to-color figure shows the kind of refinement that happens here, as rough lines become clean shapes and costume details are settled.',
  },
  {
    title: 'Developing poses and behavior',
    body: 'A character’s personality shows in how they move. The Buddies pose sketches explore each friend standing, walking, gesturing and sitting before the final art is painted. A heavyset friend points and crouches with his weight low; a tall friend leans on his cane.',
  },
  {
    title: 'Relationships with other characters',
    body: 'Characters who share a story need to look good together. The three friends are designed as a set, with contrasting shapes and heights, so each one stands out and the group still feels like a unit.',
  },
  {
    title: 'Continuity across scenes',
    body: 'Once a character is developed, the character sheet and expression references guide every scene. Their outfit, colors and features stay steady, while lighting, setting and action change around them.',
  },
  {
    title: 'Ready for future books',
    body: 'A well-developed character can grow with you. With the design documented, we can bring the same character into a sequel, a series, a cover or promotional material without starting again.',
  },
]

export const developmentOffer = {
  intro: 'Character development for books where a character needs to hold up across many scenes, or many books.',
  items: [
    'Refinement of your approved concept',
    'Pose and action studies based on your story',
    'Supporting characters designed to work alongside your hero',
    'Continuity guidance for the full book',
    'Reference material that carries into a series',
  ],
  cta: 'Develop your characters with us',
}

// ---------------------------------------------------------------- FAQ

export const characterFaqs = [
  {
    title: 'Do I need a finished manuscript before character design starts?',
    body: 'No. A finished manuscript helps, but a story summary and notes about your characters are enough to begin. We will talk through what we need at the start.',
  },
  {
    title: 'Can you design a character from my own description or sketch?',
    body: 'Yes. Written descriptions, rough sketches, photos of real places and examples of books you love are all useful starting points.',
  },
  {
    title: 'Can my character be based on a real child?',
    body: 'Many authors want a character inspired by a child in their life. We can work from the details you choose to share and turn them into a character for your book.',
  },
  {
    title: 'What is the difference between a character sheet and an expression sheet?',
    body: 'A character sheet shows the whole character: views from several angles, poses, outfits and colors. An expression sheet focuses on the face and shows how the character looks in different emotions. Many books use both.',
  },
  {
    title: 'Can you design supporting characters and animals too?',
    body: 'Yes. Siblings, friends, pets and other supporting characters can be designed alongside your main character, so the whole cast fits together.',
  },
  {
    title: 'Are the examples on this page your client projects?',
    body: 'No. They are examples that show what character design involves, such as callouts, expression studies, sheets and turnarounds. We will be happy to talk through relevant work for your project.',
  },
]
