import { useMutation } from '@tanstack/react-query'

import { deleteCourseImage } from '../../../services/courses'
import type { ApiError } from '../../../types/api'

type DeleteCourseImagePayload = {
  courseId: number
  imageId: number
}

export const deleteCourseImageMutationKey = [
  'courses',
  'images',
  'delete',
] as const

export const useDeleteCourseImageMutation = () =>
  useMutation<void, ApiError, DeleteCourseImagePayload>({
    mutationKey: deleteCourseImageMutationKey,
    mutationFn: ({ courseId, imageId }) =>
      deleteCourseImage(courseId, imageId),
    retry: false,
  })
