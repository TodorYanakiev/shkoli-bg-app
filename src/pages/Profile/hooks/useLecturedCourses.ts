import { useQuery } from '@tanstack/react-query'

import { getCoursesByLecturer } from '../../../services/courses'
import type { ApiError } from '../../../types/api'
import type { CourseResponse } from '../../../types/courses'

export const lecturedCoursesQueryKey = (lecturerId?: number) =>
  ['courses', 'lecturer', lecturerId] as const

type UseLecturedCoursesOptions = {
  enabled?: boolean
}

export const useLecturedCourses = (
  lecturerId?: number,
  options: UseLecturedCoursesOptions = {},
) =>
  useQuery<CourseResponse[], ApiError>({
    queryKey: lecturedCoursesQueryKey(lecturerId),
    queryFn: () => getCoursesByLecturer(lecturerId as number),
    enabled: Boolean(lecturerId) && (options.enabled ?? true),
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
