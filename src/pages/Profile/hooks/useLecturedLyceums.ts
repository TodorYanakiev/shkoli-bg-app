import { useQueries } from '@tanstack/react-query'

import { getLyceumById } from '../../../services/lyceums'
import type { ApiError } from '../../../types/api'
import type { LyceumResponse } from '../../../types/lyceums'
import { lyceumDetailQueryKey } from '../../Lyceums/hooks/useLyceum'

type UseLecturedLyceumsOptions = {
  enabled?: boolean
}

export const useLecturedLyceums = (
  ids: number[],
  options: UseLecturedLyceumsOptions = {},
) => {
  const isEnabled = options.enabled ?? true
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: lyceumDetailQueryKey(id),
      queryFn: () => getLyceumById(id),
      enabled: Boolean(id) && isEnabled,
      retry: false,
      staleTime: 5 * 60 * 1000,
    })),
  }) as Array<{
    data?: LyceumResponse
    isLoading: boolean
    isFetching: boolean
    error?: ApiError | null
  }>
}
