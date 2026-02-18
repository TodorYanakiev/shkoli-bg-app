import { useMemo } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { RatingStars } from '../../../components/ui/RatingStars'
import type { AppError } from '../../../types/appError'
import type { ReviewResponse } from '../../../types/reviews'
import { formatAverageRating } from '../services/reviewFormatters'
import type { ReviewFormValues } from '../validations/reviewSchema'
import { CourseDetailReviewComposer } from './CourseDetailReviewComposer'
import { CourseDetailReviewsList } from './CourseDetailReviewsList'

type CourseDetailReviewsPanelProps = {
  contentKeyPrefix:
    | 'pages.reviews.courseDetail'
    | 'pages.reviews.lyceumDetail'
    | 'pages.reviews.lecturerDetail'
  sectionId: string
  className?: string
  reviews: ReviewResponse[]
  reviewerNames: Map<number, string>
  currentUserId?: number
  resolvedAverage: number | null
  isAuthenticated: boolean
  hasOwnReview: boolean
  isMutating: boolean
  isDeletePending: boolean
  selectedRating: number
  actionError: AppError | null
  ownReviewIsLoading: boolean
  ownReviewError: AppError | null
  reviewsLoading: boolean
  reviewsError: AppError | null
  form: UseFormReturn<ReviewFormValues>
  onSubmit: () => void
  onDelete: () => void
  onFocusEditor: () => void
  editorTriggerButtonId?: string
}

export const CourseDetailReviewsPanel = ({
  contentKeyPrefix,
  sectionId,
  className,
  reviews,
  reviewerNames,
  currentUserId,
  resolvedAverage,
  isAuthenticated,
  hasOwnReview,
  isMutating,
  isDeletePending,
  selectedRating,
  actionError,
  ownReviewIsLoading,
  ownReviewError,
  reviewsLoading,
  reviewsError,
  form,
  onSubmit,
  onDelete,
  onFocusEditor,
  editorTriggerButtonId,
}: CourseDetailReviewsPanelProps) => {
  const { t, i18n } = useTranslation()

  const ratingBuckets = useMemo(() => {
    const counts = new Map<number, number>()
    ;[1, 2, 3, 4, 5].forEach((rating) => counts.set(rating, 0))

    reviews.forEach((review) => {
      if (
        typeof review.rating === 'number' &&
        Number.isFinite(review.rating) &&
        review.rating >= 1 &&
        review.rating <= 5
      ) {
        counts.set(review.rating, (counts.get(review.rating) ?? 0) + 1)
      }
    })

    const maxCount = Math.max(...counts.values(), 1)
    return [5, 4, 3, 2, 1].map((rating) => {
      const count = counts.get(rating) ?? 0
      return {
        rating,
        count,
        widthPercent: (count / maxCount) * 100,
      }
    })
  }, [reviews])

  const reviewCount = reviews.length
  const averageValue = resolvedAverage ?? 0

  return (
    <section id={sectionId} className={className ?? 'scroll-mt-24'}>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,0.95fr)]">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[minmax(0,0.56fr)_minmax(0,1fr)]">
            <div>
              <p className="text-xl font-semibold text-slate-900">
                {t(`${contentKeyPrefix}.summaryTitle`)}
              </p>
              <p className="mt-1 text-5xl font-bold leading-none text-brand">
                {formatAverageRating(averageValue, i18n.language)}
                <span className="ml-1 text-3xl font-semibold text-slate-500">
                  /5
                </span>
              </p>
              <div className="mt-2">
                <RatingStars rating={averageValue} showValue={false} />
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {t('pages.shkoli.detail.reviewCount', { count: reviewCount })}
              </p>
            </div>

            <div className="space-y-2.5">
              {ratingBuckets.map((bucket) => (
                <div key={bucket.rating} className="flex items-center gap-3">
                  <span className="w-16 shrink-0 text-sm text-slate-600">
                    {t(`${contentKeyPrefix}.ratingLevel`, {
                      rating: bucket.rating,
                    })}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <span
                      className="block h-full rounded-full bg-amber-400"
                      style={{ width: `${bucket.widthPercent}%` }}
                    />
                  </div>
                  <span className="w-4 text-right text-sm font-medium text-slate-700">
                    {bucket.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <button
            id={editorTriggerButtonId}
            type="button"
            onClick={onFocusEditor}
            className="mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            {t('pages.shkoli.detail.actions.writeReview')}
          </button>
        </article>

        <CourseDetailReviewComposer
          contentKeyPrefix={contentKeyPrefix}
          isAuthenticated={isAuthenticated}
          hasOwnReview={hasOwnReview}
          isMutating={isMutating}
          isDeletePending={isDeletePending}
          selectedRating={selectedRating}
          actionError={actionError}
          ownReviewIsLoading={ownReviewIsLoading}
          ownReviewError={ownReviewError}
          form={form}
          onSubmit={onSubmit}
          onDelete={onDelete}
        />
      </div>

      <CourseDetailReviewsList
        contentKeyPrefix={contentKeyPrefix}
        reviews={reviews}
        reviewerNames={reviewerNames}
        currentUserId={currentUserId}
        reviewsLoading={reviewsLoading}
        reviewsError={reviewsError}
      />
    </section>
  )
}
