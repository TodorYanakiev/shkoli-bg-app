import { useMutation } from '@tanstack/react-query'

import { registerCourseImage } from '../../../services/courses'
import type { ApiError } from '../../../types/api'
import type {
  CourseImageRequest,
  CourseImageResponse,
} from '../../../types/courses'

type RegisterCourseImagePayload = {
  courseId: number
  data: CourseImageRequest
}

export const registerCourseImageMutationKey = [
  'courses',
  'images',
  'register',
] as const

export const useRegisterCourseImageMutation = () =>
  useMutation<CourseImageResponse, ApiError, RegisterCourseImagePayload>({
    mutationKey: registerCourseImageMutationKey,
    mutationFn: ({ courseId, data }) => registerCourseImage(courseId, data),
    retry: false,
  })
