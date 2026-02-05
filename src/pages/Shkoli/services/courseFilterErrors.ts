import type { ApiError } from '../../../types/api'
import type { AppError } from '../../../types/appError'

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

export const getCourseFilterError = (
  error: ApiError | null,
): AppError | null =>
  error ? mapApiError(error, 'pages.shkoli.list.states.error') : null
