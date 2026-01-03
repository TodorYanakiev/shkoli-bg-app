import { useMutation } from '@tanstack/react-query'

import { register } from '../../../services/auth'
import type { ApiError } from '../../../types/api'
import type { AuthenticationResponse, RegisterRequest } from '../../../types/auth'

export const registerMutationKey = ['auth', 'register'] as const

export const useRegisterMutation = () =>
  useMutation<AuthenticationResponse, ApiError, RegisterRequest>({
    mutationKey: registerMutationKey,
    mutationFn: register,
    retry: false,
  })
