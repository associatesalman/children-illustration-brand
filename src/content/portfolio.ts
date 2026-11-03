import activityBookPages from '../assets/portfolio/activity-book-pages.webp'
import activityBooklet from '../assets/portfolio/activity-booklet.mp4'
import activityBookletPoster from '../assets/portfolio/activity-booklet-poster.webp'
import bedroomBoardBook from '../assets/portfolio/bedroom-board-book.webp'
import expressionSheet from '../assets/portfolio/expression-sheet.webp'
import forestBoardBook from '../assets/portfolio/forest-board-book.webp'
import forestSpread from '../assets/portfolio/forest-spread.webp'
import heroPoster from '../assets/portfolio/hero-poster.webp'
import heroReel from '../assets/portfolio/hero-reel.mp4'
import modelSheetPencil from '../assets/portfolio/model-sheet-pencil.webp'
import spreadThumbnails from '../assets/portfolio/spread-thumbnails.webp'
import turnaroundColor from '../assets/portfolio/turnaround-color.webp'
import watercolorPortrait from '../assets/portfolio/watercolor-portrait.webp'
import type { Artwork } from './artwork'

/**
 * Portfolio samples. Web copies of the files in public/portfolio, exported by
 * scripts/optimize_portfolio.py. The storybook board was split into its four
 * panels; the bedroom spread's flat panel is left out because its mockup shows
 * the same artwork. illustration-video-2.mp4 (an unrelated pet-care animation,
 * encoded sideways) is not used.
 */
export const portfolioArt = {
  forestSpread: {
    src: forestSpread,
    alt: 'Double-page forest scene: Little Red Riding Hood, in a red hood and heart-print apron, skips through flowers with a basket while a tall brown wolf watches her from the ferns on the right',
    width: 1200,
    height: 584,
  },
  forestBoardBook: {
    src: forestBoardBook,
    alt: 'Board-book mockup of the forest spread, open flat, with three short lines of story text set in the pale clearing at top left',
    width: 1200,
    height: 606,
  },
  bedroomBoardBook: {
    src: bedroomBoardBook,
    alt: "Board-book mockup of the bedroom spread: Little Red Riding Hood peers over the bed's footboard at the wolf, who wears Grandmother's frilled nightcap and glasses, with two columns of dialogue above",
    width: 1200,
    height: 606,
  },
  spreadThumbnails: {
    src: spreadThumbnails,
    alt: 'Ten pencil thumbnails of double-page spreads with gray lines marking the text: a girl with a bow in her hair wakes in bed, has her hair done, walks to church with a woman, stands in the aisle and among the congregation, dances while people clap and play guitar, listens to a preacher, sits beside the woman, shares a hug outside the church, and sits on her bed',
    width: 736,
    height: 1308,
  },
  modelSheetPencil: {
    src: modelSheetPencil,
    alt: 'Pencil model sheet of a girl with a bob and hair clip in a short-sleeved dress tied at the back, drawn in front, three-quarter front, side, three-quarter rear and rear views on shared guidelines',
    width: 736,
    height: 454,
  },
  turnaroundColor: {
    src: turnaroundColor,
    alt: 'Color turnaround of a girl in a purple knit hat, cropped top, checkered wristband and wide blue trousers, shown in five views from front to back',
    width: 736,
    height: 480,
  },
  expressionSheet: {
    src: expressionSheet,
    alt: 'Six expression studies of one young woman with long auburn hair: worried, startled, laughing, delighted, unsure and beaming',
    width: 736,
    height: 1308,
  },
  watercolorPortrait: {
    src: watercolorPortrait,
    alt: 'Watercolor portrait of a boy with spiky orange hair, a rumpled blue shirt and a green backpack, looking back over his shoulder against loose teal washes and drips',
    width: 736,
    height: 1308,
  },
  activityBookPages: {
    src: activityBookPages,
    alt: 'Activity book sample: a cover titled "My Activity Book" with a lion, bear and bunny among books and crayons, beside six worksheets: Match It, Count and Write, Complete the Pattern, Circle It, Missing Letter and Maze Fun, with four cheerful cartoon children waving from the right edge',
    width: 1200,
    height: 1697,
  },
} satisfies Record<string, Artwork>

export type PortfolioVideo = {
  src: string
  poster: string
  width: number
  height: number
  label: string
}

export const portfolioVideos = {
  hero: {
    src: heroReel,
    poster: heroPoster,
    width: 1280,
    height: 720,
    label: 'Animated illustration sample reel',
  },
  activityBooklet: {
    src: activityBooklet,
    poster: activityBookletPoster,
    width: 540,
    height: 960,
    label: 'Video: a printable "About Me" booklet being cut out and folded into an accordion',
  },
} satisfies Record<string, PortfolioVideo>
