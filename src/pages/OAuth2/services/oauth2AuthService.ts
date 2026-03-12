import httpClient from '../../../services/httpClient'
import type { AuthenticationResponse } from '../../../types/auth'
import type { OAuth2CompleteRegistrationRequest } from '../types'

export const completeOAuth2Registration = async (
  payload: OAuth2CompleteRegistrationRequest,
) => {
  const response = await httpClient.post<AuthenticationResponse>(
    '/api/v1/auth/oauth2/complete',
    payload,
  )

  return response.data
}
