import type { ApiError } from '../types/api'
import type { AppError } from '../types/appError'
import type { SubscriberScope } from '../types/subscribers'

type SubscriberManagementAction =
  | 'list'
  | 'createExport'
  | 'exportStatus'
  | 'downloadExport'

const getScopeMessagePrefix = (scope: SubscriberScope) =>
  scope === 'course' ? 'errors.courses.subscribers' : 'errors.lyceums.subscribers'

const getNotFoundMessageKey = (scope: SubscriberScope) =>
  scope === 'course'
    ? 'errors.courses.subscriptionNotFound'
    : 'errors.lyceums.subscriptionNotFound'

const getFallbackMessageKey = (
  scope: SubscriberScope,
  action: SubscriberManagementAction,
) => {
  const prefix = getScopeMessagePrefix(scope)

  if (action === 'list') {
    return `${prefix}.loadFailed`
  }

  if (action === 'createExport') {
    return `${prefix}.exportFailed`
  }

  if (action === 'exportStatus') {
    return `${prefix}.statusFailed`
  }

  return `${prefix}.downloadFailed`
}

const getInvalidFormatMessageKey = () => 'errors.subscribers.invalidFormat'

const getExportNotFoundMessageKey = () => 'errors.subscribers.exportNotFound'

const getExportNotReadyMessageKey = () => 'errors.subscribers.fileNotReady'

const getExportFailedStateMessageKey = () =>
  'errors.subscribers.exportFailedState'

export const createInvalidSubscriberTargetError = (
  scope: SubscriberScope,
): AppError => ({
  type: 'validation',
  messageKey: getNotFoundMessageKey(scope),
})

export const createMissingExportJobError = (
  scope: SubscriberScope,
  action: SubscriberManagementAction,
): AppError => ({
  type: 'validation',
  messageKey: getFallbackMessageKey(scope, action),
})

export const mapSubscriberManagementApiError = (
  error: unknown,
  scope: SubscriberScope,
  action: SubscriberManagementAction,
): AppError => {
  if (
    typeof error !== 'object' ||
    error === null ||
    !('status' in error) ||
    !('kind' in error)
  ) {
    return {
      type: 'unknown',
      messageKey: getFallbackMessageKey(scope, action),
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
    if (action === 'list') {
      return {
        type: 'notFound',
        status: apiError.status,
        messageKey: getNotFoundMessageKey(scope),
      }
    }

    return {
      type: 'notFound',
      status: apiError.status,
      messageKey: getExportNotFoundMessageKey(),
    }
  }

  if (apiError.status === 400) {
    if (action === 'createExport') {
      return {
        type: 'validation',
        status: apiError.status,
        messageKey: getInvalidFormatMessageKey(),
      }
    }

    if (action === 'downloadExport') {
      return {
        type: 'validation',
        status: apiError.status,
        messageKey: getExportFailedStateMessageKey(),
      }
    }
  }

  if (apiError.status === 409 && action === 'downloadExport') {
    return {
      type: 'validation',
      status: apiError.status,
      messageKey: getExportNotReadyMessageKey(),
    }
  }

  if (apiError.status >= 500) {
    return {
      type: 'server',
      status: apiError.status,
      messageKey: getFallbackMessageKey(scope, action),
    }
  }

  return {
    type: 'unknown',
    status: apiError.status,
    messageKey: getFallbackMessageKey(scope, action),
  }
}
