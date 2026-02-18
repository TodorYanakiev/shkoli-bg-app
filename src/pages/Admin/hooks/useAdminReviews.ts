import { useMutation, useQuery } from '@tanstack/react-query'

import type { AppError } from '../../../types/appError'
import type { ReviewResponse } from '../../../types/reviews'
import type { AdminReviewEntityType } from '../types'
import {
  createInvalidAdminReviewTargetError,
  mapAdminReviewApiError,
} from '../services/adminReviewsErrors'
import {
  deleteAdminEntityReview,
  getAdminEntityReviews,
} from '../services/adminReviewsService'

type AdminReviewsTargetParams = {
  entityType?: AdminReviewEntityType
  entityId?: number
}

type UseAdminReviewsOptions = {
  enabled?: boolean
}

export type DeleteAdminReviewVariables = {
  reviewerId?: number
}

export const adminReviewsQueryKeyPrefix = ['admin', 'reviews'] as const

export const adminReviewsQueryKey = (
  entityType?: AdminReviewEntityType,
  entityId?: number,
) => [...adminReviewsQueryKeyPrefix, entityType, entityId] as const

const hasValidId = (value: number | undefined): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const hasValidTarget = (
  target: AdminReviewsTargetParams,
): target is {
  entityType: AdminReviewEntityType
  entityId: number
} => Boolean(target.entityType && hasValidId(target.entityId))

export const useAdminReviews = (
  target: AdminReviewsTargetParams,
  options: UseAdminReviewsOptions = {},
) =>
  useQuery<ReviewResponse[], AppError>({
    queryKey: adminReviewsQueryKey(target.entityType, target.entityId),
    queryFn: async () => {
      if (!hasValidTarget(target)) {
        throw createInvalidAdminReviewTargetError()
      }

      try {
        return await getAdminEntityReviews({
          entityType: target.entityType,
          entityId: target.entityId,
        })
      } catch (error) {
        throw mapAdminReviewApiError(error, target.entityType, 'list')
      }
    },
    enabled: hasValidTarget(target) && (options.enabled ?? true),
    retry: 1,
    staleTime: 60 * 1000,
  })

export const useDeleteAdminReviewMutation = (
  target: AdminReviewsTargetParams,
) =>
  useMutation<void, AppError, DeleteAdminReviewVariables>({
    mutationFn: async ({ reviewerId }) => {
      if (!hasValidTarget(target) || !hasValidId(reviewerId)) {
        throw createInvalidAdminReviewTargetError()
      }

      try {
        await deleteAdminEntityReview({
          entityType: target.entityType,
          entityId: target.entityId,
          reviewerId,
        })
      } catch (error) {
        throw mapAdminReviewApiError(error, target.entityType, 'delete')
      }
    },
    retry: false,
  })
