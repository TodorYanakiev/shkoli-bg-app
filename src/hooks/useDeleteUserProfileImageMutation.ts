import { useMutation } from '@tanstack/react-query'

import { deleteUserProfileImage } from '../services/users'
import type { ApiError } from '../types/api'

type DeleteUserProfileImagePayload = {
  userId: number
}

export const deleteUserProfileImageMutationKey = [
  'users',
  'profile-image',
  'delete',
] as const

export const useDeleteUserProfileImageMutation = () =>
  useMutation<void, ApiError, DeleteUserProfileImagePayload>({
    mutationKey: deleteUserProfileImageMutationKey,
    mutationFn: ({ userId }) => deleteUserProfileImage(userId),
    retry: false,
  })
