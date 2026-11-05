/**
 * Free Sample request: services, fields, validation and the readable summary, shared by the browser form
 * (src/components/freeSample) and the server endpoint (server/freeSample.ts) so both apply the same rules.
 * No imports: Node runs this file directly with type stripping, so only erasable TypeScript is used.
 *
 * Every value lives under a flat key: "shared.title", "contact.email", "svc.<serviceId>.<field>".
 */

export type Option = string

export type FieldKind =
  | 'text'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkboxes'
  /** Reference images and documents, sent with the request as attachments. */
  | 'files'
  /** Read-only echo of a shared answer, so it is asked once and not repeated per service. */
  | 'shared'

export type FieldDef = {
  name: string
  label: string
  kind: FieldKind
  required?: boolean
  options?: readonly Option[]
  /** Example or guidance shown under the label. */
  hint?: string
  placeholder?: string
  /** Short fields share a row on desktop. */
  half?: boolean
  maxLength?: number
  /** Offers a "Not applicable" checkbox that fills the field with notApplicable. */
  allowNotApplicable?: boolean
  /** Picture cards (local artwork) instead of plain radio buttons. */
  visual?: 'styles'
  /** For kind "shared": the shared field this echoes. */
  ref?: string
  autoComplete?: string
  inputType?: 'text' | 'email' | 'tel' | 'url'
}

export type ServiceDef = {
  id: string
  name: string
  description: string
  /** A note shown at the top of the service's group. */
  note?: string
  fields: FieldDef[]
}

export const notApplicable = 'Not applicable'
const notSure = 'Not sure yet'

const styleOptions = ['Cartoon', 'Watercolor', 'Digital Painting', '3D', 'Minimal', 'Need guidance'] as const
const illustrationCounts = ['1–5', '6–15', '16–24', '25–40', 'More than 40', notSure] as const
const fileReadiness = ['Ready', 'In progress', 'Not started', notSure] as const

const files = (label: string, hint?: string): FieldDef => ({ name: 'files', label, kind: 'files', hint })

/** Shared project information: asked once, whatever the services. */
export const sharedFields: FieldDef[] = [
  {
    name: 'title',
    label: 'Project or book title',
    kind: 'text',
    required: true,
    half: true,
    hint: 'A working title is fine.',
    placeholder: 'e.g. Mia and the Moon Shell',
  },
  {
    name: 'language',
    label: 'Manuscript language',
    kind: 'text',
    required: true,
    half: true,
    placeholder: 'e.g. English',
  },
  {
    name: 'description',
    label: 'Brief project description',
    kind: 'textarea',
    required: true,
    maxLength: 4000,
    hint: 'What the book is about, who it is for and what you would like help with.',
  },
  {
    name: 'ageGroup',
    label: 'Intended reader age group',
    kind: 'select',
    required: true,
    half: true,
    options: [
      'Babies and toddlers (0–3)',
      'Preschool (3–5)',
      'Picture book readers (4–8)',
      'Early readers (6–9)',
      'Middle grade (8–12)',
      'Young adult (12+)',
      'Adults or all ages',
      notSure,
    ],
  },
  {
    name: 'stage',
    label: 'Current project stage',
    kind: 'select',
    required: true,
    half: true,
    options: [
      'Idea only',
      'Writing in progress',
      'Manuscript complete',
      'Illustrations in progress',
      'Ready to publish',
      'Already published',
      notSure,
    ],
  },
  {
    name: 'length',
    label: 'Approximate word count or page count',
    kind: 'text',
    half: true,
    placeholder: 'e.g. about 800 words, or 32 pages',
    hint: 'Required for activity books, publishing, editing and translation.',
  },
  {
    name: 'timeline',
    label: 'Preferred timeline',
    kind: 'select',
    half: true,
    options: ['As soon as possible', 'Within 1 month', '1–3 months', '3–6 months', 'Flexible', notSure],
  },
  { name: 'notes', label: 'Additional notes', kind: 'textarea' },
]

/** Services whose groups rely on the shared word or page count, which then becomes required. */
const needsLength = ['activity-book-illustration', 'book-publishing-distribution', 'editing-proofreading', 'childrens-book-translation']

/** Names and order follow the header's Services menu (src/content/site.ts). */
export const services: ServiceDef[] = [
  {
    id: 'illustration-styles',
    name: 'Illustration Styles',
    description: 'Explore a style for your book, from cartoon and watercolor to digital painting, 3D and minimal.',
    fields: [
      { name: 'style', label: 'Preferred style', kind: 'radio', required: true, options: styleOptions, visual: 'styles' },
      {
        name: 'scene',
        label: 'Describe the illustration or sample scene',
        kind: 'textarea',
        required: true,
        placeholder: 'e.g. Mia and her dog find a glowing shell on the beach at sunset.',
      },
      {
        name: 'characters',
        label: 'Number of characters in the scene',
        kind: 'select',
        required: true,
        half: true,
        options: ['1', '2', '3', '4 or more', 'None (scenery only)', notSure],
      },
      {
        name: 'count',
        label: 'Approximate illustrations for the full project',
        kind: 'select',
        half: true,
        options: illustrationCounts,
      },
      {
        name: 'mood',
        label: 'Mood, setting and preferred colors',
        kind: 'textarea',
        placeholder: 'e.g. Calm and dreamy, a quiet seaside town, soft blues and warm oranges.',
      },
      files('Reference images', 'Style examples, sketches or photos that show what you have in mind.'),
    ],
  },
  {
    id: 'character-design',
    name: 'Character Design',
    description: 'Shape the look and personality of your main character.',
    note: 'Choose “Not applicable” for any feature your character does not have.',
    fields: [
      { name: 'name', label: 'Main character name', kind: 'text', required: true, half: true, placeholder: 'e.g. Mia' },
      {
        name: 'type',
        label: 'Character type',
        kind: 'radio',
        required: true,
        options: ['Human', 'Animal', 'Fantasy creature', 'Other'],
      },
      {
        name: 'species',
        label: 'Species or creature',
        kind: 'text',
        half: true,
        allowNotApplicable: true,
        hint: 'For animal, fantasy or other characters.',
        placeholder: 'e.g. a red fox, a small friendly dragon',
      },
      { name: 'age', label: 'Age or age range', kind: 'text', required: true, half: true, placeholder: 'e.g. 7 years old' },
      { name: 'gender', label: 'Gender', kind: 'text', half: true },
      { name: 'eyes', label: 'Eye color', kind: 'text', required: true, half: true, allowNotApplicable: true, placeholder: 'e.g. dark brown' },
      {
        name: 'color',
        label: 'Skin, fur or body color',
        kind: 'text',
        required: true,
        half: true,
        allowNotApplicable: true,
        placeholder: 'e.g. light brown skin, ginger fur',
      },
      { name: 'hairColor', label: 'Hair color', kind: 'text', required: true, half: true, allowNotApplicable: true, placeholder: 'e.g. black' },
      {
        name: 'hairstyle',
        label: 'Hairstyle',
        kind: 'text',
        required: true,
        half: true,
        allowNotApplicable: true,
        placeholder: 'e.g. two curly puffs',
      },
      {
        name: 'clothing',
        label: 'Clothing and accessories',
        kind: 'textarea',
        required: true,
        allowNotApplicable: true,
        placeholder: 'e.g. yellow raincoat, red boots and a star-shaped backpack',
      },
      {
        name: 'features',
        label: 'Distinctive visual features',
        kind: 'textarea',
        placeholder: 'e.g. freckles, round glasses, a missing front tooth',
      },
      {
        name: 'personality',
        label: 'Personality and expressions',
        kind: 'textarea',
        required: true,
        placeholder: 'e.g. curious and brave, but shy with new people. Often grinning.',
      },
      { name: 'style', label: 'Preferred illustration style', kind: 'select', required: true, half: true, options: styleOptions },
      {
        name: 'pose',
        label: 'Pose or action requested',
        kind: 'text',
        required: true,
        half: true,
        placeholder: 'e.g. waving while holding a kite',
      },
      files('Reference image', 'Sketches, photos or characters you like.'),
    ],
  },
  {
    id: 'activity-book-illustration',
    name: 'Activity Book Illustration',
    description: 'Coloring, puzzle and learning pages planned for your readers’ age.',
    fields: [
      {
        name: 'bookType',
        label: 'Book type',
        kind: 'radio',
        required: true,
        options: ['Coloring', 'Puzzle', 'Educational', 'Mixed'],
      },
      { name: 'age', label: 'Target age group', kind: 'shared', ref: 'shared.ageGroup' },
      { name: 'pages', label: 'Approximate page count', kind: 'shared', ref: 'shared.length' },
      { name: 'theme', label: 'Theme or subject', kind: 'text', required: true, half: true, placeholder: 'e.g. ocean animals' },
      {
        name: 'color',
        label: 'Black-and-white or color',
        kind: 'select',
        required: true,
        half: true,
        options: ['Black-and-white', 'Full color', 'A mix of both', notSure],
      },
      {
        name: 'activities',
        label: 'Activity types required',
        kind: 'checkboxes',
        required: true,
        options: [
          'Coloring pages',
          'Mazes',
          'Dot-to-dot',
          'Word searches',
          'Spot the difference',
          'Matching',
          'Tracing and handwriting',
          'Counting and math',
          'Crosswords',
          'Other',
          notSure,
        ],
      },
      {
        name: 'goals',
        label: 'Educational goals or learning outcomes',
        kind: 'textarea',
        placeholder: 'e.g. recognizing numbers 1–10 and practicing pencil control',
      },
      {
        name: 'example',
        label: 'Example activity description',
        kind: 'textarea',
        required: true,
        placeholder: 'e.g. A maze where a turtle finds its way back to the sea, with shells to collect on the way.',
      },
      files('Reference files'),
    ],
  },
  {
    id: 'storybook-illustration',
    name: 'Storybook Illustration',
    description: 'Full pages, spreads and scenes that carry your story from cover to cover.',
    fields: [
      {
        name: 'types',
        label: 'Illustrations needed',
        kind: 'checkboxes',
        required: true,
        options: ['Full-page illustrations', 'Double-page spreads', 'Scene illustrations', 'Background design', notSure],
      },
      { name: 'summary', label: 'Story summary', kind: 'textarea', required: true },
      {
        name: 'passage',
        label: 'Sample passage or scene description',
        kind: 'textarea',
        required: true,
        hint: 'A short passage or one scene we could picture.',
      },
      {
        name: 'cast',
        label: 'Main characters and setting',
        kind: 'textarea',
        required: true,
        placeholder: 'e.g. Mia (7) and her grandfather, in a small fishing village by the sea',
      },
      {
        name: 'styleMood',
        label: 'Preferred style and mood',
        kind: 'text',
        required: true,
        half: true,
        placeholder: 'e.g. soft watercolor, cozy and gentle',
      },
      { name: 'count', label: 'Approximate illustration count', kind: 'select', required: true, half: true, options: illustrationCounts },
      { name: 'size', label: 'Book dimensions, if known', kind: 'text', half: true, placeholder: 'e.g. 8.5 × 8.5 in' },
      files('Manuscript excerpt or references'),
    ],
  },
  {
    id: 'editing-proofreading',
    name: 'Editing & Proofreading',
    description: 'Editing, proofreading, and Formatting & Layout for print and eBook.',
    fields: [
      {
        name: 'support',
        label: 'Requested support',
        kind: 'checkboxes',
        required: true,
        options: ['Editing', 'Proofreading', 'Formatting & Layout'],
      },
      { name: 'words', label: 'Manuscript word count', kind: 'shared', ref: 'shared.length' },
      { name: 'language', label: 'Manuscript language', kind: 'shared', ref: 'shared.language' },
      { name: 'age', label: 'Intended reader age', kind: 'shared', ref: 'shared.ageGroup' },
      {
        name: 'concerns',
        label: 'Specific concerns or areas needing attention',
        kind: 'textarea',
        required: true,
        placeholder: 'e.g. the rhythm of the rhyming lines, and whether the vocabulary suits 5-year-olds',
      },
      {
        name: 'sample',
        label: 'Sample text',
        kind: 'textarea',
        hint: 'Paste a short passage here, or upload the manuscript below.',
      },
      files('Manuscript upload'),
      { name: 'output', label: 'Print, eBook or both', kind: 'select', required: true, half: true, options: ['Print', 'eBook', 'Both', notSure] },
      { name: 'trim', label: 'Trim size, if known', kind: 'text', half: true, placeholder: 'e.g. 8 × 10 in' },
      {
        name: 'placement',
        label: 'Illustration placement requirements',
        kind: 'textarea',
        placeholder: 'e.g. one full-page illustration opposite each page of text',
      },
      { name: 'preferences', label: 'Formatting preferences or references', kind: 'textarea' },
    ],
  },
  {
    id: 'book-publishing-distribution',
    name: 'Book Publishing & Distribution',
    description: 'Preparing your files, formats and listings for publication.',
    note: 'Please do not include passwords or login details for any publishing account. We will never ask for them in this form.',
    fields: [
      {
        name: 'readiness',
        label: 'Current manuscript readiness',
        kind: 'select',
        required: true,
        half: true,
        options: ['Still writing', 'Complete, not yet edited', 'Edited and final', 'Formatted and print-ready', notSure],
      },
      {
        name: 'history',
        label: 'New or previously published title',
        kind: 'select',
        required: true,
        half: true,
        options: ['New title', 'Previously published', notSure],
      },
      {
        name: 'formats',
        label: 'Required formats',
        kind: 'checkboxes',
        required: true,
        options: ['Paperback', 'Hardcover', 'eBook', 'Need guidance'],
      },
      { name: 'pages', label: 'Approximate page count', kind: 'shared', ref: 'shared.length' },
      { name: 'trim', label: 'Trim size, if known', kind: 'text', half: true, placeholder: 'e.g. 8.5 × 8.5 in' },
      { name: 'isbn', label: 'Existing ISBN status', kind: 'select', required: true, half: true, options: ['I have ISBNs', 'I need ISBN guidance', notSure] },
      { name: 'cover', label: 'Cover file readiness', kind: 'select', required: true, half: true, options: fileReadiness },
      { name: 'interior', label: 'Interior file readiness', kind: 'select', required: true, half: true, options: fileReadiness },
      {
        name: 'platforms',
        label: 'Desired publishing platforms',
        kind: 'checkboxes',
        options: ['Amazon KDP', 'IngramSpark', 'Barnes & Noble Press', 'Apple Books', 'Kobo', 'Google Play Books', 'Need guidance'],
      },
      { name: 'markets', label: 'Target markets', kind: 'text', half: true, placeholder: 'e.g. US and UK' },
      { name: 'release', label: 'Planned release timing', kind: 'text', half: true, placeholder: 'e.g. spring next year' },
      files('Supporting files', 'For example the manuscript, a cover draft or interior pages.'),
    ],
  },
  {
    id: 'book-marketing',
    name: 'Book Marketing',
    description: 'Amazon, launches, branding, social media, advertising, content and author websites.',
    note: 'Please do not include passwords or login details for any account.',
    fields: [
      { name: 'status', label: 'Published or upcoming title', kind: 'radio', required: true, options: ['Published', 'Upcoming'] },
      {
        name: 'link',
        label: 'Public book link',
        kind: 'text',
        inputType: 'url',
        half: true,
        hint: 'If available, for example the book’s store page.',
        placeholder: 'https://',
      },
      { name: 'release', label: 'Release date, if known', kind: 'text', half: true, placeholder: 'e.g. 15 March' },
      {
        name: 'goals',
        label: 'Main marketing goals',
        kind: 'textarea',
        required: true,
        placeholder: 'e.g. plan a launch, improve the Amazon listing, build an author presence',
      },
      {
        name: 'audience',
        label: 'Target audience',
        kind: 'text',
        required: true,
        placeholder: 'e.g. parents of 4–7-year-olds, teachers, school librarians',
      },
      {
        name: 'interests',
        label: 'Services of interest',
        kind: 'checkboxes',
        required: true,
        options: [
          'Amazon Marketing',
          'Launch Campaigns',
          'Author Branding',
          'Social Media Marketing',
          'Book Promotion',
          'Advertising',
          'Content Creation',
          'Website',
          notSure,
        ],
      },
      { name: 'links', label: 'Existing website and social links', kind: 'textarea', placeholder: 'One link per line' },
      { name: 'previous', label: 'Previous marketing activity', kind: 'textarea' },
      { name: 'timing', label: 'Preferred campaign timing', kind: 'text', half: true, placeholder: 'e.g. six weeks before launch' },
      { name: 'details', label: 'Additional project details', kind: 'textarea' },
    ],
  },
  {
    id: 'childrens-book-translation',
    name: 'Children’s Book Translation',
    description: 'Translation that keeps your story’s meaning, voice and read-aloud rhythm.',
    fields: [
      { name: 'source', label: 'Source language', kind: 'shared', ref: 'shared.language' },
      { name: 'words', label: 'Approximate word count', kind: 'shared', ref: 'shared.length' },
      { name: 'age', label: 'Reader age group', kind: 'shared', ref: 'shared.ageGroup' },
      {
        name: 'targets',
        label: 'Target language or languages',
        kind: 'text',
        required: true,
        hint: 'Include the region if it matters, for example Spanish for Mexico.',
        placeholder: 'e.g. French, German',
      },
      {
        name: 'scope',
        label: 'Translation only, or with layout adaptation',
        kind: 'radio',
        required: true,
        options: ['Translation only', 'Translation with layout adaptation', notSure],
      },
      { name: 'rhyme', label: 'Rhyming or non-rhyming text', kind: 'radio', required: true, options: ['Rhyming', 'Non-rhyming', 'A mix of both'] },
      {
        name: 'formats',
        label: 'Intended publishing formats',
        kind: 'checkboxes',
        required: true,
        options: ['Print', 'eBook', 'Read-aloud or audio', notSure],
      },
      {
        name: 'notes',
        label: 'Cultural or terminology notes',
        kind: 'textarea',
        placeholder: 'e.g. character names to keep, a made-up word, a holiday that may need adapting',
      },
      { name: 'sample', label: 'Short sample text', kind: 'textarea', hint: 'Paste a short passage, or upload the manuscript below.' },
      files('Manuscript upload'),
    ],
  },
  {
    id: '2d-3d-animation',
    name: '2D & 3D Animation',
    description: 'Book trailers, character, story and educational animation.',
    fields: [
      { name: 'approach', label: 'Preferred approach', kind: 'radio', required: true, options: ['2D', '3D', 'Need guidance'] },
      {
        name: 'type',
        label: 'Animation type',
        kind: 'radio',
        required: true,
        options: ['Book Trailer', 'Character Animation', 'Story Animation', 'Educational Video', 'Other'],
      },
      {
        name: 'purpose',
        label: 'Project purpose',
        kind: 'textarea',
        required: true,
        placeholder: 'e.g. a short trailer for the book launch, shared on my website and social channels',
      },
      {
        name: 'duration',
        label: 'Approximate duration',
        kind: 'select',
        required: true,
        half: true,
        options: ['Under 30 seconds', '30–60 seconds', '1–3 minutes', '3–5 minutes', 'Longer than 5 minutes', notSure],
      },
      {
        name: 'script',
        label: 'Script readiness',
        kind: 'select',
        required: true,
        half: true,
        options: ['Script ready', 'Draft or outline', 'No script yet', notSure],
      },
      {
        name: 'assets',
        label: 'Existing material',
        kind: 'checkboxes',
        options: ['Character designs', 'Book illustrations', 'Storyboard', 'None yet'],
      },
      {
        name: 'concept',
        label: 'Scene or concept description',
        kind: 'textarea',
        required: true,
        placeholder: 'e.g. Mia finds the moon shell, it glows, and the title appears over the waves.',
      },
      { name: 'sound', label: 'Sound requirements', kind: 'checkboxes', options: ['Voiceover', 'Music', 'Sound effects', 'Captions', notSure] },
      {
        name: 'platforms',
        label: 'Intended platforms',
        kind: 'checkboxes',
        options: ['Website', 'YouTube', 'Instagram', 'TikTok', 'Facebook', 'Events or presentations', notSure],
      },
      {
        name: 'aspect',
        label: 'Aspect ratio',
        kind: 'select',
        half: true,
        options: ['Widescreen (16:9)', 'Square (1:1)', 'Vertical (9:16)', 'Several versions', notSure],
      },
      { name: 'links', label: 'Public reference links', kind: 'textarea', placeholder: 'One link per line' },
      files('Reference files'),
    ],
  },
]

export const contactFields: FieldDef[] = [
  { name: 'fullName', label: 'Full name', kind: 'text', required: true, half: true, autoComplete: 'name', maxLength: 100 },
  { name: 'email', label: 'Email address', kind: 'text', inputType: 'email', required: true, half: true, autoComplete: 'email', maxLength: 254 },
  {
    name: 'phone',
    label: 'Phone number',
    kind: 'text',
    inputType: 'tel',
    half: true,
    autoComplete: 'tel',
    maxLength: 30,
    hint: 'Include the country code. Required if you prefer a call.',
    placeholder: '+1 555 123 4567',
  },
  { name: 'location', label: 'Country or time zone', kind: 'text', half: true, autoComplete: 'country-name', placeholder: 'e.g. United Kingdom' },
  { name: 'contactMethod', label: 'Preferred contact method', kind: 'radio', required: true, options: ['Email', 'Phone', 'Either'] },
  { name: 'message', label: 'Additional message', kind: 'textarea' },
]

export const serviceIds = services.map((service) => service.id)
export const serviceById = Object.fromEntries(services.map((service) => [service.id, service])) as Record<string, ServiceDef>

/* ------------------------------------------------------------------ keys and sections */

export const sharedKey = (name: string) => `shared.${name}`
export const contactKey = (name: string) => `contact.${name}`
export const serviceKey = (serviceId: string, name: string) => `svc.${serviceId}.${name}`

export type Section = { id: string; title: string; fields: { key: string; def: FieldDef }[] }

/** The sections for a set of selected services, in display order: project, each service, contact. */
export function sectionsFor(selected: readonly string[]): Section[] {
  const chosen = services.filter((service) => selected.includes(service.id))
  return [
    { id: 'shared', title: 'Project details', fields: sharedFields.map((def) => ({ key: sharedKey(def.name), def })) },
    ...chosen.map((service) => ({
      id: service.id,
      title: service.name,
      fields: service.fields.map((def) => ({ key: serviceKey(service.id, def.name), def })),
    })),
    { id: 'contact', title: 'Contact information', fields: contactFields.map((def) => ({ key: contactKey(def.name), def })) },
  ]
}

/** Keys of the file fields that belong to the selected services. */
export function fileKeysFor(selected: readonly string[]) {
  return sectionsFor(selected).flatMap((section) => section.fields.filter((f) => f.def.kind === 'files').map((f) => f.key))
}

/* ------------------------------------------------------------------ values and validation */

export type Value = string | string[]
export type Values = Record<string, Value>
export type Errors = Record<string, string>

export const limits = {
  text: 200,
  textarea: 3000,
  services: serviceIds.length,
}

const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:".]+(\.[^\s@<>()[\]\\,;:".]+)+$/
const PHONE = /^\+?[\d\s().-]+$/
// oxlint-disable-next-line no-control-regex -- control characters (including CR/LF) never belong in one-line fields
const CONTROL = /[\u0000-\u001f\u007f]/g
// oxlint-disable-next-line no-control-regex -- keep line breaks in long text, drop other control characters
const CONTROL_EXCEPT_NEWLINE = /[\u0000-\u0009\u000b-\u001f\u007f]/g

const isRequired = (key: string, def: FieldDef, selected: readonly string[], values: Values) => {
  if (def.required) return true
  if (key === 'shared.length') return selected.some((id) => needsLength.includes(id))
  if (key === 'contact.phone') return values['contact.contactMethod'] === 'Phone' || values['contact.contactMethod'] === 'Either'
  return false
}

export const isRequiredField = isRequired

const maxLengthOf = (def: FieldDef) => def.maxLength ?? (def.kind === 'textarea' ? limits.textarea : limits.text)

function clean(def: FieldDef, raw: unknown): Value {
  if (def.kind === 'checkboxes') {
    const list = Array.isArray(raw) ? raw : []
    return [...new Set(list.filter((item): item is string => typeof item === 'string'))]
  }
  const text = typeof raw === 'string' ? raw : ''
  if (def.kind === 'textarea') return text.replace(/\r\n?/g, '\n').replace(CONTROL_EXCEPT_NEWLINE, '').trim()
  return text.replace(CONTROL, ' ').replace(/\s+/g, ' ').trim()
}

function checkField(key: string, def: FieldDef, value: Value, required: boolean): string | undefined {
  const label = def.label.charAt(0).toLowerCase() + def.label.slice(1)
  if (def.kind === 'checkboxes') {
    const list = value as string[]
    if (required && !list.length) return `Please choose at least one option for ${label}.`
    if (list.some((item) => !def.options?.includes(item))) return 'Please choose options from the list.'
    return undefined
  }
  const text = value as string
  if (!text) {
    if (!required) return undefined
    if (def.kind === 'select' || def.kind === 'radio') return `Please choose ${label}.`
    return `Please enter ${label}.`
  }
  if ((def.kind === 'select' || def.kind === 'radio') && !def.options?.includes(text)) return 'Please choose an option from the list.'
  if (text.length > maxLengthOf(def)) return `Please keep this under ${maxLengthOf(def)} characters.`
  if (key === 'contact.email' && !EMAIL.test(text)) return 'Please enter a valid email address, like name@example.com.'
  if (key === 'contact.phone') {
    const digits = text.replace(/\D/g, '').length
    if (!PHONE.test(text) || digits < 7 || digits > 15) return 'Please enter a valid phone number with its country code, like +44 20 7946 0000.'
  }
  if (def.inputType === 'url' && !/^https?:\/\/[^\s/$.?#][^\s]*$/i.test(text)) return 'Please enter a full web address starting with https://.'
  return undefined
}

/**
 * Cleans untrusted input and checks it. Only the sections for the selected services are read, so answers
 * left in a deselected service never reach validation, the summary or the email. File fields are checked
 * separately (see checkFiles), and "shared" echo fields carry no value of their own.
 */
export function validateRequest(input: unknown): { selected: string[]; values: Values; errors: Errors } {
  const raw = (input && typeof input === 'object' ? input : {}) as { services?: unknown; values?: unknown }
  const rawValues = (raw.values && typeof raw.values === 'object' ? raw.values : {}) as Record<string, unknown>
  const selected = serviceIds.filter((id) => Array.isArray(raw.services) && raw.services.includes(id))

  const values: Values = {}
  const errors: Errors = {}
  if (!selected.length) errors.services = 'Please choose at least one service.'

  const sections = sectionsFor(selected)
  for (const section of sections) {
    for (const { key, def } of section.fields) {
      if (def.kind === 'files' || def.kind === 'shared') continue
      values[key] = clean(def, rawValues[key])
    }
  }
  for (const section of sections) {
    for (const { key, def } of section.fields) {
      if (def.kind === 'files' || def.kind === 'shared') continue
      const error = checkField(key, def, values[key], isRequired(key, def, selected, values))
      if (error) errors[key] = error
    }
  }
  return { selected, values, errors }
}

/* ------------------------------------------------------------------ files */

export const fileRules = {
  maxFiles: 8,
  maxFileBytes: 10 * 1024 * 1024,
  // Attachments travel in the email; base64 adds about a third, so this keeps messages under common 25 MB limits.
  maxTotalBytes: 15 * 1024 * 1024,
  extensions: ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'doc', 'docx', 'txt'],
  accept: '.jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.txt',
  summary: 'JPG, PNG, WEBP, PDF, DOC, DOCX or TXT. Up to 10 MB per file, 8 files and 15 MB in total.',
}

export const extensionOf = (name: string) => (/\.([a-z0-9]+)$/i.exec(name)?.[1] ?? '').toLowerCase()

export const formatBytes = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`

/** Checks names and sizes (the server also checks each file's contents). Returns an error message or null. */
export function checkFiles(list: { name: string; size: number }[]): string | null {
  if (list.length > fileRules.maxFiles) return `Please attach no more than ${fileRules.maxFiles} files in total.`
  for (const file of list) {
    if (!fileRules.extensions.includes(extensionOf(file.name))) return `“${file.name}” is not a supported file type. Use ${fileRules.summary.split('.')[0]}.`
    if (file.size === 0) return `“${file.name}” is empty.`
    if (file.size > fileRules.maxFileBytes) return `“${file.name}” is larger than 10 MB.`
  }
  if (list.reduce((sum, file) => sum + file.size, 0) > fileRules.maxTotalBytes) return 'Your files add up to more than 15 MB. Please remove or compress some.'
  return null
}

/* ------------------------------------------------------------------ summary */

export type SummaryRow = { label: string; value: string }
export type SummarySection = { id: string; title: string; rows: SummaryRow[] }

/**
 * The readable record of a request, used by the review step and the email. Empty optional answers are
 * left out; shared echo fields are left out because the project section already lists them.
 */
export function summarize(selected: readonly string[], values: Values, fileNames: Record<string, string[]> = {}): SummarySection[] {
  return sectionsFor(selected).map((section) => ({
    id: section.id,
    title: section.title,
    rows: section.fields.flatMap(({ key, def }): SummaryRow[] => {
      if (def.kind === 'shared') return []
      if (def.kind === 'files') {
        const names = fileNames[key] ?? []
        return names.length ? [{ label: def.label, value: names.join('\n') }] : []
      }
      const value = values[key]
      const text = Array.isArray(value) ? value.join(', ') : (value ?? '')
      return text ? [{ label: def.label, value: text }] : []
    }),
  }))
}
