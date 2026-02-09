import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import type { TFunction } from 'i18next'

import type { ReviewResponse } from '../../../types/reviews'
import {
  getReviewSchema,
  type ReviewFormValues,
} from '../validations/reviewSchema'

const DEFAULT_RATING = 5

type UseReviewFormOptions = {
  review: ReviewResponse | null
  t: TFunction
}

export const useReviewForm = ({
  review,
  t,
}: UseReviewFormOptions) => {
  const schema = useMemo(() => getReviewSchema(t), [t])

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      rating: review?.rating ?? DEFAULT_RATING,
      comment: review?.comment ?? '',
    },
  })

  useEffect(() => {
    form.reset({
      rating: review?.rating ?? DEFAULT_RATING,
      comment: review?.comment ?? '',
    })
  }, [form, review?.id, review?.rating, review?.comment])

  return form
}
