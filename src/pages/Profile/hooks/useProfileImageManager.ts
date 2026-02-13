import { useQueryClient } from '@tanstack/react-query'
import { useState, type ChangeEvent } from 'react'
import type { TFunction } from 'i18next'

import type { ToastContextValue } from '../../../components/feedback/ToastContext'
import {
  USER_IMAGE_ALLOWED_MIME_TYPES,
  USER_IMAGE_MAX_SIZE_BYTES,
  USER_IMAGE_MAX_SIZE_MB,
} from '../../../constants/users'
import { useDeleteUserProfileImageMutation } from '../../../hooks/useDeleteUserProfileImageMutation'
import { useUpsertUserProfileImageMutation } from '../../../hooks/useUpsertUserProfileImageMutation'
import type { CurrentUser } from '../../../types/users'
import {
  getDefaultUserProfileImageAltText,
  hasUserProfileImage,
} from '../../../utils/userImages'
import { userProfileQueryKey } from './useUserProfile'
import {
  getProfileImageDeleteErrorKey,
  getProfileImageSaveErrorKey,
} from '../services/profileErrors'

type UseProfileImageManagerOptions = {
  user: CurrentUser | null | undefined
  t: TFunction
  showToast: ToastContextValue['showToast']
}

type UseProfileImageManagerResult = {
  validationError: string | null
  actionError: string | null
  uploadProgress: number | null
  hasExistingImage: boolean
  isSaving: boolean
  isDeleting: boolean
  canDelete: boolean
  handleImageFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  handleDeleteImage: () => void
}

const getImageValidationError = (file: File, t: TFunction) => {
  if (
    !USER_IMAGE_ALLOWED_MIME_TYPES.includes(
      file.type as (typeof USER_IMAGE_ALLOWED_MIME_TYPES)[number],
    )
  ) {
    return t('validation.imageType', {
      formats: USER_IMAGE_ALLOWED_MIME_TYPES.map((type) =>
        type.replace('image/', '').toUpperCase(),
      ).join(', '),
    })
  }

  if (file.size > USER_IMAGE_MAX_SIZE_BYTES) {
    return t('validation.imageSize', {
      size: USER_IMAGE_MAX_SIZE_MB,
    })
  }

  return null
}

export const useProfileImageManager = ({
  user,
  t,
  showToast,
}: UseProfileImageManagerOptions): UseProfileImageManagerResult => {
  const queryClient = useQueryClient()
  const upsertMutation = useUpsertUserProfileImageMutation()
  const deleteMutation = useDeleteUserProfileImageMutation()
  const [validationError, setValidationError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)

  const userId = typeof user?.id === 'number' ? user.id : null
  const hasExistingImage = hasUserProfileImage(user?.profileImage)
  const defaultAltText = getDefaultUserProfileImageAltText(user?.username)

  const isSaving = upsertMutation.isPending
  const isDeleting = deleteMutation.isPending

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !userId || isSaving || isDeleting) {
      event.currentTarget.value = ''
      return
    }

    const imageValidationError = getImageValidationError(file, t)
    if (imageValidationError) {
      setValidationError(imageValidationError)
      setUploadProgress(null)
      event.currentTarget.value = ''
      return
    }

    setValidationError(null)
    setActionError(null)
    setUploadProgress(0)

    upsertMutation.mutate(
      {
        userId,
        file,
        altText: defaultAltText,
        mode: hasExistingImage ? 'update' : 'add',
        onProgress: (progress) => setUploadProgress(progress),
      },
      {
        onSuccess: (profileImage) => {
          queryClient.setQueryData<CurrentUser | undefined>(
            userProfileQueryKey,
            (previousUser) =>
              previousUser
                ? {
                    ...previousUser,
                    profileImage,
                  }
                : previousUser,
          )
          showToast({
            message: t('feedback.profile.imageSaved'),
            tone: 'success',
          })
          setValidationError(null)
          setActionError(null)
          setUploadProgress(null)
          void queryClient.invalidateQueries({ queryKey: userProfileQueryKey })
        },
        onError: (error) => {
          setUploadProgress(null)
          const errorKey = getProfileImageSaveErrorKey(error)
          setActionError(
            errorKey ? t(errorKey) : t('errors.profile.imageSaveFailed'),
          )
        },
      },
    )

    event.currentTarget.value = ''
  }

  const handleDeleteImage = () => {
    if (!userId || !hasExistingImage || isSaving || isDeleting) return

    setActionError(null)

    deleteMutation.mutate(
      { userId },
      {
        onSuccess: () => {
          queryClient.setQueryData<CurrentUser | undefined>(
            userProfileQueryKey,
            (previousUser) =>
              previousUser
                ? {
                    ...previousUser,
                    profileImage: undefined,
                  }
                : previousUser,
          )
          showToast({
            message: t('feedback.profile.imageDeleted'),
            tone: 'success',
          })
          setValidationError(null)
          setActionError(null)
          setUploadProgress(null)
          void queryClient.invalidateQueries({ queryKey: userProfileQueryKey })
        },
        onError: (error) => {
          const errorKey = getProfileImageDeleteErrorKey(error)
          setActionError(
            errorKey ? t(errorKey) : t('errors.profile.imageDeleteFailed'),
          )
        },
      },
    )
  }

  const canDelete = Boolean(userId && hasExistingImage && !isSaving && !isDeleting)

  return {
    validationError,
    actionError,
    uploadProgress,
    hasExistingImage,
    isSaving,
    isDeleting,
    canDelete,
    handleImageFileChange,
    handleDeleteImage,
  }
}
