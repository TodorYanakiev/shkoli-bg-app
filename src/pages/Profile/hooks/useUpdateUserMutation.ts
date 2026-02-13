import { useMutation } from '@tanstack/react-query'

import { updateUser } from '../../../services/users'
import type { ApiError } from '../../../types/api'
import type { UserResponse, UserUpdateRequest } from '../../../types/users'

type UpdateUserMutationPayload = {
  userId: number
  payload: UserUpdateRequest
}

export const updateUserMutationKey = ['users', 'update'] as const

export const useUpdateUserMutation = () =>
  useMutation<UserResponse, ApiError, UpdateUserMutationPayload>({
    mutationKey: updateUserMutationKey,
    mutationFn: ({ userId, payload }) => updateUser(userId, payload),
    retry: false,
  })
