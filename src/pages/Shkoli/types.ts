import type {
  CourseAgeGroup,
  CourseResponse,
  CourseType,
  CourseScheduleDayOfWeek,
} from '../../types/courses'

export const COURSE_SORT_OPTIONS = [
  '',
  'price,asc',
  'price,desc',
  'name,asc',
  'name,desc',
] as const

export type CourseSortKey = (typeof COURSE_SORT_OPTIONS)[number]

export type CourseFilterState = {
  courseTypes?: CourseType[]
  ageGroups?: CourseAgeGroup[]
  dayOfWeek?: CourseScheduleDayOfWeek[]
  town?: string
  startTimeFrom?: string
  startTimeTo?: string
  minPrice?: number
  maxPrice?: number
  sort?: CourseSortKey
  page: number
}

export type CourseFilterQuery = {
  page: number
  size: number
  courseTypes?: CourseType[]
  ageGroups?: CourseAgeGroup[]
  dayOfWeek?: CourseScheduleDayOfWeek[]
  town?: string
  startTimeFrom?: string
  startTimeTo?: string
  minPrice?: number
  maxPrice?: number
  sort?: CourseSortKey
}

export type SortObject = {
  empty?: boolean
  sorted?: boolean
  unsorted?: boolean
}

export type PageableObject = {
  offset?: number
  sort?: SortObject
  paged?: boolean
  pageSize?: number
  pageNumber?: number
  unpaged?: boolean
}

export type PageCourseResponse = {
  totalPages: number
  totalElements: number
  size: number
  content: CourseResponse[]
  number: number
  sort?: SortObject
  first: boolean
  last: boolean
  numberOfElements: number
  pageable?: PageableObject
  empty: boolean
}
