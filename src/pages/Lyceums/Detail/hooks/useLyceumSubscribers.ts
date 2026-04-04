import { useQuery } from '@tanstack/react-query'

import { getLyceumSubscribers } from '../../../../services/subscriptions'
import {
  createInvalidSubscriberTargetError,
  mapSubscriberManagementApiError,
} from '../../../../services/subscriberManagementErrors'
import type { AppError } from '../../../../types/appError'
import type { UserResponse } from '../../../../types/users'

export const lyceumSubscribersQueryKey = (lyceumId?: number) =>
  ['lyceums', 'subscribers', lyceumId] as const

export const useLyceumSubscribers = (lyceumId?: number) =>
  useQuery<UserResponse[], AppError>({
    queryKey: lyceumSubscribersQueryKey(lyceumId),
    queryFn: async () => {
      if (typeof lyceumId !== 'number' || !Number.isFinite(lyceumId)) {
        throw createInvalidSubscriberTargetError('lyceum')
      }

      try {
        return await getLyceumSubscribers(lyceumId)
      } catch (error) {
        throw mapSubscriberManagementApiError(error, 'lyceum', 'list')
      }
    },
    enabled: typeof lyceumId === 'number' && Number.isFinite(lyceumId),
    retry: false,
  })
