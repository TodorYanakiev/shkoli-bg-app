import type { CourseAgeGroup, CourseResponse, CourseScheduleDayOfWeek, CourseType } from '../../../types/courses'

export type AdminCourseSortKey =
  | ''
  | 'price,asc'
  | 'price,desc'
  | 'name,asc'
  | 'name,desc'

export type AdminCourseFilterQuery = {
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
  sort?: AdminCourseSortKey
}

export type AdminPageCourseResponse = {
  totalPages: number
  totalElements: number
  size: number
  content: CourseResponse[]
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
}

export type AdminCoursesPagination = {
  currentPage: number
  totalPages: number
  totalItems: number
  pageStart: number
  pageEnd: number
  canGoPrev: boolean
  canGoNext: boolean
  hasMultiplePages: boolean
  goToPrev: () => void
  goToNext: () => void
}
