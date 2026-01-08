import { useMutation } from '@tanstack/react-query'

import { addLyceumLecturer } from '../../../services/lyceums'
import type { ApiError } from '../../../types/api'
import type { LyceumLecturerRequest } from '../../../types/lyceums'

type AddLyceumLecturerPayload = LyceumLecturerRequest

export const addLyceumLecturerMutationKey = [
  'lyceums',
  'lecturers',
  'add',
] as const

export const useAddLyceumLecturerMutation = () =>
  useMutation<void, ApiError, AddLyceumLecturerPayload>({
    mutationKey: addLyceumLecturerMutationKey,
    mutationFn: (payload) => addLyceumLecturer(payload),
    retry: false,
  })
