import { useMutation } from '@tanstack/react-query'

import { resetForgottenPassword } from '../../../services/auth'
import type { ApiError } from '../../../types/api'
import type { ResetForgottenPasswordRequest } from '../../../types/auth'

export const resetForgottenPasswordMutationKey = [
  'auth',
  'forgot-password',
  'reset',
] as const

export const useResetForgottenPasswordMutation = () =>
  useMutation<string, ApiError, ResetForgottenPasswordRequest>({
    mutationKey: resetForgottenPasswordMutationKey,
    mutationFn: resetForgottenPassword,
    retry: false,
  })
