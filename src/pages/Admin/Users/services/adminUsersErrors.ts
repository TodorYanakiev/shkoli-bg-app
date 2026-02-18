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
      messageKey: 'errors.users.notFound',
    }
  }
  if (error.status >= 500) {
    return {
      type: 'server',
      status: error.status,
      messageKey: 'errors.users.server',
    }
  }
  return {
    type: 'unknown',
    status: error.status,
    messageKey: fallbackKey,
  }
}

const hasEmailConflict = (error: ApiError) =>
  Boolean(error.fieldErrors?.email) ||
  error.message?.toLowerCase().includes('email') === true

const hasUsernameConflict = (error: ApiError) =>
  Boolean(error.fieldErrors?.username) ||
  error.message?.toLowerCase().includes('username') === true

export const getAdminUsersLoadError = (error: ApiError | null) =>
  error ? mapApiError(error, 'pages.admin.users.loadFailed') : null

export const getAdminUsersDeleteError = (error: ApiError | null) =>
  error ? mapApiError(error, 'errors.users.deleteFailed') : null

export const getAdminUsersImageDeleteError = (
  error: ApiError | null,
) =>
  error ? mapApiError(error, 'errors.users.imageDeleteFailed') : null

export const getAdminUsersUpdateError = (error: ApiError | null) => {
  if (!error) return null
  if (error.status === 409) {
    if (hasEmailConflict(error)) {
      return mapApiError(error, 'errors.users.emailExists')
    }
    if (hasUsernameConflict(error)) {
      return mapApiError(error, 'errors.users.usernameExists')
    }
    return mapApiError(error, 'errors.users.conflict')
  }
  if (error.status === 400) {
    return mapApiError(error, 'errors.users.updateFailed')
  }
  return mapApiError(error, 'errors.users.updateFailed')
}
