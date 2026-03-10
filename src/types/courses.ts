export type CourseType =
  | 'DANCE'
  | 'MUSIC'
  | 'SINGING'
  | 'ACTING'
  | 'PHOTOGRAPHY'
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
  | 'PIANO'
  | 'GUITAR'
  | 'VIOLIN'
  | 'ACCORDION'
  | 'DRUMS'
  | 'PIPE'
  | 'FLUTE'
  | 'KAVAL'
  | 'TAMBURA'
  | 'TRUMPET'
  | 'MANDOLINE'
  | 'SAXOPHONE'
  | 'SYNTHESIZER'
  | 'GADULKA'
  | 'VOCAL_SINGING'
  | 'FOLK_SINGING'
  | 'POP_SINGING'
  | 'CLASSICAL_SINGING'
  | 'OPERA_SINGING'
  | 'CHOIR_SINGING'
  | 'FOLK_DANCES'
  | 'BALLET'
  | 'MODERN_DANCES'
  | 'HIP_HOP_DANCES'
  | 'LATIN_DANCES'
  | 'SPORT_DANCES'
  | 'ZUMBA'
  | 'K_POP_DANCES'
  | 'PAINTING'
  | 'ICONOGRAPHY'
  | 'CERAMICS'
  | 'GLASS_PAINTING'
  | 'EMBROIDERY'
  | 'BATIK'
  | 'DECOUPAGE'
  | 'QUILLING'
  | 'WEAVING'
  | 'POTTERY'
  | 'JEWELRY_MAKING'
  | 'WOOD_CARVING'
  | 'HANDICRAFTS'
  | 'MARTENITSA_MAKING'
  | 'POETRY'
  | 'CREATIVE_WRITING'
  | 'DRAMA'
  | 'SPOKEN_WORD'
  | 'PUPPET_THEATER'
  | 'DRAMA_TROUPES'
  | 'HEALTH'
  | 'PATRIOTISM'
  | 'ECOLOGY'
  | 'CHESS'
  | 'COMPUTERS'
  | 'ROBOTICS'
  | 'NATIONAL_ASSESSMENT_BEL_MATH'
  | 'APPLYING_TO_ART_SCHOOLS'
  | 'TABLE_TENNIS'
  | 'AIKIDO'
  | 'AEROBICS'
  | 'SKATEBOARDING'
  | 'STUNT_DRIVING'
  | 'CALLIGRAPHY'
  | 'IKEBANA'

export type CourseExecutionType = 'INDIVIDUAL' | 'GROUP'

export type CourseActiveMonth =
  | 'JANUARY'
  | 'FEBRUARY'
  | 'MARCH'
  | 'APRIL'
  | 'MAY'
  | 'JUNE'
  | 'JULY'
  | 'AUGUST'
  | 'SEPTEMBER'
  | 'OCTOBER'
  | 'NOVEMBER'
  | 'DECEMBER'

export type CourseAgeGroup =
  | 'TODDLER'
  | 'CHILD'
  | 'TEEN'
  | 'ADULT'
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
  endTime?: string
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

export type CourseImageRequest = {
  s3Key?: string
  url?: string
  role: CourseImageRole
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
  executionType?: CourseExecutionType
  ageGroupList?: CourseAgeGroup[]
  schedule?: CourseSchedule
  mainImage?: CourseImageResponse
  address?: string
  price?: number
  facebookLink?: string
  websiteLink?: string
  lyceumId?: number
  achievements?: string
  activeStartMonth?: CourseActiveMonth
  activeEndMonth?: CourseActiveMonth
  lecturerIds?: number[]
  averageRating?: number
}

export type CourseRequest = {
  name: string
  description: string
  type: CourseType
  executionType?: CourseExecutionType
  ageGroupList: CourseAgeGroup[]
  schedule?: CourseSchedule
  address?: string
  price?: number
  facebookLink?: string
  websiteLink?: string
  lyceumId?: number
  achievements?: string
  activeStartMonth?: CourseActiveMonth
  activeEndMonth?: CourseActiveMonth
  lecturerIds?: number[]
}

export type CourseUpdateRequest = {
  name?: string
  description?: string
  type?: CourseType
  executionType?: CourseExecutionType
  ageGroupList?: CourseAgeGroup[]
  schedule?: CourseSchedule
  address?: string
  price?: number
  facebookLink?: string
  websiteLink?: string
  lyceumId?: number
  achievements?: string
  activeStartMonth?: CourseActiveMonth
  activeEndMonth?: CourseActiveMonth
  lecturerIds?: number[]
  lecturerIdsToAdd?: number[]
  lecturerIdsToRemove?: number[]
}
