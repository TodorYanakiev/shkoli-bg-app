import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { useToast } from '../../../../components/feedback/ToastContext'
import type { ApiError } from '../../../../types/api'
import { getAdminFeedbackError } from '../services/adminFeedbackErrors'
import { adminFeedbackQueryKeyPrefix } from './useAdminFeedback'
import {
  useDeleteFeedbackMutation,
  useMarkFeedbackReadMutation,
  useMarkFeedbackUnreadMutation,
} from './useAdminFeedbackMutations'

export const useAdminFeedbackActions = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const markReadMutation = useMarkFeedbackReadMutation()
  const markUnreadMutation = useMarkFeedbackUnreadMutation()
  const deleteMutation = useDeleteFeedbackMutation()
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const invalidateFeedback = useCallback(
    async () =>
      queryClient.invalidateQueries({
        queryKey: adminFeedbackQueryKeyPrefix,
      }),
    [queryClient],
  )

  const showActionError = useCallback(
    (error: unknown, operation: 'markRead' | 'markUnread' | 'delete') => {
      const appError = getAdminFeedbackError(error as ApiError, operation)
      if (!appError) return
      showToast({
        message: t(appError.messageKey),
        tone: 'error',
      })
    },
    [showToast, t],
  )

  const markRead = useCallback(
    async (feedbackId?: number) => {
      if (!feedbackId || markReadMutation.isPending) return false
      setUpdatingId(feedbackId)
      try {
        await markReadMutation.mutateAsync({ feedbackId })
        await invalidateFeedback()
        showToast({
          message: t('feedback.adminFeedback.markedRead'),
          tone: 'success',
        })
        return true
      } catch (error) {
        showActionError(error, 'markRead')
        return false
      } finally {
        setUpdatingId(null)
      }
    },
    [invalidateFeedback, markReadMutation, showActionError, showToast, t],
  )

  const markUnread = useCallback(
    async (feedbackId?: number) => {
      if (!feedbackId || markUnreadMutation.isPending) return false
      setUpdatingId(feedbackId)
      try {
        await markUnreadMutation.mutateAsync({ feedbackId })
        await invalidateFeedback()
        showToast({
          message: t('feedback.adminFeedback.markedUnread'),
          tone: 'success',
        })
        return true
      } catch (error) {
        showActionError(error, 'markUnread')
        return false
      } finally {
        setUpdatingId(null)
      }
    },
    [invalidateFeedback, markUnreadMutation, showActionError, showToast, t],
  )

  const deleteItem = useCallback(
    async (feedbackId?: number) => {
      if (!feedbackId || deleteMutation.isPending) return false
      setDeletingId(feedbackId)
      try {
        await deleteMutation.mutateAsync({ feedbackId })
        await invalidateFeedback()
        showToast({
          message: t('feedback.adminFeedback.deleted'),
          tone: 'success',
        })
        return true
      } catch (error) {
        showActionError(error, 'delete')
        return false
      } finally {
        setDeletingId(null)
      }
    },
    [deleteMutation, invalidateFeedback, showActionError, showToast, t],
  )

  const isUpdating = useCallback(
    (feedbackId?: number) =>
      Boolean(
        feedbackId &&
          updatingId === feedbackId &&
          (markReadMutation.isPending || markUnreadMutation.isPending),
      ),
    [markReadMutation.isPending, markUnreadMutation.isPending, updatingId],
  )

  const isDeleting = useCallback(
    (feedbackId?: number) =>
      Boolean(feedbackId && deletingId === feedbackId && deleteMutation.isPending),
    [deleteMutation.isPending, deletingId],
  )

  return {
    markRead,
    markUnread,
    deleteItem,
    isUpdating,
    isDeleting,
  }
}
