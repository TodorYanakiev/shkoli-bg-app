import type { ApiError } from '../../../../types/api'
import type { AppError } from '../../../../types/appError'

const mapApiError = (error: ApiError, fallbackKey: string): AppError => {
  if (error.kind === 'network') {
    return {
      type: 'network',
      status: error.status,
      messageKey: 'errors.network',
    }
  }
  if (error.kind === 'unauthorized') {
    return {
      type: 'auth',
      status: error.status,
      messageKey: 'errors.auth.forbidden',
    }
  }
  if (error.kind === 'forbidden') {
    return {
      type: 'forbidden',
      status: error.status,
      messageKey: 'errors.auth.forbidden',
    }
  }
  if (error.status === 404) {
    return {
      type: 'notFound',
      status: error.status,
      messageKey: fallbackKey,
    }
  }
  if (error.status >= 500) {
    return {
      type: 'server',
      status: error.status,
      messageKey: fallbackKey,
    }
  }
  return {
    type: 'unknown',
    status: error.status,
    messageKey: fallbackKey,
  }
}

export const getAdminLyceumsLoadError = (error: ApiError | null) =>
  error ? mapApiError(error, 'pages.admin.lyceums.loadFailed') : null

export const getAdminLyceumsDeleteError = (error: ApiError | null) =>
  error ? mapApiError(error, 'errors.lyceums.deleteFailed') : null

export const getAdminLyceumsCreateError = (error: ApiError | null) => {
  if (!error) return null
  if (error.status === 409) {
    return mapApiError(error, 'errors.lyceums.createConflict')
  }
  if (error.status === 400) {
    return mapApiError(error, 'errors.lyceums.createInvalid')
  }
  return mapApiError(error, 'errors.lyceums.createFailed')
}

export const getAdminLyceumsAdminsLoadError = (error: ApiError | null) =>
  error ? mapApiError(error, 'pages.admin.lyceums.admins.loadFailed') : null

export const getAdminLyceumsAdminAssignError = (error: ApiError | null) => {
  if (!error) return null
  if (error.status === 409) {
    return mapApiError(error, 'errors.lyceums.admins.alreadyAssigned')
  }
  if (error.status === 404) {
    return mapApiError(error, 'errors.lyceums.admins.notFound')
  }
  if (error.status === 400) {
    return mapApiError(error, 'errors.lyceums.admins.addInvalid')
  }
  return mapApiError(error, 'errors.lyceums.admins.addFailed')
}

export const getAdminLyceumsAdminRemoveError = (error: ApiError | null) => {
  if (!error) return null
  if (error.status === 404) {
    return mapApiError(error, 'errors.lyceums.admins.notFound')
  }
  if (error.status === 400) {
    return mapApiError(error, 'errors.lyceums.admins.removeInvalid')
  }
  return mapApiError(error, 'errors.lyceums.admins.removeFailed')
}
