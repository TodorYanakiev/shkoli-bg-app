import { useMutation } from '@tanstack/react-query'

import { requestPasswordReset } from '../../../services/auth'
import type { ApiError } from '../../../types/api'
import type { ForgotPasswordRequest } from '../../../types/auth'

export const requestPasswordResetMutationKey = [
  'auth',
  'forgot-password',
] as const

export const useRequestPasswordResetMutation = () =>
  useMutation<string, ApiError, ForgotPasswordRequest>({
    mutationKey: requestPasswordResetMutationKey,
    mutationFn: requestPasswordReset,
    retry: false,
  })
