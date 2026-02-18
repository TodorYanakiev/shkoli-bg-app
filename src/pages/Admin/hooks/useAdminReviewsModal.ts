import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useToast } from '../../../components/feedback/ToastContext'
import { useUsersByIds } from '../../../hooks/useUsersByIds'
import type { AppError } from '../../../types/appError'
import type { ReviewResponse } from '../../../types/reviews'
import { getUserDisplayName } from '../../../utils/user'
import { adminCoursesQueryKeyPrefix } from '../Courses/hooks/useAdminCourses'
import { adminLyceumsQueryKey } from '../Lyceums/hooks/useAdminLyceums'
import { adminUsersQueryKeyPrefix } from '../Users/hooks/useAdminUsers'
import {
  adminReviewsQueryKey,
  useAdminReviews,
  useDeleteAdminReviewMutation,
} from './useAdminReviews'
import type { AdminReviewEntity } from '../types'
import {
  calculateAdminAverageRating,
  normalizeAdminAverageRating,
} from '../services/adminReviewFormatters'

type UseAdminReviewsModalOptions = {
  isOpen: boolean
  reviewTarget: AdminReviewEntity | null
}

type UseAdminReviewsModalResult = {
  reviews: ReviewResponse[]
  reviewerNames: Map<number, string>
  reviewersAreLoading: boolean
  resolvedAverage: number | null
  actionError: AppError | null
  isDeletePending: boolean
  isLoading: boolean
  error: AppError | null
  isDeletingReview: (reviewerId?: number) => boolean
  onDeleteReview: (reviewerId?: number) => Promise<void>
}

const getInvalidationQueryKeys = (
  reviewTarget: AdminReviewEntity,
): ReadonlyArray<readonly unknown[]> => {
  const queryKeys: Array<readonly unknown[]> = [
    adminReviewsQueryKey(reviewTarget.type, reviewTarget.id),
  ]

  if (reviewTarget.type === 'course') {
    queryKeys.push(
      adminCoursesQueryKeyPrefix,
      ['courses', 'filter'],
      ['courses', 'detail', reviewTarget.id],
      ['lyceums', 'courses'],
    )
    return queryKeys
  }

  if (reviewTarget.type === 'lyceum') {
    queryKeys.push(
      adminLyceumsQueryKey,
      ['lyceums'],
      ['lyceums', 'detail', reviewTarget.id],
    )
    return queryKeys
  }

  queryKeys.push(adminUsersQueryKeyPrefix, ['users'])
  return queryKeys
}

export const useAdminReviewsModal = ({
  isOpen,
  reviewTarget,
}: UseAdminReviewsModalOptions): UseAdminReviewsModalResult => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const [deletingReviewerId, setDeletingReviewerId] = useState<number | null>(
    null,
  )

  const queryTarget = reviewTarget
    ? {
        entityType: reviewTarget.type,
        entityId: reviewTarget.id,
      }
    : {}

  const reviewsQuery = useAdminReviews(queryTarget, { enabled: isOpen })
  const deleteMutation = useDeleteAdminReviewMutation(queryTarget)
  const reviews = useMemo(() => reviewsQuery.data ?? [], [reviewsQuery.data])
  const actionError = deleteMutation.error ?? null

  const reviewerIds = useMemo(
    () =>
      Array.from(
        new Set(
          reviews
            .map((review) => review.userId)
            .filter(
              (reviewerId): reviewerId is number =>
                typeof reviewerId === 'number' &&
                Number.isFinite(reviewerId),
            ),
        ),
      ),
    [reviews],
  )
  const reviewersQuery = useUsersByIds(reviewerIds, {
    enabled: isOpen && reviewerIds.length > 0,
  })
  const reviewerNames = useMemo(
    () =>
      !reviewersQuery.data
        ? new Map<number, string>()
        : new Map(
            reviewersQuery.data
              .filter((user) => user.id != null)
              .map((user) => [user.id as number, getUserDisplayName(user)]),
          ),
    [reviewersQuery.data],
  )

  const resolvedAverage =
    normalizeAdminAverageRating(reviewTarget?.averageRating) ??
    calculateAdminAverageRating(reviews)

  const isDeletingReview = useCallback(
    (reviewerId?: number) =>
      Boolean(
        typeof reviewerId === 'number' &&
          deleteMutation.isPending &&
          deletingReviewerId === reviewerId,
      ),
    [deleteMutation.isPending, deletingReviewerId],
  )

  const onDeleteReview = useCallback(
    async (reviewerId?: number) => {
      if (!reviewTarget || deleteMutation.isPending) return
      if (typeof reviewerId !== 'number' || !Number.isFinite(reviewerId)) return
      if (!window.confirm(t('pages.admin.reviews.deleteConfirm'))) return

      deleteMutation.reset()
      setDeletingReviewerId(reviewerId)

      try {
        await deleteMutation.mutateAsync({ reviewerId })
        await Promise.all(
          getInvalidationQueryKeys(reviewTarget).map((queryKey) =>
            queryClient.invalidateQueries({ queryKey }),
          ),
        )
        showToast({
          message: t('feedback.reviews.deleteSuccess'),
          tone: 'success',
        })
      } catch (error) {
        const appError = error as AppError
        showToast({
          message: t(appError.messageKey ?? 'errors.reviews.deleteFailed'),
          tone: 'error',
        })
      } finally {
        setDeletingReviewerId(null)
      }
    },
    [deleteMutation, queryClient, reviewTarget, showToast, t],
  )

  return {
    reviews,
    reviewerNames,
    reviewersAreLoading: reviewersQuery.isLoading,
    resolvedAverage,
    actionError,
    isDeletePending: deleteMutation.isPending,
    isLoading: reviewsQuery.isLoading,
    error: reviewsQuery.error ?? null,
    isDeletingReview,
    onDeleteReview,
  }
}
