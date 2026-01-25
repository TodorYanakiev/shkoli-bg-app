import type { ApiError } from '../../../../types/api'

export const getInviteLecturerErrorKey = (
  error: ApiError | null,
): string | null => {
  if (!error) return null
  if (error.kind === 'network') {
    return 'errors.network'
  }
  if (error.kind === 'unauthorized' || error.kind === 'forbidden') {
    return 'errors.auth.forbidden'
  }
  if (error.status === 409) {
    return 'errors.lyceums.lecturers.alreadyAssigned'
  }
  if (error.status === 404) {
    return 'errors.lyceums.lecturers.notFound'
  }
  if (error.status === 400) {
    return 'errors.lyceums.lecturers.addInvalid'
  }
  if (error.status >= 500) {
    return 'errors.generic'
  }
  return 'errors.lyceums.lecturers.addFailed'
}

export const getRemoveLecturerErrorKey = (
  error: ApiError | null,
): string | null => {
  if (!error) return null
  if (error.kind === 'network') {
    return 'errors.network'
  }
  if (error.kind === 'unauthorized' || error.kind === 'forbidden') {
    return 'errors.auth.forbidden'
  }
  if (error.status === 404) {
    return 'errors.lyceums.lecturers.notFound'
  }
  if (error.status === 400) {
    return 'errors.lyceums.lecturers.removeInvalid'
  }
  if (error.status >= 500) {
    return 'errors.generic'
  }
  return 'errors.lyceums.lecturers.removeFailed'
}

export const getLecturersLoadErrorKey = (
  error: ApiError | null,
): string | null => {
  if (!error) return null
  if (error.kind === 'network') {
    return 'errors.network'
  }
  if (error.kind === 'unauthorized' || error.kind === 'forbidden') {
    return 'errors.auth.forbidden'
  }
  return 'pages.lyceums.edit.lecturers.listError'
}
