import type { ApiError } from '../../../types/api'
import type { AppError } from '../../../types/appError'
import type {
  ReviewEntityType,
  ReviewFieldName,
  ReviewOperation,
} from '../types'

const isApiError = (error: unknown): error is ApiError => {
  if (typeof error !== 'object' || error === null) return false
  return (
    'status' in error &&
    typeof (error as { status: unknown }).status === 'number' &&
    'kind' in error
  )
}

export const isAppError = (error: unknown): error is AppError => {
  if (typeof error !== 'object' || error === null) return false

  const possibleType = (error as { type?: unknown }).type
  const possibleMessageKey = (error as { messageKey?: unknown }).messageKey

  return (
    typeof possibleType === 'string' &&
    typeof possibleMessageKey === 'string'
  )
}

const entityNotFoundMessageKey = (
  entityType: ReviewEntityType,
): string => {
  if (entityType === 'course') return 'errors.reviews.courseNotFound'
  if (entityType === 'lyceum') return 'errors.reviews.lyceumNotFound'
  return 'errors.reviews.userNotFound'
}

const extractFieldNamesFromError = (
  apiError: ApiError,
): ReviewFieldName[] => {
  const fromPayload = Object.keys(apiError.fieldErrors ?? {})
    .filter((field): field is ReviewFieldName =>
      field === 'rating' || field === 'comment',
    )

  if (fromPayload.length > 0) {
    return fromPayload
  }

  const errorMessage = apiError.message?.toLowerCase() ?? ''
  const inferred: ReviewFieldName[] = []

  if (errorMessage.includes('rating')) {
    inferred.push('rating')
  }
  if (errorMessage.includes('comment')) {
    inferred.push('comment')
  }

  return inferred
}

const createValidationFieldErrors = (
  apiError: ApiError,
): Record<string, string> => {
  const fields = extractFieldNamesFromError(apiError)
  const messageKey = 'errors.reviews.validationInvalid'

  if (fields.length === 0) {
    return { rating: messageKey }
  }

  return Object.fromEntries(
    fields.map((fieldName) => [fieldName, messageKey]),
  )
}

const getReviewMessageKey = (
  entityType: ReviewEntityType,
  operation: ReviewOperation,
  status: number,
): string => {
  if (operation === 'list') {
    if (status === 400) return 'errors.reviews.invalidIdentifier'
    if (status === 404) return entityNotFoundMessageKey(entityType)
    return 'errors.reviews.loadFailed'
  }

  if (operation === 'get') {
    if (status === 400) return 'errors.reviews.invalidIdentifier'
    if (status === 404) return 'errors.reviews.reviewNotFound'
    return 'errors.reviews.loadFailed'
  }

  if (operation === 'create') {
    if (status === 400) return 'errors.reviews.validationInvalid'
    if (status === 404) return entityNotFoundMessageKey(entityType)
    if (status === 409) return 'errors.reviews.alreadyReviewed'
    return 'errors.reviews.createFailed'
  }

  if (operation === 'update') {
    if (status === 400) return 'errors.reviews.validationInvalidUpdate'
    if (status === 404) return 'errors.reviews.reviewNotFound'
    return 'errors.reviews.updateFailed'
  }

  if (status === 404) return 'errors.reviews.reviewNotFound'
  if (status === 409) return 'errors.reviews.alreadyDeleted'
  return 'errors.reviews.deleteFailed'
}

export const createInvalidReviewTargetError = (): AppError => ({
  type: 'validation',
  messageKey: 'errors.reviews.invalidIdentifier',
  fieldErrors: {
    rating: 'errors.reviews.invalidIdentifier',
  },
})

export const mapReviewApiError = (
  error: unknown,
  entityType: ReviewEntityType,
  operation: ReviewOperation,
): AppError => {
  if (isAppError(error)) {
    return error
  }

  if (!isApiError(error)) {
    return {
      type: 'unknown',
      messageKey: 'errors.reviews.generic',
    }
  }

  if (error.kind === 'network') {
    return {
      type: 'network',
      status: error.status,
      messageKey: 'errors.network',
    }
  }

  if (error.kind === 'unauthorized' || error.status === 401) {
    return {
      type: 'auth',
      status: error.status,
      messageKey: 'errors.reviews.authRequired',
    }
  }

  if (error.kind === 'forbidden' || error.status === 403) {
    return {
      type: 'forbidden',
      status: error.status,
      messageKey: 'errors.reviews.forbidden',
    }
  }

  if (error.status >= 500) {
    return {
      type: 'server',
      status: error.status,
      messageKey: 'errors.reviews.server',
    }
  }

  if (error.status === 400 && (operation === 'create' || operation === 'update')) {
    return {
      type: 'validation',
      status: error.status,
      messageKey: getReviewMessageKey(entityType, operation, error.status),
      fieldErrors: createValidationFieldErrors(error),
    }
  }

  if (error.status === 404) {
    return {
      type: 'notFound',
      status: error.status,
      messageKey: getReviewMessageKey(entityType, operation, error.status),
    }
  }

  if (error.status === 409 || error.status === 400) {
    return {
      type: 'validation',
      status: error.status,
      messageKey: getReviewMessageKey(entityType, operation, error.status),
    }
  }

  return {
    type: 'unknown',
    status: error.status,
    messageKey: getReviewMessageKey(entityType, operation, error.status),
  }
}
