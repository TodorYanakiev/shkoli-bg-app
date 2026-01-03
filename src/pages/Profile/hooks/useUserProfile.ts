import { useQuery } from '@tanstack/react-query'

import { getCurrentUser } from '../../../services/users'
import type { ApiError } from '../../../types/api'
import type { CurrentUser } from '../../../types/users'

export const userProfileQueryKey = ['users', 'me'] as const

type UseUserProfileOptions = {
  enabled?: boolean
}

export const useUserProfile = (options: UseUserProfileOptions = {}) =>
  useQuery<CurrentUser, ApiError>({
    queryKey: userProfileQueryKey,
    queryFn: getCurrentUser,
    enabled: options.enabled ?? true,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
