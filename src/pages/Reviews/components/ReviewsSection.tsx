import { type UseMutationResult, type UseQueryResult } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from '../../../components/feedback/ToastContext'
import { RatingStars } from '../../../components/ui/RatingStars'
import { useUsersByIds } from '../../../hooks/useUsersByIds'
import type { AppError } from '../../../types/appError'
import type { ReviewRequest, ReviewResponse, ReviewUpdateRequest } from '../../../types/reviews'
import { getUserDisplayName } from '../../../utils/user'
import { useReviewForm } from '../hooks/useReviewForm'
import { calculateAverageRating, formatAverageRating, normalizeAverageRating } from '../services/reviewFormatters'
import { ReviewEditorPanel } from './ReviewEditorPanel'
import { ReviewList } from './ReviewList'
type ReviewsSectionProps = {
  titleKey: string
  sectionId?: string
  editorMode?: 'inline' | 'modal'
  averageRating?: number | null
  isAuthenticated: boolean
  currentUserId?: number
  reviewsQuery: UseQueryResult<ReviewResponse[], AppError>
  ownReviewQuery: UseQueryResult<ReviewResponse | null, AppError>
  createMutation: UseMutationResult<ReviewResponse, AppError, ReviewRequest>
  updateMutation: UseMutationResult<ReviewResponse, AppError, ReviewUpdateRequest>
  deleteMutation: UseMutationResult<void, AppError, void>
  onMutated?: () => void
  className?: string
}
export const ReviewsSection = ({
  titleKey,
  sectionId,
  editorMode = 'inline',
  averageRating,
  isAuthenticated,
  currentUserId,
  reviewsQuery,
  ownReviewQuery,
  createMutation,
  updateMutation,
  deleteMutation,
  onMutated,
  className,
}: ReviewsSectionProps) => {
  const { t, i18n } = useTranslation()
  const { showToast } = useToast()
  const reviews = useMemo(
    () => reviewsQuery.data ?? [],
    [reviewsQuery.data],
  )
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
              .map((user) => [user.id as number, getUserDisplayName(user)]),
          ),
    [reviewersQuery.data],
  )
  const resolvedAverage =
    normalizeAverageRating(averageRating) ?? calculateAverageRating(reviews)
  const form = useReviewForm({ review: ownReview, t })
  const selectedRatingRaw = form.watch('rating')
  const selectedRating = useMemo(() => {
    if (typeof selectedRatingRaw === 'number' && Number.isFinite(selectedRatingRaw)) {
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
  const refreshAfterMutation = () => {
    void reviewsQuery.refetch()
    void ownReviewQuery.refetch()
    onMutated?.()
  }

  const applyFieldErrors = (error: AppError) => {
    Object.entries(error.fieldErrors ?? {}).forEach(([fieldName, key]) => {
      if (fieldName === 'rating' || fieldName === 'comment') {
        form.setError(fieldName, { type: 'server', message: t(key) })
      }
    })
  }

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

  const onDelete = () => {
    if (!hasOwnReview || !window.confirm(t('pages.reviews.form.deleteConfirm'))) {
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
  }

  return (
    <section
      id={sectionId}
      className={
        className ??
        'scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'
      }
    >
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold text-slate-900">{t(titleKey)}</h3>
        {resolvedAverage != null ? (
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5">
            <RatingStars rating={resolvedAverage} showValue={false} />
            <span className="text-xs font-semibold text-amber-700">
              {formatAverageRating(resolvedAverage, i18n.language)}
            </span>
            <span className="text-xs text-amber-700/80">({reviews.length})</span>
          </div>
        ) : (
          <span className="text-xs font-medium text-slate-500">
            {t('pages.reviews.summary.noRatings')}
          </span>
        )}
      </div>
      <div className="mt-4">
        <ReviewList
          reviews={reviews}
          isLoading={reviewsQuery.isLoading}
          error={reviewsQuery.error ?? null}
          currentUserId={currentUserId}
          reviewerNames={reviewerNames}
        />
      </div>
      <ReviewEditorPanel
        editorMode={editorMode}
        isAuthenticated={isAuthenticated}
        hasOwnReview={hasOwnReview}
        isMutating={isMutating}
        isDeletePending={deleteMutation.isPending}
        selectedRating={selectedRating}
        actionError={actionError}
        form={form}
        onSubmit={onSubmit}
        onDelete={onDelete}
        ownReviewIsLoading={ownReviewQuery.isLoading}
        ownReviewError={ownReviewQuery.error ?? null}
      />
    </section>
  )
}
