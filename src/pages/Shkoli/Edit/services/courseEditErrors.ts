import type { ApiError } from '../../../../types/api'
import type { AppError } from '../../../../types/appError'

export const isApiError = (value: unknown): value is ApiError =>
  typeof value === 'object' &&
  value !== null &&
  'status' in value &&
  'kind' in value

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

export const getCourseEditLoadError = (error: ApiError | null) => {
  if (!error) return null
  if (error.status === 404) {
    return {
      type: 'notFound',
      status: error.status,
      messageKey: 'pages.shkoli.edit.notFound',
    } satisfies AppError
  }
  return toAppError(error, 'pages.shkoli.edit.loadFailed')
}

export const getCourseUpdateError = (
  error: ApiError | null,
): AppError | null => {
  if (!error) return null
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
  if (error.status === 400) {
    return {
      type: 'validation',
      status: error.status,
      messageKey: 'errors.courses.updateInvalid',
      fieldErrors: error.fieldErrors,
    }
  }
  if (error.status === 404) {
    return {
      type: 'notFound',
      status: error.status,
      messageKey: 'errors.courses.updateNotFound',
    }
  }
  if (error.status === 409) {
    return {
      type: 'unknown',
      status: error.status,
      messageKey: 'errors.courses.updateConflict',
    }
  }
  if (error.status >= 500) {
    return {
      type: 'server',
      status: error.status,
      messageKey: 'errors.courses.updateFailed',
    }
  }
  return {
    type: 'unknown',
    status: error.status,
    messageKey: 'errors.courses.updateFailed',
  }
}

export const getCourseImagesError = (error: ApiError | null) => {
  if (!error) return null
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
  if (error.status === 400) {
    return {
      type: 'validation',
      status: error.status,
      messageKey: 'errors.courses.imagesInvalid',
    }
  }
  if (error.status === 404) {
    return {
      type: 'notFound',
      status: error.status,
      messageKey: 'errors.courses.imagesNotFound',
    }
  }
  if (error.status >= 500) {
    return {
      type: 'server',
      status: error.status,
      messageKey: 'errors.courses.imagesLoadFailed',
    }
  }

  return toAppError(error, 'errors.courses.imagesLoadFailed')
}

export const getCourseImageActionError = (error: ApiError | null) => {
  if (!error) return null
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
  if (error.status === 400) {
    return {
      type: 'validation',
      status: error.status,
      messageKey: 'errors.courses.imageDeleteInvalid',
    }
  }
  if (error.status === 404) {
    return {
      type: 'notFound',
      status: error.status,
      messageKey: 'errors.courses.imageDeleteNotFound',
    }
  }
  if (error.status >= 500) {
    return {
      type: 'server',
      status: error.status,
      messageKey: 'errors.courses.imageDeleteFailed',
    }
  }

  return toAppError(error, 'errors.courses.imageDeleteFailed')
}
