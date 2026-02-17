import { useMutation } from '@tanstack/react-query'

import { updateUser } from '../../../../services/users'
import type { ApiError } from '../../../../types/api'
import type { UserResponse } from '../../../../types/users'
import type { AdminUserUpdatePayload } from '../types'

export const updateAdminUserMutationKey = [
  'admin',
  'users',
  'update',
] as const

export const useUpdateAdminUserMutation = () =>
  useMutation<UserResponse, ApiError, AdminUserUpdatePayload>({
    mutationKey: updateAdminUserMutationKey,
    mutationFn: ({ userId, payload }) => updateUser(userId, payload),
    retry: false,
  })

