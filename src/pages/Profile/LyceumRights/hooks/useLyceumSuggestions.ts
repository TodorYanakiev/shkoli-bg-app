import { useQuery } from '@tanstack/react-query'

import { filterLyceums, getAllLyceums } from '../../../../services/lyceums'
import type { ApiError } from '../../../../types/api'
import type { LyceumResponse } from '../../../../types/lyceums'

export const lyceumSuggestionsQueryKey = (town?: string) =>
  ['lyceums', town ? 'filter' : 'all', town ?? 'all'] as const

type UseLyceumSuggestionsOptions = {
  enabled?: boolean
}

export const useLyceumSuggestions = (
  town?: string,
  options: UseLyceumSuggestionsOptions = {},
) =>
  useQuery<LyceumResponse[], ApiError>({
    queryKey: lyceumSuggestionsQueryKey(town),
    queryFn: () => (town ? filterLyceums({ town }) : getAllLyceums()),
    enabled: options.enabled ?? Boolean(town),
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
