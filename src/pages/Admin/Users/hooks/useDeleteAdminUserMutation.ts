import { useMutation } from '@tanstack/react-query'

import { deleteUser } from '../../../../services/users'
import type { ApiError } from '../../../../types/api'

type DeleteAdminUserPayload = {
  userId: number
}

export const deleteAdminUserMutationKey = [
  'admin',
  'users',
  'delete',
] as const

export const useDeleteAdminUserMutation = () =>
  useMutation<void, ApiError, DeleteAdminUserPayload>({
    mutationKey: deleteAdminUserMutationKey,
    mutationFn: ({ userId }) => deleteUser(userId),
    retry: false,
  })

