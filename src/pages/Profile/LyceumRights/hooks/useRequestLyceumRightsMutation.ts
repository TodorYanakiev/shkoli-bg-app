import { useMutation } from '@tanstack/react-query'

import { requestLyceumRights } from '../../../../services/lyceums'
import type { ApiError } from '../../../../types/api'
import type { LyceumRightsRequest } from '../../../../types/lyceums'

export const requestLyceumRightsMutationKey = [
  'lyceums',
  'request-rights',
] as const

export const useRequestLyceumRightsMutation = () =>
  useMutation<string, ApiError, LyceumRightsRequest>({
    mutationKey: requestLyceumRightsMutationKey,
    mutationFn: requestLyceumRights,
    retry: false,
  })
