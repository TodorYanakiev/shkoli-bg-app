import { useMutation } from '@tanstack/react-query'

import { updateUserRole } from '../../../../services/users'
import type { ApiError } from '../../../../types/api'
import type { UserResponse, UserRoleUpdateRequest } from '../../../../types/users'

type UpdateAdminUserRolePayload = {
  userId: number
  payload: UserRoleUpdateRequest
}

export const updateAdminUserRoleMutationKey = [
  'admin',
  'users',
  'role',
  'update',
] as const

export const useUpdateAdminUserRoleMutation = () =>
  useMutation<UserResponse, ApiError, UpdateAdminUserRolePayload>({
    mutationKey: updateAdminUserRoleMutationKey,
    mutationFn: ({ userId, payload }) => updateUserRole(userId, payload),
    retry: false,
  })
