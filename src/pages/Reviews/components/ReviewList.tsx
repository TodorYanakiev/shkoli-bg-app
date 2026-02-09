import { useTranslation } from 'react-i18next'

import { RatingStars } from '../../../components/ui/RatingStars'
import type { AppError } from '../../../types/appError'
import type { ReviewResponse } from '../../../types/reviews'
import { formatReviewDate } from '../services/reviewFormatters'

type ReviewListProps = {
  reviews: ReviewResponse[]
  isLoading: boolean
  error: AppError | null
  currentUserId?: number
  reviewerNames: Map<number, string>
}

export const ReviewList = ({
  reviews,
  isLoading,
  error,
  currentUserId,
  reviewerNames,
}: ReviewListProps) => {
  const { t, i18n } = useTranslation()

  if (isLoading) {
    return <p className="text-sm text-slate-600">{t('pages.reviews.list.loading')}</p>
  }

  if (error) {
    return (
      <div
        className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
        role="alert"
      >
        {t(error.messageKey)}
      </div>
    )
  }

  if (reviews.length === 0) {
    return <p className="text-sm text-slate-600">{t('pages.reviews.list.empty')}</p>
  }

  return (
    <ul className="space-y-3">
      {reviews.map((review, index) => {
        const reviewerId = review.userId
        const reviewerName =
          (reviewerId != null ? reviewerNames.get(reviewerId) : null) ??
          t('pages.reviews.list.reviewerFallback')
        const ratingValue = review.rating ?? 0
        const createdAt = formatReviewDate(review.createdAt, i18n.language)

        return (
          <li
            key={review.id ?? `${reviewerName}-${index}`}
            className="rounded-xl border border-slate-200 bg-slate-50/70 p-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">
                {reviewerName}
                {reviewerId != null && reviewerId === currentUserId ? (
                  <span className="ml-2 text-xs font-medium text-brand">
                    {t('pages.reviews.list.yourReview')}
                  </span>
                ) : null}
              </p>
              <RatingStars rating={ratingValue} showValue />
            </div>
            {createdAt ? (
              <p className="mt-1 text-xs text-slate-500">{createdAt}</p>
            ) : null}
            {review.comment ? (
              <p className="mt-2 text-sm text-slate-700">
                {review.comment}
              </p>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}
