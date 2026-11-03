import businessInsider from '../assets/media/business-insider.png'
import entrepreneur from '../assets/media/entrepreneur.png'
import inc from '../assets/media/inc.png'
import losAngelesTimes from '../assets/media/los-angeles-times.png'
import ted from '../assets/media/ted.png'
import wsj from '../assets/media/wsj.png'
import { artwork, type Artwork } from './artwork'

export type Point = {
  title: string
  body: string
}

/**
 * "Explore Children's Book Services" — transcribed from the reference screenshot in
 * Childrens Brand Replica (2).docx. Links point to the matching homepage section.
 */
export const exploreServices: (Point & { href: string })[] = [
  {
    title: 'Picture Book Illustration',
    body: "Full children's book illustrations, from character design to finished pages.",
    href: '#illustration',
  },
  {
    title: 'Book Cover Illustration',
    body: 'Front, back, and wraparound covers prepared for KDP or IngramSpark.',
    href: '#portfolio',
  },
  {
    title: 'Character Design',
    body: 'Consistent, expressive characters before the full book begins.',
    href: '#characters',
  },
  {
    // Reference text: "See starting prices and package options…". No prices are
    // published yet, so this links to the pricing answer in the FAQ.
    title: 'Illustration Pricing',
    body: 'Starting prices and package options for self-published authors.',
    href: '#faq',
  },
  {
    title: 'Animation Services',
    body: 'Turn your illustrated book into short videos or animated promos.',
    href: '#marketing',
  },
]

export type MediaLogo = {
  name: string
  src: string
  width: number
  height: number
}

/** Logos cropped from the "Get featured & amplify your success" reference. Outreach targets only. */
export const mediaLogos: MediaLogo[] = [
  { name: 'Business Insider', src: businessInsider, width: 202, height: 63 },
  { name: 'Los Angeles Times', src: losAngelesTimes, width: 218, height: 26 },
  { name: 'Entrepreneur', src: entrepreneur, width: 219, height: 42 },
  { name: 'TED', src: ted, width: 168, height: 61 },
  { name: 'The Wall Street Journal', src: wsj, width: 112, height: 60 },
  { name: 'Inc.', src: inc, width: 182, height: 62 },
]

export type Feature = Point & {
  icon: 'launch' | 'royalty' | 'readers' | 'ownership' | 'charges' | 'support'
  /**
   * Set when the reference states a guarantee or business policy that Children Book
   * has not confirmed yet. The page marks these until `confirmed` is set to true.
   */
  claim?: { confirmed: boolean; note: string }
}

/** Features section — transcribed from the reference screenshot, with grammar corrected. */
export const features: Feature[] = [
  {
    icon: 'launch',
    title: 'Rejection-Proof Launch',
    body: 'We guarantee a rejection-free, smooth publication process for our clients.',
    claim: { confirmed: false, note: 'Publication guarantee' },
  },
  {
    icon: 'royalty',
    title: '100% Royalty-Free',
    body: 'Keep every penny of your earnings. We never take a cut of your profits.',
    claim: { confirmed: false, note: 'Royalty policy' },
  },
  {
    icon: 'readers',
    title: 'Worldwide Readership',
    body: 'Share your stories with readers around the world and reach new audiences.',
  },
  {
    icon: 'ownership',
    title: '100% of Your Ownership',
    body: 'Enjoy complete rights to your published book, because it is solely yours.',
    claim: { confirmed: false, note: 'Rights policy' },
  },
  {
    icon: 'charges',
    title: 'No Hidden Charges',
    body: 'There are no surprise charges. Pay once and receive your services without extra payments.',
    claim: { confirmed: false, note: 'Pricing policy' },
  },
  {
    icon: 'support',
    title: '24/7 Client Support',
    body: 'Day or night, our team is available for prompt assistance.',
    claim: { confirmed: false, note: 'Support hours' },
  },
]

export type StyleSample = {
  name: string
  note: string
  artwork: Artwork
}

export const styles: StyleSample[] = [
  { name: 'Cartoon', note: 'Bold outlines and bright, friendly color.', artwork: artwork.styleCartoon },
  { name: 'Watercolor', note: 'Soft edges and gentle washes of color.', artwork: artwork.styleWatercolor },
  { name: 'Flat and minimal', note: 'Simple shapes for clean, modern books.', artwork: artwork.styleFlat },
  { name: 'Comic book', note: 'Heavy lines and energetic backgrounds.', artwork: artwork.styleComic },
  { name: 'Line art', note: 'Pencil drawings that suit coloring books.', artwork: artwork.styleLineArt },
  { name: 'Soft 3D', note: 'Rounded forms with light and depth.', artwork: artwork.styleSoft3d },
]

export const characterPoints: Point[] = [
  {
    title: 'The same face on every page',
    body: 'Eyes, hair, and proportions stay consistent from the first scene to the last.',
  },
  {
    title: 'Outfits that stay on model',
    body: 'Clothing and colors only change when your story calls for it.',
  },
  {
    title: 'A full range of feelings',
    body: 'Happy, sad, angry, surprised: expressions change while the character stays recognizable.',
  },
]

export type BookType = Point & {
  artwork: Artwork
}

export const bookTypes: BookType[] = [
  {
    title: 'Storybooks',
    body: 'Full-page scenes and double-page spreads that carry the story.',
    artwork: artwork.pageStory,
  },
  {
    title: 'Coloring books',
    body: 'Clean line drawings with simple shapes, ready to print.',
    artwork: artwork.pageColoring,
  },
  {
    title: 'Activity books',
    body: 'Mazes, matching games, and learning pages built around your characters.',
    artwork: artwork.pageMaze,
  },
]

export type ProcessStep = Point & {
  icon: 'concept' | 'illustration' | 'editing' | 'formatting' | 'cover' | 'publishing'
}

/** Six-step book creation process — transcribed from the reference screenshot. */
export const processSteps: ProcessStep[] = [
  {
    icon: 'concept',
    title: 'Concept Outline, Report & Research',
    body: 'We explore your story, characters, and vision to plan the right direction for your book.',
  },
  {
    icon: 'illustration',
    title: 'Illustration Design',
    body: 'Our artists bring your characters and scenes to life with colorful, child-friendly illustrations.',
  },
  {
    icon: 'editing',
    title: 'Editing and Proofreading',
    body: 'Our editors refine each page for clarity, consistency, and a natural storytelling voice.',
  },
  {
    icon: 'formatting',
    title: 'Book Formatting',
    body: 'We arrange text and illustrations into a beautiful, easy-to-read book layout.',
  },
  {
    icon: 'cover',
    title: 'Book Cover Design',
    body: 'We create an eye-catching cover that captures your story and invites young readers inside.',
  },
  {
    icon: 'publishing',
    title: 'Book Publishing',
    body: 'We prepare your finished book for print and digital publishing, ready to reach young readers.',
  },
]

export const publishingFormats = ['Paperback', 'Hardcover', 'eBook']

export const publishingPlatforms = ['Amazon KDP', 'IngramSpark', 'Apple Books', 'Barnes & Noble', 'Kobo', 'Google Play Books']

export const publishingSupport = [
  'Editing and proofreading',
  'Interior layout and typography',
  'Print-ready and eBook files',
  'ISBN and copyright guidance',
  'Titles, descriptions, and categories',
  'Author account setup',
]

export const marketingSupport = [
  'Amazon listing optimization',
  'Amazon A+ Content',
  'Amazon advertising support',
  'Author branding',
  'Author websites',
  'Social media marketing',
  'Book trailers and animated videos',
  'Launch and series planning',
]

export const reasons: Point[] = [
  {
    title: 'One team for the whole book',
    body: "Illustration, editing, design, publishing, and marketing happen in one place, so you don't have to coordinate separate freelancers.",
  },
  {
    title: "Focused on children's books",
    body: 'We work on books for young readers, with attention to age group, emotion, and visual storytelling.',
  },
  {
    title: 'A coordinator who keeps you informed',
    body: 'A dedicated project manager shares progress and answers your questions at every stage.',
  },
  {
    title: 'You approve each stage',
    body: 'Sketches, pages, and files are reviewed with you before the project moves forward.',
  },
  {
    title: 'An agreed scope and schedule',
    body: 'Your project follows a written scope and timeline, so you always know what comes next.',
  },
  {
    title: 'Support after publication',
    body: 'We can help with marketing, author branding, and planning your next book or series.',
  },
]

export const faqs: Point[] = [
  {
    title: 'What do I need to get started?',
    body: 'A manuscript or a short summary of your story is enough. Notes on your characters, the age group you are writing for, and any styles you like will help us plan the right approach.',
  },
  {
    title: 'Can I hire you only for illustration?',
    body: 'Yes. Illustration, publishing, and marketing can each be booked on their own, or combined into one managed project.',
  },
  {
    title: 'Which illustration styles do you offer?',
    body: 'We work in cartoon, watercolor, flat, comic book, line art, and soft 3D styles, among others. We can help you choose the style that fits your story and readers.',
  },
  {
    title: 'Will I see the work before it is finished?',
    body: 'Yes. You review and approve each stage, from character sketches to final files, before the next stage begins.',
  },
  {
    title: 'Can you prepare my book for Amazon KDP and IngramSpark?',
    body: 'Yes. We format print and eBook files to each platform’s requirements and can help set up your listings.',
  },
  {
    title: 'How is a project priced?',
    body: 'Every book is different. After we understand your page count, illustration needs, and services, we send a proposal with the scope and schedule.',
  },
  {
    title: 'Do you work with authors outside the US and UK?',
    body: 'Our focus is authors in the United States and the United Kingdom, and we are happy to talk with authors elsewhere.',
  },
  {
    title: 'Can you help after my book is published?',
    body: 'Yes. We offer marketing, author branding, and support for future books or a series.',
  },
]

export const sampleChecklist = [
  'Your manuscript, or a short summary of the story',
  'Notes on your main characters',
  'The age group you are writing for',
  'Any illustration styles you like',
]
