import httpClient from './httpClient'
import type {
  AuthenticationRequest,
  AuthenticationResponse,
  RegisterRequest,
} from '../types/auth'

export const authenticate = async (payload: AuthenticationRequest) => {
  const response = await httpClient.post<AuthenticationResponse>(
    '/api/v1/auth/authenticate',
    payload,
  )
  return response.data
}

export const register = async (payload: RegisterRequest) => {
  const response = await httpClient.post<AuthenticationResponse>(
    '/api/v1/auth/register',
    payload,
  )
  return response.data
}

export const logout = async () => {
  await httpClient.post('/api/v1/auth/logout')
}
