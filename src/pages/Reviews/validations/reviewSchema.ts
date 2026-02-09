import { z } from 'zod'
import type { TFunction } from 'i18next'

const MIN_REVIEW_RATING = 1
const MAX_REVIEW_RATING = 5

export const getReviewSchema = (t: TFunction) =>
  z.object({
    rating: z.coerce
      .number({
        required_error: t('validation.required'),
        invalid_type_error: t('validation.number'),
      })
      .min(MIN_REVIEW_RATING, t('pages.reviews.form.validation.ratingRange'))
      .max(MAX_REVIEW_RATING, t('pages.reviews.form.validation.ratingRange')),
    comment: z
      .string()
      .optional()
      .transform((value) => {
        const trimmed = value?.trim()
        return trimmed ? trimmed : undefined
      }),
  })

export type ReviewFormValues = z.infer<ReturnType<typeof getReviewSchema>>

export const REVIEW_RATING_OPTIONS = [5, 4, 3, 2, 1] as const
