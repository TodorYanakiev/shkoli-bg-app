import {
  deleteCourseReview,
  deleteLyceumReview,
  deleteUserReview,
  getCourseReviews,
  getLyceumReviews,
  getUserReviews,
} from '../../../services/reviews'
import type { ReviewResponse } from '../../../types/reviews'
import type { AdminReviewEntityType } from '../types'

export type AdminReviewsTarget = {
  entityType: AdminReviewEntityType
  entityId: number
}

export type AdminDeleteReviewTarget = AdminReviewsTarget & {
  reviewerId: number
}

export const getAdminEntityReviews = async ({
  entityType,
  entityId,
}: AdminReviewsTarget): Promise<ReviewResponse[]> => {
  if (entityType === 'course') {
    return getCourseReviews(entityId)
  }
  if (entityType === 'lyceum') {
    return getLyceumReviews(entityId)
  }
  return getUserReviews(entityId)
}

export const deleteAdminEntityReview = async ({
  entityType,
  entityId,
  reviewerId,
}: AdminDeleteReviewTarget): Promise<void> => {
  if (entityType === 'course') {
    await deleteCourseReview(entityId, reviewerId)
    return
  }
  if (entityType === 'lyceum') {
    await deleteLyceumReview(entityId, reviewerId)
    return
  }
  await deleteUserReview(entityId, reviewerId)
}
