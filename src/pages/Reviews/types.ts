import type { AppError } from '../../types/appError'
import type {
  ReviewRequest,
  ReviewResponse,
  ReviewUpdateRequest,
} from '../../types/reviews'

export type ReviewEntityType = 'course' | 'lyceum' | 'user'

export type ReviewOperation =
  | 'list'
  | 'get'
  | 'create'
  | 'update'
  | 'delete'

export type ReviewFieldName = 'rating' | 'comment'

export type ReviewMutationArgs = ReviewRequest | ReviewUpdateRequest

export type ReviewQueryOptions = {
  enabled?: boolean
}

export type ReviewItemQueryOptions = ReviewQueryOptions & {
  allowMissing?: boolean
}

export type ReviewMutationResult = {
  error: AppError | null
  isPending: boolean
}

export type ReviewDisplayItem = ReviewResponse & {
  reviewerName: string
  isCurrentUserReview: boolean
}
