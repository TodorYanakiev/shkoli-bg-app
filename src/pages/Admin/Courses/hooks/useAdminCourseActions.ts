import { useCallback, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { useToast } from '../../../../components/feedback/ToastContext'
import type { ApiError } from '../../../../types/api'
import type { AppError } from '../../../../types/appError'
import { adminCoursesQueryKeyPrefix } from './useAdminCourses'
import { useDeleteAdminCourseMutation } from './useDeleteAdminCourseMutation'
import { getAdminCoursesDeleteError } from '../services/adminCoursesErrors'

type AdminCourseActions = {
  deletingId: number | null
  deleteError: AppError | null
  onDelete: (id?: number) => Promise<boolean>
  isDeleting: (id?: number) => boolean
}

export const useAdminCourseActions = (): AdminCourseActions => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const mutation = useDeleteAdminCourseMutation()

  const deleteError = useMemo(
    () => getAdminCoursesDeleteError(mutation.error ?? null),
    [mutation.error],
  )

  const onDelete = useCallback(
    async (id?: number) => {
      if (!id || mutation.isPending) return false
      setDeletingId(id)
      try {
        await mutation.mutateAsync({ id })
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: adminCoursesQueryKeyPrefix,
          }),
          queryClient.invalidateQueries({
            queryKey: ['courses', 'filter'],
          }),
        ])
        showToast({
          message: t('feedback.courses.deleteSuccess'),
          tone: 'success',
        })
        return true
      } catch (error) {
        const appError = getAdminCoursesDeleteError(error as ApiError)
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
