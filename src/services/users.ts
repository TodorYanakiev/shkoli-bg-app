import httpClient from './httpClient'
import type { ChangePasswordRequest, CurrentUser } from '../types/users'

export const getCurrentUser = async () => {
  const response = await httpClient.get<CurrentUser>('/api/v1/users/me')
  return response.data
}

export const changePassword = async (payload: ChangePasswordRequest) => {
  await httpClient.patch('/api/v1/users', payload)
}
