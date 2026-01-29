import { useQuery } from '@tanstack/react-query'

import { getAllUsers } from '../../../../services/users'
import type { ApiError } from '../../../../types/api'
import type { UserResponse } from '../../../../types/users'

export const adminUsersQueryKey = ['admin', 'users', 'all'] as const

type UseAdminUsersOptions = {
  enabled?: boolean
}

export const useAdminUsers = (options: UseAdminUsersOptions = {}) =>
  useQuery<UserResponse[], ApiError>({
    queryKey: adminUsersQueryKey,
    queryFn: getAllUsers,
    enabled: options.enabled ?? true,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  })
