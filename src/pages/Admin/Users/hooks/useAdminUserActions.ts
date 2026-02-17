import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { useToast } from '../../../../components/feedback/ToastContext'
import type { ApiError } from '../../../../types/api'
import type {
  AdminUserUpdatePayload,
  AdminUserUpdateResult,
} from '../types'
import { getAdminUsersDeleteError } from '../services/adminUsersErrors'
import { adminUsersQueryKeyPrefix } from './useAdminUsers'
import { useDeleteAdminUserMutation } from './useDeleteAdminUserMutation'
import { useUpdateAdminUserMutation } from './useUpdateAdminUserMutation'

type AdminUserActions = {
  updatingId: number | null
  deletingId: number | null
  onUpdate: (payload: AdminUserUpdatePayload) => Promise<AdminUserUpdateResult>
  onDelete: (userId?: number) => Promise<boolean>
  isUpdating: (userId?: number) => boolean
  isDeleting: (userId?: number) => boolean
}

export const useAdminUserActions = (): AdminUserActions => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const updateMutation = useUpdateAdminUserMutation()
  const deleteMutation = useDeleteAdminUserMutation()

  const onUpdate = useCallback(
    async ({ userId, payload }: AdminUserUpdatePayload) => {
      if (updateMutation.isPending) {
        return { ok: false, error: null }
      }

      setUpdatingId(userId)
      try {
        await updateMutation.mutateAsync({ userId, payload })
        await queryClient.invalidateQueries({
          queryKey: adminUsersQueryKeyPrefix,
        })
        showToast({
          message: t('feedback.users.updateSuccess'),
          tone: 'success',
        })
        return { ok: true, error: null }
      } catch (error) {
        return { ok: false, error: error as ApiError }
      } finally {
        setUpdatingId(null)
      }
    },
    [queryClient, showToast, t, updateMutation],
  )

  const onDelete = useCallback(
    async (userId?: number) => {
      if (!userId || deleteMutation.isPending) return false
      setDeletingId(userId)
      try {
        await deleteMutation.mutateAsync({ userId })
        await queryClient.invalidateQueries({
          queryKey: adminUsersQueryKeyPrefix,
        })
        showToast({
          message: t('feedback.users.deleteSuccess'),
          tone: 'success',
        })
        return true
      } catch (error) {
        const appError = getAdminUsersDeleteError(error as ApiError)
        if (appError) {
          showToast({
            message: t(appError.messageKey),
            tone: 'error',
          })
        }
        return false
      } finally {
        setDeletingId(null)
      }
    },
    [deleteMutation, queryClient, showToast, t],
  )

  const isUpdating = useCallback(
    (userId?: number) =>
      Boolean(userId && updateMutation.isPending && updatingId === userId),
    [updateMutation.isPending, updatingId],
  )

  const isDeleting = useCallback(
    (userId?: number) =>
      Boolean(userId && deleteMutation.isPending && deletingId === userId),
    [deleteMutation.isPending, deletingId],
  )

  return {
    updatingId,
    deletingId,
    onUpdate,
    onDelete,
    isUpdating,
    isDeleting,
  }
}
