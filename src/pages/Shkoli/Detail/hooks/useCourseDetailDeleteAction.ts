import { useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useToast } from '../../../../components/feedback/ToastContext'
import { deleteCourse } from '../../../../services/courses'
import type { ApiError } from '../../../../types/api'
import { getCourseDeleteError } from '../services/courseDetailErrors'

type UseCourseDetailDeleteActionOptions = {
  courseId: number
  canDeleteCourse: boolean
  courseName?: string
}

type CourseDetailDeleteAction = {
  isDeletingCourse: boolean
  onDeleteCourse: () => Promise<boolean>
}

export const useCourseDetailDeleteAction = ({
  courseId,
  canDeleteCourse,
  courseName,
}: UseCourseDetailDeleteActionOptions): CourseDetailDeleteAction => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const mutation = useMutation<void, ApiError, number>({
    mutationKey: ['courses', 'detail', 'delete'],
    mutationFn: (id) => deleteCourse(id),
    retry: false,
  })

  const onDeleteCourse = useCallback(async () => {
    if (!canDeleteCourse || !Number.isFinite(courseId) || mutation.isPending) {
      return false
    }

    const fallbackName = t('pages.profile.emptyValue')
    const resolvedName = courseName?.trim() || fallbackName
    const shouldDelete = window.confirm(
      t('pages.shkoli.detail.deleteConfirm.message', {
        name: resolvedName,
      }),
    )
    if (!shouldDelete) {
      return false
    }

    try {
      await mutation.mutateAsync(courseId)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['courses'] }),
        queryClient.invalidateQueries({ queryKey: ['lyceums', 'courses'] }),
      ])
      showToast({
        message: t('feedback.courses.deleteSuccess'),
        tone: 'success',
      })
      navigate('/shkoli', { replace: true })
      return true
    } catch (error) {
      const appError = getCourseDeleteError(error as ApiError)
      if (appError) {
        showToast({
          message: t(appError.messageKey),
          tone: 'error',
        })
      }
      return false
    }
  }, [
    canDeleteCourse,
    courseId,
    mutation,
    queryClient,
    showToast,
    t,
    courseName,
    navigate,
  ])

  return {
    isDeletingCourse: mutation.isPending,
    onDeleteCourse,
  }
}
