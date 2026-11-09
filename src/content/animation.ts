import type { StyleVideoAsset } from './illustrationStyles'
import cutoutRig400 from '../assets/animation/2d-cutout-rig-400.webp'
import cutoutRig531 from '../assets/animation/2d-cutout-rig-531.webp'
import parkScene from '../assets/animation/3d-park-scene.mp4'
import parkScenePoster from '../assets/animation/3d-park-scene-poster.webp'
import process480 from '../assets/animation/3d-process-steps-480.webp'
import process736 from '../assets/animation/3d-process-steps-736.webp'
import sketchToRender from '../assets/animation/sketch-to-render.mp4'
import sketchToRenderPoster from '../assets/animation/sketch-to-render-poster.webp'
import stageLayout480 from '../assets/animation/stage-layout-480.webp'
import stageLayout720 from '../assets/animation/stage-layout-720.webp'
import stageRender480 from '../assets/animation/stage-render-480.webp'
import stageRender720 from '../assets/animation/stage-render-720.webp'
import stageSketch480 from '../assets/animation/stage-sketch-480.webp'
import stageSketch720 from '../assets/animation/stage-sketch-720.webp'
import storyScenes from '../assets/animation/story-scenes.mp4'
import storyScenesPoster from '../assets/animation/story-scenes-poster.webp'
// Every image and video on this page is used only here; none is shared with another page.

export type AnimationImage = { src: string; srcSet: string; width: number; height: number; alt: string }
export type Capability = { title: string; body: string }
export type PillarIcon = 'story' | 'world' | 'trailer' | 'learn'

/* ------------------------------------------------------------------ Hero */

export const heroIntro =
  'We turn children’s stories into moving pictures. Characters who blink, wobble and grin, worlds that open up beyond the page edge, and scenes timed so a young viewer always knows where to look and what happens next.'

export const pillars: { icon: PillarIcon; title: string; body: string }[] = [
  {
    icon: 'story',
    title: '2D Storytelling',
    body: 'Hand-drawn and illustrated scenes that move with the charm of the book’s own artwork.',
  },
  {
    icon: 'world',
    title: '3D Characters & Worlds',
    body: 'Modeled, textured and lit characters in spaces the camera can travel through.',
  },
  {
    icon: 'trailer',
    title: 'Animated Book Trailers',
    body: 'Short videos that introduce your book’s premise, characters and title.',
  },
  {
    icon: 'learn',
    title: 'Educational Animation',
    body: 'Clear, friendly sequences that help children follow an idea one step at a time.',
  },
]

/* ----------------------------------------------------------------- Intro */

export const introVideo: StyleVideoAsset = {
  src: sketchToRender,
  label: 'The same family scenes shown three ways at once: a pencil storyboard, an untextured 3D layout and the finished, lit 3D render.',
  caption:
    'One sequence at three stages, playing in sync: pencil storyboard (top), untextured 3D layout (middle) and the lit, rendered shot (bottom).',
  poster: { src: sketchToRenderPoster, width: 540, height: 960 },
}

export const introParagraphs = [
  'A picture book asks the reader to imagine what happens between the pages. Animation fills that gap. A character’s ears droop before they speak, a door creaks open a little at a time, and a pause lands exactly where the joke needs it. For children’s authors, that motion can carry a story to new places: a trailer for a book launch, a read-along video, a short lesson built around a favorite character, or a scene that brings the world of a series to life.',
  'Every project starts with the story rather than the software. We look at who the audience is, what the animation needs to do and where it will be watched, then choose the approach that serves those goals.',
]

export const approaches: { name: string; summary: string; suits: string[] }[] = [
  {
    name: '2D animation',
    summary:
      'Flat, drawn images given movement. It can look exactly like your illustrations: the same line, texture and color, now in motion.',
    suits: [
      'Books whose illustrated style should carry straight into the video',
      'Storybook warmth, hand-drawn charm and graphic simplicity',
      'Shorter pieces where the artwork already exists',
    ],
  },
  {
    name: '3D animation',
    summary:
      'Characters and sets built as digital models, so they have volume, depth and light, and the camera can move around them.',
    suits: [
      'Characters who should feel solid, tactile or toy-like',
      'Worlds the viewer explores from several angles',
      'Recurring characters who will appear in many scenes or episodes',
    ],
  },
]

/* ------------------------------------------------------------------- 2D */

export const cutoutRigImage: AnimationImage = {
  src: cutoutRig531,
  srcSet: `${cutoutRig400} 400w, ${cutoutRig531} 531w`,
  width: 531,
  height: 626,
  alt: 'The same flat 2D boy shown twice. On the left he is split into separate pieces: head and hair, neck, white shirt with dark sleeves, forearms, hands, dark denim shorts, legs, striped socks and red sneakers. On the right the pieces are assembled into one standing pose, hands on hips.',
}

export const cutoutRigCaption = 'A flat 2D character as a cut-out rig: the separate pieces on the left, the assembled pose on the right.'

export const cutoutRigIntro = [
  'The boy shown here is drawn once and then cut into the parts an animator moves. This is a cut-out, or puppet, rig: one of the two main ways of animating a 2D character, alongside drawing every frame by hand.',
  'Each piece turns around its own pivot, at the shoulder, elbow, wrist, hip or knee, so a pose is built by rotating and placing parts rather than redrawing the whole figure.',
]

export const cutoutRigPoints: Capability[] = [
  {
    title: 'Drawn once, in pieces',
    body: 'Head and hair, neck, shirt, sleeves, forearms, hands, shorts, legs, socks and sneakers are separate shapes, so each one can move without the rest being redrawn.',
  },
  {
    title: 'Joints that stay closed',
    body: 'Pieces such as the neck run on beneath the parts that overlap them, so a tilting head or a swinging arm never opens a gap at the joint.',
  },
  {
    title: 'On model in every frame',
    body: 'Because the artwork itself does not change, line weight, proportions and color stay identical from shot to shot, which suits longer videos and recurring characters.',
  },
  {
    title: 'Mixed with drawn frames',
    body: 'Some moves are beyond a rig, such as a full head turn or a big squash and stretch. For those, animators swap in hand-drawn pieces, so many 2D projects combine both methods.',
  },
]

export const twoDParagraphs = [
  '2D animation brings an illustrated character to life through movement, timing and expression. Because it is built from drawings, it can match a book’s artwork closely, from loose pencil and watercolor washes to bold vector shapes.',
  'Good 2D animation is less about drawing every moment and more about choosing the right ones. A strong pose, a well-timed hold and a small anticipation before a jump do more for a young audience than constant motion.',
]

export const twoDCapabilities: Capability[] = [
  {
    title: 'Character animation',
    body: 'Walks, reactions, lip movement and the small acting choices that make an illustrated character feel alive.',
  },
  {
    title: 'Story and scene animation',
    body: 'Characters moving through a setting together, with entrances, exits and simple camera moves that keep the story readable.',
  },
  {
    title: 'Frame-by-frame animation',
    body: 'Every pose drawn by hand for the most fluid, expressive movement, used for big actions, effects and moments a rig cannot reach.',
  },
  {
    title: 'Illustrated backgrounds',
    body: 'Painted or drawn environments built in layers, so foreground, middle ground and sky can move at different depths.',
  },
  {
    title: 'Short storytelling sequences',
    body: 'Self-contained moments of a few seconds to a few minutes, each with a clear beginning, turn and ending.',
  },
]

/* ------------------------------------------------------------------- 3D */

export const processImage: AnimationImage = {
  src: process736,
  srcSet: `${process480} 480w, ${process736} 736w`,
  width: 736,
  height: 1104,
  alt: 'Infographic titled “3D Animation Process: 7 Steps From Idea to Final Render”, following one boy character through seven panels: a concept sketch, a grey wireframe model, the textured model, a skeleton rig, a sequence of walking and jumping poses, the character under a spotlight, and the final rendered scene.',
}

export const threeDParagraphs = [
  '3D animation builds characters, props and places as digital models with real volume. Once built, they can be lit like a film set and viewed from any angle, so a character can turn, lean toward the camera or walk through a scene in a single shot.',
  'For children’s stories, 3D works well for characters with a soft, rounded, toy-like quality, and for worlds the audience should feel they could step into.',
]

export const threeDCapabilities: Capability[] = [
  {
    title: 'Character and object modeling',
    body: 'Turning a concept sketch into a 3D form, with proportions and silhouettes that read clearly at a child’s eye level.',
  },
  {
    title: 'Materials and texturing',
    body: 'Surface color and detail, such as fabric, fur, wood or painted plastic, that decide whether a world feels soft, shiny or storybook.',
  },
  {
    title: 'Rigging and character movement',
    body: 'An internal skeleton and controls that let the model bend, walk, gesture and change expression.',
  },
  {
    title: 'Lighting and rendering',
    body: 'Lights that set the time of day and the mood of each scene, then rendering the finished frames.',
  },
  {
    title: 'Animated scenes and environments',
    body: 'Sets, props and camera moves composed so each shot frames the action and supports the story.',
  },
]

/* ------------------------------------------------------------ Character */

export const parkSceneVideo: StyleVideoAsset = {
  src: parkScene,
  label: 'A short 3D-rendered scene in a sunny park: a boy sits alone under a tree, close-ups show a red-haired girl looking sad and the boy looking worried and then determined, he crosses the park, and the two children end up smiling over a sheet of paper on a bench.',
  caption: 'A 15-second 3D scene with no dialogue: the story is carried entirely by staging, faces and one decisive gesture.',
  poster: { src: parkScenePoster, width: 736, height: 414 },
}

export const characterParagraphs = [
  'Children read characters through their faces and bodies long before they follow the plot. In this short 3D scene nobody speaks: who sits apart, where the eyes go and how an expression changes tell the whole story.',
  'Every beat is staged to be read once, quickly. Close-ups isolate a feeling, wide shots show who is alone and who is not, and the camera follows a character the moment he decides to act. The same acting principles apply whether a character is rendered in 3D or drawn in 2D.',
]

export const sceneBeats: Capability[] = [
  {
    title: 'Set the scene',
    body: 'A wide shot under the trees. The boy sits apart while other children gather around a grown-up by a bench, so before anyone moves the viewer already knows who is on the outside.',
  },
  {
    title: 'Show the feeling',
    body: 'Tight close-ups on the girl’s lowered eyes and the boy’s worried brow. Holding the camera close gives young viewers time to read each emotion.',
  },
  {
    title: 'Turn the moment',
    body: 'His brow drops and his hand closes into a fist: worry becomes determination, shown with a face and one simple gesture instead of words.',
  },
  {
    title: 'Move the story on',
    body: 'He gets up and walks across the park with the camera behind his shoulder, so the audience travels with him.',
  },
  {
    title: 'Land the ending',
    body: 'The scene closes on a bench, the two children leaning over a sheet of paper and smiling: a warm, clear resolution.',
  },
]

export const characterCapabilities: Capability[] = [
  { title: 'Expressions', body: 'Clear emotional changes, from a slow worried frown to a sudden delighted grin, that young viewers can read at a glance.' },
  { title: 'Gestures', body: 'Hand and arm movements that support what a character says, or quietly contradict it.' },
  { title: 'Body language', body: 'Weight, posture and balance that show whether a character is confident, shy, tired or excited.' },
  { title: 'Personality in motion', body: 'Signature ways of moving, such as a hop, a fidget or a stomp, that make each character distinct.' },
  { title: 'Consistent behavior', body: 'The same character acting in the same recognizable way from the first scene to the last.' },
]

/* ---------------------------------------------------------------- Story */

export const storyVideo: StyleVideoAsset = {
  src: storyScenes,
  label: 'Rendered 3D story scenes of a family camping trip: two girls reading a map, a tent going up, the family toasting marshmallows at a campfire at night, and a bike ride through the trees.',
  caption:
    'Rendered 3D story scenes from a family camping trip: a map, a tent, a campfire and a bike ride, each shot built around one clear action or feeling.',
  poster: { src: storyScenesPoster, width: 720, height: 432 },
}

export const storyParagraphs = [
  'Turning a story into animation means deciding what each moment looks like in time. A single page might become three shots: a wide view to set the scene, a closer one for the reaction, and a held beat before the page-turn surprise.',
  'Throughout, we keep the story clear for its audience. Each shot has one main idea, characters stay on model, and pacing, color and tone suit the age group, gentle and steady for the youngest viewers and livelier for older ones.',
]

export const storyPoints: Capability[] = [
  { title: 'Narrative clarity', body: 'One idea per shot, with staging that leads the eye to the action that matters.' },
  { title: 'Character consistency', body: 'Designs, colors and personalities held steady across every scene and angle.' },
  { title: 'Age-appropriate presentation', body: 'Pacing, sound, color and emotional intensity chosen for the children who will watch.' },
  { title: 'Faithful to the book', body: 'Key scenes, phrases and visual details carried over so the animation feels like the same story.' },
]

/* -------------------------------------------------------------- Trailer */

export const trailerParagraphs = [
  'A book trailer is a short promotional video that gives viewers a taste of the story. Its job is to spark curiosity: who is this character, what is the problem, and where can I find the book?',
  'We adapt the premise into a concise sequence, choosing a few strong scenes rather than retelling the whole plot. Trailers can be shared on an author website, social channels, launch events or school visits. Like any marketing material, a trailer supports your promotion; it cannot guarantee views or sales.',
]

export const trailerBeats: Capability[] = [
  { title: 'Opening hook', body: 'A striking image, line or moment that makes the viewer want to keep watching.' },
  { title: 'Premise and character', body: 'Who the story is about and the situation they face, in a sentence or two.' },
  { title: 'Selected scenes', body: 'A few key moments, often animated from the book’s own illustrations, that hint at the adventure.' },
  { title: 'Pacing and titles', body: 'Timing, on-screen text and transitions shaped to the trailer’s length and platform.' },
  { title: 'Closing message', body: 'The book’s cover, title, author name and where readers can find it.' },
]

/* ----------------------------------------------------------- Educational */

export const educationParagraphs = [
  'Animation can make an idea visible. A seed becomes a sprout in seconds, letters can sound themselves out, and a character can walk a child through the steps of brushing their teeth or counting to ten.',
  'Educational and explainer animation works best when it stays simple: one concept at a time, visuals that match the narration, and a familiar character who guides the viewer through each step.',
]

export const educationCapabilities: Capability[] = [
  { title: 'Concept visuals', body: 'Abstract or invisible ideas, like feelings, numbers or how something grows, turned into images children can follow.' },
  { title: 'Step-by-step sequences', body: 'Processes broken into short, ordered moments with clear transitions between them.' },
  { title: 'Character guides', body: 'A friendly character, perhaps one from your book, who asks questions and models the learning.' },
  { title: 'Read-along support', body: 'On-screen words timed to narration, for early readers and classroom use.' },
  { title: 'Review and repetition', body: 'Key points revisited at the end so the main idea is reinforced.' },
  { title: 'Calm, uncluttered design', body: 'Limited motion and color in the background, so attention stays on what matters.' },
]

/* ---------------------------------------------------- Storyboarding & VD */

export const stages: (AnimationImage & { step: string; title: string; body: string })[] = [
  {
    step: '01',
    title: 'Storyboard',
    body: 'Rough pencil frames fix the staging, poses and expressions before anything is built.',
    src: stageSketch720,
    srcSet: `${stageSketch480} 480w, ${stageSketch720} 720w`,
    width: 720,
    height: 360,
    alt: 'Pencil storyboard frame of a father and daughter cheering with their fists in the air.',
  },
  {
    step: '02',
    title: 'Layout and blocking',
    body: 'Untextured 3D models in a simple set test the timing, camera angle and movement.',
    src: stageLayout720,
    srcSet: `${stageLayout480} 480w, ${stageLayout720} 720w`,
    width: 720,
    height: 360,
    alt: 'The same moment as untextured 3D models in a grey set: the father and daughter raising their arms.',
  },
  {
    step: '03',
    title: 'Final render',
    body: 'Textures, lighting and set dressing complete the shot the storyboard planned.',
    src: stageRender720,
    srcSet: `${stageRender480} 480w, ${stageRender720} 720w`,
    width: 720,
    height: 360,
    alt: 'The finished render: the father and daughter dancing happily in a sunlit living room.',
  },
]

export const developmentTopics: Capability[] = [
  { title: 'Script breakdown', body: 'Splitting the text or script into scenes and shots, and noting what each one must show.' },
  { title: 'Visual direction', body: 'Agreeing on the overall look: line quality, shape language, level of detail and reference points.' },
  { title: 'Scene planning', body: 'Locations, props, camera positions and how characters move through each space.' },
  { title: 'Character exploration', body: 'Sketches, model sheets, turnarounds and expression studies before animation begins.' },
  { title: 'Color decisions', body: 'Palettes for characters and scenes, and color scripts that track the story’s mood.' },
  { title: 'Animatics', body: 'Storyboard frames timed to a draft soundtrack, so the pacing can be reviewed before production.' },
]

/* ------------------------------------------------------- Sound & delivery */

export const soundIntro =
  'Sound and delivery are planned at the start, not added at the end. What is included depends on the agreed project scope, so we list the options together and confirm which ones your project needs.'

export const soundGroups: { title: string; items: Capability[] }[] = [
  {
    title: 'Sound',
    items: [
      { title: 'Voiceover', body: 'Narration or character voices, whether you record them, provide a reader, or need options to discuss.' },
      { title: 'Music', body: 'A score or licensed track that sets the mood, with its usage rights confirmed for where the video will appear.' },
      { title: 'Sound effects', body: 'Footsteps, page turns and small details timed to the action, kept gentle for young listeners.' },
      { title: 'Captions', body: 'Subtitles or on-screen text, which help viewers watching without sound and support early readers.' },
    ],
  },
  {
    title: 'Final delivery',
    items: [
      { title: 'Formats and aspect ratios', body: 'Widescreen, square or vertical versions, depending on where the animation will be shown.' },
      { title: 'Lengths and cut-downs', body: 'A main version and, if agreed, shorter edits for previews or social posts.' },
      { title: 'Platform requirements', body: 'File type, resolution and length limits checked against each platform you plan to use.' },
      { title: 'Supporting files', body: 'Caption files, thumbnails or still frames, if they are part of the agreed scope.' },
    ],
  },
]

/* ------------------------------------------------------------ Comparison */

export const comparison: { topic: string; twoD: string; threeD: string }[] = [
  {
    topic: 'Visual appearance',
    twoD: 'Flat, drawn or painted images. Can match a book’s illustrations closely, from pencil and watercolor to clean vector shapes.',
    threeD: 'Characters and sets with volume, depth, lighting and shadow. Styles range from soft and toy-like to richly detailed.',
  },
  {
    topic: 'Character and environment creation',
    twoD: 'Characters are drawn, or cut into parts for rigging. Backgrounds are illustrated, often in layers for depth.',
    threeD: 'Characters and sets are modeled, textured and rigged once, then posed, lit and filmed from any angle.',
  },
  {
    topic: 'Production approach',
    twoD: 'Poses are drawn frame by frame or moved with a 2D rig. New angles usually mean new drawings.',
    threeD: 'Up-front building, then animation, lighting and rendering. Once built, assets can be reused across many shots.',
  },
  {
    topic: 'Suitable storytelling applications',
    twoD: 'Picture-book adaptations, illustrated trailers, read-alongs, and graphic or hand-made looks.',
    threeD: 'Immersive worlds, tactile or toy-like characters, sweeping camera moves and characters for a series.',
  },
  {
    topic: 'What affects scope and production time',
    twoD: 'Length, number of characters, frame-by-frame versus rigged animation, background detail and how much artwork already exists.',
    threeD: 'Length, number of models and sets, rig complexity, texture and lighting detail, rendering, and how many shots reuse assets.',
  },
]

export const comparisonNote =
  'Neither approach is better in every case, and some projects combine the two. Scope and timing depend on the details of each project, so we confirm them once we have seen your story and goals.'

/* -------------------------------------------------------------- Process */

export const processSteps: Capability[] = [
  {
    title: 'Discovery & Project Brief',
    body: 'We learn about your book, audience, goals and where the animation will be used, then agree on length, style and what is included.',
  },
  {
    title: 'Script & Creative Direction',
    body: 'The story is shaped into a script or shot list, and the visual direction is set with references, tone and pacing.',
  },
  {
    title: 'Storyboarding & Animatic',
    body: 'Each shot is sketched, then timed into an animatic so the flow can be reviewed and adjusted before production.',
  },
  {
    title: 'Character & Environment Development',
    body: 'Characters, props and backgrounds are designed or adapted from your illustrations: drawn and rigged for 2D, or modeled, textured and rigged for 3D.',
  },
  {
    title: 'Animation Production',
    body: 'Scenes are animated shot by shot, with movement, expression and timing refined at each review point.',
  },
  {
    title: 'Sound, Review & Refinement',
    body: 'Agreed sound elements are added and synced, and the full piece is reviewed together for changes within the agreed rounds.',
  },
  {
    title: 'Final Export & Delivery',
    body: 'The approved animation is exported in the agreed formats, sizes and versions, ready for the places you plan to share it.',
  },
]

export const processNote =
  'The steps stay the same, but the work inside them varies with the agreed 2D or 3D scope. 3D adds modeling, texturing, lighting and rendering, for example, while frame-by-frame 2D spends more time on drawing.'

/* ------------------------------------------------------------------ FAQ */

export const faqs: { title: string; body: string }[] = [
  {
    title: 'How do I choose between 2D and 3D?',
    body: 'Start with your book and your goal. If the animation should look like your existing illustrations, 2D is often the natural fit. If you want characters with volume and a world the camera can move through, or you plan a recurring series, 3D may suit better. We can talk through examples and the trade-offs for your project before you decide.',
  },
  {
    title: 'Can you animate my existing book illustrations?',
    body: 'Often, yes. Illustrations can be separated into layers and parts, such as characters, limbs and backgrounds, and animated in a 2D style that keeps the original artwork. Layered source files make this easier; flattened images may need some redrawing or cleanup first. We review your files and explain what is possible.',
  },
  {
    title: 'What materials should I provide?',
    body: 'Helpful starting points include your manuscript or story summary, any illustrations or character designs, layered artwork files if you have them, reference images or videos you like, the intended audience and age group, and where the animation will be shown. Share what you have, and we will tell you if anything else would help.',
  },
  {
    title: 'How do length and complexity affect production?',
    body: 'Longer animations need more shots, and each shot needs planning, animation and review. Complexity adds to that: more characters on screen, detailed backgrounds, frame-by-frame movement, lip sync, or, in 3D, extra models and detailed lighting. Keeping the piece focused is often the best way to put effort where it shows most.',
  },
  {
    title: 'How are voiceover, music and captions planned?',
    body: 'We decide at the brief stage which of these your project needs and who will provide them. A draft voice track is often used in the animatic so the timing can be checked early. Music needs suitable usage rights for every platform where the video will appear, and captions are timed to the final edit.',
  },
  {
    title: 'Can you prepare versions for websites and social platforms?',
    body: 'Yes, if they are part of the agreed scope. Platforms favor different shapes and lengths, such as widescreen for websites and video sites, or square and vertical for social feeds. Planning these versions from the start means key action can be framed to work in each crop.',
  },
]
