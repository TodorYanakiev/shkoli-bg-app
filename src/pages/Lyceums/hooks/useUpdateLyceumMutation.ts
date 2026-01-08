import { useMutation } from '@tanstack/react-query'

import { updateLyceum } from '../../../services/lyceums'
import type { ApiError } from '../../../types/api'
import type { LyceumRequest, LyceumResponse } from '../../../types/lyceums'

type UpdateLyceumPayload = {
  id: number
  payload: LyceumRequest
}

export const updateLyceumMutationKey = ['lyceums', 'update'] as const

export const useUpdateLyceumMutation = () =>
  useMutation<LyceumResponse, ApiError, UpdateLyceumPayload>({
    mutationKey: updateLyceumMutationKey,
    mutationFn: ({ id, payload }) => updateLyceum(id, payload),
    retry: false,
  })
