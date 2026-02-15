import { useQuery } from '@tanstack/react-query'

import type { CourseResponse } from '../../../types/courses'
import type { AppError } from '../../../types/appError'
import { toMapExplorerError } from '../services/mapExplorerErrors'
import { fetchAllCoursesForMap } from '../services/mapExplorerService'
import type { MapCourseFilterQuery } from '../types'

export const mapExplorerCoursesQueryKey = (
  query: MapCourseFilterQuery,
) => ['map', 'courses', query] as const

export const useMapExplorerCourses = (query: MapCourseFilterQuery) =>
  useQuery<CourseResponse[], AppError>({
    queryKey: mapExplorerCoursesQueryKey(query),
    queryFn: async () => {
      try {
        return await fetchAllCoursesForMap(query)
      } catch (error) {
        throw toMapExplorerError(error, 'pages.map.states.error')
      }
    },
    retry: 1,
    staleTime: 60 * 1000,
  })