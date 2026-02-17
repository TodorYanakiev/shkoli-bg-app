import httpClient from './httpClient'
import type {
  ChangePasswordRequest,
  CurrentUser,
  PageUserResponse,
  UsersPageQuery,
  UserImageRequest,
  UserImageResponse,
  UserResponse,
  UserUpdateRequest,
} from '../types/users'
import type { ApiError } from '../types/api'

const DEFAULT_USERS_PAGE_SIZE = 9
const ALL_USERS_PAGE_SIZE = 100

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

export const getUsersPage = async (
  query: UsersPageQuery = {},
) => {
  const response = await httpClient.get<PageUserResponse>(
    '/api/v1/users',
    {
      params: {
        page: query.page ?? 0,
        size: query.size ?? DEFAULT_USERS_PAGE_SIZE,
      },
    },
  )
  return response.data
}

export const getAllUsers = async () => {
  const firstPage = await getUsersPage({
    page: 0,
    size: ALL_USERS_PAGE_SIZE,
  })
  const totalPages = Math.max(firstPage.totalPages ?? 1, 1)

  if (totalPages <= 1) {
    return firstPage.content ?? []
  }

  const nextPageIndices = Array.from(
    { length: totalPages - 1 },
    (_, index) => index + 1,
  )
  const nextPages = await Promise.all(
    nextPageIndices.map((page) =>
      getUsersPage({
        page,
        size: firstPage.size || ALL_USERS_PAGE_SIZE,
      }),
    ),
  )

  return [
    ...(firstPage.content ?? []),
    ...nextPages.flatMap((page) => page.content ?? []),
  ]
}

export const getUserByEmail = async (email: string) => {
  const response = await httpClient.get<UserResponse>(
    '/api/v1/users/by-email',
    {
      params: { email },
    },
  )
  return response.data
}

const isNotFoundApiError = (error: unknown): error is ApiError => {
  if (typeof error !== 'object' || error === null) return false
  if (!('status' in error)) return false
  return (error as { status?: unknown }).status === 404
}

export const findUserByEmail = async (email: string) => {
  const normalizedEmail = email.trim()
  if (!normalizedEmail) return null

  try {
    return await getUserByEmail(normalizedEmail)
  } catch (error) {
    if (isNotFoundApiError(error)) {
      return null
    }
    throw error
  }
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
