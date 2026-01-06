export type CourseType =
  | 'DANCE'
  | 'MUSIC'
  | 'SINGING'
  | 'ACTING'
  | 'PHOTOGRAPHY'
  | 'PAINTING'
  | 'CRAFTING'
  | 'SPORT'
  | 'YOGA'
  | 'MARTIAL_ARTS'
  | 'MATH'
  | 'SCIENCE'
  | 'HISTORY'
  | 'GEOGRAPHY'
  | 'LITERATURE'
  | 'LANGUAGES'
  | 'DEBATES'
  | 'TECHNOLOGY'
  | 'COOKING'

export type CourseAgeGroup =
  | 'TODDLER'
  | 'CHILD'
  | 'PRE_TEEN'
  | 'TEEN'
  | 'YOUNG_ADULT'
  | 'ADULT'
  | 'MATURE_ADULT'
  | 'SENIOR'

export type CourseScheduleRecurrence = 'WEEKLY' | 'MONTHLY' | 'ONE_TIME'

export type CourseScheduleDayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY'

export type CourseScheduleSlot = {
  recurrence: CourseScheduleRecurrence
  dayOfWeek?: CourseScheduleDayOfWeek
  dayOfMonth?: number
  startTime?: string
  classesCount?: number
  singleClassDurationMinutes?: number
  gapBetweenClassesMinutes?: number
}

export type CourseScheduleSpecialCase = {
  date: string
  cancelled?: boolean
  reason?: string
}

export type CourseSchedule = {
  slots?: CourseScheduleSlot[]
  specialCases?: CourseScheduleSpecialCase[]
}

export type CourseImageRole = 'LOGO' | 'MAIN' | 'GALLERY'

export type CourseImageResponse = {
  id?: number
  courseId?: number
  s3Key?: string
  url?: string
  role?: CourseImageRole
  altText?: string
  width?: number
  height?: number
  mimeType?: string
  orderIndex?: number
}

export type CourseResponse = {
  id?: number
  name?: string
  description?: string
  type?: CourseType
  ageGroupList?: CourseAgeGroup[]
  schedule?: CourseSchedule
  images?: CourseImageResponse[]
  address?: string
  price?: number
  facebookLink?: string
  websiteLink?: string
  lyceumId?: number
  achievements?: string
  lecturerIds?: number[]
}
