import {
  cartoonMedia as cartoon,
  digitalMedia as digital,
  minimalMedia as minimal,
  styleById,
  threeDMedia as threeD,
  watercolorMedia as watercolor,
} from '../../content/illustrationStyles'
import {
  Craft,
  Figure,
  MediaRow,
  Prose,
  ServiceBand,
  StyleIntro,
  StyleShell,
  Strengths,
  VideoFigure,
} from './StyleParts'

const ratio = (item: { width: number; height: number }) => item.width / item.height

/** 01 · Cartoon: an editorial gallery of the character development pieces. */
export function CartoonSection() {
  const style = styleById['cartoon-style']
  return (
    <StyleShell style={style} tone="white">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
        <StyleIntro style={style} className="lg:col-span-7" />
        <Prose paragraphs={style.look} className="lg:col-span-5" />
      </div>

      <div className="mt-14 grid grid-cols-1 gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-8">
        <Figure
          image={cartoon.sheet}
          sizes="(min-width: 1024px) 38vw, 100vw"
          className="mx-auto w-full max-w-lg lg:col-span-5 lg:max-w-none"
        />
        <div className="lg:col-span-7">
          <MediaRow
            items={[
              { ratio: ratio(cartoon.turnaround.poster), node: <VideoFigure video={cartoon.turnaround} /> },
              { ratio: ratio(cartoon.sketches), node: <Figure image={cartoon.sketches} sizes="(min-width: 1024px) 28vw, (min-width: 640px) 50vw, 100vw" /> },
            ]}
          />
          <Strengths style={style} className="mt-12 lg:mt-14" />
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-10 lg:mt-24 lg:grid-cols-12 lg:items-center lg:gap-16">
        <Craft style={style} className="lg:col-span-5" />
        <Figure image={cartoon.fox} sizes="(min-width: 1024px) 52vw, 100vw" className="lg:col-span-7" />
      </div>

      <MediaRow
        className="mt-16 lg:mt-24"
        items={[
          { ratio: ratio(cartoon.girl), node: <Figure image={cartoon.girl} sizes="(min-width: 640px) 38vw, 100vw" /> },
          { ratio: ratio(cartoon.vectorFace.poster), node: <VideoFigure video={cartoon.vectorFace} /> },
          { ratio: ratio(cartoon.bee), node: <Figure image={cartoon.bee} sizes="(min-width: 640px) 30vw, 100vw" /> },
        ]}
      />

      <ServiceBand style={style} tone="white" />
    </StyleShell>
  )
}

/** 02 · Watercolor: alternating video/text and image/text splits. */
export function WatercolorSection() {
  const style = styleById['watercolor-style']
  return (
    <StyleShell style={style} tone="sun">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <VideoFigure video={watercolor.bench} className="order-2 mx-auto w-full max-w-sm lg:order-1 lg:col-span-4 lg:max-w-none" />
        <div className="order-1 lg:order-2 lg:col-span-8">
          <StyleIntro style={style} />
          <Prose paragraphs={style.look} className="mt-8" />
          <Strengths style={style} className="mt-12" />
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-12 lg:mt-24 lg:grid-cols-12 lg:items-center lg:gap-16">
        <Craft style={style} className="lg:col-span-5" />
        <MediaRow
          className="lg:col-span-7"
          items={[
            { ratio: ratio(watercolor.family), node: <Figure image={watercolor.family} sizes="(min-width: 640px) 30vw, 100vw" /> },
            { ratio: ratio(watercolor.sea), node: <Figure image={watercolor.sea} sizes="(min-width: 1024px) 34vw, (min-width: 640px) 55vw, 100vw" /> },
          ]}
        />
      </div>

      <ServiceBand style={style} tone="sun" />
    </StyleShell>
  )
}

/** 03 · Digital Painting: a broad triptych of the painted landscape. */
export function DigitalPaintingSection() {
  const style = styleById['digital-painting']
  return (
    <StyleShell style={style} tone="white">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
        <StyleIntro style={style} className="lg:col-span-7" />
        <Prose paragraphs={style.look} className="lg:col-span-5" />
      </div>

      <MediaRow
        className="mt-14 lg:mt-20"
        items={[
          { ratio: ratio(digital.landscape.poster), node: <VideoFigure video={digital.landscape} /> },
          { ratio: ratio(digital.finished), node: <Figure image={digital.finished} sizes="(min-width: 640px) 33vw, 100vw" /> },
          { ratio: ratio(digital.detail), node: <Figure image={digital.detail} sizes="(min-width: 640px) 33vw, 100vw" /> },
        ]}
      />

      <div className="mt-16 grid grid-cols-1 gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
        <Strengths style={style} className="lg:col-span-5" />
        <Craft style={style} className="lg:col-span-7" />
      </div>

      <ServiceBand style={style} tone="white" />
    </StyleShell>
  )
}

/** 04 · 3D: text beside a duo of the render and the walk cycle. */
export function ThreeDSection() {
  const style = styleById['3d-style']
  return (
    <StyleShell style={style} tone="sun">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-5">
          <StyleIntro style={style} />
          <Prose paragraphs={style.look} className="mt-8" />
        </div>
        <MediaRow
          className="lg:col-span-7"
          items={[
            { ratio: ratio(threeD.render), node: <Figure image={threeD.render} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" /> },
            { ratio: ratio(threeD.walk.poster), node: <VideoFigure video={threeD.walk} /> },
          ]}
        />
      </div>

      <Strengths style={style} row className="mt-16 lg:mt-24" />
      <Craft style={style} columns={4} className="mt-14 lg:mt-16" />

      <ServiceBand style={style} tone="sun" />
    </StyleShell>
  )
}

/** 05 · Minimal: one wide, cinematic video, with stills beside the explanation. */
export function MinimalSection() {
  const style = styleById['minimal-style']
  return (
    <StyleShell style={style} tone="white">
      <StyleIntro style={style} className="max-w-4xl" />

      <VideoFigure video={minimal.story} className="mt-12 lg:mt-16" />

      <div className="mt-16 grid grid-cols-1 gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Prose paragraphs={style.look} />
          <Strengths style={style} className="mt-12" />
        </div>
        <div className="space-y-8 lg:col-span-7">
          <Figure image={minimal.street} sizes="(min-width: 1024px) 52vw, 100vw" />
          <Figure image={minimal.shadows} sizes="(min-width: 1024px) 52vw, 100vw" />
        </div>
      </div>

      <Craft style={style} columns={4} className="mt-16 lg:mt-20" />

      <ServiceBand style={style} tone="white" />
    </StyleShell>
  )
}
