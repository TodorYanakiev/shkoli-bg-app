import { useQuery } from '@tanstack/react-query'

import type { LyceumResponse } from '../../../types/lyceums'
import type { AppError } from '../../../types/appError'
import { toMapExplorerError } from '../services/mapExplorerErrors'
import { fetchAllLyceumsForMap } from '../services/mapExplorerService'
import type { MapLyceumFilterQuery } from '../types'

export const mapExplorerLyceumsQueryKey = (
  query: MapLyceumFilterQuery,
) => ['map', 'lyceums', query] as const

export const useMapExplorerLyceums = (query: MapLyceumFilterQuery) =>
  useQuery<LyceumResponse[], AppError>({
    queryKey: mapExplorerLyceumsQueryKey(query),
    queryFn: async () => {
      try {
        return await fetchAllLyceumsForMap(query)
      } catch (error) {
        throw toMapExplorerError(error, 'pages.map.states.error')
      }
    },
    retry: 1,
    staleTime: 60 * 1000,
  })