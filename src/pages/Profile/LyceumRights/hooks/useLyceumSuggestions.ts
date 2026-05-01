import { useQuery } from '@tanstack/react-query'

import { getLyceumsByTown } from '../../../../services/lyceums'
import type { ApiError } from '../../../../types/api'
import type { LyceumResponse } from '../../../../types/lyceums'

export const lyceumSuggestionsQueryKey = (town?: string) =>
  ['lyceums', 'by-town', town?.trim() || 'none'] as const

type UseLyceumSuggestionsOptions = {
  enabled?: boolean
}

type LyceumSuggestionsResponse =
  | LyceumResponse[]
  | {
      content?: LyceumResponse[]
    }

export const getLyceumSuggestionItems = (
  response: LyceumSuggestionsResponse,
): LyceumResponse[] => {
  if (Array.isArray(response)) {
    return response
  }

  return Array.isArray(response.content) ? response.content : []
}

export const useLyceumSuggestions = (
  town?: string,
  options: UseLyceumSuggestionsOptions = {},
) => {
  const normalizedTown = town?.trim() ?? ''

  return useQuery<LyceumResponse[], ApiError>({
    queryKey: lyceumSuggestionsQueryKey(town),
    queryFn: async () => {
      if (!normalizedTown) {
        return []
      }

      const response = await getLyceumsByTown(normalizedTown)
      return getLyceumSuggestionItems(response)
    },
    enabled: options.enabled ?? Boolean(normalizedTown),
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}
