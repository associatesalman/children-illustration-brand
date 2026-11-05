import activity1448 from '../assets/editing/activity-spread-1448.webp'
import activity720 from '../assets/editing/activity-spread-720.webp'
import ch1After420 from '../assets/editing/ch1-after-420.webp'
import ch1After760 from '../assets/editing/ch1-after-760.webp'
import ch1Before420 from '../assets/editing/ch1-before-420.webp'
import ch1Before760 from '../assets/editing/ch1-before-760.webp'
import ch2After420 from '../assets/editing/ch2-after-420.webp'
import ch2After760 from '../assets/editing/ch2-after-760.webp'
import ch2Before420 from '../assets/editing/ch2-before-420.webp'
import ch2Before760 from '../assets/editing/ch2-before-760.webp'
import ch3After420 from '../assets/editing/ch3-after-420.webp'
import ch3After760 from '../assets/editing/ch3-after-760.webp'
import ch3Before420 from '../assets/editing/ch3-before-420.webp'
import ch3Before760 from '../assets/editing/ch3-before-760.webp'
import chapterSpreads680 from '../assets/editing/chapter-book-spreads-680.webp'
import dogPages1448 from '../assets/editing/dog-book-pages-1448.webp'
import dogPages720 from '../assets/editing/dog-book-pages-720.webp'
import dropCap1200 from '../assets/editing/drop-cap-spreads-1200.webp'
import dropCap640 from '../assets/editing/drop-cap-spreads-640.webp'
import formatting1080 from '../assets/editing/formatting-before-after-1080.webp'
import formatting640 from '../assets/editing/formatting-before-after-640.webp'
import hero1672 from '../assets/editing/hero-before-after-1672.webp'
import hero960 from '../assets/editing/hero-before-after-960.webp'
import otter1530 from '../assets/editing/otter-spread-1530.webp'
import otter720 from '../assets/editing/otter-spread-720.webp'
import pastures1536 from '../assets/editing/pastures-spread-1536.webp'
import pastures720 from '../assets/editing/pastures-spread-720.webp'
import printEbook1448 from '../assets/editing/print-and-ebook-1448.webp'
import printEbook720 from '../assets/editing/print-and-ebook-720.webp'
import tablet1254 from '../assets/editing/proofreading-tablet-1254.webp'
import tablet640 from '../assets/editing/proofreading-tablet-640.webp'
import textInterior480 from '../assets/editing/text-interior-spreads-480.webp'
import textInterior750 from '../assets/editing/text-interior-spreads-750.webp'
import type { StyleImage } from './illustrationStyles'

/*
 * Editing & Proofreading page, with Formatting & Layout Design. Copy follows the "Editing & Proofreading"
 * and "Formatting & Layout Design" parts of "Childrens Brand Replica (4).docx" (including the text inside
 * its panels), with grammar corrected. Images: see scripts/optimize_editing.py and
 * src/assets/artwork/ASSETS.md. No prices, timelines, revision allowances or results are stated.
 */

const set = (...pairs: [string, number][]) => pairs.map(([src, w]) => `${src} ${w}w`).join(', ')
const image = (src: string, srcSet: string | undefined, width: number, height: number, alt: string, caption = ''): StyleImage => ({
  src,
  srcSet,
  width,
  height,
  alt,
  caption,
})

export type Point = { title: string; body: string }

// ---------------------------------------------------------------- Hero

export const heroImage = image(
  hero1672,
  set([hero960, 960], [hero1672, 1672]),
  1672,
  941,
  'Before and after book editing: on the left, a torn draft page of Chapter One covered in red editor notes such as too vague, be specific and add more emotion; on the right, the same passage rewritten and neatly typeset, with a fountain pen, under the words Before and After Book Editing, from messy draft to polished manuscript',
)

/** Measured from the hero mockup's edges (deep navy). */
export const heroBackground = '#03172a'

// ---------------------------------------------------------------- 01 What editing and proofreading involve

export const introLead =
  'Professional editing and proofreading help prepare your manuscript for publication. We offer children’s book proofreading, copy editing and manuscript editing, so your story reads clearly, sounds right for its readers and is free of the small errors that distract from it.'

export const introBody = [
  'Editing looks at how the story reads. An editor considers word choice, sentence clarity, dialogue, flow and tone, and asks whether each line suits the age of the children who will hear or read it. Proofreading is the careful final check: grammar, spelling, punctuation and consistency, line by line, before the text is set into pages.',
  'Throughout, your voice leads. The aim is never to rewrite your book into someone else’s, but to remove whatever stands between your story and a young reader.',
]

export const tabletImage = image(
  tablet1254,
  set([tablet640, 640], [tablet1254, 1254]),
  1254,
  1254,
  'A tablet showing Chapter One of a children’s story with handwritten red editor notes such as stronger verb, nice image, consider small, concise and parallel structure, beside labels for editing, proofreading and publishing',
  'An edited page: notes suggest a stronger verb, a smaller word and a more concise phrase, and point out what already works.',
)

/** What every sentence is reviewed for. */
export const reviewAreas: Point[] = [
  { title: 'Wording', body: 'Words that are vivid, precise and familiar to young readers, in place of vague or overly formal ones.' },
  { title: 'Grammar', body: 'Correct verb forms, agreement and word use, including easily missed errors such as its and it’s.' },
  { title: 'Punctuation', body: 'Commas, quotation marks, exclamation marks and dashes that help a sentence read aloud the way it should.' },
  { title: 'Clarity', body: 'Sentences that say one thing clearly, in an order a child can follow, without gaps in the story’s logic.' },
  { title: 'Dialogue', body: 'Characters who sound like themselves, with speech that feels natural for their age and personality.' },
  { title: 'Consistency', body: 'The same names, spellings, tense and terms from the first page to the last.' },
  { title: 'Age-appropriate language', body: 'Vocabulary, sentence length and tone matched to the age group the book is written for.' },
]

// ---------------------------------------------------------------- 02 Human editor

export const humanEditor = {
  title: 'Why choosing AI over a professional children’s book editor could hurt your story',
  body: [
    'You have spent months bringing your children’s book to life. Automated AI editing can quietly change your characters’ voices, weaken the emotions and remove the small details you worked so hard to create. Worse, you might not notice until your story no longer feels like yours. Is that a risk worth taking?',
    'That is why a professional editor by your side matters. A human editor knows how to keep the fun, imagination and emotion that make children fall in love with a story. Our professional book editing improves your writing without losing the voice and personality that make your book special.',
    'After all, your story could become a child’s favorite bedtime read, and poor editing should not stand in its way. We give your manuscript the care it deserves, so little readers keep asking for just one more page.',
  ],
  pullQuote: 'So little readers keep asking for just one more page.',
}

// ---------------------------------------------------------------- 03 Service and author involvement

export const editingServices: Point[] = [
  {
    title: 'Story review',
    body: 'A read of the whole manuscript for story flow, pacing, characters and how well it suits its age group, with suggestions where the story could be clearer or stronger.',
  },
  {
    title: 'Copy edit help',
    body: 'Line-by-line work on grammar, punctuation, word choice and sentence clarity, and on keeping names, spelling, tense and terms consistent.',
  },
  {
    title: 'Final proof check',
    body: 'A last careful read for typos, missing words, punctuation and spacing before the text is finalized.',
  },
  {
    title: 'Detailed editor notes',
    body: 'Comments that explain each suggested change and raise questions, so you can see why a change is suggested and decide what stays.',
  },
  {
    title: 'Formatting refinement',
    body: 'Tidy, consistent chapter titles, headings and text styles, so the manuscript moves smoothly into page layout.',
  },
  {
    title: 'Publishing readiness',
    body: 'A clean, consistent manuscript prepared for the next stage, whether that is layout, printing or an ebook.',
  },
]

export const servicesTagline = 'Get your manuscript polished before you send it for publishing.'

/** The six promises from the source panel ("01 Stories Stay Yours" to "06 A Book to Be Proud Of"). */
export const editingPromises: Point[] = [
  { title: 'Stories stay yours', body: 'Your voice and imagination remain at the heart of every edit.' },
  { title: 'Words kids understand', body: 'We make each line clear, natural and fun to read.' },
  { title: 'Characters feel real', body: 'Dialogue and emotions sound right for young readers.' },
  { title: 'Mistakes get caught', body: 'Small errors are checked before they reach the page.' },
  { title: 'You stay involved', body: 'Your ideas and questions matter throughout the process.' },
  { title: 'A book to be proud of', body: 'A careful final polish helps your story shine.' },
]

/** How the author takes part in the review. No timings or revision counts are promised. */
export const reviewSteps: Point[] = [
  {
    title: 'Share your manuscript',
    body: 'Send the text and tell us who the book is for: the age group, the kind of book and anything you are unsure about.',
  },
  {
    title: 'Edits with explanations',
    body: 'The editor marks suggested changes in the text and adds notes that explain the reason for each one.',
  },
  {
    title: 'You review every suggestion',
    body: 'Accept a change, keep your original or ask a question. The final decision on your words is always yours.',
  },
  {
    title: 'Final proofread',
    body: 'Once the text is settled, a final proof check catches any remaining errors before layout.',
  },
]

// ---------------------------------------------------------------- 04 Before and after examples

/** Text segment: plain, removed (del), added (ins) or flagged by the editor without removal (flag). */
export type Segment = string | { del: string; note?: number } | { ins: string } | { flag: string; note?: number }

export type CorrectionExample = {
  id: string
  /** Chapter label exactly as on the sample, e.g. "Chapter One". */
  chapter: string
  title?: string
  source: 'document' | 'hero' | 'demonstration'
  sourceNote: string
  before: Segment[][]
  after: Segment[][]
  /** Editor notes written on the draft, numbered to match the segments. */
  editorNotes?: string[]
  /** A note written beside the whole draft rather than on one word. */
  generalNote?: string
  changes: Point[]
  originals?: { before: StyleImage; after: StyleImage }
}

const page = (src: string, src420: string, alt: string) => image(src, set([src420, 420], [src, 760]), 760, 1155, alt)

export const correctionExamples: CorrectionExample[] = [
  {
    id: 'milo-and-the-moon',
    chapter: 'Chapter One',
    title: 'Milo and the Moon',
    source: 'document',
    sourceNote: 'Sample pages supplied for this service',
    before: [
      ['Milo was ', { del: 'extraordinarily apprehensive' }, ' of the enormous shadow behind the tree. The night was very quiet, and the moon made long, wobbly shapes on the ground.'],
      ['He ', { del: 'proceeded cautiously' }, ' toward it, holding his tiny lantern. His heart thumped, but he kept going. The shadow looked bigger and bigger, and Milo squinted to see what it was.'],
      ['Suddenly, the shadow ', { del: 'commenced to move' }, ' and made a funny squeak.'],
      ['It was only Pip, the bunny, ', { del: 'attempting to locate nourishment' }, '!'],
      ['Milo ', { del: 'experienced tremendous relief' }, '. “You silly bunny!” he said.'],
    ],
    after: [
      ['Milo was ', { ins: 'a little scared' }, ' of the enormous shadow behind the tree. The night was very quiet, and the moon made long, wobbly shapes on the ground.'],
      ['He ', { ins: 'tiptoed' }, ' toward it, holding his tiny lantern. His heart thumped, but he kept going. The shadow looked bigger and bigger, and Milo squinted to see what it was.'],
      ['Suddenly, the shadow ', { ins: 'began to wiggle' }, ' and made a funny squeak.'],
      ['It was only Pip, the bunny, ', { ins: 'looking for a snack' }, '!'],
      ['Milo ', { ins: 'let out a giggle' }, '. “You silly bunny!” he said.'],
    ],
    changes: [
      {
        title: 'Age-appropriate language',
        body: '“Extraordinarily apprehensive” and “attempting to locate nourishment” are adult, formal phrases. “A little scared” and “looking for a snack” say the same thing in words a young child knows.',
      },
      {
        title: 'Stronger, simpler verbs',
        body: '“Proceeded cautiously” becomes “tiptoed” and “commenced to move” becomes “began to wiggle”: one vivid verb a child can picture replaces a stiff phrase.',
      },
      {
        title: 'Showing, not telling',
        body: '“Experienced tremendous relief” names a feeling. “Let out a giggle” shows Milo’s reaction and leads naturally into “You silly bunny!”',
      },
    ],
    originals: {
      before: page(ch1Before760, ch1Before420, 'Original sample page: Chapter One, Milo and the Moon, before editing'),
      after: page(ch1After760, ch1After420, 'Original sample page: Chapter One, Milo and the Moon, after editing, with deleted words struck through in red and new words underlined in green'),
    },
  },
  {
    id: 'the-dragon-who-sneezed',
    chapter: 'Chapter Two',
    title: 'The Dragon Who Sneezed',
    source: 'document',
    sourceNote: 'Sample pages supplied for this service',
    before: [
      [{ del: 'The diminutive dragon experienced considerable irritation in his nasal passage.' }, ' He had been playing in the meadow all morning, chasing butterflies and sniffing the flowers.'],
      ['He scrunched his eyes and tried to hold it in, but the tickle grew and grew. ', { del: 'He emitted an exceptionally powerful exhalation.' }],
      ['The hat sailed through the air and landed in a patch of daisies. The dragon blinked, surprised, and looked at his friends. ', { del: 'His companions expressed amusement.' }],
      ['The little dragon laughed, too, and picked up his hat, feeling much better at last.'],
    ],
    after: [
      [{ ins: 'The little dragon felt a tickle in his nose.' }, ' He had been playing in the meadow all morning, chasing butterflies and sniffing the flowers.'],
      ['He scrunched his eyes and tried to hold it in, but the tickle grew and grew. ', { ins: 'Achoo! He sneezed so hard his hat flew off!' }],
      ['The hat sailed through the air and landed in a patch of daisies. The dragon blinked, surprised, and looked at his friends. ', { ins: 'His friends burst into giggles.' }],
      ['The little dragon laughed, too, and picked up his hat, feeling much better at last.'],
    ],
    changes: [
      {
        title: 'Simpler, age-appropriate wording',
        body: '“The diminutive dragon experienced considerable irritation in his nasal passage” becomes “The little dragon felt a tickle in his nose”, which a young listener understands straight away.',
      },
      {
        title: 'Clarity and story logic',
        body: 'In the original, “the tickle” in paragraph two had never been mentioned, and the hat sails through the air before anything says it came off. The edit introduces the tickle and adds “his hat flew off”, so each moment follows from the last.',
      },
      {
        title: 'Sound and energy',
        body: '“He emitted an exceptionally powerful exhalation” becomes “Achoo!”: a sound word children love to say aloud, followed by an exclamation that matches the moment.',
      },
      {
        title: 'Consistent terms',
        body: 'The same sentence pair called the characters “his friends” and then “his companions”. The edit keeps “friends” and replaces “expressed amusement” with “burst into giggles”.',
      },
    ],
    originals: {
      before: page(ch2Before760, ch2Before420, 'Original sample page: Chapter Two, The Dragon Who Sneezed, before editing'),
      after: page(ch2After760, ch2After420, 'Original sample page: Chapter Two, The Dragon Who Sneezed, after editing, with deleted sentences struck through in red and new sentences underlined in green'),
    },
  },
  {
    id: 'maisies-missing-mittens',
    chapter: 'Chapter Three',
    title: 'Maisie’s Missing Mittens',
    source: 'document',
    sourceNote: 'Sample pages supplied for this service',
    before: [
      ['It was a bright, cold morning, and Maisie couldn’t find her mittens anywhere. “', { del: 'I am experiencing distress because my mittens are absent,' }, '” Maisie cried.'],
      ['Her friend Fox, who had been building a snowman in the garden, hurried over. “', { del: 'I shall endeavor to assist you,' }, '” said Fox.'],
      ['They searched under the bench, behind the bushes, and beside the birdbath, but the mittens were not there.'],
      ['Then Maisie spotted something on top of the snowman’s head. “', { del: 'We have successfully located the garments.' }, '” She laughed and ran over to take her mittens back.'],
    ],
    after: [
      ['It was a bright, cold morning, and Maisie couldn’t find her mittens anywhere. “', { ins: 'Oh no! Where did my mittens go?' }, '” Maisie cried.'],
      ['Her friend Fox, who had been building a snowman in the garden, hurried over. “', { ins: 'Let’s look together!' }, '” said Fox.'],
      ['They searched under the bench, behind the bushes, and beside the birdbath, but the mittens were not there.'],
      ['Then Maisie spotted something on top of the snowman’s head. “', { ins: 'There they are—on the snowman!' }, '” She laughed and ran over to take her mittens back.'],
    ],
    changes: [
      {
        title: 'Natural dialogue',
        body: 'Each line of speech was stiff and formal (“I shall endeavor to assist you”). The edits give Maisie and Fox the short, lively lines children actually say: “Let’s look together!”',
      },
      {
        title: 'Punctuation that carries emotion',
        body: 'Flat commas and full stops inside the quotations become a question mark and exclamation marks, and a dash sets up the reveal, so the dialogue reads aloud with feeling.',
      },
      {
        title: 'Clear, specific wording',
        body: '“We have successfully located the garments” becomes “There they are—on the snowman!”, which names exactly where the mittens are instead of using a vague, formal word.',
      },
    ],
    originals: {
      before: page(ch3Before760, ch3Before420, 'Original sample page: Chapter Three, Maisie’s Missing Mittens, before editing'),
      after: page(ch3After760, ch3After420, 'Original sample page: Chapter Three, Maisie’s Missing Mittens, after editing, with deleted dialogue struck through in red and new dialogue underlined in green'),
    },
  },
  {
    id: 'the-harbor',
    chapter: 'Chapter One',
    source: 'hero',
    sourceNote: 'The draft and revision shown in the page’s opening mockup',
    before: [
      ['The wind was ', { del: 'cold', note: 1 }, ' that night, and she stood at the edge of the harbor, ', { del: 'wondering', note: 2 }, ' if she had made the right decision.'],
      [{ del: 'Everything', note: 3 }, ' felt uncertain, like her future was a question she ', { del: 'couldn’t' }, ' answer.'],
      ['She ', { del: 'thought' }, ' about what had ', { del: 'happened', note: 4 }, ' in the past, and all the ', { flag: 'mistakes', note: 5 }, ' she had made.'],
      ['Maybe it was too late to change ', { del: 'anything' }, '. But a small part of her still ', { del: 'believed' }, ' that ', { del: 'something', note: 6 }, ' better could be.'],
    ],
    editorNotes: ['too vague', 'be specific', 'stronger opening?', 'show', 'too general', 'clearer?'],
    generalNote: 'add more emotion',
    after: [
      [{ ins: 'A sharp wind swept' }, ' across the harbor, and she stood at the edge, ', { ins: 'the salt air bracing against her skin' }, '. ', { ins: 'For the first time in a long while, she let herself wonder' }, ' if she had made the right decision.'],
      ['The past was ', { ins: 'a series of hard lessons' }, ', but she no longer saw them as mistakes—', { ins: 'only as a path that had led her here' }, '. ', { ins: 'Maybe it wasn’t too late to change. Maybe a brighter future was still possible.' }],
    ],
    changes: [
      {
        title: 'Specific, sensory detail',
        body: 'The editor marked “cold” as too vague. The revision replaces it with something the reader can feel: “A sharp wind swept across the harbor… the salt air bracing against her skin.”',
      },
      {
        title: 'A stronger, clearer structure',
        body: '“Everything felt uncertain” was queried as a weak opening and removed. The revision moves from the scene to her thoughts in two tighter paragraphs.',
      },
      {
        title: 'Showing emotion instead of naming it',
        body: 'General phrases flagged as “show” and “too general” (“what had happened”, “all the mistakes”) become “a series of hard lessons… only as a path that had led her here”.',
      },
      {
        title: 'Clearer wording',
        body: 'The vague “something better could be” becomes “a brighter future was still possible”, and the repeated “Maybe” now builds rhythm toward a hopeful ending.',
      },
    ],
  },
  {
    id: 'demonstration-runaway-kite',
    chapter: 'Demonstration passage',
    title: 'The Runaway Kite',
    source: 'demonstration',
    sourceNote: 'Written for this page to show grammar, punctuation, tense and repetition fixes. Not client work.',
    before: [
      ['Rosa ', { del: 'runs' }, ' up the hill with her new kite. The wind was ', { del: 'strong and' }, ' the kite ', { del: 'pulls and pulls' }, ' at ', { del: 'it’s' }, ' string. ', { del: '“Hold on tight”' }, ' said Grandpa.'],
      ['Rosa held on ', { del: 'really really tight' }, ', but the string ', { del: 'slips' }, ' through her ', { del: 'fingers and' }, ' the kite flew away over the trees.'],
      [{ del: 'Rosa felt sad. She was very sad because the kite was her favorite kite.' }, ' Then she ', { del: 'sees' }, ' a flash of red in the old oak tree.'],
    ],
    after: [
      ['Rosa ', { ins: 'ran' }, ' up the hill with her new kite. The wind was ', { ins: 'strong, and' }, ' the kite ', { ins: 'pulled and pulled' }, ' at ', { ins: 'its' }, ' string. ', { ins: '“Hold on tight!”' }, ' said Grandpa.'],
      ['Rosa held on ', { ins: 'as tight as she could' }, ', but the string ', { ins: 'slipped' }, ' through her ', { ins: 'fingers, and' }, ' the kite flew away over the trees.'],
      [{ ins: 'Rosa’s eyes stung with tears. The kite was her favorite.' }, ' Then she ', { ins: 'saw' }, ' a flash of red in the old oak tree.'],
    ],
    changes: [
      {
        title: 'Consistent tense',
        body: 'The passage jumped between present and past (“runs”, “was”, “pulls”, “flew”). “Ran”, “pulled”, “slipped” and “saw” keep the whole story in the past tense.',
      },
      {
        title: 'Grammar',
        body: '“It’s” means “it is”. The possessive “its string” has no apostrophe.',
      },
      {
        title: 'Punctuation',
        body: 'A comma now joins each pair of complete clauses (“strong, and”, “fingers, and”), and Grandpa’s call gains an exclamation mark inside the quotation marks.',
      },
      {
        title: 'Repeated and unnecessary words',
        body: '“Really really tight” becomes “as tight as she could”. “Sad… very sad” and “her favorite kite” repeated themselves, so the edit shows the feeling once (“eyes stung with tears”). “Pulled and pulled” is kept: that repetition is deliberate and gives the line its rhythm.',
      },
    ],
  },
]

// ---------------------------------------------------------------- 05 Formatting & Layout Design

export const formattingIntro = {
  title: 'Comprehensive book layout design services',
  lead: 'Choose professional layouts that keep text, pictures and spacing easy to follow. We can help you with every aspect of book formatting, from interior page design to paperback, hardcover and ebook preparation for professionally presented print and digital editions.',
}

export const layoutPrinciples: Point[] = [
  { title: 'Balanced page layout', body: 'We balance text and art so each page feels clear, open and easy to read.' },
  { title: 'Readable type and spacing', body: 'We set type size, spacing and line breaks so young readers can follow each page.' },
  { title: 'Consistent margin planning', body: 'We keep margins and gutters consistent so words and images remain safely in place.' },
  { title: 'Consistent page alignment', body: 'We align each page element so the whole book feels neat, balanced and consistent.' },
  { title: 'Clear spread planning', body: 'We plan every spread so words, pictures and page turns move together naturally.' },
  { title: 'Custom page layout', body: 'Our custom layouts fit the story, artwork and age group instead of forcing a template.' },
]

export type LayoutSample = { id: string; eyebrow: string; title: string; body: string; image: StyleImage }

/** Each sample is placed beside the principle it demonstrates. */
export const layoutSamples: LayoutSample[] = [
  {
    id: 'balanced',
    eyebrow: 'Balanced page layout',
    title: 'Text and illustration in balance',
    body: 'A full-page illustration fills the left-hand page, and the facing page carries just a few short lines set in the open space of a light, airy illustration. The words never compete with the art, so the page feels calm and easy to read.',
    image: image(
      otter1530,
      set([otter720, 720], [otter1530, 1530]),
      1530,
      1028,
      'An open picture book: on the left, a full-page illustration of an otter stretching in bed beside a round window; on the right, a few short lines of text set among pale trees',
    ),
  },
  {
    id: 'spread',
    eyebrow: 'Clear spread planning',
    title: 'One picture across two pages',
    body: 'When a single illustration runs across both pages, the layout is planned as one spread. Here the text sits in the open sky on the left, clear of the gutter and away from the boy and the calf, so nothing important disappears into the binding and the eye moves naturally to the page turn.',
    image: image(
      pastures1536,
      set([pastures720, 720], [pastures1536, 1536]),
      1536,
      1024,
      'A picture-book spread with one illustration across both pages: a boy brushing a calf by a fence in a green pasture, with lines of text in the sky on the left-hand page',
    ),
  },
  {
    id: 'typography',
    eyebrow: 'Readable type and placement',
    title: 'Type that invites young readers in',
    body: 'Large decorative drop caps open each page of text, the text blocks are short with comfortable line spacing, and each one sits beside its illustration rather than over it. The reader always knows where to start.',
    image: image(
      dropCap1200,
      set([dropCap640, 640], [dropCap1200, 1200]),
      1200,
      1179,
      'Two picture-book spreads: a framed illustration of an old man facing a page of text that opens with a large drop cap, and a page of text with a drop cap facing an illustration of the man resting among plants',
    ),
  },
  {
    id: 'consistency',
    eyebrow: 'Consistent margins and alignment',
    title: 'The same care on every page',
    body: 'Across this whole book, the dedication, the chapter titles and the story pages share the same type, heading style, text width and border of paw prints. Consistent margins and alignment make the book feel finished from cover to cover.',
    image: image(
      dogPages1448,
      set([dogPages720, 720], [dogPages1448, 1448]),
      1448,
      1086,
      'Pages of a picture book about a dog named Manny laid out on a yellow surface: a dedication page, chapter titles such as Manny’s Early Morning Plan and Manny’s Favorite Ride, and story pages with matching paw-print borders',
    ),
  },
]

export const layoutChecks = {
  eyebrow: 'All-in-one support to finish a book',
  title: 'Catch and fix layout mistakes early with children’s book formatting for printing',
  body: 'A file can look fine on screen and still cause trouble once it reaches print. We check page size, bleed, margins, image placement and page order before handoff, helping you avoid cropped artwork, narrow gutters or unexpected white edges. The final file is prepared to move smoothly into printing, with fewer surprises at production.',
  checks: [
    {
      title: 'Trim and bleed checks',
      body: 'To format a book for printing properly, we set trim and bleed so artwork can reach the page edge where needed, without leaving white lines or placing important text and images too close to the final trim.',
    },
    {
      title: 'Safe margins and gutters',
      body: 'Book interior formatting keeps text and artwork inside safe margins and away from gutters, so no important detail feels cramped, hidden or too close to the binding once the book is printed.',
    },
    {
      title: 'Files ready for print',
      body: 'Our print-ready formatting checks page order, size, image placement and final file setup before handoff, giving you a file that is easier to send to the printer without last-minute layout surprises.',
    },
  ] as Point[],
  closing: {
    title: 'Print a book with perfect formatting',
    body: 'Send your final text and artwork, and we will prepare each page as a clean, print-ready file.',
  },
}

export const formattingBeforeAfter = image(
  formatting1080,
  set([formatting640, 640], [formatting1080, 1080]),
  1080,
  1080,
  'An open book labeled Before and After. Before: a chapter page in a word processor with visible formatting marks, cramped headings and stretched justified lines. After: the same page typeset with a floral header, a centered chapter title, a drop cap, a bulleted list and a page number. Caption: Your book isn’t bad, it’s just badly formatted.',
  'The same chapter page before and after formatting. Before: visible formatting marks, cramped headings and stretched lines. After: a chapter opener, a centered title, a drop cap, an indented list and even spacing.',
)

export const formatsImage = image(
  printEbook1448,
  set([printEbook720, 720], [printEbook1448, 1448]),
  1448,
  1086,
  'The picture book Together Is Home shown twice: as an open printed book with a family illustration facing the text, and on an e-reader with the same text above a black-and-white version of the illustration',
  'One book, two formats: the printed page and the same text reflowed for an e-reader.',
)

export const formatsCopy = {
  title: 'Files for the format you need',
  body: [
    'A printed book and an ebook follow different rules. Print files need the right trim size, bleed for edge-to-edge art and safe margins for the binding. Ebook files need text and images that read clearly on a screen, where the reader may change the type size.',
    'We prepare paperback, hardcover and ebook files from the same finished book, so every edition looks professionally presented.',
  ],
}

export type BookType = Point & { image?: StyleImage }

/** "Professional book formatting for kids' stories from all genres." */
export const bookTypes: BookType[] = [
  {
    title: 'Picture books',
    body: 'Art-led pages with only a few words each. Text is placed in open areas of the illustration and away from the gutter, and full-bleed art is checked against trim and bleed.',
  },
  {
    title: 'Beginner books',
    body: 'For early readers: larger type, generous line spacing, short lines and deliberate line breaks, with text in a consistent position so new readers know where to look.',
  },
  {
    title: 'Illustrated books',
    body: 'Text and pictures share the page. Spot illustrations, drop caps and text set beside the art keep longer passages inviting.',
    image: image(
      textInterior750,
      set([textInterior480, 480], [textInterior750, 750]),
      750,
      1124,
      'Interior spreads of an illustrated book with black line art of a woman in a hat and a birdcage on a branch, with text columns opening with large drop caps, and the book’s cover',
    ),
  },
  {
    title: 'Activity book layouts',
    body: 'Clearly separated activities, numbered steps and questions, consistent headings and room to write or draw, so children can work through each page on their own.',
    image: image(
      activity1448,
      set([activity720, 720], [activity1448, 1448]),
      1448,
      1086,
      'An activity-book spread: four jars of coins labeled with a lock, a basket, a heart and a plant on the left; on the right, boxed sections titled Activity, Build the Jars, Money Mission and Family Discussion Questions with three numbered questions',
    ),
  },
  {
    title: 'Chapter book layouts',
    body: 'Numbered chapter openers, display titles and comfortable body text for longer reading, with spot art and page numbers that help readers find their place.',
    image: image(
      chapterSpreads680,
      undefined,
      680,
      418,
      'Six open chapter-book spreads in black and white: chapter openers numbered 1, 2 and 5, a speech-bubble page, and text pages with silhouette illustrations of a tree, a figure and a road',
    ),
  },
  {
    title: 'And more',
    body: 'Other children’s formats are planned case by case, because kids’ book formatting changes with age, length, art and style.',
  },
]
