import { useMutation, useQuery } from '@tanstack/react-query'

import {
  createUserReview,
  deleteUserReview,
  getUserReview,
  getUserReviews,
  updateUserReview,
} from '../../../services/reviews'
import type { AppError } from '../../../types/appError'
import type {
  ReviewRequest,
  ReviewResponse,
  ReviewUpdateRequest,
} from '../../../types/reviews'
import type {
  ReviewItemQueryOptions,
  ReviewQueryOptions,
} from '../types'
import {
  createInvalidReviewTargetError,
  mapReviewApiError,
} from '../services/reviewErrors'

export const userReviewsQueryKey = (userId?: number) =>
  ['reviews', 'users', userId] as const

export const userReviewQueryKey = (
  userId?: number,
  reviewerId?: number,
) => ['reviews', 'users', userId, 'reviewers', reviewerId] as const

const hasValidId = (value: number | undefined): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const shouldRetryReviewQuery = (
  failureCount: number,
  error: AppError,
) => {
  if (error.status != null && error.status >= 400 && error.status < 500) {
    return false
  }

  return failureCount < 1
}

export const useUserReviews = (
  userId?: number,
  options: ReviewQueryOptions = {},
) =>
  useQuery<ReviewResponse[], AppError>({
    queryKey: userReviewsQueryKey(userId),
    queryFn: async () => {
      try {
        return await getUserReviews(userId as number)
      } catch (error) {
        throw mapReviewApiError(error, 'user', 'list')
      }
    },
    enabled: hasValidId(userId) && (options.enabled ?? true),
    retry: shouldRetryReviewQuery,
    staleTime: 60 * 1000,
  })

export const useUserReview = (
  userId?: number,
  reviewerId?: number,
  options: ReviewItemQueryOptions = {},
) =>
  useQuery<ReviewResponse | null, AppError>({
    queryKey: userReviewQueryKey(userId, reviewerId),
    queryFn: async () => {
      try {
        return await getUserReview(userId as number, reviewerId as number)
      } catch (error) {
        const appError = mapReviewApiError(error, 'user', 'get')

        if (options.allowMissing && appError.status === 404) {
          return null
        }

        throw appError
      }
    },
    enabled:
      hasValidId(userId) &&
      hasValidId(reviewerId) &&
      (options.enabled ?? true),
    retry: shouldRetryReviewQuery,
    staleTime: 60 * 1000,
  })

export const useCreateUserReviewMutation = (userId?: number) =>
  useMutation<ReviewResponse, AppError, ReviewRequest>({
    mutationFn: async (payload) => {
      if (!hasValidId(userId)) {
        throw createInvalidReviewTargetError()
      }

      try {
        return await createUserReview(userId, payload)
      } catch (error) {
        throw mapReviewApiError(error, 'user', 'create')
      }
    },
    retry: false,
  })

export const useUpdateUserReviewMutation = (
  userId?: number,
  reviewerId?: number,
) =>
  useMutation<ReviewResponse, AppError, ReviewUpdateRequest>({
    mutationFn: async (payload) => {
      if (!hasValidId(userId) || !hasValidId(reviewerId)) {
        throw createInvalidReviewTargetError()
      }

      try {
        return await updateUserReview(userId, reviewerId, payload)
      } catch (error) {
        throw mapReviewApiError(error, 'user', 'update')
      }
    },
    retry: false,
  })

export const useDeleteUserReviewMutation = (
  userId?: number,
  reviewerId?: number,
) =>
  useMutation<void, AppError, void>({
    mutationFn: async () => {
      if (!hasValidId(userId) || !hasValidId(reviewerId)) {
        throw createInvalidReviewTargetError()
      }

      try {
        await deleteUserReview(userId, reviewerId)
      } catch (error) {
        throw mapReviewApiError(error, 'user', 'delete')
      }
    },
    retry: false,
  })
