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

const toAppError = (
  error: ApiError | null,
  fallbackKey: string,
): AppError | null => (error ? mapApiError(error, fallbackKey) : null)

export const getLyceumLoadError = (error: ApiError | null) => {
  if (!error) return null
  if (error.status === 404) {
    return {
      type: 'notFound',
      status: error.status,
      messageKey: 'pages.lyceums.detail.notFound',
    } satisfies AppError
  }
  return mapApiError(error, 'pages.lyceums.detail.loadFailed')
}

export const getSectionError = (
  error: ApiError | null,
  fallbackKey: string,
) => toAppError(error, fallbackKey)
