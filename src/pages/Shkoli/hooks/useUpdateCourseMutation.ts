import { useMutation } from '@tanstack/react-query'

import { updateCourse } from '../../../services/courses'
import type { ApiError } from '../../../types/api'
import type {
  CourseResponse,
  CourseUpdateRequest,
} from '../../../types/courses'

type UpdateCoursePayload = {
  id: number
  payload: CourseUpdateRequest
}

export const updateCourseMutationKey = ['courses', 'update'] as const

export const useUpdateCourseMutation = () =>
  useMutation<CourseResponse, ApiError, UpdateCoursePayload>({
    mutationKey: updateCourseMutationKey,
    mutationFn: ({ id, payload }) => updateCourse(id, payload),
    retry: false,
  })
