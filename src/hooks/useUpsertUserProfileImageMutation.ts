import { useMutation } from '@tanstack/react-query'

import {
  uploadAndSaveUserProfileImage,
  type UploadAndSaveUserProfileImagePayload,
} from '../services/userProfileImageUpload'
import type { ApiError } from '../types/api'
import type { UserImageResponse } from '../types/users'

export const upsertUserProfileImageMutationKey = [
  'users',
  'profile-image',
  'upsert',
] as const

export const useUpsertUserProfileImageMutation = () =>
  useMutation<UserImageResponse, ApiError, UploadAndSaveUserProfileImagePayload>(
    {
      mutationKey: upsertUserProfileImageMutationKey,
      mutationFn: uploadAndSaveUserProfileImage,
      retry: false,
    },
  )
