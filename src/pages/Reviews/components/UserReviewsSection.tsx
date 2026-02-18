import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useToast } from '../../../components/feedback/ToastContext'
import { useAuthStatus } from '../../../hooks/useAuthStatus'
import { useUsersByIds } from '../../../hooks/useUsersByIds'
import type { AppError } from '../../../types/appError'
import { getUserDisplayName } from '../../../utils/user'
import { resolveUserImageUrl } from '../../../utils/userImages'
import { useUserProfile } from '../../Profile/hooks/useUserProfile'
import {
  useCreateUserReviewMutation,
  useDeleteUserReviewMutation,
  useUpdateUserReviewMutation,
  useUserReview,
  useUserReviews,
} from '../hooks/useUserReviews'
import { useReviewForm } from '../hooks/useReviewForm'
import {
  calculateAverageRating,
  normalizeAverageRating,
} from '../services/reviewFormatters'
import { CourseDetailReviewsPanel } from './CourseDetailReviewsPanel'

type UserReviewsSectionProps = {
  userId?: number
  averageRating?: number | null
  lyceumId?: number
  className?: string
}

export const UserReviewsSection = ({
  userId,
  averageRating,
  lyceumId,
  className,
}: UserReviewsSectionProps) => {
  const { t } = useTranslation()
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuthStatus()
  const { data: currentUser } = useUserProfile({ enabled: isAuthenticated })

  const currentUserId = currentUser?.id
  const reviewsQuery = useUserReviews(userId)
  const reviews = useMemo(() => reviewsQuery.data ?? [], [reviewsQuery.data])
  const ownReviewFromList = useMemo(
    () =>
      !isAuthenticated || currentUserId == null
        ? null
        : reviews.find((review) => review.userId === currentUserId) ?? null,
    [currentUserId, isAuthenticated, reviews],
  )
  const hasOwnReviewInList = ownReviewFromList != null
  const ownReviewQuery = useUserReview(userId, currentUserId, {
    enabled: isAuthenticated && hasOwnReviewInList,
    allowMissing: true,
  })
  const createMutation = useCreateUserReviewMutation(userId)
  const updateMutation = useUpdateUserReviewMutation(userId, currentUserId)
  const deleteMutation = useDeleteUserReviewMutation(userId, currentUserId)
  const ownReview = hasOwnReviewInList
    ? ownReviewQuery.data ?? ownReviewFromList
    : null
  const hasOwnReview = Boolean(ownReview?.id)
  const reviewerIds = useMemo(
    () =>
      Array.from(
        new Set(
          reviews
            .map((review) => review.userId)
            .filter(
              (reviewerId): reviewerId is number =>
                typeof reviewerId === 'number' && Number.isFinite(reviewerId),
            ),
        ),
      ),
    [reviews],
  )
  const reviewersQuery = useUsersByIds(reviewerIds, {
    enabled: reviewerIds.length > 0,
  })
  const reviewerNames = useMemo(
    () =>
      !reviewersQuery.data
        ? new Map<number, string>()
        : new Map(
            reviewersQuery.data
              .filter((user) => user.id != null)
              .map((user) => [
                user.id as number,
                getUserDisplayName(user) || t('pages.reviews.list.reviewerFallback'),
              ]),
          ),
    [reviewersQuery.data, t],
  )
  const reviewerAvatarUrls = useMemo(() => {
    const avatarMap = new Map<number, string>()
    reviewersQuery.data?.forEach((user) => {
      if (user.id == null) return
      const avatarUrl = resolveUserImageUrl(user.profileImage)
      if (avatarUrl) {
        avatarMap.set(user.id, avatarUrl)
      }
    })
    return avatarMap
  }, [reviewersQuery.data])
  const resolvedAverage =
    normalizeAverageRating(averageRating) ?? calculateAverageRating(reviews)
  const form = useReviewForm({ review: ownReview, t })
  const selectedRatingRaw = form.watch('rating')
  const selectedRating = useMemo(() => {
    if (
      typeof selectedRatingRaw === 'number' &&
      Number.isFinite(selectedRatingRaw)
    ) {
      return selectedRatingRaw
    }
    const parsed = Number(selectedRatingRaw)
    return Number.isFinite(parsed) ? parsed : 5
  }, [selectedRatingRaw])
  const actionError =
    createMutation.error ?? updateMutation.error ?? deleteMutation.error
  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending

  const onMutated = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['users'] })

    if (lyceumId != null) {
      void queryClient.invalidateQueries({
        queryKey: ['lyceums', 'lecturers', lyceumId],
      })
    }
  }, [lyceumId, queryClient])

  const refreshAfterMutation = useCallback(() => {
    void reviewsQuery.refetch()
    onMutated()
  }, [onMutated, reviewsQuery])

  const applyFieldErrors = useCallback(
    (error: AppError) => {
      Object.entries(error.fieldErrors ?? {}).forEach(([fieldName, key]) => {
        if (fieldName === 'rating' || fieldName === 'comment') {
          form.setError(fieldName, { type: 'server', message: t(key) })
        }
      })
    },
    [form, t],
  )

  const onSubmit = form.handleSubmit((values) => {
    const mutation = hasOwnReview ? updateMutation : createMutation
    createMutation.reset()
    updateMutation.reset()
    mutation.mutate(
      { rating: values.rating, comment: values.comment },
      {
        onSuccess: () => {
          showToast({
            tone: 'success',
            message: t(
              hasOwnReview
                ? 'feedback.reviews.updateSuccess'
                : 'feedback.reviews.createSuccess',
            ),
          })
          refreshAfterMutation()
        },
        onError: applyFieldErrors,
      },
    )
  })

  const onDelete = useCallback(() => {
    if (
      !hasOwnReview ||
      !window.confirm(t('pages.reviews.form.deleteConfirm'))
    ) {
      return
    }
    deleteMutation.reset()
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        showToast({
          tone: 'success',
          message: t('feedback.reviews.deleteSuccess'),
        })
        refreshAfterMutation()
      },
    })
  }, [deleteMutation, hasOwnReview, refreshAfterMutation, showToast, t])

  const onFocusEditor = useCallback(() => {
    if (!isAuthenticated) {
      return
    }

    form.setFocus('comment')
  }, [form, isAuthenticated])

  return (
    <CourseDetailReviewsPanel
      contentKeyPrefix="pages.reviews.lecturerDetail"
      sectionId="user-reviews"
      className={className}
      reviews={reviews}
      reviewerNames={reviewerNames}
      reviewerAvatarUrls={reviewerAvatarUrls}
      currentUserId={currentUserId}
      resolvedAverage={resolvedAverage}
      isAuthenticated={isAuthenticated}
      hasOwnReview={hasOwnReview}
      isMutating={isMutating}
      isDeletePending={deleteMutation.isPending}
      selectedRating={selectedRating}
      actionError={actionError}
      ownReviewIsLoading={hasOwnReviewInList && ownReviewQuery.isLoading}
      ownReviewError={ownReviewQuery.error ?? null}
      reviewsLoading={reviewsQuery.isLoading}
      reviewsError={reviewsQuery.error ?? null}
      form={form}
      onSubmit={onSubmit}
      onDelete={onDelete}
      onFocusEditor={onFocusEditor}
    />
  )
}
