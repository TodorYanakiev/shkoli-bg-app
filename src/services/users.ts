import httpClient from './httpClient'
import type { CurrentUser } from '../types/users'

export const getCurrentUser = async () => {
  const response = await httpClient.get<CurrentUser>('/api/v1/users/me')
  return response.data
}
