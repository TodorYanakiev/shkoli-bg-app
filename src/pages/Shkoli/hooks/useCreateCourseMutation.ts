import { useMutation } from '@tanstack/react-query'

import { createCourse } from '../../../services/courses'
import type { ApiError } from '../../../types/api'
import type { CourseRequest, CourseResponse } from '../../../types/courses'

export const createCourseMutationKey = ['courses', 'create'] as const

export const useCreateCourseMutation = () =>
  useMutation<CourseResponse, ApiError, CourseRequest>({
    mutationKey: createCourseMutationKey,
    mutationFn: (payload) => createCourse(payload),
    retry: false,
  })
