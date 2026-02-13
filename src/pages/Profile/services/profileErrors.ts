import type { ApiError } from '../../../types/api'

const hasFieldErrors = (error: ApiError) =>
  Boolean(error.fieldErrors && Object.keys(error.fieldErrors).length > 0)

const getSharedErrorKey = (error: ApiError | null): string | null => {
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

  return null
}

export const getProfileErrorKey = (error: ApiError | null): string | null => {
  const sharedErrorKey = getSharedErrorKey(error)
  if (sharedErrorKey) return sharedErrorKey
  if (!error) return null
  if (error.status === 404) return 'errors.profile.notFound'
  if (error.status >= 500) return 'errors.profile.server'
  return 'errors.profile.loadFailed'
}

export const getProfileImageSaveErrorKey = (error: ApiError | null) => {
  const sharedErrorKey = getSharedErrorKey(error)
  if (sharedErrorKey) return sharedErrorKey
  if (!error) return null
  return 'errors.profile.imageSaveFailed'
}

export const getProfileImageDeleteErrorKey = (error: ApiError | null) => {
  const sharedErrorKey = getSharedErrorKey(error)
  if (sharedErrorKey) return sharedErrorKey
  if (!error) return null
  return 'errors.profile.imageDeleteFailed'
}

export const getProfileUpdateErrorKey = (error: ApiError | null) => {
  const sharedErrorKey = getSharedErrorKey(error)
  if (sharedErrorKey) return sharedErrorKey
  if (!error) return null

  if (error.status === 404) {
    return 'errors.profile.notFound'
  }

  if (error.status === 409) {
    if (error.fieldErrors?.email) {
      return 'errors.profile.emailExists'
    }
    if (error.fieldErrors?.username) {
      return 'errors.profile.usernameExists'
    }

    const message = error.message?.toLowerCase() ?? ''
    if (message.includes('email')) {
      return 'errors.profile.emailExists'
    }
    if (message.includes('username')) {
      return 'errors.profile.usernameExists'
    }
    return 'errors.profile.conflict'
  }

  if (error.status >= 500) {
    return 'errors.profile.server'
  }

  if (error.status === 400 && hasFieldErrors(error)) {
    return null
  }

  return 'errors.profile.updateFailed'
}

export const getProfileDeleteErrorKey = (error: ApiError | null) => {
  const sharedErrorKey = getSharedErrorKey(error)
  if (sharedErrorKey) return sharedErrorKey
  if (!error) return null
  if (error.status === 404) return 'errors.profile.notFound'
  if (error.status >= 500) return 'errors.profile.server'
  return 'errors.profile.deleteFailed'
}
