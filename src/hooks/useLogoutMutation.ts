import { useMutation } from '@tanstack/react-query'

import { logout } from '../services/auth'
import type { ApiError } from '../types/api'

export const logoutMutationKey = ['auth', 'logout'] as const

export const useLogoutMutation = () =>
  useMutation<void, ApiError, void>({
    mutationKey: logoutMutationKey,
    mutationFn: () => logout(),
    retry: false,
  })
