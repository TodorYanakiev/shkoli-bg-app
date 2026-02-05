import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type { ApiError } from '../../../types/api'
import { filterCourses } from '../services/courseFilterService'
import type { CourseFilterQuery, PageCourseResponse } from '../types'

export const coursesFilterQueryKey = (query: CourseFilterQuery) =>
  ['courses', 'filter', query] as const

export const useCoursesFilter = (query: CourseFilterQuery) =>
  useQuery<PageCourseResponse, ApiError>({
    queryKey: coursesFilterQueryKey(query),
    queryFn: () => filterCourses(query),
    placeholderData: keepPreviousData,
    retry: 1,
    staleTime: 60 * 1000,
  })
