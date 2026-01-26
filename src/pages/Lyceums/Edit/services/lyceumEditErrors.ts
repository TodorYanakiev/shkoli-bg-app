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
  return {
    type: 'unknown',
    status: error.status,
    messageKey: fallbackKey,
  }
}

const toAppError = (
  error: ApiError | null,
  fallbackKey: string,
): AppError | null => (error ? mapApiError(error, fallbackKey) : null)

export const getLyceumLoadError = (error: ApiError | null) =>
  toAppError(error, 'pages.lyceums.detail.loadFailed')

export const getLyceumUpdateError = (error: ApiError | null) =>
  toAppError(error, 'errors.lyceums.updateFailed')
