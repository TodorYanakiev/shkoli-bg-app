import { useMutation } from '@tanstack/react-query'

import type { ApiError } from '../../../../types/api'
import type { LyceumRequest, LyceumResponse } from '../../../../types/lyceums'
import { createAdminLyceum } from '../services/adminLyceumsService'

type CreateAdminLyceumPayload = {
  payload: LyceumRequest
}

export const createAdminLyceumMutationKey = [
  'admin',
  'lyceums',
  'create',
] as const

export const useCreateAdminLyceumMutation = () =>
  useMutation<LyceumResponse, ApiError, CreateAdminLyceumPayload>({
    mutationKey: createAdminLyceumMutationKey,
    mutationFn: ({ payload }) => createAdminLyceum(payload),
    retry: false,
  })
