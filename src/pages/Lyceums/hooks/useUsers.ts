import { useQuery } from '@tanstack/react-query'

import { getAllUsers } from '../../../services/users'
import type { ApiError } from '../../../types/api'
import type { UserResponse } from '../../../types/users'

export const usersQueryKey = ['users', 'all'] as const

type UseUsersOptions = {
  enabled?: boolean
}

export const useUsers = (options: UseUsersOptions = {}) =>
  useQuery<UserResponse[], ApiError>({
    queryKey: usersQueryKey,
    queryFn: getAllUsers,
    enabled: options.enabled ?? true,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  })
