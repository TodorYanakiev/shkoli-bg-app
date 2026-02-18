import { useTranslation } from 'react-i18next'

import { RatingStars } from '../../../components/ui/RatingStars'
import type { ReviewResponse } from '../../../types/reviews'
import { formatAdminReviewDate } from '../services/adminReviewFormatters'

type AdminReviewsListProps = {
  reviews: ReviewResponse[]
  reviewerNames: Map<number, string>
  onDeleteReview: (reviewerId?: number) => Promise<void>
  isDeletingReview: (reviewerId?: number) => boolean
}

export const AdminReviewsList = ({
  reviews,
  reviewerNames,
  onDeleteReview,
  isDeletingReview,
}: AdminReviewsListProps) => {
  const { t, i18n } = useTranslation()

  return (
    <ul className="space-y-3">
      {reviews.map((review, index) => {
        const reviewerId = review.userId
        const hasReviewerId =
          typeof reviewerId === 'number' && Number.isFinite(reviewerId)
        const reviewerName =
          hasReviewerId
            ? reviewerNames.get(reviewerId) ??
              t('pages.admin.reviews.reviewerFallback', {
                id: reviewerId,
              })
            : t('pages.reviews.list.reviewerFallback')
        const createdAt = formatAdminReviewDate(review.createdAt, i18n.language)
        const deletedAt = formatAdminReviewDate(review.deletedAt, i18n.language)
        const isDeleted = Boolean(review.deletedAt)
        const isDeleting = isDeletingReview(reviewerId)
        const isDeleteDisabled = !hasReviewerId || isDeleted || isDeleting

        return (
          <li
            key={review.id ?? `${reviewerName}-${index}`}
            className="rounded-xl border border-slate-200 bg-slate-50/70 p-3"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">
                  {reviewerName}
                </p>
                {createdAt ? (
                  <p className="text-xs text-slate-500">
                    {t('pages.admin.reviews.createdAt', {
                      date: createdAt,
                    })}
                  </p>
                ) : null}
                {deletedAt ? (
                  <p className="text-xs text-rose-600">
                    {t('pages.admin.reviews.deletedAt', {
                      date: deletedAt,
                    })}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col items-end gap-2">
                <RatingStars rating={review.rating ?? 0} showValue />
                <button
                  type="button"
                  onClick={() => {
                    void onDeleteReview(reviewerId)
                  }}
                  disabled={isDeleteDisabled}
                  className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-semibold text-rose-700 transition hover:border-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeleting
                    ? t('pages.admin.reviews.actions.deleting')
                    : t('pages.admin.reviews.actions.delete')}
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-700">
              {review.comment ?? t('pages.reviews.list.commentEmpty')}
            </p>
            {isDeleted ? (
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-rose-600">
                {t('pages.admin.reviews.deletedBadge')}
              </p>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}
