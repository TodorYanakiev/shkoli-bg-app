import httpClient from './httpClient'
import type {
  ChangePasswordRequest,
  CurrentUser,
  UserResponse,
} from '../types/users'

export const getCurrentUser = async () => {
  const response = await httpClient.get<CurrentUser>('/api/v1/users/me')
  return response.data
}

export const changePassword = async (payload: ChangePasswordRequest) => {
  await httpClient.patch('/api/v1/users', payload)
}

export const getAllUsers = async () => {
  const response = await httpClient.get<UserResponse[]>('/api/v1/users')
  return response.data
}

export const getUserById = async (id: number) => {
  const response = await httpClient.get<UserResponse>(`/api/v1/users/${id}`)
  return response.data
}

export const getUsersByIds = async (ids: number[]) => {
  const uniqueIds = Array.from(new Set(ids)).filter((id) =>
    Number.isFinite(id),
  )
  if (uniqueIds.length === 0) return []
  const results = await Promise.allSettled(
    uniqueIds.map((id) => getUserById(id)),
  )
  return results
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value)
}
