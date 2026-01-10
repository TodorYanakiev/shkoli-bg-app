import { useQuery } from '@tanstack/react-query'

import { getCourseById } from '../../../services/courses'
import type { ApiError } from '../../../types/api'
import type { CourseResponse } from '../../../types/courses'

export const courseDetailQueryKey = (id?: number) =>
  ['courses', 'detail', id] as const

type UseCourseOptions = {
  enabled?: boolean
}

export const useCourse = (id?: number, options: UseCourseOptions = {}) =>
  useQuery<CourseResponse, ApiError>({
    queryKey: courseDetailQueryKey(id),
    queryFn: () => getCourseById(id as number),
    enabled: Boolean(id) && (options.enabled ?? true),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  })
