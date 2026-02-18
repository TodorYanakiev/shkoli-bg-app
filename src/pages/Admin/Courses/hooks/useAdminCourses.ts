import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type { ApiError } from '../../../../types/api'
import { fetchAdminCourses } from '../services/adminCoursesService'
import type { AdminCourseFilterQuery, AdminPageCourseResponse } from '../types'

export const adminCoursesQueryKeyPrefix = ['admin', 'courses', 'filter'] as const

export const adminCoursesQueryKey = (query: AdminCourseFilterQuery) =>
  [...adminCoursesQueryKeyPrefix, query] as const

export const useAdminCourses = (query: AdminCourseFilterQuery) =>
  useQuery<AdminPageCourseResponse, ApiError>({
    queryKey: adminCoursesQueryKey(query),
    queryFn: () => fetchAdminCourses(query),
    placeholderData: keepPreviousData,
    retry: 1,
    staleTime: 60 * 1000,
  })
