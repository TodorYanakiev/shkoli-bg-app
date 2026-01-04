import { useQuery } from '@tanstack/react-query'

import { getLyceumById } from '../../../services/lyceums'
import type { ApiError } from '../../../types/api'
import type { LyceumResponse } from '../../../types/lyceums'

export const administratedLyceumQueryKey = (id?: number) =>
  ['lyceums', 'by-id', id] as const

type UseAdministratedLyceumOptions = {
  enabled?: boolean
}

export const useAdministratedLyceum = (
  id?: number,
  options: UseAdministratedLyceumOptions = {},
) =>
  useQuery<LyceumResponse, ApiError>({
    queryKey: administratedLyceumQueryKey(id),
    queryFn: () => getLyceumById(id as number),
    enabled: Boolean(id) && (options.enabled ?? true),
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
