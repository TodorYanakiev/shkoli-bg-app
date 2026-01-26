import type { ApiError } from '../../../types/api'

export const getProfileErrorKey = (error: ApiError | null): string | null => {
  if (!error) return null
  if (error.kind === 'network') {
    return 'errors.network'
  }
  if (error.kind === 'unauthorized' || error.kind === 'forbidden') {
    return 'errors.auth.forbidden'
  }
  return 'errors.profile.loadFailed'
}
