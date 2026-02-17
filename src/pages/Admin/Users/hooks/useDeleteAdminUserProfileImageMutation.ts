import { useMutation } from '@tanstack/react-query'

import { deleteUserProfileImage } from '../../../../services/users'
import type { ApiError } from '../../../../types/api'

type DeleteAdminUserProfileImagePayload = {
  userId: number
}

export const deleteAdminUserProfileImageMutationKey = [
  'admin',
  'users',
  'profile-image',
  'delete',
] as const

export const useDeleteAdminUserProfileImageMutation = () =>
  useMutation<void, ApiError, DeleteAdminUserProfileImagePayload>({
    mutationKey: deleteAdminUserProfileImageMutationKey,
    mutationFn: ({ userId }) => deleteUserProfileImage(userId),
    retry: false,
  })
