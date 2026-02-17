import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { useToast } from '../../../../components/feedback/ToastContext'
import type { ApiError } from '../../../../types/api'
import type {
  AdminUserUpdatePayload,
  AdminUserUpdateResult,
} from '../types'
import {
  getAdminUsersDeleteError,
  getAdminUsersImageDeleteError,
} from '../services/adminUsersErrors'
import { adminUsersQueryKeyPrefix } from './useAdminUsers'
import { useDeleteAdminUserMutation } from './useDeleteAdminUserMutation'
import { useDeleteAdminUserProfileImageMutation } from './useDeleteAdminUserProfileImageMutation'
import { useUpdateAdminUserMutation } from './useUpdateAdminUserMutation'
import { useUpdateAdminUserRoleMutation } from './useUpdateAdminUserRoleMutation'

type AdminUserActions = {
  updatingId: number | null
  deletingId: number | null
  deletingImageId: number | null
  onUpdate: (payload: AdminUserUpdatePayload) => Promise<AdminUserUpdateResult>
  onDelete: (userId?: number) => Promise<boolean>
  onDeleteProfileImage: (userId?: number) => Promise<boolean>
  isUpdating: (userId?: number) => boolean
  isDeleting: (userId?: number) => boolean
  isDeletingProfileImage: (userId?: number) => boolean
}

export const useAdminUserActions = (): AdminUserActions => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null)
  const updateMutation = useUpdateAdminUserMutation()
  const updateRoleMutation = useUpdateAdminUserRoleMutation()
  const deleteMutation = useDeleteAdminUserMutation()
  const deleteProfileImageMutation = useDeleteAdminUserProfileImageMutation()

  const onUpdate = useCallback(
    async ({ userId, payload, role, currentRole }: AdminUserUpdatePayload) => {
      if (updateMutation.isPending || updateRoleMutation.isPending) {
        return { ok: false, error: null }
      }

      setUpdatingId(userId)
      try {
        await updateMutation.mutateAsync({ userId, payload })
        if (role !== currentRole) {
          await updateRoleMutation.mutateAsync({
            userId,
            payload: { role },
          })
        }
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
    [queryClient, showToast, t, updateMutation, updateRoleMutation],
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

  const onDeleteProfileImage = useCallback(
    async (userId?: number) => {
      if (!userId || deleteProfileImageMutation.isPending) return false
      setDeletingImageId(userId)
      try {
        await deleteProfileImageMutation.mutateAsync({ userId })
        await queryClient.invalidateQueries({
          queryKey: adminUsersQueryKeyPrefix,
        })
        showToast({
          message: t('feedback.users.imageDeleted'),
          tone: 'success',
        })
        return true
      } catch (error) {
        const appError = getAdminUsersImageDeleteError(error as ApiError)
        if (appError) {
          showToast({
            message: t(appError.messageKey),
            tone: 'error',
          })
        }
        return false
      } finally {
        setDeletingImageId(null)
      }
    },
    [deleteProfileImageMutation, queryClient, showToast, t],
  )

  const isUpdating = useCallback(
    (userId?: number) =>
      Boolean(
        userId &&
          (updateMutation.isPending || updateRoleMutation.isPending) &&
          updatingId === userId,
      ),
    [updateMutation.isPending, updateRoleMutation.isPending, updatingId],
  )

  const isDeleting = useCallback(
    (userId?: number) =>
      Boolean(userId && deleteMutation.isPending && deletingId === userId),
    [deleteMutation.isPending, deletingId],
  )

  const isDeletingProfileImage = useCallback(
    (userId?: number) =>
      Boolean(
        userId &&
          deleteProfileImageMutation.isPending &&
          deletingImageId === userId,
      ),
    [deleteProfileImageMutation.isPending, deletingImageId],
  )

  return {
    updatingId,
    deletingId,
    deletingImageId,
    onUpdate,
    onDelete,
    onDeleteProfileImage,
    isUpdating,
    isDeleting,
    isDeletingProfileImage,
  }
}
