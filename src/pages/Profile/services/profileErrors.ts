import type { ApiError } from '../../../types/api'

const getSharedErrorKey = (error: ApiError | null, fallbackKey: string) => {
  if (!error) return null
  if (error.kind === 'network') {
    return 'errors.network'
  }
  if (error.kind === 'unauthorized' || error.kind === 'forbidden') {
    return 'errors.auth.forbidden'
  }
  if (
    error.message === 's3_config_missing' ||
    error.message === 's3_bucket_missing'
  ) {
    return 'errors.profile.imageConfigMissing'
  }
  return fallbackKey
}

export const getProfileErrorKey = (error: ApiError | null): string | null => {
  return getSharedErrorKey(error, 'errors.profile.loadFailed')
}

export const getProfileImageSaveErrorKey = (error: ApiError | null) =>
  getSharedErrorKey(error, 'errors.profile.imageSaveFailed')

export const getProfileImageDeleteErrorKey = (error: ApiError | null) =>
  getSharedErrorKey(error, 'errors.profile.imageDeleteFailed')

export const getProfileUpdateErrorKey = (error: ApiError | null) =>
  getSharedErrorKey(error, 'errors.profile.updateFailed')

export const getProfileDeleteErrorKey = (error: ApiError | null) =>
  getSharedErrorKey(error, 'errors.profile.deleteFailed')
