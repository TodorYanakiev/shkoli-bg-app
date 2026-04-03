import { useQuery } from '@tanstack/react-query'

import { getCourseSubscribers } from '../../../../services/subscriptions'
import {
  createInvalidSubscriberTargetError,
  mapSubscriberManagementApiError,
} from '../../../../services/subscriberManagementErrors'
import type { AppError } from '../../../../types/appError'
import type { UserResponse } from '../../../../types/users'

export const courseSubscribersQueryKey = (courseId?: number) =>
  ['courses', 'subscribers', courseId] as const

export const useCourseSubscribers = (courseId?: number) =>
  useQuery<UserResponse[], AppError>({
    queryKey: courseSubscribersQueryKey(courseId),
    queryFn: async () => {
      if (typeof courseId !== 'number' || !Number.isFinite(courseId)) {
        throw createInvalidSubscriberTargetError('course')
      }

      try {
        return await getCourseSubscribers(courseId)
      } catch (error) {
        throw mapSubscriberManagementApiError(error, 'course', 'list')
      }
    },
    enabled: typeof courseId === 'number' && Number.isFinite(courseId),
    retry: false,
  })
