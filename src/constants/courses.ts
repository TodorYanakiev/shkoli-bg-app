export const COURSE_TYPES = [
  'DANCE',
  'MUSIC',
  'SINGING',
  'ACTING',
  'PHOTOGRAPHY',
  'PAINTING',
  'CRAFTING',
  'SPORT',
  'YOGA',
  'MARTIAL_ARTS',
  'MATH',
  'SCIENCE',
  'HISTORY',
  'GEOGRAPHY',
  'LITERATURE',
  'LANGUAGES',
  'DEBATES',
  'TECHNOLOGY',
  'COOKING',
] as const

export const COURSE_AGE_GROUPS = [
  'TODDLER',
  'CHILD',
  'PRE_TEEN',
  'TEEN',
  'YOUNG_ADULT',
  'ADULT',
  'MATURE_ADULT',
  'SENIOR',
] as const

export const COURSE_SCHEDULE_RECURRENCES = [
  'WEEKLY',
  'MONTHLY',
] as const

export const COURSE_DAYS_OF_WEEK = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
] as const

export const COURSE_IMAGE_ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const

export const COURSE_IMAGE_MAX_SIZE_MB = 5

export const COURSE_IMAGE_MAX_SIZE_BYTES =
  COURSE_IMAGE_MAX_SIZE_MB * 1024 * 1024
