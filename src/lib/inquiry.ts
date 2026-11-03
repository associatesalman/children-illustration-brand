/**
 * Contact inquiry fields, service catalog and validation, shared by the
 * browser form and the server endpoint (server/contact.ts) so both apply the
 * same rules. No imports: Node runs this file directly with type stripping.
 *
 * Services come from the strategy document ("Childrens Brand Replica.docx",
 * Core Services) and the Book Illustration, Publishing and Marketing pages.
 */

export const serviceCatalog: Record<string, readonly string[]> = {
  Illustration: [
    'Character Design',
    'Picture Book Illustration',
    'Storybook Illustration',
    'Animal Illustration',
    'Educational Illustration',
    'Coloring Books',
    'Activity Books',
    'Comic Illustration',
    'Background and Scene Design',
  ],
  'Editing and Proofreading': [
    'Developmental Editing',
    'Line Editing',
    'Copy Editing',
    'Proofreading',
    'Children’s Content and Age-Appropriate Language Review',
  ],
  'Book Design and Formatting': ['Cover Design', 'Interior Layout and Typography', 'Print Formatting', 'eBook Formatting'],
  'Publishing and Distribution': [
    'Amazon KDP Setup',
    'Multi-Platform Distribution',
    'Print-on-Demand Setup',
    'ISBN Assistance',
    'Copyright Guidance',
    'Metadata Optimization',
    'Author Account Support',
  ],
  'Marketing and Author Branding': [
    'Amazon Listing Optimization',
    'A+ Content',
    'Amazon Advertising',
    'Book Launch Campaigns',
    'Social Media Marketing',
    'Author Branding',
    'Author Website',
    'Press Releases',
    'Book Trailers',
    'Animated Promotional Videos',
    'Merchandise Design',
    'Book Series Planning',
  ],
  // No sub-service to force here: the visitor picks the scope, or asks us to recommend one.
  'Complete Book Project': ['From idea to published book', 'From idea to published book, plus marketing'],
  'Not Sure / Need Guidance': ['I’d like a recommendation'],
}

export const mainServices = Object.keys(serviceCatalog)

export const projectStages = [
  'Idea Only',
  'Writing in Progress',
  'Manuscript Ready',
  'Illustrations in Progress',
  'Ready to Publish',
  'Already Published',
]

export type InquiryValues = {
  fullName: string
  email: string
  phone: string
  country: string
  mainService: string
  specificService: string
  projectStage: string
  details: string
}

export type InquiryField = keyof InquiryValues
export type InquiryErrors = Partial<Record<InquiryField, string>>

export const emptyInquiry: InquiryValues = {
  fullName: '',
  email: '',
  phone: '',
  country: '',
  mainService: '',
  specificService: '',
  projectStage: '',
  details: '',
}

export const fieldLimits: Record<InquiryField, number> = {
  fullName: 100,
  email: 254,
  phone: 30,
  country: 80,
  mainService: 60,
  specificService: 80,
  projectStage: 40,
  details: 5000,
}

export const detailsMinLength = 20

const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:".]+(\.[^\s@<>()[\]\\,;:".]+)+$/
const PHONE = /^\+?[\d\s().-]+$/
// Control characters (including CR/LF) are never valid in single-line fields.
// oxlint-disable-next-line no-control-regex -- matching control characters is the point
const CONTROL = /[\u0000-\u001f\u007f]/g

const text = (value: unknown) => (typeof value === 'string' ? value : '')

/** Normalizes untrusted input and returns the cleaned values with any field errors. */
export function validateInquiry(input: unknown): { values: InquiryValues; errors: InquiryErrors } {
  const raw = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>
  const line = (key: InquiryField) => text(raw[key]).replace(CONTROL, ' ').replace(/\s+/g, ' ').trim()
  const values: InquiryValues = {
    fullName: line('fullName'),
    email: line('email'),
    phone: line('phone'),
    country: line('country'),
    mainService: line('mainService'),
    specificService: line('specificService'),
    projectStage: line('projectStage'),
    // Keep line breaks in the details, drop other control characters.
    details: text(raw.details)
      .replace(/\r\n?/g, '\n')
      // oxlint-disable-next-line no-control-regex -- intentional, see above
      .replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, '')
      .trim(),
  }

  const errors: InquiryErrors = {}
  const tooLong = (key: InquiryField) => values[key].length > fieldLimits[key]

  if (!values.fullName) errors.fullName = 'Please enter your full name.'
  else if (tooLong('fullName')) errors.fullName = `Please keep your name under ${fieldLimits.fullName} characters.`

  if (!values.email) errors.email = 'Please enter your email address.'
  else if (tooLong('email') || !EMAIL.test(values.email)) errors.email = 'Please enter a valid email address, like name@example.com.'

  if (values.phone) {
    const digits = values.phone.replace(/\D/g, '').length
    if (tooLong('phone') || !PHONE.test(values.phone) || digits < 7 || digits > 15) {
      errors.phone = 'Please enter a valid phone number, including the country code if you are outside the US.'
    }
  }

  if (tooLong('country')) errors.country = `Please keep the country under ${fieldLimits.country} characters.`

  const specificOptions = serviceCatalog[values.mainService]
  if (!specificOptions) {
    errors.mainService = 'Please choose the service you need most.'
    values.specificService = ''
  } else if (values.specificService && !specificOptions.includes(values.specificService)) {
    errors.specificService = 'Please choose an option from the list.'
  }

  if (values.projectStage && !projectStages.includes(values.projectStage)) {
    errors.projectStage = 'Please choose an option from the list.'
  }

  if (!values.details) errors.details = 'Please tell us a little about your book.'
  else if (values.details.length < detailsMinLength) {
    errors.details = `Please add a little more detail (at least ${detailsMinLength} characters).`
  } else if (tooLong('details')) errors.details = `Please keep the details under ${fieldLimits.details} characters.`

  return { values, errors }
}
