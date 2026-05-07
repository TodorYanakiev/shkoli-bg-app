import { useQuery } from '@tanstack/react-query'

import { getCourseStatistics } from '../../../../services/statistics'
import type { ApiError } from '../../../../types/api'
import type { EntityStatisticsResponse } from '../../../../types/statistics'

export const courseStatisticsQueryKey = (id?: number) =>
  ['courses', 'statistics', id] as const

type UseCourseStatisticsOptions = {
  enabled?: boolean
}

export const useCourseStatistics = (
  id?: number,
  options: UseCourseStatisticsOptions = {},
) =>
  useQuery<EntityStatisticsResponse, ApiError>({
    queryKey: courseStatisticsQueryKey(id),
    queryFn: () => getCourseStatistics(id as number),
    enabled: Boolean(id) && (options.enabled ?? true),
    retry: (failureCount, error) => error.status >= 500 && failureCount < 1,
    staleTime: 60 * 1000,
  })
