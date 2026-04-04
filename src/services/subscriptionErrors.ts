import type { ApiError } from '../types/api'
import type { AppError } from '../types/appError'

type SubscriptionEntityType = 'course' | 'lyceum'
type SubscriptionActionType = 'subscribe' | 'unsubscribe'

const getFallbackMessageKey = (
  entityType: SubscriptionEntityType,
  action: SubscriptionActionType,
) => {
  if (entityType === 'course') {
    return action === 'subscribe'
      ? 'errors.courses.subscribeFailed'
      : 'errors.courses.unsubscribeFailed'
  }

  return action === 'subscribe'
    ? 'errors.lyceums.subscribeFailed'
    : 'errors.lyceums.unsubscribeFailed'
}

const getNotFoundMessageKey = (entityType: SubscriptionEntityType) => {
  if (entityType === 'course') {
    return 'errors.courses.subscriptionNotFound'
  }

  return 'errors.lyceums.subscriptionNotFound'
}

const getConflictMessageKey = (entityType: SubscriptionEntityType) => {
  if (entityType === 'course') {
    return 'errors.courses.alreadySubscribed'
  }

  return 'errors.lyceums.alreadySubscribed'
}

const getNotSubscribedMessageKey = (entityType: SubscriptionEntityType) => {
  if (entityType === 'course') {
    return 'errors.courses.notSubscribed'
  }

  return 'errors.lyceums.notSubscribed'
}

export const createInvalidSubscriptionTargetError = (
  entityType: SubscriptionEntityType,
): AppError => ({
  type: 'validation',
  messageKey: getNotFoundMessageKey(entityType),
})

export const mapSubscriptionApiError = (
  error: unknown,
  entityType: SubscriptionEntityType,
  action: SubscriptionActionType,
): AppError => {
  if (
    typeof error !== 'object' ||
    error === null ||
    !('status' in error) ||
    !('kind' in error)
  ) {
    return {
      type: 'unknown',
      messageKey: getFallbackMessageKey(entityType, action),
    }
  }

  const apiError = error as ApiError

  if (apiError.kind === 'network') {
    return {
      type: 'network',
      status: apiError.status,
      messageKey: 'errors.network',
    }
  }

  if (apiError.kind === 'unauthorized') {
    return {
      type: 'auth',
      status: apiError.status,
      messageKey: 'errors.subscriptions.authRequired',
    }
  }

  if (apiError.kind === 'forbidden') {
    return {
      type: 'forbidden',
      status: apiError.status,
      messageKey: 'errors.auth.forbidden',
    }
  }

  if (apiError.status === 404) {
    return {
      type: 'notFound',
      status: apiError.status,
      messageKey: getNotFoundMessageKey(entityType),
    }
  }

  if (apiError.status === 409 && action === 'subscribe') {
    return {
      type: 'validation',
      status: apiError.status,
      messageKey: getConflictMessageKey(entityType),
    }
  }

  if (apiError.status === 400 && action === 'unsubscribe') {
    return {
      type: 'validation',
      status: apiError.status,
      messageKey: getNotSubscribedMessageKey(entityType),
    }
  }

  if (apiError.status >= 500) {
    return {
      type: 'server',
      status: apiError.status,
      messageKey: getFallbackMessageKey(entityType, action),
    }
  }

  return {
    type: 'unknown',
    status: apiError.status,
    messageKey: getFallbackMessageKey(entityType, action),
  }
}
