import { useMutation } from '@tanstack/react-query'

import { changePassword } from '../../../services/users'
import type { ApiError } from '../../../types/api'
import type { ChangePasswordRequest } from '../../../types/users'

export const changePasswordMutationKey = ['users', 'change-password'] as const

export const useChangePasswordMutation = () =>
  useMutation<void, ApiError, ChangePasswordRequest>({
    mutationKey: changePasswordMutationKey,
    mutationFn: changePassword,
    retry: false,
  })
