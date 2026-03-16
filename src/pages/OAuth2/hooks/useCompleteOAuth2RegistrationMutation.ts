import { useMutation } from '@tanstack/react-query'

import { completeOAuth2Registration } from '../services/oauth2AuthService'
import { toOAuth2CompleteError } from '../services/oauth2Errors'
import type { AppError } from '../../../types/appError'
import type { AuthenticationResponse } from '../../../types/auth'
import type { OAuth2CompleteRegistrationRequest } from '../types'

export const oauth2CompleteRegistrationMutationKey = [
  'auth',
  'oauth2',
  'complete-registration',
] as const

export const useCompleteOAuth2RegistrationMutation = () =>
  useMutation<
    AuthenticationResponse,
    AppError,
    OAuth2CompleteRegistrationRequest
  >({
    mutationKey: oauth2CompleteRegistrationMutationKey,
    mutationFn: async (payload) => {
      try {
        return await completeOAuth2Registration(payload)
      } catch (error) {
        throw toOAuth2CompleteError(error)
      }
    },
    retry: false,
  })
