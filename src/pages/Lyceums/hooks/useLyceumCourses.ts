import { useQuery } from '@tanstack/react-query'

import { getLyceumCourses } from '../../../services/lyceums'
import type { ApiError } from '../../../types/api'
import type { CourseResponse } from '../../../types/courses'

export const lyceumCoursesQueryKey = (id?: number) =>
  ['lyceums', 'courses', id] as const

type UseLyceumCoursesOptions = {
  enabled?: boolean
}

export const useLyceumCourses = (
  id?: number,
  options: UseLyceumCoursesOptions = {},
) =>
  useQuery<CourseResponse[], ApiError>({
    queryKey: lyceumCoursesQueryKey(id),
    queryFn: () => getLyceumCourses(id as number),
    enabled: Boolean(id) && (options.enabled ?? true),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  })
