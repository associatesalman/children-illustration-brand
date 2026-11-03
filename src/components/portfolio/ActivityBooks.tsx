import { portfolioArt, portfolioVideos } from '../../content/portfolio'
import { ArtImage } from '../ui/ArtImage'
import { Accent, Section, SectionHeading } from '../ui/Section'
import { PortfolioVideo } from './PortfolioVideo'

const worksheets = [
  { name: 'Match It', body: 'Draw a line from each picture to its word: apple, monkey, pig, pencil, spoon, notebook, frog.' },
  { name: 'Count and Write', body: 'Count the apples, cups, pencils, lunch boxes and more, then write each number in its box.' },
  { name: 'Complete the Pattern', body: 'Circles, squares, stars and hearts in rows to continue.' },
  { name: 'Circle It', body: 'Choose the word that names the picture, from three choices.' },
  { name: 'Missing Letter', body: 'Fill the gaps in grapes, elephant, fish, cat and ball.' },
  { name: 'Maze Fun', body: 'Help the bunny find its way to the carrot.' },
]

export function ActivityBooks() {
  return (
    <Section id="activity-books" labelledBy="activity-title">
      <SectionHeading
        id="activity-title"
        eyebrow="Activity book illustration"
        title={
          <>
            Illustrations for <Accent>interactive</Accent> activity books
          </>
        }
        intro="Activity pages have to be clear before they are decorative: one instruction, generous space to write, and pictures a child can name at once."
      />

      <div className="mt-14 grid grid-cols-1 items-start gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
        <figure className="lg:col-span-7">
          <ArtImage artwork={portfolioArt.activityBookPages} />
          <figcaption className="mt-3 text-sm text-ink-soft">
            Activity book sample: the cover and six printable worksheets.
          </figcaption>
        </figure>

        <div className="lg:col-span-5">
          <h3 className="text-display text-3xl">One book, one visual system</h3>
          <p className="mt-3 text-lg leading-relaxed text-ink-soft">
            The cover sets the tone with a lion, a bear and a bunny reading among books, crayons and alphabet blocks,
            plus a “This book belongs to” line for the owner’s name. Inside, every worksheet shares the same rainbow
            header, star and strip of grass, so a child always knows where the title and instructions are. The
            pictures are simple, single objects that are easy to recognize and count.
          </p>
          <dl className="mt-8 space-y-4">
            {worksheets.map((sheet) => (
              <div key={sheet.name} className="border-t border-ink/15 pt-3">
                <dt className="font-semibold">{sheet.name}</dt>
                <dd className="text-ink-soft">{sheet.body}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-lg leading-relaxed text-ink-soft">
            Together they cover matching, number, alphabet and pattern practice, a maze, and skill-based worksheets
            for early learners.
          </p>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 items-center gap-12 lg:mt-28 lg:grid-cols-12 lg:gap-20">
        <div className="max-w-2xl lg:col-span-7">
          <h3 className="text-display text-[clamp(1.9rem,1.5rem+1.4vw,2.6rem)] leading-[1.1]">
            Printables children make, not just fill in
          </h3>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            This short video shows a printable “About Me” booklet being cut out and folded into an accordion. Each panel
            asks for something personal: name and age, things to do for fun, a great day, favorite colors and books, a
            place to visit and a favorite memory. Bold lettering, clouds and a row of smiling faces frame the panels,
            while the writing spaces stay plain so children’s handwriting has room.
          </p>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            Cutting, folding and personalizing turn a printed page into something a child keeps, a useful addition to
            an activity book or a classroom resource.
          </p>
        </div>
        <figure className="mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-sm">
          <PortfolioVideo video={portfolioVideos.activityBooklet} name="booklet video" />
          <figcaption className="mt-3 text-sm text-ink-soft">
            Video, 33 seconds, without sound. Plays while it is on screen; click it to pause.
          </figcaption>
        </figure>
      </div>
    </Section>
  )
}
