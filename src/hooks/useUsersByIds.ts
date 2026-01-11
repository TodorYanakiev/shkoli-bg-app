import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { getUsersByIds } from '../services/users'
import type { ApiError } from '../types/api'
import type { UserResponse } from '../types/users'

export const usersByIdsQueryKey = (ids: number[]) =>
  ['users', 'byIds', ...ids] as const

type UseUsersByIdsOptions = {
  enabled?: boolean
}

export const useUsersByIds = (
  ids: number[],
  options: UseUsersByIdsOptions = {},
) => {
  const uniqueIds = useMemo(
    () =>
      Array.from(new Set(ids))
        .filter((id) => Number.isFinite(id))
        .sort((a, b) => a - b),
    [ids],
  )

  return useQuery<UserResponse[], ApiError>({
    queryKey: usersByIdsQueryKey(uniqueIds),
    queryFn: () => getUsersByIds(uniqueIds),
    enabled: uniqueIds.length > 0 && (options.enabled ?? true),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  })
}
