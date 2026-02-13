import { useMutation } from '@tanstack/react-query'

import { deleteUser } from '../../../services/users'
import type { ApiError } from '../../../types/api'

type DeleteUserMutationPayload = {
  userId: number
}

export const deleteUserMutationKey = ['users', 'delete'] as const

export const useDeleteUserMutation = () =>
  useMutation<void, ApiError, DeleteUserMutationPayload>({
    mutationKey: deleteUserMutationKey,
    mutationFn: ({ userId }) => deleteUser(userId),
    retry: false,
  })
