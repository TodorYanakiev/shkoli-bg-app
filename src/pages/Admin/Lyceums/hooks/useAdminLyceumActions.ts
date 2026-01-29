import { useCallback, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { useToast } from '../../../../components/feedback/ToastContext'
import type { ApiError } from '../../../../types/api'
import type { AppError } from '../../../../types/appError'
import type { LyceumResponse } from '../../../../types/lyceums'
import { adminLyceumsQueryKey } from './useAdminLyceums'
import { useDeleteAdminLyceumMutation } from './useDeleteAdminLyceumMutation'
import { getAdminLyceumsDeleteError } from '../services/adminLyceumsErrors'

type AdminLyceumActions = {
  deletingId: number | null
  deleteError: AppError | null
  onDelete: (id?: number) => Promise<boolean>
  isDeleting: (id?: number) => boolean
}

export const useAdminLyceumActions = (): AdminLyceumActions => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const mutation = useDeleteAdminLyceumMutation()

  const deleteError = useMemo(
    () => getAdminLyceumsDeleteError(mutation.error ?? null),
    [mutation.error],
  )

  const onDelete = useCallback(
    async (id?: number) => {
      if (!id || mutation.isPending) return false
      setDeletingId(id)
      try {
        await mutation.mutateAsync({ id })
        queryClient.setQueryData<LyceumResponse[]>(
          adminLyceumsQueryKey,
          (prev) => (prev ? prev.filter((item) => item.id !== id) : prev),
        )
        showToast({
          message: t('feedback.lyceums.deleteSuccess'),
          tone: 'success',
        })
        return true
      } catch (error) {
        const appError = getAdminLyceumsDeleteError(error as ApiError)
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
    [mutation, queryClient, showToast, t],
  )

  const isDeleting = useCallback(
    (id?: number) => Boolean(id && mutation.isPending && deletingId === id),
    [mutation.isPending, deletingId],
  )

  return {
    deletingId,
    deleteError,
    onDelete,
    isDeleting,
  }
}
