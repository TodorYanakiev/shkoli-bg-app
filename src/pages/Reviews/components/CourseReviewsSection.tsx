import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useToast } from '../../../components/feedback/ToastContext'
import { useAuthStatus } from '../../../hooks/useAuthStatus'
import { useUsersByIds } from '../../../hooks/useUsersByIds'
import type { AppError } from '../../../types/appError'
import { getUserDisplayName } from '../../../utils/user'
import { useUserProfile } from '../../Profile/hooks/useUserProfile'
import {
  useCourseReview,
  useCourseReviews,
  useCreateCourseReviewMutation,
  useDeleteCourseReviewMutation,
  useUpdateCourseReviewMutation,
} from '../hooks/useCourseReviews'
import { useReviewForm } from '../hooks/useReviewForm'
import {
  calculateAverageRating,
  normalizeAverageRating,
} from '../services/reviewFormatters'
import { CourseDetailReviewsPanel } from './CourseDetailReviewsPanel'

type CourseReviewsSectionProps = {
  courseId?: number
  averageRating?: number | null
  className?: string
  editorTriggerButtonId?: string
}

export const CourseReviewsSection = ({
  courseId,
  averageRating,
  className,
  editorTriggerButtonId,
}: CourseReviewsSectionProps) => {
  const { t } = useTranslation()
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuthStatus()
  const { data: currentUser } = useUserProfile({ enabled: isAuthenticated })

  const currentUserId = currentUser?.id
  const reviewsQuery = useCourseReviews(courseId)
  const ownReviewQuery = useCourseReview(courseId, currentUserId, {
    enabled: isAuthenticated,
    allowMissing: true,
  })
  const createMutation = useCreateCourseReviewMutation(courseId)
  const updateMutation = useUpdateCourseReviewMutation(courseId, currentUserId)
  const deleteMutation = useDeleteCourseReviewMutation(courseId, currentUserId)
  const reviews = useMemo(() => reviewsQuery.data ?? [], [reviewsQuery.data])
  const ownReview = ownReviewQuery.data ?? null
  const hasOwnReview = Boolean(ownReview?.id)
  const reviewerIds = useMemo(
    () =>
      Array.from(
        new Set(
          reviews
            .map((review) => review.userId)
            .filter(
              (userId): userId is number =>
                typeof userId === 'number' && Number.isFinite(userId),
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
    if (courseId != null) {
      void queryClient.invalidateQueries({
        queryKey: ['courses', 'detail', courseId],
      })
    }

    void queryClient.invalidateQueries({ queryKey: ['courses', 'filter'] })
    void queryClient.invalidateQueries({ queryKey: ['lyceums', 'courses'] })
  }, [courseId, queryClient])

  const refreshAfterMutation = useCallback(() => {
    void reviewsQuery.refetch()
    void ownReviewQuery.refetch()
    onMutated()
  }, [onMutated, ownReviewQuery, reviewsQuery])

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
      contentKeyPrefix="pages.reviews.courseDetail"
      sectionId="course-reviews"
      className={className}
      reviews={reviews}
      reviewerNames={reviewerNames}
      currentUserId={currentUserId}
      resolvedAverage={resolvedAverage}
      isAuthenticated={isAuthenticated}
      hasOwnReview={hasOwnReview}
      isMutating={isMutating}
      isDeletePending={deleteMutation.isPending}
      selectedRating={selectedRating}
      actionError={actionError}
      ownReviewIsLoading={ownReviewQuery.isLoading}
      ownReviewError={ownReviewQuery.error ?? null}
      reviewsLoading={reviewsQuery.isLoading}
      reviewsError={reviewsQuery.error ?? null}
      form={form}
      onSubmit={onSubmit}
      onDelete={onDelete}
      onFocusEditor={onFocusEditor}
      editorTriggerButtonId={editorTriggerButtonId}
    />
  )
}
