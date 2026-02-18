import { useQuery } from '@tanstack/react-query'

import { getCourseImages } from '../../../services/courses'
import type { ApiError } from '../../../types/api'
import type { CourseImageResponse } from '../../../types/courses'

export const courseImagesQueryKey = (id?: number) =>
  ['courses', 'images', id] as const

type UseCourseImagesOptions = {
  enabled?: boolean
}

export const useCourseImages = (
  id?: number,
  options: UseCourseImagesOptions = {},
) =>
  useQuery<CourseImageResponse[], ApiError>({
    queryKey: courseImagesQueryKey(id),
    queryFn: () => getCourseImages(id as number),
    enabled: Boolean(id) && (options.enabled ?? true),
    retry: (failureCount, error) =>
      error.status >= 500 && failureCount < 1,
    staleTime: 5 * 60 * 1000,
  })
