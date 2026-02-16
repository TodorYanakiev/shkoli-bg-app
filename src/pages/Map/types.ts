import type {
  CourseAgeGroup,
  CourseResponse,
  CourseScheduleDayOfWeek,
  CourseType,
} from '../../types/courses'
import type { LyceumResponse } from '../../types/lyceums'
import type { CourseSortKey } from '../Shkoli/types'

export type MapFilterState = {
  search: string
  town: string
  courseTypes?: CourseType[]
  ageGroups?: CourseAgeGroup[]
  dayOfWeek?: CourseScheduleDayOfWeek[]
  startTimeFrom?: string
  startTimeTo?: string
  minPrice?: number
  maxPrice?: number
  courseSort?: CourseSortKey
}

export type MapLyceumFilterQuery = {
  town?: string
}

export type MapCourseFilterQuery = {
  town?: string
  courseTypes?: CourseType[]
  ageGroups?: CourseAgeGroup[]
  dayOfWeek?: CourseScheduleDayOfWeek[]
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

export type PageLyceumResponse = {
  totalPages: number
  totalElements: number
  size: number
  content: LyceumResponse[]
  number: number
  sort?: SortObject
  first: boolean
  last: boolean
  numberOfElements: number
  pageable?: PageableObject
  empty: boolean
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

export type MapExplorerItem = {
  lyceumId: number
  name: string
  town: string | null
  address: string | null
  averageRating: number | null
  latitude: number
  longitude: number
  imageUrl: string | null
  imageAlt: string | null
  activityCount: number
  categories: CourseType[]
  activities: CourseResponse[]
  lyceum: LyceumResponse
}

export type MapExplorerSummary = {
  lyceumsCount: number
  totalActivities: number
}
