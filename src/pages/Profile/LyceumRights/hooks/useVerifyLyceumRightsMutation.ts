import { useMutation } from '@tanstack/react-query'

import { verifyLyceumRights } from '../../../../services/lyceums'
import type { ApiError } from '../../../../types/api'
import type { LyceumRightsVerificationRequest } from '../../../../types/lyceums'

export const verifyLyceumRightsMutationKey = [
  'lyceums',
  'verify-rights',
] as const

export const useVerifyLyceumRightsMutation = () =>
  useMutation<string, ApiError, LyceumRightsVerificationRequest>({
    mutationKey: verifyLyceumRightsMutationKey,
    mutationFn: verifyLyceumRights,
    retry: false,
  })
