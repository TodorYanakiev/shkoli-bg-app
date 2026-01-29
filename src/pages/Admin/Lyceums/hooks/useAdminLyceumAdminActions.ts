import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useToast } from '../../../../components/feedback/ToastContext'
import type { ApiError } from '../../../../types/api'
import type { AppError } from '../../../../types/appError'
import { adminLyceumAdminsQueryKey } from './useAdminLyceumAdmins'
import { useAssignLyceumAdminMutation } from './useAssignLyceumAdminMutation'
import { useRemoveLyceumAdminMutation } from './useRemoveLyceumAdminMutation'
import {
  getAdminLyceumsAdminAssignError,
  getAdminLyceumsAdminRemoveError,
} from '../services/adminLyceumsErrors'

type AdminLyceumAdminActions = {
  isAssigning: boolean
  isRemoving: boolean
  removingId: number | null
  assignError: AppError | null
  removeError: AppError | null
  onAssign: (lyceumId: number, userId: number) => Promise<boolean>
  onRemove: (lyceumId: number, userId?: number) => Promise<boolean>
}

export const useAdminLyceumAdminActions = (
  lyceumId: number,
): AdminLyceumAdminActions => {
  const { t } = useTranslation()
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  const [removingId, setRemovingId] = useState<number | null>(null)
  const assignMutation = useAssignLyceumAdminMutation()
  const removeMutation = useRemoveLyceumAdminMutation()

  const assignError = useMemo(
    () => getAdminLyceumsAdminAssignError(assignMutation.error ?? null),
    [assignMutation.error],
  )
  const removeError = useMemo(
    () => getAdminLyceumsAdminRemoveError(removeMutation.error ?? null),
    [removeMutation.error],
  )

  const onAssign = useCallback(
    async (targetLyceumId: number, userId: number) => {
      if (assignMutation.isPending) return false
      try {
        await assignMutation.mutateAsync({
          lyceumId: targetLyceumId,
          userId,
        })
        queryClient.invalidateQueries({
          queryKey: adminLyceumAdminsQueryKey(targetLyceumId),
        })
        showToast({
          message: t('feedback.lyceums.adminAdded'),
          tone: 'success',
        })
        return true
      } catch (error) {
        const appError = getAdminLyceumsAdminAssignError(error as ApiError)
        if (appError) {
          showToast({
            message: t(appError.messageKey),
            tone: 'error',
          })
        }
        return false
      }
    },
    [assignMutation, queryClient, showToast, t],
  )

  const onRemove = useCallback(
    async (targetLyceumId: number, userId?: number) => {
      if (!userId || removeMutation.isPending) return false
      setRemovingId(userId)
      try {
        await removeMutation.mutateAsync({
          lyceumId: targetLyceumId,
          userId,
        })
        queryClient.invalidateQueries({
          queryKey: adminLyceumAdminsQueryKey(targetLyceumId),
        })
        showToast({
          message: t('feedback.lyceums.adminRemoved'),
          tone: 'success',
        })
        return true
      } catch (error) {
        const appError = getAdminLyceumsAdminRemoveError(error as ApiError)
        if (appError) {
          showToast({
            message: t(appError.messageKey),
            tone: 'error',
          })
        }
        return false
      } finally {
        setRemovingId(null)
      }
    },
    [queryClient, removeMutation, showToast, t],
  )

  return {
    isAssigning: assignMutation.isPending,
    isRemoving: removeMutation.isPending,
    removingId,
    assignError,
    removeError,
    onAssign,
    onRemove,
  }
}
