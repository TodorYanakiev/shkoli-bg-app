import { useCallback, useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { useToast } from '../../../../components/feedback/ToastContext'
import { useAuthStatus } from '../../../../hooks/useAuthStatus'
import { useLoginRedirectToCurrentPage } from '../../../../hooks/useLoginRedirectToCurrentPage'
import {
  createInvalidSubscriptionTargetError,
  mapSubscriptionApiError,
} from '../../../../services/subscriptionErrors'
import {
  getStoredSubscriptionState,
  setStoredSubscriptionState,
} from '../../../../services/subscriptionState'
import {
  subscribeToCourse,
  unsubscribeFromCourse,
} from '../../../../services/subscriptions'
import type { AppError } from '../../../../types/appError'
import {
  useUserProfile,
  userProfileQueryKey,
} from '../../../Profile/hooks/useUserProfile'

type CourseSubscriptionActions = {
  isAuthenticated: boolean
  isSubscribed: boolean
  actionError: AppError | null
  isPending: boolean
  onToggleSubscription: () => Promise<void>
}

const hasValidCourseId = (courseId?: number): courseId is number =>
  typeof courseId === 'number' && Number.isFinite(courseId)

export const useCourseSubscriptionActions = (
  courseId?: number,
): CourseSubscriptionActions => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const redirectToLogin = useLoginRedirectToCurrentPage()
  const { isAuthenticated } = useAuthStatus()
  const { data: currentUser } = useUserProfile({ enabled: isAuthenticated })
  const [actionError, setActionError] = useState<AppError | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const currentUserId = currentUser?.id

  useEffect(() => {
    const storedState = getStoredSubscriptionState(
      currentUserId,
      'course',
      courseId,
    )
    setIsSubscribed(storedState ?? false)
    setActionError(null)
  }, [courseId, currentUserId])

  const subscribeMutation = useMutation<void, AppError, void>({
    mutationFn: async () => {
      if (!hasValidCourseId(courseId)) {
        throw createInvalidSubscriptionTargetError('course')
      }

      try {
        await subscribeToCourse(courseId)
      } catch (error) {
        throw mapSubscriptionApiError(error, 'course', 'subscribe')
      }
    },
    retry: false,
  })

  const unsubscribeMutation = useMutation<void, AppError, void>({
    mutationFn: async () => {
      if (!hasValidCourseId(courseId)) {
        throw createInvalidSubscriptionTargetError('course')
      }

      try {
        await unsubscribeFromCourse(courseId)
      } catch (error) {
        throw mapSubscriptionApiError(error, 'course', 'unsubscribe')
      }
    },
    retry: false,
  })

  const refreshCurrentUser = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: userProfileQueryKey,
    })
  }, [queryClient])

  const syncSubscriptionState = useCallback(
    (nextValue: boolean) => {
      setIsSubscribed(nextValue)
      setStoredSubscriptionState(currentUserId, 'course', courseId, nextValue)
    },
    [courseId, currentUserId],
  )

  const onToggleSubscription = useCallback(async () => {
    if (!isAuthenticated) {
      redirectToLogin()
      return
    }

    setActionError(null)

    try {
      if (isSubscribed) {
        await unsubscribeMutation.mutateAsync()
        syncSubscriptionState(false)
        await refreshCurrentUser()
        showToast({
          message: t('feedback.courses.unsubscribed'),
          tone: 'success',
        })
        return
      }

      await subscribeMutation.mutateAsync()
      syncSubscriptionState(true)
      await refreshCurrentUser()
      showToast({
        message: t('feedback.courses.subscribed'),
        tone: 'success',
      })
    } catch (error) {
      const appError = error as AppError

      if (appError.messageKey === 'errors.courses.alreadySubscribed') {
        syncSubscriptionState(true)
        showToast({
          message: t(appError.messageKey),
          tone: 'info',
        })
        return
      }

      if (appError.messageKey === 'errors.courses.notSubscribed') {
        syncSubscriptionState(false)
        showToast({
          message: t(appError.messageKey),
          tone: 'info',
        })
        return
      }

      setActionError(appError)
      showToast({
        message: t(appError.messageKey),
        tone: 'error',
      })
    }
  }, [
    isAuthenticated,
    isSubscribed,
    refreshCurrentUser,
    redirectToLogin,
    showToast,
    subscribeMutation,
    syncSubscriptionState,
    t,
    unsubscribeMutation,
  ])

  return {
    isAuthenticated,
    isSubscribed,
    actionError,
    isPending: subscribeMutation.isPending || unsubscribeMutation.isPending,
    onToggleSubscription,
  }
}
