import { useEffect, useState, type ChangeEvent } from 'react'
import type { TFunction } from 'i18next'

import {
  USER_IMAGE_ALLOWED_MIME_TYPES,
  USER_IMAGE_MAX_SIZE_BYTES,
  USER_IMAGE_MAX_SIZE_MB,
} from '../../../constants/users'

type UseRegisterProfileImageResult = {
  selectedProfileImageFile: File | null
  selectedProfileImagePreviewUrl: string | null
  profileImageValidationError: string | null
  uploadProgress: number | null
  handleProfileImageFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  clearProfileImageSelection: () => void
  setUploadProgress: (progress: number | null) => void
  resetProfileImageUploadState: () => void
}

const getProfileImageValidationError = (file: File, t: TFunction) => {
  if (!USER_IMAGE_ALLOWED_MIME_TYPES.includes(file.type as (typeof USER_IMAGE_ALLOWED_MIME_TYPES)[number])) {
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

export const useRegisterProfileImage = (
  t: TFunction,
): UseRegisterProfileImageResult => {
  const [selectedProfileImageFile, setSelectedProfileImageFile] =
    useState<File | null>(null)
  const [selectedProfileImagePreviewUrl, setSelectedProfileImagePreviewUrl] =
    useState<string | null>(null)
  const [profileImageValidationError, setProfileImageValidationError] =
    useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)

  useEffect(() => {
    if (!selectedProfileImageFile) {
      setSelectedProfileImagePreviewUrl(null)
      return
    }

    const previewUrl = URL.createObjectURL(selectedProfileImageFile)
    setSelectedProfileImagePreviewUrl(previewUrl)

    return () => {
      URL.revokeObjectURL(previewUrl)
    }
  }, [selectedProfileImageFile])

  const handleProfileImageFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validationError = getProfileImageValidationError(file, t)
    if (validationError) {
      setProfileImageValidationError(validationError)
      event.currentTarget.value = ''
      return
    }

    setSelectedProfileImageFile(file)
    setProfileImageValidationError(null)
    setUploadProgress(null)
    event.currentTarget.value = ''
  }

  const clearProfileImageSelection = () => {
    setSelectedProfileImageFile(null)
    setProfileImageValidationError(null)
    setUploadProgress(null)
  }

  const resetProfileImageUploadState = () => {
    setProfileImageValidationError(null)
    setUploadProgress(null)
  }

  return {
    selectedProfileImageFile,
    selectedProfileImagePreviewUrl,
    profileImageValidationError,
    uploadProgress,
    handleProfileImageFileChange,
    clearProfileImageSelection,
    setUploadProgress,
    resetProfileImageUploadState,
  }
}
