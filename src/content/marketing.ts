import advertising480 from '../assets/marketing/advertising-types-480.webp'
import ecosystemPoster from '../assets/marketing/amazon-ecosystem-poster.webp'
import ecosystem from '../assets/marketing/amazon-ecosystem.mp4'
import amazonBoard480 from '../assets/marketing/amazon-marketing-board-480.webp'
import amazonBoard735 from '../assets/marketing/amazon-marketing-board-735.webp'
import aplus1x640 from '../assets/marketing/aplus-01-process-640.webp'
import aplus1x970 from '../assets/marketing/aplus-01-process-970.webp'
import aplus2x640 from '../assets/marketing/aplus-02-inside-pages-640.webp'
import aplus2x970 from '../assets/marketing/aplus-02-inside-pages-970.webp'
import aplus3x640 from '../assets/marketing/aplus-03-series-640.webp'
import aplus3x970 from '../assets/marketing/aplus-03-series-970.webp'
import aplus4x640 from '../assets/marketing/aplus-04-lesson-preview-640.webp'
import aplus4x970 from '../assets/marketing/aplus-04-lesson-preview-970.webp'
import aplus5x640 from '../assets/marketing/aplus-05-contents-640.webp'
import aplus5x970 from '../assets/marketing/aplus-05-contents-970.webp'
import advertising735 from '../assets/marketing/advertising-types-735.webp'
import brandBoard480 from '../assets/marketing/brand-identity-board-480.webp'
import brandBoard736 from '../assets/marketing/brand-identity-board-736.webp'
import brandReelPoster from '../assets/marketing/brand-website-reel-poster.webp'
import brandReel from '../assets/marketing/brand-website-reel.mp4'
import toolkitPoster from '../assets/marketing/content-toolkit-poster.webp'
import toolkit from '../assets/marketing/content-toolkit.mp4'
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

export const marketYourStoryImage: StyleImage = {
  src: story736,
  srcSet: set([story480, 480], [story736, 736]),
  width: 736,
  height: 970,
  alt: 'A hand holding an open book against a deep red background, under the words Publishing is just the start. Market your story. Reach more. Sell more.',
  caption: '',
}

export const amazonIntro = [
  'For many families, a new picture book is found on Amazon: a parent searching for a bedtime story, a grandparent choosing a birthday gift, a teacher filling a classroom shelf. Each of them decides from a small cover, a title and the few lines they read while scrolling on a phone.',
  'We help children’s authors make those moments count. We look at how your book is presented on its page, how easily the right shoppers can find it through search and categories, and whether advertising suits it at all, then build a plan around your book, your readers and your budget.',
]

export const amazonFocus: { title: string; body: string }[] = [
  { title: 'Presentation', body: 'A cover, description and A+ Content that show an adult what the book is, who it is for and why a child will enjoy it.' },
  { title: 'Discoverability', body: 'Keywords and categories that follow how families really search: by age, topic, occasion and reading level.' },
  { title: 'Advertising approach', body: 'Sponsored ads used deliberately, with an agreed budget and a clear goal, never simply switched on and left running.' },
]

export const ecosystemVideo: StyleVideoAsset = {
  src: ecosystem,
  label:
    'Amazon’s smile logo drawn on a cream background, then appearing across its services: a Prime delivery van, grocery produce, Prime signage, an animated sky, a shopping tag, an Alexa+ stage event, a Kindle, and Prime Video and Amazon Music screens',
  caption: 'Amazon’s own brand animation: one smile across delivery, groceries, devices, music and streaming.',
  poster: { src: ecosystemPoster, width: 720, height: 900 },
}

export const campaignIntro =
  'The animation here follows Amazon’s smile across delivery vans, groceries, devices, music and streaming, a reminder of how much of a family’s shopping and screen time runs through one company. Sponsored ads can place a book inside that flow, in search results and on the pages of related titles. Whether they help depends on how carefully the campaign is run.'

export const campaignSteps: { title: string; body: string }[] = [
  {
    title: 'Campaign setup',
    body: 'We choose the campaign types that fit your book, usually starting with sponsored product ads, and agree a daily budget and goal you are comfortable with. Campaigns are organized by format and audience so the results are easy to read.',
  },
  {
    title: 'Targeting',
    body: 'Search terms that parents and teachers type, such as an age range, a theme or an occasion, plus comparable children’s titles whose pages your book can appear on. Searches that do not match the book are excluded.',
  },
  {
    title: 'Monitoring',
    body: 'Impressions, clicks, spend and orders are reviewed on a regular schedule, looking for search terms that use budget without results and those that are quietly working.',
  },
  {
    title: 'Ongoing refinement',
    body: 'Bids shift toward what performs, weak keywords are paused and new ones tested, and seasonal moments such as back-to-school or the holidays are planned ahead. You receive a plain-language note of what changed and why.',
  },
]

export const amazonBoardImage: StyleImage = {
  src: amazonBoard735,
  srcSet: set([amazonBoard480, 480], [amazonBoard735, 735]),
  width: 735,
  height: 701,
  alt: 'Illustration headed Amazon Marketing, with Amazon’s smile logo above a team of small figures stacking cardboard boxes marked with icons for analytics, settings, time, ideas and global reach, using a ladder and a lift',
  caption: '',
}

export const listingIntro =
  'Children rarely choose their own books. The page has to reassure the adult who is buying: is it right for this age, will it hold a child’s attention, is it worth the price? We review the listing piece by piece and fix whatever stands in the way.'

export const listingAreas: { title: string; body: string }[] = [
  {
    title: 'Listing review',
    body: 'Title, subtitle, series name, cover thumbnail, age range and the first preview pages, checked together the way a shopper sees them on a small screen.',
  },
  {
    title: 'Descriptions',
    body: 'A clear opening line, the heart of the story in a few sentences, and the details parents look for: age range, themes and what makes the book a good read-aloud.',
  },
  {
    title: 'Keyword research',
    body: 'Search terms drawn from how families actually look for books, such as “bedtime story for toddlers” or “picture book about starting school”, placed where Amazon reads them.',
  },
  {
    title: 'Category relevance',
    body: 'Categories chosen for accuracy as well as visibility, so the book is shown beside titles for the same age group and subject, where the right readers are already browsing.',
  },
]

export const aplusIntro = [
  'A+ Content is the set of designed image panels that sits below the description on an Amazon book page. Instead of one block of text, visitors scroll through visuals, which suits children’s books especially well: the artwork is often the strongest reason to buy, and A+ is where it can be shown large.',
  'Each panel has one job. Together they answer the questions a parent or teacher would otherwise have to guess at before deciding.',
]

export const aplusModules: { title: string; body: string }[] = [
  { title: 'Visual panels', body: 'Large artwork, interior spreads and character art that show the book’s style and quality at a glance.' },
  { title: 'Book highlights', body: 'The essentials made visible: age range, format and trim size, what a child will learn or enjoy, and how the pages are organized.' },
  { title: 'Author information', body: 'A short introduction to the author or illustrator, with a portrait, so families know who made the book.' },
  { title: 'Comparisons', body: 'Series and companion titles side by side, so readers can see how the books relate and where to start.' },
]

export const aplusSamplesIntro =
  'The five panels below come from one A+ set for a how-to-draw book series. Each is shown whole, as it appears on the book page. For a picture book, the same panels might feature a favorite spread, introduce the main characters, state the age range and themes, and set out the series in reading order.'

const aplusImage = (src640: string, src970: string, alt: string): StyleImage => ({
  src: src970,
  srcSet: set([src640, 640], [src970, 970]),
  width: 970,
  height: 600,
  alt,
  caption: '',
})

export type AplusSample = { kind: string; title: string; body: string; image: StyleImage }

export const aplusSamples: AplusSample[] = [
  {
    kind: 'Visual panel',
    title: 'From sketch to finished character',
    body: 'Four small frames trace one illustration from rough construction lines to clean line art and flat color, beside the finished, fully painted character. Before reading a word, a visitor sees what the book teaches and the standard it builds toward.',
    image: aplusImage(
      aplus1x640,
      aplus1x970,
      'A+ panel: four small frames showing one anime-style schoolgirl drawing at successive stages, rough sketch, refined pencil, clean line art and flat color, beside a large finished full-color version of the same character under cherry blossoms',
    ),
  },
  {
    kind: 'Book highlights',
    title: 'Inside the pages',
    body: 'Open spreads show the real interior layout, labeled with the method’s three stages: Analyzing, Sketching and Finishing. Two banners state the practical facts a buyer would otherwise ask about: step-by-step instructions, and a 7.5 × 9.25 inch trim size chosen for comfortable holding.',
    image: aplusImage(
      aplus2x640,
      aplus2x970,
      'A+ panel: two open interior spreads of step-by-step drawing exercises labeled Analyzing, Sketching and Finishing, with banners reading Step-by-step instructions for easier visualizing the process, and Smaller size 7.5 x 9.25 inches for better holding and reading experience',
    ),
  },
  {
    kind: 'Comparison',
    title: 'Two books, one series',
    body: 'Both titles stand side by side under a banner that introduces the series: a 30-day drawing guide for beginners and teachers, and a follow-on book about stylizing characters. Shoppers can see how the books relate and choose the right starting point.',
    image: aplusImage(
      aplus3x640,
      aplus3x970,
      'A+ panel: two hardcover books on a desk, How to Draw and Think Like a True Artist, a 30-day drawing guide for beginners and teachers, and How to Draw and Think: Stylizing Characters, under a banner reading New efficient way to learn with How to Draw and Think series',
    ),
  },
  {
    kind: 'Book highlights',
    title: 'What the lessons cover',
    body: 'Two stacked bands preview the progression inside: first the fundamentals of the human figure, with a proportion diagram and a short note on body structure, then a deliberately exaggerated pose with a tip on pushing it further. The panel shows that the book moves from rules to personal style.',
    image: aplusImage(
      aplus4x640,
      aplus4x970,
      'A+ panel in two bands: Learn the basics of drawing human figure, with a classical proportion diagram and a note that an adult body is typically 7 to 8 heads tall; and And learn how to break the rules to make more stylized characters, with a hunched, long-armed mannequin pose and a tip on exaggerating posture',
    ),
  },
  {
    kind: 'Key features',
    title: 'The contents at a glance',
    body: 'The cover of the second book sits beside a short list of what it covers: anatomy and shape language, cartoon, anime and semi-realistic drawing, and mixing styles. Readable in seconds, it confirms the book’s scope for a visitor who is close to deciding.',
    image: aplusImage(
      aplus5x640,
      aplus5x970,
      'A+ panel: the cover of How to Draw and Think: Stylizing Characters beside a list reading Basic anatomy and shape language, Drawing cartoon, Drawing anime, Drawing semi-realistic, Mixing styles, under the heading Learn to draw and think like a true master',
    ),
  },
]

export const amazonTrademarkNote =
  'Amazon, Kindle, A+ Content and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates. We are an independent service and are not affiliated with, endorsed by or sponsored by Amazon. Amazon alone decides search placement and rankings, so no result is guaranteed.'

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
  'The nine slides below come from one complete sample case study for a children’s book brand. Read in order, they show the stages of the work we deliver: understanding the brand and its problem, planning and producing the ad creative, then reporting on what happened and what it means.',
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
        body: 'The cover frames the whole story in one line: how strategic ad creative helped a children’s book brand sell online, with the headline result stated up front.',
        next: 'Next, it introduces the client.',
        image: socialSlide('01-case-study', 'Cover slide in a beige folder with a picture-book cover clipped to it: Current Client Case Study, 4.5x ROAS, how strategic ad creative helped generate a 4.5x return on ad spend for an e-commerce brand'),
      },
      {
        title: 'The client',
        deliverable: 'Client and goal brief',
        body: 'A children’s book brand with strong books and a clear audience of families, whose social media was not yet working as a sales channel. The goal: strengthen how the brand shows up online and create ads that move readers closer to buying.',
        next: 'With the goal set, the next step is to pin down the problem.',
        image: socialSlide('02-client', 'Slide headed The Client, retail industry: a retail e-commerce brand that struggled to make social media a real sales channel, with two illustrated children’s book covers clipped below the text'),
      },
      {
        title: 'The problem',
        deliverable: 'Content audit',
        body: 'The audit found content too similar to other children’s book brands, not enough of it, and book presentation that needed to feel more intentional. The slide sums it up: the content was not distinct enough in a crowded category.',
        next: 'The problem shapes the creative approach.',
        image: socialSlide('03-problem', 'Slide headed The Problem, with a children’s book cover pinned beside the title: the brand’s social presence did not match the quality of its products and the content felt too similar to competitors, above a grid of circles with one filled in'),
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
        body: 'Instagram ad creative designed to make the books feel desirable, inviting and easy to buy. Instead of plain cover posts, the visuals show the books in context, as part of family reading time, with a clear path to purchase.',
        next: 'The strategy is then turned into finished ads.',
        image: socialSlide('04-approach', 'Slide headed Our Approach: Instagram ad creative designed to make products feel more desirable, styled and easy to shop, with three children’s book covers as ad examples'),
      },
      {
        title: 'What made the ads work',
        deliverable: 'Ad creative',
        body: 'The finished ads were built around more than the cover: clear, desirable visuals that stop the scroll and give parents enough confidence to click through. Three ad examples sit at the foot of the slide.',
        next: 'The ads then run as a campaign.',
        image: socialSlide('05-ads-work', 'Slide headed What Made the Ads Work: creative that made the books feel clear, desirable and easy to act on, with activity-book and children’s book covers and a bar chart of 2x, 3.5x and a 4.5x client result'),
      },
      {
        title: 'Campaign snapshot',
        deliverable: 'Campaign summary',
        body: 'The campaign at a glance: purchase-focused Instagram ads run over the first 90 days, with the spend, tracked sales and return stated plainly on one page.',
        next: 'The results are then put in context.',
        image: socialSlide('06-snapshot', 'Slide headed Campaign Snapshot: purchase-focused Instagram ads over 90 days, $2.7K ad spend, $12.1K tracked sales, 4.5x return on ad spend, above three children’s book covers and a Shop Now button'),
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
        image: socialSlide('07-result', 'Slide headed Why This Result Matters, with a stack of children’s books, comparing the campaign’s 4.5x return on ad spend with common 2x to 3x benchmarks in a bar chart'),
      },
      {
        title: 'The business impact',
        deliverable: 'Campaign reporting summary',
        body: 'What the campaign meant for the business, backed by per-ad metric cards: views, reach, engagement, purchases, cost per purchase, placements, duration and spend, labeled as an internal reporting summary.',
        next: 'Finally, the takeaway for future content.',
        image: socialSlide('08-impact', 'Slide headed The Business Impact: the campaign drove the client’s strongest sales period since launching, above a row of five children’s book covers and a bar chart showing the 4.5x result against common benchmarks'),
      },
      {
        title: 'Your creative should be working harder',
        deliverable: 'Key takeaway',
        body: 'The closing message: social creative should build desire, strengthen perception and give people a reason to act. When strategy and visuals line up, content becomes a sales driver, which is where the next campaign begins.',
        image: socialSlide('09-creative', 'Slide headed Your Creative Should Be Working Harder, with children’s book covers pinned beside the title and arranged in a row above a bar chart'),
      },
    ],
  },
]

export const socialNote =
  'These slides are a sample case study for a children’s book brand, shown to illustrate the format and stages of the work. The figures on them belong to that sample; they are not results we promise or a forecast for your book.'
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

/**
 * `fill` makes a sample cover the shared 16:10 card instead of showing its whole frame, cropping only what lies
 * outside the card; `position` is the CSS object-position that decides which part is kept.
 */
export type WebsiteSample = { video: StyleVideoAsset; title: string; body: string; fill?: { position: string } }

/** The four supplied samples. Descriptions describe only what each video shows. */
export const websiteSamples: WebsiteSample[] = [
  {
    video: {
      src: site1,
      label: 'Website sample 1: a scroll through a book-store website, from a hero offering textbooks at the best price past best-seller covers, featured books, an award banner and reader testimonials to the footer',
      caption: '',
      poster: { src: site1Poster, width: 800, height: 600 },
    },
    // 4:3 in a 16:10 card: keeps source rows 80-580. The site logo and menu (rows 82-109 in the hero shots) and the
    // footer text (down to row 578 when the page rests at the bottom) both stay inside; above row 80 is grey backdrop.
    fill: { position: '50% 80%' },
    title: 'A clean, book-first storefront',
    body: 'A light, airy book-store site: a hero with a featured cover and a search box, then rows of best-seller and other books with prices, an award banner and reader testimonials before the footer. For an author, the same structure puts every book in front of readers with its cover and price, and lets awards and reviews build trust on the way down the page.',
  },
  {
    video: {
      src: site2,
      label: 'Website sample 2: a book trailer for a placeholder novel cover on a beach at sunset, with review quotes, an open inside page, a price and an Available Now end card',
      caption: '',
      poster: { src: site2Poster, width: 736, height: 414 },
    },
    // 16:9 in a 16:10 card: trims 37 px from each side, which only ever shows the beach backdrop.
    fill: { position: '50% 50%' },
    title: 'A book trailer for your home page',
    body: 'A short trailer built around one book: the cover turns into view beside the title and author, star-rated review quotes appear, an inside page opens, and it closes on a tagline, the price and an Available Now card. On an author website, a trailer like this greets visitors with the new release and gives them a reason to buy before they scroll.',
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
