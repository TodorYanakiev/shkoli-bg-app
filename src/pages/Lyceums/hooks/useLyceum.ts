import { useQuery } from '@tanstack/react-query'

import { getLyceumById } from '../../../services/lyceums'
import type { ApiError } from '../../../types/api'
import type { LyceumResponse } from '../../../types/lyceums'

export const lyceumDetailQueryKey = (id?: number) =>
  ['lyceums', 'detail', id] as const

type UseLyceumOptions = {
  enabled?: boolean
}

export const useLyceum = (id?: number, options: UseLyceumOptions = {}) =>
  useQuery<LyceumResponse, ApiError>({
    queryKey: lyceumDetailQueryKey(id),
    queryFn: () => getLyceumById(id as number),
    enabled: Boolean(id) && (options.enabled ?? true),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  })
