import advertising480 from '../assets/marketing/advertising-types-480.webp'
import advertising735 from '../assets/marketing/advertising-types-735.webp'
import brandBoard480 from '../assets/marketing/brand-identity-board-480.webp'
import brandBoard736 from '../assets/marketing/brand-identity-board-736.webp'
import brandReelPoster from '../assets/marketing/brand-website-reel-poster.webp'
import brandReel from '../assets/marketing/brand-website-reel.mp4'
import toolkitPoster from '../assets/marketing/content-toolkit-poster.webp'
import toolkit from '../assets/marketing/content-toolkit.mp4'
import coverReelPoster from '../assets/marketing/cover-design-reel-poster.webp'
import coverReel from '../assets/marketing/cover-design-reel.mp4'
import webPage480 from '../assets/marketing/illustrated-web-page-480.webp'
import webPage736 from '../assets/marketing/illustrated-web-page-736.webp'
import story480 from '../assets/marketing/market-your-story-480.webp'
import story736 from '../assets/marketing/market-your-story-736.webp'
import workbook1200 from '../assets/marketing/promotion-workbook-tablets-1200.webp'
import workbook640 from '../assets/marketing/promotion-workbook-tablets-640.webp'
import site1Poster from '../assets/marketing/website-sample-1-poster.webp'
import site1 from '../assets/marketing/website-sample-1.mp4'
import site2Poster from '../assets/marketing/website-sample-2-poster.webp'
import site2 from '../assets/marketing/website-sample-2.mp4'
import site3Poster from '../assets/marketing/website-sample-3-poster.webp'
import site3 from '../assets/marketing/website-sample-3.mp4'
import site4Poster from '../assets/marketing/website-sample-4-poster.webp'
import site4 from '../assets/marketing/website-sample-4.mp4'
import type { StyleImage, StyleVideoAsset } from './illustrationStyles'

/*
 * Book Marketing page content. Media comes only from public/book marketing/ (web copies built by
 * scripts/optimize_marketing.py). The supplied introduction and benefit wording from
 * "Childrens Brand Replica (5).docx" is kept exactly. No results, rankings, sales or reviews are promised.
 */

const set = (...pairs: [string, number][]) => pairs.map(([src, w]) => `${src} ${w}w`).join(', ')

// ---------------------------------------------------------------- Hero

export type PillarIcon = 'discover' | 'identity' | 'engage' | 'launch'
export type Pillar = { title: string; body: string; icon: PillarIcon }

/** Top-left, top-right, bottom-left, bottom-right on desktop. */
export const pillars: Pillar[] = [
  { icon: 'discover', title: 'Discoverability', body: 'Listings, keywords and categories that help parents and teachers find your book.' },
  { icon: 'identity', title: 'Author Identity', body: 'A recognizable look and voice that carries across your books, website and posts.' },
  { icon: 'engage', title: 'Audience Engagement', body: 'Content that gives families, educators and young readers a reason to stay in touch.' },
  { icon: 'launch', title: 'Launch Momentum', body: 'A planned launch, and a plan for the weeks after it, so interest keeps building.' },
]

export const heroIntro =
  'Marketing support built for children’s authors: we help your book reach the parents, educators and young readers it was written for, from the first listing to the months after launch.'

// ---------------------------------------------------------------- Introduction (supplied wording, unchanged)

export const introHeading = ['You Put Your Heart Into Writing The Book.', 'The Real Challenge Starts After Publishing.'] as const
export const introLead =
  "Most authors don't struggle because their story is not good. They struggle because they don't know how to make people notice it."
export const introQuestions = ['How do you reach parents?', 'How do you get discovered on Amazon?', 'How do you build momentum after launch?']
export const introAnswer = "We help answer those questions with a complete marketing approach built for children's authors."

export const beginningQuote = 'Publishing your book is only the beginning, getting it discovered is what truly matters.'
export const beginningBody =
  'We offer proven book marketing for authors, combining creative promotion with data-driven strategies. Whether you’re launching a new title, promoting a series, or wondering how I can market my newly published Kindle book, our tailored approach helps your book stand out.'

export const whyHeading = 'Why Choose Our Book Marketing Services?'
/** Each benefit split into its lead term (bold) and the rest of the supplied sentence. */
export const whyBenefits: [string, string][] = [
  ['Customized Book Promotion Services', ' for children’s authors'],
  ['Targeted Campaigns', ' across social media, Amazon, and online platforms'],
  ['Audience Engagement Strategies', ' focused on parents, educators, and young readers'],
  ['Amazon Book Marketing', ' to improve discoverability and rankings'],
  ['Results-Oriented Campaigns', ' designed to boost downloads, reviews, and sales'],
]

// ---------------------------------------------------------------- Services overview (document order, plus Website)

export const serviceIndex = [
  { id: 'amazon-book-marketing', title: 'Amazon Book Marketing' },
  { id: 'book-launch-campaigns', title: 'Book Launch Campaigns' },
  { id: 'author-branding', title: 'Author Branding' },
  { id: 'social-media-marketing', title: 'Social Media Marketing' },
  { id: 'book-promotion', title: 'Book Promotion' },
  { id: 'advertising-services', title: 'Advertising Services' },
  { id: 'content-creation', title: 'Content Creation' },
  { id: 'website', title: 'Website' },
] as const

// ---- 1. Amazon Book Marketing

export const coverReelVideo: StyleVideoAsset = {
  src: coverReel,
  label: 'A fantasy book cover being designed on a laptop, then shown as a printed hardcover',
  caption: '',
  poster: { src: coverReelPoster, width: 720, height: 1280 },
}

export const marketYourStoryImage: StyleImage = {
  src: story736,
  srcSet: set([story480, 480], [story736, 736]),
  width: 736,
  height: 970,
  alt: 'A hand holding an open book against a deep red background, under the words Publishing is just the start. Market your story. Reach more. Sell more.',
  caption: '',
}

export const amazonCopy = [
  'Amazon is where many parents and grandparents look for a children’s book, so the book page has to work hard. Shoppers judge a picture book in seconds, from a thumbnail cover, a title and the first lines of the description.',
  'We review how your book appears in search and on its product page, then improve the parts you control: the cover presentation, the description, the keywords and the categories it is listed in. Where it suits your goals, we also set up and manage Amazon ads.',
]
export const amazonPoints = [
  'Cover review at thumbnail size, where most shoppers first see it',
  'Descriptions written for the parents and teachers who choose children’s books',
  'Keyword and category research for your book’s age group and topic',
  'Amazon ad setup and monitoring, when advertising fits your plan',
]

// ---- 2. Book Launch Campaigns (no matching asset: text-led)

export const launchCopy =
  'A launch gives a new book its best chance to be noticed. We plan it in three stages, so the work before release day sets up the launch, and the work after it keeps the book in front of readers.'
export const launchStages: { stage: string; title: string; points: string[] }[] = [
  {
    stage: 'Before release',
    title: 'Prepare',
    points: ['Launch plan and timeline', 'Book page, description and keywords ready', 'Advance reader copies for early reviews', 'Cover reveal and announcement content'],
  },
  {
    stage: 'Launch week',
    title: 'Announce',
    points: ['Coordinated posts across your channels', 'Email to your readers and contacts', 'Launch ads, if they are part of the plan', 'Outreach to parenting and book communities'],
  },
  {
    stage: 'After launch',
    title: 'Sustain',
    points: ['Regular content that keeps the book visible', 'Review follow-up with early readers', 'Seasonal and school-calendar promotions', 'Adjustments based on what readers respond to'],
  },
]

// ---- 3. Author Branding

export const brandReelVideo: StyleVideoAsset = {
  src: brandReel,
  label: 'Scrolling through a nature-themed art website with gilded frames, leafy illustrations and matching serif lettering',
  caption: '',
  poster: { src: brandReelPoster, width: 702, height: 416 },
}

export const brandBoardImage: StyleImage = {
  src: brandBoard736,
  srcSet: set([brandBoard480, 480], [brandBoard736, 736]),
  width: 736,
  height: 1242,
  alt: 'A brand identity board in burgundy, black and gold: an ornate Holly Anne wordmark with a teacup illustration in an oval frame, a monogram seal, stationery, a folder and an envelope. Credited Brand by Muse & Misfit.',
  caption: '',
}

export const illustratedPageImage: StyleImage = {
  src: webPage736,
  srcSet: set([webPage480, 480], [webPage736, 736]),
  width: 736,
  height: 1306,
  alt: 'A long illustrated web page: a painted open scrapbook in a meadow, a row of polaroid-style pictures, flowers and hand-lettered headings in Russian, all in one warm, consistent style',
  caption: '',
}

export const brandingCopy = [
  'Your author brand is how readers recognize you before they open a book: your name lettering, colors, illustration style and the way you speak to families. When it stays consistent, every new title builds on the last.',
  'We define those elements and apply them to the places readers meet you, from book covers and bookmarks to social profiles and your website. The examples here show the idea: one palette, one type style and one illustration language, carried across every piece.',
]
export const brandingPoints = ['Author name logo and lettering', 'Color palette and typography', 'Brand guide for consistent use', 'Social profile and banner designs', 'Bookmarks, stationery and event materials']

// ---- 4. Social Media Marketing (the nine supplied slides of one sample case study, in story order)

/** All social slide web copies, keyed by path, e.g. "../assets/marketing/social-03-problem-736.webp". */
const socialFiles = import.meta.glob<string>('../assets/marketing/social-*.webp', { eager: true, import: 'default' })
const socialFile = (name: string, width: number) => {
  const file = socialFiles[`../assets/marketing/social-${name}-${width}.webp`]
  if (!file) throw new Error(`Missing social slide: ${name}-${width}`)
  return file
}
const socialSlide = (name: string, alt: string): StyleImage => ({
  src: socialFile(name, 736),
  srcSet: set([socialFile(name, 480), 480], [socialFile(name, 736), 736]),
  width: 736,
  height: 920,
  alt,
  caption: '',
})

export const socialCopy = [
  'Parents, teachers and librarians share book recommendations every day on social media. We help you take part in those conversations with a consistent presence and posts people want to save and share.',
  'The nine slides below come from one complete sample case study for a retail brand. Read in order, they show the stages of the work we deliver: understanding the brand and its problem, planning and producing the ad creative, then reporting on what happened and what it means.',
]

export type SocialStage = { title: string; deliverable: string; body: string; next?: string; image: StyleImage }
export type SocialPhase = { title: string; summary: string; stages: SocialStage[] }

export const socialPhases: SocialPhase[] = [
  {
    title: 'Brief and audit',
    summary: 'Who the brand is, what it needs and what is holding it back.',
    stages: [
      {
        title: 'Case study overview',
        deliverable: 'Cover slide',
        body: 'The cover frames the whole story in one line: how strategic ad creative helped an e-commerce brand, with the headline result stated up front.',
        next: 'Next, it introduces the client.',
        image: socialSlide('01-case-study', 'Cover slide in a beige folder: Current Client Case Study, 4.5x ROAS, how strategic ad creative helped generate a 4.5x return on ad spend for an e-commerce brand'),
      },
      {
        title: 'The client',
        deliverable: 'Client and goal brief',
        body: 'A retail brand with strong products and a clear audience, whose social media was not yet working as a sales channel. The goal: strengthen how the brand shows up online and create ads that move people closer to buying.',
        next: 'With the goal set, the next step is to pin down the problem.',
        image: socialSlide('02-client', 'Slide headed The Client, retail industry: a retail e-commerce brand that struggled to make social media a real sales channel, with two photographs of people in streetwear'),
      },
      {
        title: 'The problem',
        deliverable: 'Content audit',
        body: 'The audit found content too similar to competitors, not enough of it, and product presentation that needed to feel more intentional. The slide sums it up: the content was not distinct enough in a crowded category.',
        next: 'The problem shapes the creative approach.',
        image: socialSlide('03-problem', 'Slide headed The Problem: the brand’s social presence did not match the quality of its products and the content felt too similar to competitors, above a grid of circles with one filled in'),
      },
    ],
  },
  {
    title: 'Creative strategy and production',
    summary: 'The plan for the ads, the creative itself and the campaign that ran.',
    stages: [
      {
        title: 'Our approach',
        deliverable: 'Creative strategy',
        body: 'Instagram ad creative designed to make the products feel desirable, styled and easy to shop. Instead of plain product posts, the visuals show the pieces in context, as part of a lifestyle, with a clear path to purchase.',
        next: 'The strategy is then turned into finished ads.',
        image: socialSlide('04-approach', 'Slide headed Our Approach: Instagram ad creative designed to make products feel more desirable, styled and easy to shop, with three small ad images'),
      },
      {
        title: 'What made the ads work',
        deliverable: 'Ad creative',
        body: 'The finished ads were built around more than the product: clear, desirable visuals that stop the scroll and give people enough confidence to click through. Three ad examples sit at the foot of the slide.',
        next: 'The ads then run as a campaign.',
        image: socialSlide('05-ads-work', 'Slide headed What Made the Ads Work: creative that made the clothing feel clear, desirable and easy to act on, with three ad images'),
      },
      {
        title: 'Campaign snapshot',
        deliverable: 'Campaign summary',
        body: 'The campaign at a glance: purchase-focused Instagram ads run over the first 90 days, with the spend, tracked sales and return stated plainly on one page.',
        next: 'The results are then put in context.',
        image: socialSlide('06-snapshot', 'Slide headed Campaign Snapshot: purchase-focused Instagram ads over 90 days, $2.7K ad spend, $12.1K tracked sales, 4.5x return on ad spend, above a billboard of three T-shirts'),
      },
    ],
  },
  {
    title: 'Reporting and next steps',
    summary: 'What the numbers mean, the detail behind them and the lesson to carry forward.',
    stages: [
      {
        title: 'Why this result matters',
        deliverable: 'Benchmark comparison',
        body: 'A result means more next to a yardstick. This slide compares the campaign’s return with common e-commerce and Meta ad benchmarks in a simple bar chart.',
        next: 'Next comes the detail behind the headline.',
        image: socialSlide('07-result', 'Slide headed Why This Result Matters, comparing the campaign’s 4.5x return on ad spend with common 2x to 3x benchmarks in a bar chart'),
      },
      {
        title: 'The business impact',
        deliverable: 'Campaign reporting summary',
        body: 'What the campaign meant for the business, backed by per-ad metric cards: views, reach, engagement, purchases, cost per purchase, placements, duration and spend, labeled as an internal reporting summary.',
        next: 'Finally, the takeaway for future content.',
        image: socialSlide('08-impact', 'Slide headed The Business Impact, with five pinned cards of per-ad metrics such as views, purchases, reach, engagement and spend, marked internal campaign reporting summary'),
      },
      {
        title: 'Your creative should be working harder',
        deliverable: 'Key takeaway',
        body: 'The closing message: social creative should build desire, strengthen perception and give people a reason to act. When strategy and visuals line up, content becomes a sales driver, which is where the next campaign begins.',
        image: socialSlide('09-creative', 'Slide headed Your Creative Should Be Working Harder, with photographs pinned around the text'),
      },
    ],
  },
]

export const socialNote =
  'These slides are a sample case study for a retail clothing brand, shown to illustrate the format and stages of the work. The figures on them belong to that sample; they are not results we promise or a forecast for your book.'
export const socialPoints = ['Platform choice based on where your readers are', 'Monthly content calendar', 'Post, carousel and short-video designs', 'Captions and hashtags written for your audience', 'Community replies and engagement support']

// ---- 5. Book Promotion

export const workbookImage: StyleImage = {
  src: workbook1200,
  srcSet: set([workbook640, 640], [workbook1200, 1200]),
  width: 1200,
  height: 1800,
  alt: 'A grid of tablets showing a branded workbook in lavender, cream and black: cover, welcome page, contents, workshop page, author introduction and a Join our community page',
  caption: '',
}

export const promotionCopy = [
  'Promotion keeps a book in front of new readers long after launch day. We combine outreach, reader incentives and promotional materials into a plan that suits your book and your budget.',
  'Branded materials like the workbook shown give readers something of value and keep your name with them: a downloadable activity pack, a teacher’s guide or a reading journal can introduce your book to classrooms and families.',
]
export const promotionPoints = [
  'Free and discounted ebook promotions',
  'Outreach to book bloggers, reviewers and parenting sites',
  'School, library and bookstore event materials',
  'Downloadable activity packs and teacher guides',
  'Newsletter sign-up offers and reader giveaways',
]

// ---- 6. Advertising Services (follows the six types in the supplied mockup)

export const advertisingImage: StyleImage = {
  src: advertising735,
  srcSet: set([advertising480, 480], [advertising735, 735]),
  width: 735,
  height: 836,
  alt: 'Types of Advertising: six pencil-sketch icons labeled Social, Display, Search, Native, Retargeting and Video',
  caption: '',
}

export const advertisingCopy =
  'Paid advertising puts your book in front of readers who would not find it on their own. We choose the formats that suit your book and budget, write and design the ads, and review results regularly so spending goes where it works best.'
export const advertisingTypes: { title: string; body: string }[] = [
  { title: 'Social', body: 'Ads on Facebook and Instagram, aimed at parents, grandparents and educators by interest and age group.' },
  { title: 'Display', body: 'Image ads on websites and apps that families and teachers visit.' },
  { title: 'Search', body: 'Ads that appear when people search for books like yours on Amazon or Google.' },
  { title: 'Native', body: 'Sponsored articles and listings that match the look of the site they appear on.' },
  { title: 'Retargeting', body: 'Reminders shown to people who visited your book page or website but did not act yet.' },
  { title: 'Video', body: 'Short trailers and clips for social feeds and video platforms.' },
]

// ---- 7. Content Creation

export const toolkitVideo: StyleVideoAsset = {
  src: toolkit,
  label: 'Content Creation Toolkit: a tripod, phone, mirrorless camera, wireless microphone and editing, email, SEO and research apps',
  caption: '',
  poster: { src: toolkitPoster, width: 720, height: 900 },
}

export const contentCopy = [
  'Good marketing needs a steady supply of material: posts, videos, articles and emails that keep your book in conversation. We plan and produce that content in your brand style, so you can focus on writing.',
  'As the toolkit shows, it takes more than one tool: filming and photography, editing, research, search optimization and email all play a part. We bring them together for you.',
]
export const contentPoints = [
  'Social posts and short videos',
  'Book trailers and animated clips',
  'Blog articles and author interviews',
  'Email newsletters',
  'Illustrated quote cards and activity printables',
  'Press releases for launches and events',
]

// ---- 8. Website

export const websiteCopy = [
  'Your website is the one place online that is fully yours. It is where readers, parents, teachers and event organizers go to learn about you and your books, so it should be easy to read and easy to find your way around.',
  'We design author websites around four things: presenting each book clearly with its cover, description and where to find it; telling your story on an About the Author page; showing news, events and school visits; and a simple menu that gets visitors to what they want in a click or two.',
]

export type WebsiteSample = { video: StyleVideoAsset; title: string; body: string }

/** The four supplied samples. Descriptions describe only what each video shows. */
export const websiteSamples: WebsiteSample[] = [
  {
    video: {
      src: site1,
      label: 'Website sample 1: a bright, minimal layout with one featured item, a large title and a side category menu',
      caption: '',
      poster: { src: site1Poster, width: 720, height: 540 },
    },
    title: 'Bright, gallery-style presentation',
    body: 'One featured item at a time on a clean white backdrop, with a large name beneath it and a short category list at the side. The tour moves from the featured view to a detail page and then to a tidy grid. For an author, the same structure gives each book its own spotlight, a page for its details and a clear overview of the whole series.',
  },
  {
    video: {
      src: site2,
      label: 'Website sample 2: a dark layout with a large central image, a bold title, one call-to-action button and thumbnails',
      caption: '',
      poster: { src: site2Poster, width: 720, height: 540 },
    },
    title: 'Bold feature page with one clear action',
    body: 'A dark, dramatic page where a single large image carries the design: a bold title on one side, one clearly marked button, and thumbnails to switch between items. Applied to a new release, the cover takes center stage with a short hook, one obvious next step for readers, and the rest of your books a click away.',
  },
  {
    video: {
      src: site3,
      label: 'Website sample 3: a black page with a white sculpture, an elegant display title and a short about section',
      caption: '',
      poster: { src: site3Poster, width: 684, height: 414 },
    },
    title: 'Quiet, image-led storytelling',
    body: 'A restrained black page built around one striking image, an elegant display title and a short About section beside it. Nothing competes with the artwork. An author site can use the same restraint for an About the Author page or a featured illustration, letting the art and the voice of the book set the tone.',
  },
  {
    video: {
      src: site4,
      label: 'Website sample 4: an immersive opening through detailed nature imagery that leads into labeled content on a white panel',
      caption: '',
      poster: { src: site4Poster, width: 740, height: 460 },
    },
    title: 'Immersive opening, clear information',
    body: 'An opening that travels through layered, detailed imagery before settling into clearly labeled content blocks on a clean white panel. It shows how a site can create atmosphere and still lead visitors to plain, readable information. For a children’s book, the opening can step into the world of the story before guiding families to the books and the author.',
  },
]

export const websiteApproach = {
  title: 'Designed around your books, not a template',
  body: [
    'A template is made to suit many different kinds of business. We design for one author. The colors, characters and illustration style already in your books shape the look, and the pages are planned around what your visitors come to do: find your books, learn about you and see what is coming next.',
    'Every site is built to adapt to phones, tablets and desktops, with readable text, clear headings and a menu that stays simple as your list of books grows.',
  ],
}

// ---------------------------------------------------------------- Detailed Amazon Book Marketing

export const amazonDetailPurpose = 'Help authors improve their presence on Amazon.'

export type AmazonCard = { title: string; body: string; points: string[]; icon: 'listing' | 'aplus' | 'ads' | 'page' }

export const amazonCards: AmazonCard[] = [
  {
    icon: 'listing',
    title: 'Amazon Listing Optimization',
    body: 'Your listing is the information Amazon uses to decide when to show your book, and what shoppers read before they choose it. We review each part and refine it for the readers you want to reach.',
    points: ['Book title analysis', 'Description writing', 'Keyword research', 'Category selection', 'Backend keyword setup'],
  },
  {
    icon: 'aplus',
    title: 'Amazon A+ Content',
    body: 'A+ Content adds images and formatted sections to your book page, below the main description. It is especially useful for children’s books, where the illustrations are a big part of the appeal.',
    points: ['Enhanced book description', 'Author section', 'Visual content', 'Comparison sections'],
  },
  {
    icon: 'ads',
    title: 'Amazon Advertising Support',
    body: 'Amazon ads can place your book in search results and on related book pages. We set up campaigns, choose what to target and keep watching the numbers, so the budget goes to what performs.',
    points: ['Campaign setup', 'Keyword targeting', 'Ad monitoring', 'Performance improvement'],
  },
  {
    icon: 'page',
    title: 'Book Page Improvement',
    body: 'When visitors reach your book page but do not buy, something on the page may be holding them back. We look at it the way a parent would and suggest clear, practical changes.',
    points: ['Cover review', 'Description improvement', 'Category research', 'Conversion improvement suggestions'],
  },
]

// ---------------------------------------------------------------- Final reference sections (document's last four images)

/**
 * Reference 1 (docx image6): "What’s Included in Our Professional Book Marketing Services?" Twelve tiles in
 * the reference; "Celebrity Endorsement" and "New York Times Square Billboard" are left out because they
 * are not services we can support.
 */
export type IncludedIcon = 'social' | 'seo' | 'ppc' | 'podcast' | 'logo' | 'trailer' | 'press' | 'fair' | 'platform' | 'animation'
export const includedHeading = 'What’s Included in Our Professional Book Marketing Services?'
export const includedServices: { title: string; body: string; icon: IncludedIcon }[] = [
  { icon: 'social', title: 'Social Media Marketing', body: 'Planned posts and campaigns on the platforms your readers use.' },
  { icon: 'seo', title: 'Search Engine Optimization', body: 'Website and listing wording that helps search engines match your book to readers.' },
  { icon: 'ppc', title: 'Google & Amazon PPC', body: 'Pay-per-click ads on Google and Amazon, set up and monitored.' },
  { icon: 'podcast', title: 'Podcast Interview', body: 'Help preparing for and pitching podcast interviews about your book.' },
  { icon: 'logo', title: 'Author Logo & Website', body: 'A name logo and a website that present you and your books.' },
  { icon: 'trailer', title: 'Video Book Trailer', body: 'A short trailer that introduces your story and illustrations.' },
  { icon: 'press', title: 'Press Release Distribution', body: 'A written release for your launch or event, sent to relevant outlets.' },
  { icon: 'fair', title: 'Book Fair Participation', body: 'Materials and planning for showing your book at book fairs.' },
  { icon: 'platform', title: 'Platform Promotion', body: 'Your book presented on reader and review platforms.' },
  { icon: 'animation', title: 'Children’s Book Animation', body: 'Animated scenes from your illustrations for trailers and posts.' },
]

/**
 * Reference 2 (docx image5): the "Book Marketing" platform cards. Third-party logos are not reproduced, and
 * the reference's dated user figures are dropped. Google+ (closed in 2019) is left out; Twitter is now X.
 */
export type PlatformIcon = 'pinterest' | 'facebook' | 'goodreads' | 'x' | 'librarything' | 'bookclub' | 'readers'
export const marketingPlatforms: { title: string; body: string; icon: PlatformIcon }[] = [
  {
    icon: 'pinterest',
    title: 'Pinterest',
    body: 'A website where people save and share images, such as photos, book covers and videos. Pins of your cover, illustrations and activity pages can link back to your book or website.',
  },
  {
    icon: 'facebook',
    title: 'Facebook Marketing',
    body: 'An online social network with a large audience of parents and grandparents. Author pages, reading groups and targeted ads help a children’s book reach families.',
  },
  {
    icon: 'goodreads',
    title: 'Goodreads',
    body: 'An Amazon company and “social cataloging” website where readers track, rate and review books. A complete author profile and book page help readers find and follow you.',
  },
  {
    icon: 'x',
    title: 'X (formerly Twitter)',
    body: 'A service for short public posts, useful for connecting with teachers, librarians and other children’s authors, and for sharing launch news.',
  },
  {
    icon: 'librarything',
    title: 'LibraryThing',
    body: 'A book-cataloging community along the same lines as Goodreads, used by keen readers and librarians. Listing your book there gives readers another place to discover it.',
  },
  {
    icon: 'bookclub',
    title: 'Online Book Clubs',
    body: 'Sites where readers find new titles and sample chapters from emerging authors. Sharing a sample lets readers try your book before they look for it.',
  },
  {
    icon: 'readers',
    title: 'Readers’ Favorite',
    body: 'A book review and award contest site that offers book reviews and other features for authors. We help you prepare your book’s details for submission.',
  },
]
export const platformsNote =
  'Each platform sets its own rules and these change over time, so we follow their current guidelines. We are not affiliated with these companies, and no platform guarantees reviews or placement.'

/**
 * Reference 4 (docx image4): "Features" and "Services for Authors and Publishers". Left out: payment terms,
 * lifetime ownership, included domain and hosting, 24/7 assistance (not services we state), Google+ (closed)
 * and the other studio’s pricing line and email address.
 */
export const websiteFeatures = [
  'Easy to use and maintain',
  'Easy to promote on all social media websites',
  'Direct links to your book on Amazon and other bookstores',
]
export const authorServicesIntro = 'We can help you if:'
export const authorServices = [
  'You need a website where you can show your latest books and brand yourself.',
  'You already have a website, but it’s difficult to manage.',
  'You don’t want another website, but you need someone to do regular updates.',
  'You’d like to shift your website to the WordPress platform so that you can do updates yourself.',
  'You’d like to create and implement a marketing plan for your book.',
  'You want social media campaigns, including newsletters, Facebook, blogs and articles.',
]
