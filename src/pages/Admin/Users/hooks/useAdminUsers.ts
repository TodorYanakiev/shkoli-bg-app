import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getUsersPage } from '../../../../services/users'
import type { ApiError } from '../../../../types/api'
import type { PageUserResponse } from '../../../../types/users'
import type { AdminUsersQuery } from '../types'

export const adminUsersQueryKeyPrefix = ['admin', 'users'] as const

export const adminUsersQueryKey = (query: AdminUsersQuery) =>
  [...adminUsersQueryKeyPrefix, 'page', query] as const

type UseAdminUsersOptions = {
  enabled?: boolean
}

export const useAdminUsers = (
  query: AdminUsersQuery,
  options: UseAdminUsersOptions = {},
) =>
  useQuery<PageUserResponse, ApiError>({
    queryKey: adminUsersQueryKey(query),
    queryFn: () => getUsersPage(query),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
    retry: 1,
    staleTime: 60 * 1000,
  })
