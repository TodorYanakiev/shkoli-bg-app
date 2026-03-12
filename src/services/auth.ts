import httpClient from './httpClient'
import { env } from './env'
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

const toApiBaseUrl = () => {
  const configuredBaseUrl = env.apiBaseUrl.trim()

  if (/^https?:\/\//i.test(configuredBaseUrl)) {
    return configuredBaseUrl.endsWith('/')
      ? configuredBaseUrl
      : `${configuredBaseUrl}/`
  }

  const normalizedPath = configuredBaseUrl.startsWith('/')
    ? configuredBaseUrl
    : `/${configuredBaseUrl}`
  const normalizedBasePath = normalizedPath.endsWith('/')
    ? normalizedPath
    : `${normalizedPath}/`

  if (typeof window === 'undefined') {
    return `http://localhost${normalizedBasePath}`
  }

  return `${window.location.origin}${normalizedBasePath}`
}

export const getGoogleOAuthAuthorizationUrl = () =>
  new URL('oauth2/authorization/google', toApiBaseUrl()).toString()
