import { useMutation } from '@tanstack/react-query'

import { updateUser } from '../../../../services/users'
import type { ApiError } from '../../../../types/api'
import type { UserResponse, UserUpdateRequest } from '../../../../types/users'

type UpdateAdminUserPayload = {
  userId: number
  payload: UserUpdateRequest
}

export const updateAdminUserMutationKey = [
  'admin',
  'users',
  'update',
] as const

export const useUpdateAdminUserMutation = () =>
  useMutation<UserResponse, ApiError, UpdateAdminUserPayload>({
    mutationKey: updateAdminUserMutationKey,
    mutationFn: ({ userId, payload }) => updateUser(userId, payload),
    retry: false,
  })
