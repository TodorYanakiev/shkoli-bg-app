import { useQuery } from '@tanstack/react-query'

import { getLyceumStatistics } from '../../../../services/statistics'
import type { ApiError } from '../../../../types/api'
import type { EntityStatisticsResponse } from '../../../../types/statistics'

export const lyceumStatisticsQueryKey = (id?: number) =>
  ['lyceums', 'statistics', id] as const

type UseLyceumStatisticsOptions = {
  enabled?: boolean
}

export const useLyceumStatistics = (
  id?: number,
  options: UseLyceumStatisticsOptions = {},
) =>
  useQuery<EntityStatisticsResponse, ApiError>({
    queryKey: lyceumStatisticsQueryKey(id),
    queryFn: () => getLyceumStatistics(id as number),
    enabled: Boolean(id) && (options.enabled ?? true),
    retry: (failureCount, error) => error.status >= 500 && failureCount < 1,
    staleTime: 60 * 1000,
  })
