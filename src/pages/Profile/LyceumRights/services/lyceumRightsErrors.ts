import type { ApiError } from '../../../../types/api'

export const getRequestRightsErrorKey = (
  error: ApiError | null,
): string | null => {
  if (!error) return null
  if (error.kind === 'network') {
    return 'errors.network'
  }
  if (error.kind === 'unauthorized' || error.kind === 'forbidden') {
    return 'errors.profile.lyceumRightsUnauthorized'
  }
  if (error.status === 409) {
    return 'errors.profile.lyceumRightsAlreadyAdminOther'
  }
  if (error.status === 400) {
    return 'errors.profile.lyceumRightsInvalid'
  }
  if (error.status >= 500) {
    return 'errors.profile.lyceumRightsServer'
  }
  return 'errors.profile.lyceumRightsRequestFailed'
}

export const getVerifyRightsErrorKey = (
  error: ApiError | null,
): string | null => {
  if (!error) return null
  if (error.kind === 'network') {
    return 'errors.network'
  }
  if (error.kind === 'unauthorized' || error.kind === 'forbidden') {
    return 'errors.auth.forbidden'
  }
  return 'errors.profile.lyceumRightsVerifyFailed'
}
