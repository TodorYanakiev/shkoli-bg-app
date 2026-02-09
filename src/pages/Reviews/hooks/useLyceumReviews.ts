import { useMutation, useQuery } from '@tanstack/react-query'

import {
  createLyceumReview,
  deleteLyceumReview,
  getLyceumReview,
  getLyceumReviews,
  updateLyceumReview,
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

export const lyceumReviewsQueryKey = (lyceumId?: number) =>
  ['reviews', 'lyceums', lyceumId] as const

export const lyceumReviewQueryKey = (
  lyceumId?: number,
  userId?: number,
) => ['reviews', 'lyceums', lyceumId, 'users', userId] as const

const hasValidId = (value: number | undefined): value is number =>
  typeof value === 'number' && Number.isFinite(value)

export const useLyceumReviews = (
  lyceumId?: number,
  options: ReviewQueryOptions = {},
) =>
  useQuery<ReviewResponse[], AppError>({
    queryKey: lyceumReviewsQueryKey(lyceumId),
    queryFn: async () => {
      try {
        return await getLyceumReviews(lyceumId as number)
      } catch (error) {
        throw mapReviewApiError(error, 'lyceum', 'list')
      }
    },
    enabled: hasValidId(lyceumId) && (options.enabled ?? true),
    retry: 1,
    staleTime: 60 * 1000,
  })

export const useLyceumReview = (
  lyceumId?: number,
  userId?: number,
  options: ReviewItemQueryOptions = {},
) =>
  useQuery<ReviewResponse | null, AppError>({
    queryKey: lyceumReviewQueryKey(lyceumId, userId),
    queryFn: async () => {
      try {
        return await getLyceumReview(lyceumId as number, userId as number)
      } catch (error) {
        const appError = mapReviewApiError(error, 'lyceum', 'get')

        if (options.allowMissing && appError.status === 404) {
          return null
        }

        throw appError
      }
    },
    enabled:
      hasValidId(lyceumId) &&
      hasValidId(userId) &&
      (options.enabled ?? true),
    retry: 1,
    staleTime: 60 * 1000,
  })

export const useCreateLyceumReviewMutation = (lyceumId?: number) =>
  useMutation<ReviewResponse, AppError, ReviewRequest>({
    mutationFn: async (payload) => {
      if (!hasValidId(lyceumId)) {
        throw createInvalidReviewTargetError()
      }

      try {
        return await createLyceumReview(lyceumId, payload)
      } catch (error) {
        throw mapReviewApiError(error, 'lyceum', 'create')
      }
    },
    retry: false,
  })

export const useUpdateLyceumReviewMutation = (
  lyceumId?: number,
  userId?: number,
) =>
  useMutation<ReviewResponse, AppError, ReviewUpdateRequest>({
    mutationFn: async (payload) => {
      if (!hasValidId(lyceumId) || !hasValidId(userId)) {
        throw createInvalidReviewTargetError()
      }

      try {
        return await updateLyceumReview(lyceumId, userId, payload)
      } catch (error) {
        throw mapReviewApiError(error, 'lyceum', 'update')
      }
    },
    retry: false,
  })

export const useDeleteLyceumReviewMutation = (
  lyceumId?: number,
  userId?: number,
) =>
  useMutation<void, AppError, void>({
    mutationFn: async () => {
      if (!hasValidId(lyceumId) || !hasValidId(userId)) {
        throw createInvalidReviewTargetError()
      }

      try {
        await deleteLyceumReview(lyceumId, userId)
      } catch (error) {
        throw mapReviewApiError(error, 'lyceum', 'delete')
      }
    },
    retry: false,
  })
