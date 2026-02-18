import { useMutation } from '@tanstack/react-query'

import { deleteCourse } from '../../../../services/courses'
import type { ApiError } from '../../../../types/api'

type DeleteAdminCoursePayload = {
  id: number
}

export const deleteAdminCourseMutationKey = [
  'admin',
  'courses',
  'delete',
] as const

export const useDeleteAdminCourseMutation = () =>
  useMutation<void, ApiError, DeleteAdminCoursePayload>({
    mutationKey: deleteAdminCourseMutationKey,
    mutationFn: ({ id }) => deleteCourse(id),
    retry: false,
  })
