import { uploadFileToS3 } from './s3'
import { addUserProfileImage, updateUserProfileImage } from './users'
import type { ApiError } from '../types/api'
import type { UserImageRequest, UserImageResponse } from '../types/users'
import { buildUserImageS3Key, loadImageDimensions } from '../utils/userImages'

export type UserProfileImageSaveMode = 'add' | 'update'

export type UploadAndSaveUserProfileImagePayload = {
  userId: number
  file: File
  altText?: string
  mode: UserProfileImageSaveMode
  onProgress?: (progress: number) => void
}

const normalizeOptionalText = (value?: string) => {
  const normalized = value?.trim()
  return normalized ? normalized : undefined
}

const isApiError = (value: unknown): value is ApiError =>
  typeof value === 'object' &&
  value !== null &&
  'status' in value &&
  'kind' in value

const toApiError = (error: unknown): ApiError => {
  if (isApiError(error)) return error
  if (error instanceof Error) {
    return {
      status: 0,
      kind: 'unknown',
      message: error.message,
    }
  }

  return {
    status: 0,
    kind: 'unknown',
  }
}

const buildUserImageRequest = async ({
  userId,
  file,
  altText,
  onProgress,
}: Omit<UploadAndSaveUserProfileImagePayload, 'mode'>): Promise<UserImageRequest> => {
  const previewUrl = URL.createObjectURL(file)

  try {
    const { width, height } = await loadImageDimensions(previewUrl)
    const s3Key = buildUserImageS3Key(userId, file.name)

    await uploadFileToS3({
      file,
      key: s3Key,
      onProgress,
    })

    return {
      s3Key,
      altText: normalizeOptionalText(altText),
      width,
      height,
      mimeType: file.type,
    }
  } finally {
    URL.revokeObjectURL(previewUrl)
  }
}

export const uploadAndSaveUserProfileImage = async ({
  userId,
  file,
  altText,
  mode,
  onProgress,
}: UploadAndSaveUserProfileImagePayload): Promise<UserImageResponse> => {
  try {
    const payload = await buildUserImageRequest({
      userId,
      file,
      altText,
      onProgress,
    })

    if (mode === 'add') {
      return await addUserProfileImage(userId, payload)
    }

    try {
      return await updateUserProfileImage(userId, payload)
    } catch (error) {
      const apiError = toApiError(error)
      if (apiError.status === 404) {
        return await addUserProfileImage(userId, payload)
      }
      throw apiError
    }
  } catch (error) {
    throw toApiError(error)
  }
}
