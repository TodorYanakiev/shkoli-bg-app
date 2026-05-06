import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { useToast } from '../components/feedback/ToastContext'
import { shareCourse, shareLyceum } from '../services/statistics'
import type { ApiError } from '../types/api'
import type { AppError } from '../types/appError'

type ShareEntityType = 'course' | 'lyceum'

type UseShareActionOptions = {
  entityType: ShareEntityType
  entityId?: number
}

type UseShareActionResult = {
  isSharing: boolean
  onShare: () => Promise<void>
}

const hasValidEntityId = (entityId?: number): entityId is number =>
  typeof entityId === 'number' && Number.isFinite(entityId)

const getShareFailedMessageKey = (entityType: ShareEntityType) =>
  entityType === 'course'
    ? 'errors.courses.shareFailed'
    : 'errors.lyceums.shareFailed'

const getShareNotFoundMessageKey = (entityType: ShareEntityType) =>
  entityType === 'course'
    ? 'errors.courses.shareNotFound'
    : 'errors.lyceums.shareNotFound'

const createInvalidShareTargetError = (
  entityType: ShareEntityType,
): AppError => ({
  type: 'validation',
  messageKey: getShareNotFoundMessageKey(entityType),
})

const mapShareApiError = (
  error: unknown,
  entityType: ShareEntityType,
): AppError => {
  if (
    typeof error !== 'object' ||
    error === null ||
    !('status' in error) ||
    !('kind' in error)
  ) {
    return {
      type: 'unknown',
      messageKey: getShareFailedMessageKey(entityType),
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

  if (apiError.status === 404) {
    return {
      type: 'notFound',
      status: apiError.status,
      messageKey: getShareNotFoundMessageKey(entityType),
    }
  }

  if (apiError.status >= 500) {
    return {
      type: 'server',
      status: apiError.status,
      messageKey: getShareFailedMessageKey(entityType),
    }
  }

  return {
    type: 'unknown',
    status: apiError.status,
    messageKey: getShareFailedMessageKey(entityType),
  }
}

const copyTextToClipboard = async (value: string) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }

  if (typeof document === 'undefined') {
    throw new Error('clipboard-unavailable')
  }

  const helper = document.createElement('textarea')
  helper.value = value
  helper.setAttribute('readonly', 'readonly')
  helper.style.position = 'fixed'
  helper.style.opacity = '0'
  helper.style.pointerEvents = 'none'

  document.body.appendChild(helper)
  helper.focus()
  helper.select()

  const copied = document.execCommand('copy')
  document.body.removeChild(helper)

  if (!copied) {
    throw new Error('copy-failed')
  }
}

const resolveShareUrl = () =>
  typeof window !== 'undefined' ? window.location.href : ''

const recordShareAction = async (entityType: ShareEntityType, entityId: number) => {
  if (entityType === 'course') {
    await shareCourse(entityId)
    return
  }

  await shareLyceum(entityId)
}

export const useShareAction = ({
  entityType,
  entityId,
}: UseShareActionOptions): UseShareActionResult => {
  const { t } = useTranslation()
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  const [isSharing, setIsSharing] = useState(false)

  const onShare = useCallback(
    async () => {
      if (isSharing) {
        return
      }

      setIsSharing(true)

      try {
        if (!hasValidEntityId(entityId)) {
          throw createInvalidShareTargetError(entityType)
        }

        try {
          await recordShareAction(entityType, entityId)
        } catch (error) {
          throw mapShareApiError(error, entityType)
        }

        await copyTextToClipboard(resolveShareUrl())

        void queryClient.invalidateQueries({
          queryKey:
            entityType === 'course'
              ? ['courses', 'statistics', entityId]
              : ['lyceums', 'statistics', entityId],
        })
        showToast({
          message: t('feedback.share.copied'),
          tone: 'success',
        })
      } catch (error) {
        const appError =
          typeof error === 'object' &&
          error !== null &&
          'messageKey' in error &&
          typeof error.messageKey === 'string'
            ? (error as AppError)
            : null
        showToast({
          message: t(appError?.messageKey ?? 'feedback.share.failed'),
          tone: 'error',
        })
      } finally {
        setIsSharing(false)
      }
    },
    [
      entityId,
      entityType,
      isSharing,
      queryClient,
      showToast,
      t,
    ],
  )

  return {
    isSharing,
    onShare,
  }
}
