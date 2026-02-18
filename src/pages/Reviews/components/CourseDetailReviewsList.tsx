import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { RatingStars } from '../../../components/ui/RatingStars'
import type { AppError } from '../../../types/appError'
import type { ReviewResponse } from '../../../types/reviews'
import { formatReviewDate } from '../services/reviewFormatters'

type CourseDetailReviewsListProps = {
  contentKeyPrefix:
    | 'pages.reviews.courseDetail'
    | 'pages.reviews.lyceumDetail'
    | 'pages.reviews.lecturerDetail'
  reviews: ReviewResponse[]
  reviewerNames: Map<number, string>
  reviewerAvatarUrls: Map<number, string>
  currentUserId?: number
  reviewsLoading: boolean
  reviewsError: AppError | null
}

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest'

const SORT_OPTIONS: SortOption[] = ['newest', 'oldest', 'highest', 'lowest']

const getInitials = (value: string) =>
  value
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

const getTimestamp = (value?: string) => {
  if (!value) return 0
  const timestamp = new Date(value).getTime()
  return Number.isFinite(timestamp) ? timestamp : 0
}

const sortReviews = (reviews: ReviewResponse[], sortOption: SortOption) => {
  const sorted = [...reviews]

  sorted.sort((left, right) => {
    const leftRating =
      typeof left.rating === 'number' && Number.isFinite(left.rating)
        ? left.rating
        : 0
    const rightRating =
      typeof right.rating === 'number' && Number.isFinite(right.rating)
        ? right.rating
        : 0
    const leftTimestamp = getTimestamp(left.createdAt)
    const rightTimestamp = getTimestamp(right.createdAt)

    if (sortOption === 'newest') {
      return rightTimestamp - leftTimestamp
    }
    if (sortOption === 'oldest') {
      return leftTimestamp - rightTimestamp
    }
    if (sortOption === 'highest') {
      return rightRating - leftRating || rightTimestamp - leftTimestamp
    }

    return leftRating - rightRating || rightTimestamp - leftTimestamp
  })

  return sorted
}

export const CourseDetailReviewsList = ({
  contentKeyPrefix,
  reviews,
  reviewerNames,
  reviewerAvatarUrls,
  currentUserId,
  reviewsLoading,
  reviewsError,
}: CourseDetailReviewsListProps) => {
  const { t, i18n } = useTranslation()
  const [sortOption, setSortOption] = useState<SortOption>('newest')

  const sortedReviews = useMemo(
    () => sortReviews(reviews, sortOption),
    [reviews, sortOption],
  )

  return (
    <div className="mt-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-3xl font-semibold text-slate-900">
          {t(`${contentKeyPrefix}.allReviews`)}{' '}
          <span className="text-slate-500">({reviews.length})</span>
        </h3>
        <label className="inline-flex items-center gap-2 text-sm text-slate-600">
          <span>{t(`${contentKeyPrefix}.sortLabel`)}</span>
          <select
            value={sortOption}
            onChange={(event) => setSortOption(event.target.value as SortOption)}
            className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {t(`${contentKeyPrefix}.sort.${option}`)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-3">
        {reviewsLoading ? (
          <p className="text-sm text-slate-600">{t('pages.reviews.list.loading')}</p>
        ) : reviewsError ? (
          <div
            className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
            role="alert"
          >
            {t(reviewsError.messageKey)}
          </div>
        ) : sortedReviews.length === 0 ? (
          <p className="text-sm text-slate-600">{t('pages.reviews.list.empty')}</p>
        ) : (
          <ul className="space-y-3">
            {sortedReviews.map((review, index) => {
              const reviewerId = review.userId
              const reviewerName =
                (reviewerId != null ? reviewerNames.get(reviewerId) : null) ??
                t('pages.reviews.list.reviewerFallback')
              const reviewerAvatarUrl =
                reviewerId != null ? reviewerAvatarUrls.get(reviewerId) : null
              const ratingValue = review.rating ?? 0
              const createdAt = formatReviewDate(review.createdAt, i18n.language)

              return (
                <li
                  key={review.id ?? `${reviewerName}-${index}`}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-600">
                        <span>{getInitials(reviewerName)}</span>
                        {reviewerAvatarUrl ? (
                          <img
                            src={reviewerAvatarUrl}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : null}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-slate-900">
                          {reviewerName}
                          {reviewerId != null && reviewerId === currentUserId ? (
                            <span className="ml-2 text-xs font-medium text-brand">
                              {t('pages.reviews.list.yourReview')}
                            </span>
                          ) : null}
                        </p>
                        {createdAt ? (
                          <p className="text-xs text-slate-500">{createdAt}</p>
                        ) : null}
                      </div>
                    </div>
                    <div className="shrink-0">
                      <RatingStars rating={ratingValue} showValue />
                    </div>
                  </div>
                  {review.comment ? (
                    <p className="mt-3 text-base leading-relaxed text-slate-700">
                      {review.comment}
                    </p>
                  ) : (
                    <p className="mt-3 text-base text-slate-500">
                      {t('pages.reviews.list.commentEmpty')}
                    </p>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
