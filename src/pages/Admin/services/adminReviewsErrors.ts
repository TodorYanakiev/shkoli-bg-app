import type { ApiError } from '../../../types/api'
import type { AppError } from '../../../types/appError'
import type { AdminReviewEntityType } from '../types'

type AdminReviewOperation = 'list' | 'delete'

const isApiError = (error: unknown): error is ApiError => {
  if (typeof error !== 'object' || error === null) return false
  return (
    'status' in error &&
    typeof (error as { status?: unknown }).status === 'number' &&
    'kind' in error
  )
}

const entityNotFoundMessageKey = (
  entityType: AdminReviewEntityType,
): string => {
  if (entityType === 'course') return 'errors.reviews.courseNotFound'
  if (entityType === 'lyceum') return 'errors.reviews.lyceumNotFound'
  return 'errors.reviews.userNotFound'
}

const getFallbackMessageKey = (operation: AdminReviewOperation): string =>
  operation === 'list'
    ? 'errors.reviews.loadFailed'
    : 'errors.reviews.deleteFailed'

export const createInvalidAdminReviewTargetError = (): AppError => ({
  type: 'validation',
  messageKey: 'errors.reviews.invalidIdentifier',
})

export const mapAdminReviewApiError = (
  error: unknown,
  entityType: AdminReviewEntityType,
  operation: AdminReviewOperation,
): AppError => {
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

  if (error.status === 404) {
    return {
      type: 'notFound',
      status: error.status,
      messageKey:
        operation === 'list'
          ? entityNotFoundMessageKey(entityType)
          : 'errors.reviews.reviewNotFound',
    }
  }

  if (error.status === 409) {
    return {
      type: 'validation',
      status: error.status,
      messageKey: 'errors.reviews.alreadyDeleted',
    }
  }

  if (error.status === 400) {
    return {
      type: 'validation',
      status: error.status,
      messageKey: 'errors.reviews.invalidIdentifier',
    }
  }

  return {
    type: 'unknown',
    status: error.status,
    messageKey: getFallbackMessageKey(operation),
  }
}
