import { useMutation, useQuery } from '@tanstack/react-query'

import {
  createCourseReview,
  deleteCourseReview,
  getCourseReview,
  getCourseReviews,
  updateCourseReview,
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

export const courseReviewsQueryKey = (courseId?: number) =>
  ['reviews', 'courses', courseId] as const

export const courseReviewQueryKey = (
  courseId?: number,
  userId?: number,
) => ['reviews', 'courses', courseId, 'users', userId] as const

const hasValidId = (value: number | undefined): value is number =>
  typeof value === 'number' && Number.isFinite(value)

export const useCourseReviews = (
  courseId?: number,
  options: ReviewQueryOptions = {},
) =>
  useQuery<ReviewResponse[], AppError>({
    queryKey: courseReviewsQueryKey(courseId),
    queryFn: async () => {
      try {
        return await getCourseReviews(courseId as number)
      } catch (error) {
        throw mapReviewApiError(error, 'course', 'list')
      }
    },
    enabled: hasValidId(courseId) && (options.enabled ?? true),
    retry: 1,
    staleTime: 60 * 1000,
  })

export const useCourseReview = (
  courseId?: number,
  userId?: number,
  options: ReviewItemQueryOptions = {},
) =>
  useQuery<ReviewResponse | null, AppError>({
    queryKey: courseReviewQueryKey(courseId, userId),
    queryFn: async () => {
      try {
        return await getCourseReview(courseId as number, userId as number)
      } catch (error) {
        const appError = mapReviewApiError(error, 'course', 'get')

        if (options.allowMissing && appError.status === 404) {
          return null
        }

        throw appError
      }
    },
    enabled:
      hasValidId(courseId) &&
      hasValidId(userId) &&
      (options.enabled ?? true),
    retry: 1,
    staleTime: 60 * 1000,
  })

export const useCreateCourseReviewMutation = (courseId?: number) =>
  useMutation<ReviewResponse, AppError, ReviewRequest>({
    mutationFn: async (payload) => {
      if (!hasValidId(courseId)) {
        throw createInvalidReviewTargetError()
      }

      try {
        return await createCourseReview(courseId, payload)
      } catch (error) {
        throw mapReviewApiError(error, 'course', 'create')
      }
    },
    retry: false,
  })

export const useUpdateCourseReviewMutation = (
  courseId?: number,
  userId?: number,
) =>
  useMutation<ReviewResponse, AppError, ReviewUpdateRequest>({
    mutationFn: async (payload) => {
      if (!hasValidId(courseId) || !hasValidId(userId)) {
        throw createInvalidReviewTargetError()
      }

      try {
        return await updateCourseReview(courseId, userId, payload)
      } catch (error) {
        throw mapReviewApiError(error, 'course', 'update')
      }
    },
    retry: false,
  })

export const useDeleteCourseReviewMutation = (
  courseId?: number,
  userId?: number,
) =>
  useMutation<void, AppError, void>({
    mutationFn: async () => {
      if (!hasValidId(courseId) || !hasValidId(userId)) {
        throw createInvalidReviewTargetError()
      }

      try {
        await deleteCourseReview(courseId, userId)
      } catch (error) {
        throw mapReviewApiError(error, 'course', 'delete')
      }
    },
    retry: false,
  })
