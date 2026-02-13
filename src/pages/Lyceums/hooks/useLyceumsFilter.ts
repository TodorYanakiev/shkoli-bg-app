import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type { ApiError } from '../../../types/api'
import { filterLyceums } from '../services/lyceumFilterService'
import type { LyceumFilterQuery, PageLyceumResponse } from '../types'

export const lyceumsFilterQueryKey = (query: LyceumFilterQuery) =>
  ['lyceums', 'filter', query] as const

export const useLyceumsFilter = (query: LyceumFilterQuery) =>
  useQuery<PageLyceumResponse, ApiError>({
    queryKey: lyceumsFilterQueryKey(query),
    queryFn: () => filterLyceums(query),
    placeholderData: keepPreviousData,
    retry: 1,
    staleTime: 60 * 1000,
  })
