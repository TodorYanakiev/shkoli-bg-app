import type { ApiError } from '../../../../types/api'
import type { AppError } from '../../../../types/appError'

type FeedbackOperation = 'load' | 'markRead' | 'markUnread' | 'delete'

const fallbackByOperation: Record<FeedbackOperation, string> = {
  load: 'errors.feedback.loadFailed',
  markRead: 'errors.feedback.markReadFailed',
  markUnread: 'errors.feedback.markUnreadFailed',
  delete: 'errors.feedback.deleteFailed',
}

export const getAdminFeedbackError = (
  error: ApiError | null,
  operation: FeedbackOperation,
): AppError | null => {
  if (!error) return null

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
      messageKey: 'errors.feedback.authRequired',
    }
  }

  if (error.kind === 'forbidden' || error.status === 403) {
    return {
      type: 'forbidden',
      status: error.status,
      messageKey: 'errors.feedback.forbidden',
    }
  }

  if (error.status === 404) {
    return {
      type: 'notFound',
      status: error.status,
      messageKey: 'errors.feedback.notFound',
    }
  }

  if (error.status >= 500) {
    return {
      type: 'server',
      status: error.status,
      messageKey: 'errors.feedback.server',
    }
  }

  if (error.status === 400) {
    return {
      type: 'validation',
      status: error.status,
      messageKey:
        operation === 'load'
          ? 'errors.feedback.loadInvalid'
          : 'errors.feedback.invalidRequest',
    }
  }

  return {
    type: 'unknown',
    status: error.status,
    messageKey: fallbackByOperation[operation],
  }
}
