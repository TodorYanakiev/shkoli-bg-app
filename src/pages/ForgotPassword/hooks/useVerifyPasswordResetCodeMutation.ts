import { useMutation } from '@tanstack/react-query'

import { verifyPasswordResetCode } from '../../../services/auth'
import type { ApiError } from '../../../types/api'
import type { PasswordResetCodeVerificationRequest } from '../../../types/auth'

export const verifyPasswordResetCodeMutationKey = [
  'auth',
  'forgot-password',
  'verify',
] as const

export const useVerifyPasswordResetCodeMutation = () =>
  useMutation<string, ApiError, PasswordResetCodeVerificationRequest>({
    mutationKey: verifyPasswordResetCodeMutationKey,
    mutationFn: verifyPasswordResetCode,
    retry: false,
  })
