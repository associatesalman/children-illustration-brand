import copyColors1080 from '../assets/activity-books/coloring-copy-colors-1080.webp'
import copyColors640 from '../assets/activity-books/coloring-copy-colors-640.webp'
import markers from '../assets/activity-books/coloring-markers.mp4'
import markersPoster from '../assets/activity-books/coloring-markers-poster-540.webp'
import windowSet640 from '../assets/activity-books/coloring-window-set-640.webp'
import windowSet848 from '../assets/activity-books/coloring-window-set-848.webp'
import heroVideo from '../assets/activity-books/hero-workbook.mp4'
import heroPoster from '../assets/activity-books/hero-workbook-poster-540.webp'
import alphabet from '../assets/activity-books/jungle-alphabet-344.webp'
import completeFaces from '../assets/activity-books/jungle-complete-faces-341.webp'
import counting from '../assets/activity-books/jungle-counting-343.webp'
import matching from '../assets/activity-books/jungle-matching-341.webp'
import maze from '../assets/activity-books/jungle-maze-344.webp'
import spotDifference from '../assets/activity-books/jungle-spot-difference-343.webp'
import robotGrid1065 from '../assets/activity-books/robots-page-grid-1065.webp'
import robotGrid640 from '../assets/activity-books/robots-page-grid-640.webp'
import robotSpread1065 from '../assets/activity-books/robots-spread-1065.webp'
import robotSpread640 from '../assets/activity-books/robots-spread-640.webp'
import type { StyleImage, StyleVideoAsset } from './illustrationStyles'

/**
 * Activity Book Illustration service page (/services/activity-book-illustration).
 *
 * Media comes from the supplied folder `public/activity book illustration/`, exported by
 * scripts/optimize_activity_books.py and placed by what each file shows (see that script and
 * src/assets/artwork/ASSETS.md). The pieces are third-party examples, not studio or client work.
 */

const set = (...pairs: [string, number][]) => pairs.map(([src, w]) => `${src} ${w}w`).join(', ')

export const heroVideoAsset: StyleVideoAsset = {
  src: heroVideo,
  label: 'Flipping through a summer activity workbook',
  caption: '',
  poster: { src: heroPoster, width: 540, height: 960 },
}

export type CategoryCopy = {
  id: string
  number: string
  name: string
  heading: [string, string]
  lead: string
}

// ---------------------------------------------------------------- 01 Coloring Books

export const coloring: CategoryCopy = {
  id: 'coloring-books',
  number: '01',
  name: 'Coloring Books',
  heading: ['Line art that invites', 'every crayon in the box'],
  lead: 'A good coloring page looks simple, but every line has a job: to show a child exactly where one shape ends and the next begins.',
}

export const coloringMedia: { copyColors: StyleImage; windowSet: StyleImage; video: StyleVideoAsset } = {
  copyColors: {
    src: copyColors1080,
    srcSet: set([copyColors640, 640], [copyColors1080, 1080]),
    width: 1080,
    height: 1890,
    alt: 'A kids coloring book: a cover of cheering children with a “This belongs to” name label, and five “Copy the Colors” pages. Each page has a name line, a row of color swatches, a small colored reference picture, and a large outlined animal to color: a tiger, an octopus, a jellyfish, a panda and a sea turtle.',
    caption:
      'A “Copy the Colors” set: each page pairs bold outlines with a small finished reference and the exact swatches to use.',
  },
  windowSet: {
    src: windowSet848,
    srcSet: set([windowSet640, 640], [windowSet848, 848]),
    width: 848,
    height: 1264,
    alt: 'A coloring book called By the Window, a Cozy Coloring Book, laid on linen among loose pages. Every page shows a different view through a window: sunflower fields, ocean waves, a desert sunrise, a cat at the sill and patterned panes. Two pages are partly colored in soft pencil.',
    caption:
      'One theme, many pages: every scene in this set is framed by a window, so the book feels like a collection rather than a stack of unrelated drawings.',
  },
  video: {
    src: markers,
    label: 'Coloring a bow-and-hearts page with markers',
    caption:
      'Thick, closed outlines in practice: the marker fills each heart and ribbon loop without the color running into its neighbor.',
    poster: { src: markersPoster, width: 540, height: 960 },
  },
}

export const coloringTopics = [
  {
    title: 'Clear lines and recognizable characters',
    body: 'Children should know what they are coloring before they pick up a crayon. The tiger, octopus and panda pages use rounded, friendly shapes with one or two defining features each, such as stripes, tentacles or eye patches, so every animal reads instantly.',
  },
  {
    title: 'Detail matched to the age group',
    body: 'Young children need large, open shapes and heavy outlines that forgive a wobbly hand. Older children and adults enjoy finer line work and more pattern, like the window panes and waves in the cozy set. We decide the level of detail with your readers in mind.',
  },
  {
    title: 'Coloring spaces and outlines',
    body: 'Every area meant to be colored is fully enclosed, and outlines are thick enough to act as a border. The marker video shows why that matters: each heart and ribbon loop holds its color cleanly.',
  },
  {
    title: 'Page composition',
    body: 'Each page has one clear focal point with breathing room around it. On the “Copy the Colors” pages, the name line, swatches and reference image sit in a consistent header, and the drawing fills a framed panel below.',
  },
]

export const coloringTheme = {
  title: 'Themed illustrations, one consistent direction',
  body: [
    'A coloring book works best as a set. Sea creatures and jungle animals in the same line weight, or a series of views through different windows, give children a reason to turn the page and keep going.',
    'We agree on the theme, line style and character look at the start, then hold every page to it, so the book feels finished and collectible from cover to back page.',
  ],
}

export const coloringPrint = {
  title: 'Prepared for printing',
  body: 'Coloring pages are printed and used by hand, so we prepare them for print: clean black line art, sensible margins that keep artwork away from the binding and trim, and files sized for your book’s format. If pages will be printed at home, we can talk through layouts that suit standard paper.',
}

export const coloringOffer = {
  items: [
    'Coloring page illustration built around your theme',
    'Characters designed to be easy and fun to color',
    'Line weight and detail matched to your readers’ age',
    'Activity extras such as name lines, swatches and reference pictures',
    'A cover that matches the interior style',
    'Print-ready line art for your book format',
  ],
  cta: 'Plan your coloring book',
}

// ---------------------------------------------------------------- 02 Puzzle Books

export const puzzles: CategoryCopy = {
  id: 'puzzle-books',
  number: '02',
  name: 'Puzzle Books',
  heading: ['Puzzles where the picture', 'is part of the challenge'],
  lead: 'In an illustrated puzzle, the artwork is not decoration. It is the maze, the clue and the thing to find, so it has to be drawn with the solution in mind.',
}

export const puzzleMedia: { spread: StyleImage; maze: StyleImage; matching: StyleImage; difference: StyleImage } = {
  spread: {
    src: robotSpread1065,
    srcSet: set([robotSpread640, 640], [robotSpread1065, 1065]),
    width: 1065,
    height: 628,
    alt: 'An open activity book. The left page, titled Differences, asks readers to spot 5 differences between two pictures of a pink robot and a robot dog. The right page, titled Maze, says “Help the Robot get through the maze,” with the maze drawn inside a large robot’s screen.',
    caption:
      'A robot-themed spread: a spot-the-difference page and a maze built into the robot’s own body, each with a short instruction under its title.',
  },
  maze: {
    src: maze,
    width: 344,
    height: 500,
    alt: 'Jungle Maze page: help the baby panda find his way to her mother through the jungle maze, trace the path with a crayon. Children and a panda wait at the top, and the mother panda sits by a pond at the bottom.',
    caption: 'Maze: a clear start, a clear goal, and a story reason to get there.',
  },
  matching: {
    src: matching,
    width: 341,
    height: 501,
    alt: 'Feeding Time page: draw a line to match the animals with their food. A monkey, tiger, panda, bird and zebra on the left, each with a dot, and bamboo, seeds, meat, grass and bananas on the right.',
    caption: 'Matching: two tidy columns and a dot beside every item to draw from and to.',
  },
  difference: {
    src: spotDifference,
    width: 343,
    height: 501,
    alt: 'Spot the Difference page: two nearly identical jungle scenes with an elephant, a giraffe, a tiger, a lion, a bear, a zebra and a child. The page says there are 5 differences.',
    caption: 'Spot the difference: two framed scenes, stacked, with the number of differences stated up front.',
  },
}

export const puzzleTypes = [
  {
    title: 'Mazes',
    body: 'A maze needs an obvious start and finish, corridors wide enough for a crayon, and a reason to solve it. The jungle maze puts the baby panda at the entrance and its mother at the exit; the robot maze sits inside the robot’s screen, so the puzzle and the character are one picture.',
  },
  {
    title: 'Matching activities',
    body: 'Matching pages work when every item is easy to identify and the layout leaves space to draw. In Feeding Time, each animal and each food has its own row and a dot to connect, so the page stays readable even after several lines are drawn across it.',
  },
  {
    title: 'Hidden objects and spot the difference',
    body: 'Finding pages reward careful looking. Spot-the-difference scenes need changes that are noticeable but not obvious, placed across the whole picture. The robot book also includes an I Spy page, where readers search a crowded grid of look-alike robots; you can see it in the page overview further down.',
  },
  {
    title: 'Illustrated games',
    body: 'Games such as matching, mazes and the robot book’s math game turn practice into play. The illustration carries the theme, so a set of puzzles feels like one adventure rather than separate exercises.',
  },
]

export const puzzlePrinciples = [
  {
    title: 'Clear instructions',
    body: 'Every page in these examples opens with a title and one or two short sentences: “Trace the path with a crayon.” “There are a total of 5 differences!” We write and place instructions so a child, or the adult reading with them, knows what to do at a glance.',
  },
  {
    title: 'Readable layouts',
    body: 'Puzzles need room. We keep the puzzle area large, the background quiet, and decorations to the edges, so the challenge is never lost in the artwork.',
  },
  {
    title: 'Visual clues',
    body: 'Characters can point the way. A waiting mother panda shows where the maze ends; food that clearly belongs to one animal makes a match feel logical rather than random.',
  },
  {
    title: 'Difficulty for the audience',
    body: 'The number of turns in a maze, the size of the differences and the number of items to match can all be tuned to your readers’ age. We plan difficulty across the book, so it can build gradually from page to page.',
  },
  {
    title: 'Illustration that supports the activity',
    body: 'Every drawing in a puzzle is checked against the puzzle itself: walls that line up, differences that are really there, and answers that work. If your book includes an answer key, we illustrate that too.',
  },
]

export const puzzleOffer = {
  items: [
    'Illustrated mazes, matching pages and spot-the-difference scenes',
    'Finding pages such as I Spy grids',
    'Puzzle art designed around your theme and characters',
    'Instruction and title placement on every page',
    'Difficulty planned for your readers’ age',
    'Answer key illustrations when your book needs them',
  ],
  cta: 'Discuss your puzzle book',
}

// ---------------------------------------------------------------- 03 Educational Activity Books

export const educational: CategoryCopy = {
  id: 'educational-activity-books',
  number: '03',
  name: 'Educational Activity Books',
  heading: ['Learning pages that', 'feel like play'],
  lead: 'Alphabet tracing, counting and skill-building worksheets need illustration that is friendly and clear, and that keeps the learning task front and center.',
}

export const educationalMedia: { alphabet: StyleImage; counting: StyleImage; completeFaces: StyleImage; grid: StyleImage } = {
  alphabet: {
    src: alphabet,
    width: 344,
    height: 501,
    alt: 'Alphabet Safari page: trace the letters to practice your alphabet skills and learn the names of jungle animals. Dotted letters Aa to Ee sit beside an antelope, a bear, a chimpanzee, a dung beetle and an elephant.',
    caption: 'Alphabet: each dotted letter pair sits beside an animal whose name starts with it.',
  },
  counting: {
    src: counting,
    width: 343,
    height: 500,
    alt: 'Counting Monkeys page: a jungle full of monkeys swinging in the trees above four children, with the question “How many monkeys do you see? Write your answer here!” and an empty answer box.',
    caption: 'Counting: one question, many monkeys, and a box for the answer.',
  },
  completeFaces: {
    src: completeFaces,
    width: 341,
    height: 500,
    alt: 'Complete the Jungle Friends page: draw the other half of each jungle animal’s face. Half faces of a lion, monkey, tiger, frog, bear and panda are shown in a framed grid.',
    caption: 'Drawing skills: half a face is shown, and the child draws the matching half.',
  },
  grid: {
    src: robotGrid1065,
    srcSet: set([robotGrid640, 640], [robotGrid1065, 1065]),
    width: 1065,
    height: 798,
    alt: 'An overview of a robot-themed square activity book: a cover titled Robots and many interior pages, including drawing on a grid, mazes, dot to dot, shadow matching, color by number, differences, math games, copy the path, how many, and I Spy.',
    caption:
      'A whole book at a glance: one robot cast and one page frame carry drawing, counting, math, dot-to-dot and puzzle pages.',
  },
}

export const educationalTopics = [
  {
    title: 'Alphabet and early literacy',
    body: 'Letter pages pair a letter with a picture that starts with it, so children connect the shape, the sound and the word. In Alphabet Safari, each row gives a large, clear animal, its name, and dotted capital and lowercase letters to trace with plenty of space.',
  },
  {
    title: 'Numbers and counting',
    body: 'Counting pages need objects that are easy to tell apart and a scene that is fun to search. The monkeys are spread through the trees at different heights, and the answer box makes the task obvious. The robot book adds “How many?” tables and simple math games.',
  },
  {
    title: 'Skill-based worksheets',
    body: 'Some pages practice skills rather than facts: drawing the missing half of a face, copying a path, joining dots in order, or coloring by number. These rely on precise guide lines and dots, so the illustration has to be drawn accurately.',
  },
]

export const educationalPrinciples = [
  {
    title: 'Clear visual instructions',
    body: 'A short title, one instruction line and a picture that shows what to do. Many young users cannot read the instructions yet, so the page layout itself should suggest the task: dotted letters say “trace me,” an empty box says “write here.”',
  },
  {
    title: 'Age-appropriate illustration',
    body: 'Friendly, simple characters, high contrast and a calm background suit early learners. Detail is saved for pages where looking closely is the point.',
  },
  {
    title: 'Organized pages',
    body: 'Repeating the same page structure, with the title at the top, the instruction below it and the activity in a frame, helps children and teachers find their way through the book.',
  },
]

export const educationalConsistency = {
  title: 'A consistent presentation for authors and educators',
  body: [
    'The robot book shows how a series of different activities can still feel like one product: the same robot characters, the same framed page, the same title tabs and the same color palette on every spread.',
    'We help authors, teachers and educational publishers build that consistency into their own books, from the cast of characters and the page template to the way instructions are written and placed. You bring the learning content; we illustrate it so it is clear, cohesive and inviting.',
  ],
}

/** Behind the scenes: the eight stages of an educational activity book, as given in the brand's reference. */
export const educationalBehindScenes: { intro: string; steps: { title: string; body: string }[] } = {
  intro: 'Every educational activity book moves through the same eight stages, from the first conversation to the final files, so you always know what comes next.',
  steps: [
    { title: 'Project Consultation', body: 'We get to know your story, your intended audience and your illustration preferences.' },
    { title: 'Concept Drawing', body: 'We develop initial concepts and character sketches to explore the look of the book.' },
    { title: 'Storyboarding', body: 'We plan the visual flow across the pages and keep it consistent from start to finish.' },
    { title: 'Character Creation', body: 'We develop characters suited to your story and to your readers.' },
    { title: 'Background', body: 'We create settings that support the characters and the activities on each page.' },
    { title: 'Revision & Adjustment', body: 'We review the drafts with you and incorporate your feedback.' },
    { title: 'Color & Consistency', body: 'We refine the colors and keep the visual style consistent throughout the book.' },
    { title: 'Final Delivery', body: 'We prepare the agreed final files in the format you need for print or digital publishing.' },
  ],
}

export const educationalOffer = {
  items: [
    'Alphabet, phonics and early reading pages',
    'Number, counting and simple math activities',
    'Tracing, drawing, dot-to-dot and color-by-number worksheets',
    'A recurring cast of characters to guide learners',
    'A page template that keeps every activity consistent',
    'Illustration built around your curriculum or learning goals',
  ],
  cta: 'Talk about your educational book',
}

// ---------------------------------------------------------------- process and FAQ

export const process = [
  {
    title: 'Your book and your readers',
    body: 'We start with the age group, the purpose of the book, its format and any learning content or theme you already have.',
  },
  {
    title: 'An activity plan',
    body: 'Together we map the pages: which activities, in what order, at what difficulty, and how coloring, puzzle and learning pages are balanced.',
  },
  {
    title: 'Characters and page style',
    body: 'We design the recurring characters, the line style and a page template with space for titles, instructions and activities.',
  },
  {
    title: 'Sketches you can review',
    body: 'Rough layouts show each activity in place, so you can check the puzzles, the instructions and the flow of the book before final art.',
  },
  {
    title: 'Final illustration',
    body: 'Clean line art or full color, with every maze, difference and dotted line checked to make sure the activity works.',
  },
  {
    title: 'Files ready to print',
    body: 'Pages are prepared for your book’s size and printing method, with artwork kept clear of trims and the binding.',
  },
]

export const activityFaqs = [
  {
    title: 'Do I need to supply the activities, or can you suggest them?',
    body: 'Either works. Some authors and educators arrive with every page planned; others have a theme and an age group. We can suggest activity types and a page mix, and you decide what goes in.',
  },
  {
    title: 'Can one book mix coloring, puzzles and learning pages?',
    body: 'Yes. Many activity books combine them, like the robot book on this page. A shared cast and page template keep a mixed book feeling consistent.',
  },
  {
    title: 'Can you illustrate a book for a specific age group?',
    body: 'Yes. Line weight, level of detail, puzzle difficulty and instruction wording are all planned for the readers you describe.',
  },
  {
    title: 'Will the puzzles actually work?',
    body: 'Every maze, matching page and spot-the-difference scene is checked against its solution during illustration. We can also illustrate answer pages.',
  },
  {
    title: 'Can my existing characters appear in the activity book?',
    body: 'Yes. If you already have a character from a storybook or series, we can bring them into the activity pages, using your existing references.',
  },
  {
    title: 'Are the examples on this page your client projects?',
    body: 'No. They are examples that show the kinds of coloring, puzzle and learning pages an activity book can include. We are happy to discuss relevant work for your project.',
  },
]
