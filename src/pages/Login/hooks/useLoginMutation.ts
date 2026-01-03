import { useMutation } from '@tanstack/react-query'

import { authenticate } from '../../../services/auth'
import type { ApiError } from '../../../types/api'
import type {
  AuthenticationRequest,
  AuthenticationResponse,
} from '../../../types/auth'

export const loginMutationKey = ['auth', 'login'] as const

export const useLoginMutation = () =>
  useMutation<AuthenticationResponse, ApiError, AuthenticationRequest>({
    mutationKey: loginMutationKey,
    mutationFn: authenticate,
    retry: false,
  })
