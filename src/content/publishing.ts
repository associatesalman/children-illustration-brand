import hero1672 from '../assets/publishing/hero-library-1672.webp'
import hero960 from '../assets/publishing/hero-library-960.webp'
import logoBarnesNoble from '../assets/publishing/logo-barnes-noble.png'
import logoHoopla from '../assets/publishing/logo-hoopla.png'
import book1195 from '../assets/publishing/printed-picture-book-1195.webp'
import book640 from '../assets/publishing/printed-picture-book-640.webp'
import process640 from '../assets/publishing/process-chart-640.webp'
import process941 from '../assets/publishing/process-chart-941.webp'
import type { StyleImage } from './illustrationStyles'

/*
 * Book Publishing & Distribution page content. Built only from the two supplied mockups in
 * public/book publication and distribution/ (the hero and the process chart), the platform reference
 * and the existing book entries. No prices, timelines, results or partnerships are stated.
 */

const set = (...pairs: [string, number][]) => pairs.map(([src, w]) => `${src} ${w}w`).join(', ')

// ---------------------------------------------------------------- Hero

export const heroImage: StyleImage = {
  src: hero1672,
  srcSet: set([hero960, 960], [hero1672, 1672]),
  width: 1672,
  height: 941,
  alt: 'A wall of tall wooden bookshelves with a glowing arched doorway in the middle, where a small figure stands reading a book, under the words Klutz, Beyond the page, possibilities',
  caption: '',
}

/** Darkest edge of the hero mockup (measured), used for any space around the contained image. */
export const heroBackground = '#080200'

// ---------------------------------------------------------------- Platforms

export type Platform = { name: string; note: string; logo?: { src: string; width: number; height: number } }

/** Stores and library lending only: places a book is actually sold or borrowed. */
export const platforms: Platform[] = [
  { name: 'Amazon', note: 'Kindle ebooks and print' },
  { name: 'Barnes & Noble', note: 'Print and ebooks', logo: { src: logoBarnesNoble, width: 95, height: 56 } },
  { name: 'Apple Books', note: 'Ebooks' },
  { name: 'Google Play Books', note: 'Ebooks' },
  { name: 'Kobo', note: 'Ebooks' },
  { name: 'hoopla', note: 'Digital library lending', logo: { src: logoHoopla, width: 89, height: 36 } },
]

export const platformNote =
  'Availability depends on the format, the territory and each platform’s own eligibility rules. Listing a book does not guarantee placement or sales, and we are not affiliated with or endorsed by these companies.'

// ---------------------------------------------------------------- Publishing introduction

export const introImage: StyleImage = {
  src: book1195,
  srcSet: set([book640, 640], [book1195, 1195]),
  width: 1195,
  height: 1426,
  alt: 'A printed children’s picture book shown as its cover and two open spreads: a boy and a girl in an embroidered hat plant a seed in a flower garden, then sit together on a tree branch among the clouds',
  caption: '',
}

export const introCopy = [
  'Publishing a children’s book takes more than a good story. The words need to read well aloud, the illustrations need to print true to their colors, and every file has to meet the requirements of the printer and each store. We bring those pieces together, so your book is ready for readers in print and on screen.',
  'Our team supports you from the first manuscript to release day. Editing, formatting, quality checks and distribution setup are coordinated in one place, and each decision is explained along the way, so you always know where your book stands and what comes next.',
]

export const introPoints: { title: string; body: string }[] = [
  { title: 'Print and digital editions', body: 'Paperback, hardcover and ebook files prepared from the same finished book.' },
  { title: 'Editing, formatting and checks', body: 'Professional editing, careful layout and quality checks before anything is published.' },
  { title: 'Made for illustrated books', body: 'Full-color pages, double-page spreads and picture-led layouts handled with care.' },
  { title: 'Distribution setup', body: 'Your editions set up on the publishing platforms that suit your book.' },
  { title: 'Guidance at every stage', body: 'Clear explanations of each step, so the decisions stay yours.' },
  { title: 'One coordinated team', body: 'Joined-up support from manuscript preparation through to release.' },
]

// ---------------------------------------------------------------- Showcase

/** The 15 books shown on this page, in display order (three rows of five on desktop). */
export const showcaseSlugs = [
  'el-principito',
  'favole-sbagliate',
  'il-misterioso-ladro-di-zucche',
  'the-marigold-road',
  'le-secret-de-la-cabane-interdite',
  'naciste-para-brillar',
  'eres-una-chica-maravillosa',
  'tu-puedes',
  'paciencia',
  'the-secret-jobs-of-christmas-creatures',
  'barzellette-per-bambini',
  'apprendre-a-lire-le-son-des-lettres',
  'christmas-coloring-book-for-kids',
  '100000-whys',
  'captivating-stories-for-curious-kids',
] as const

// ---------------------------------------------------------------- Process (follows the supplied chart)

export const processImage: StyleImage = {
  src: process941,
  srcSet: set([process640, 640], [process941, 941]),
  width: 941,
  height: 1672,
  alt: 'Klutz Book Publishing, The Complete Process: a winding path through nine illustrated steps, from content submission, quality check and approval and negotiation, to editing, designing and sales and marketing, then printing and binding, pre-release reviews and distribution',
  caption: '',
}

export type ProcessStep = { title: string; body: string; icon: 'submit' | 'check' | 'agree' | 'edit' | 'design' | 'promote' | 'print' | 'review' | 'distribute' }

/** The chart's nine steps, in the order its path runs, each defined from the chart's own text. */
export const processSteps: ProcessStep[] = [
  {
    icon: 'submit',
    title: 'Content submission',
    body: 'The author submits a proposal or query letter, either to a literary agent or directly to a publisher.',
  },
  {
    icon: 'check',
    title: 'Quality check',
    body: 'If the publisher accepts the script, it joins the set of unsolicited manuscripts that are checked for the quality of their content.',
  },
  {
    icon: 'agree',
    title: 'Approval and negotiation',
    body: 'Commissioning editors negotiate the intellectual property rights and the royalty, and decide the intended formats of publication.',
  },
  {
    icon: 'edit',
    title: 'Editing',
    body: 'The focus is on technical and legal issues and on improving the content through rewriting and editorial changes, the choice of title and headings, and structural changes.',
  },
  {
    icon: 'design',
    title: 'Designing',
    body: 'The artwork and layout of the book: licensed photographs, creative illustrations, typesetting, cover design, the type and quality of paper, the binding method and proofreading.',
  },
  {
    icon: 'promote',
    title: 'Sales and marketing',
    body: 'The front cover images are produced and chapters are edited for promotion, then sales people promote the book.',
  },
  {
    icon: 'print',
    title: 'Printing and binding',
    body: 'The printer sends a pre-press proof of the book. Once the proof is approved, printing begins.',
  },
  {
    icon: 'review',
    title: 'Pre-release reviews',
    body: 'The printer often sends some free copies of the book to the publisher, to be used for pre-release reviews.',
  },
  {
    icon: 'distribute',
    title: 'Distribution',
    body: 'Books are generally sold through booksellers and retailers. Newspapers and magazines can be sold directly to subscribers, and other periodicals through newsagents.',
  },
]
