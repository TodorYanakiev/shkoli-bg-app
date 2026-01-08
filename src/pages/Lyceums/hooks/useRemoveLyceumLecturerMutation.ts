import { useMutation } from '@tanstack/react-query'

import { removeLyceumLecturer } from '../../../services/lyceums'
import type { ApiError } from '../../../types/api'

type RemoveLyceumLecturerPayload = {
  lyceumId: number
  userId: number
}

export const removeLyceumLecturerMutationKey = [
  'lyceums',
  'lecturers',
  'remove',
] as const

export const useRemoveLyceumLecturerMutation = () =>
  useMutation<void, ApiError, RemoveLyceumLecturerPayload>({
    mutationKey: removeLyceumLecturerMutationKey,
    mutationFn: ({ lyceumId, userId }) =>
      removeLyceumLecturer(lyceumId, userId),
    retry: false,
  })
