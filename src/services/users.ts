import httpClient from './httpClient'
import type {
  ChangePasswordRequest,
  CurrentUser,
  UserUpdateRequest,
  UserImageRequest,
  UserImageResponse,
  UserResponse,
} from '../types/users'

export const getCurrentUser = async () => {
  const response = await httpClient.get<CurrentUser>('/api/v1/users/me')
  return response.data
}

export const changePassword = async (payload: ChangePasswordRequest) => {
  await httpClient.patch('/api/v1/users', payload)
}

export const updateUser = async (userId: number, payload: UserUpdateRequest) => {
  const response = await httpClient.put<UserResponse>(`/api/v1/users/${userId}`, payload)
  return response.data
}

export const deleteUser = async (userId: number) => {
  await httpClient.delete(`/api/v1/users/${userId}`)
}

export const getUserProfileImage = async (userId: number) => {
  const response = await httpClient.get<UserImageResponse>(
    `/api/v1/users/${userId}/profile-image`,
  )
  return response.data
}

export const addUserProfileImage = async (
  userId: number,
  payload: UserImageRequest,
) => {
  const response = await httpClient.post<UserImageResponse>(
    `/api/v1/users/${userId}/profile-image`,
    payload,
  )
  return response.data
}

export const updateUserProfileImage = async (
  userId: number,
  payload: UserImageRequest,
) => {
  const response = await httpClient.put<UserImageResponse>(
    `/api/v1/users/${userId}/profile-image`,
    payload,
  )
  return response.data
}

export const deleteUserProfileImage = async (userId: number) => {
  await httpClient.delete(`/api/v1/users/${userId}/profile-image`)
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
