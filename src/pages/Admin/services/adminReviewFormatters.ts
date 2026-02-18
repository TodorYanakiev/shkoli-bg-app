import type { ReviewResponse } from '../../../types/reviews'

const MAX_STARS = 5

export const normalizeAdminAverageRating = (
  averageRating: number | null | undefined,
): number | null => {
  if (typeof averageRating !== 'number' || !Number.isFinite(averageRating)) {
    return null
  }

  const clampedValue = Math.min(Math.max(averageRating, 0), MAX_STARS)
  return Number(clampedValue.toFixed(1))
}

export const calculateAdminAverageRating = (
  reviews: ReviewResponse[],
): number | null => {
  const ratings = reviews
    .map((review) => review.rating)
    .filter((rating): rating is number =>
      typeof rating === 'number' && Number.isFinite(rating),
    )

  if (ratings.length === 0) {
    return null
  }

  const average =
    ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length

  return normalizeAdminAverageRating(average)
}

export const formatAdminAverageRating = (
  rating: number,
  locale: string,
): string =>
  new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(rating)

export const formatAdminReviewDate = (
  dateValue: string | undefined,
  locale: string,
): string | null => {
  if (!dateValue) return null

  const parsedDate = new Date(dateValue)
  if (Number.isNaN(parsedDate.getTime())) {
    return null
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsedDate)
}
