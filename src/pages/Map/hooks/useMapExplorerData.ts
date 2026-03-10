import { useMemo } from 'react'

import type { CourseResponse, CourseType } from '../../../types/courses'
import type { AppError } from '../../../types/appError'
import { resolveLyceumImageUrl } from '../../../utils/lyceumImages'
import { useMapExplorerCourses } from './useMapExplorerCourses'
import { useMapExplorerLyceums } from './useMapExplorerLyceums'
import type {
  MapCourseFilterQuery,
  MapExplorerItem,
  MapExplorerSummary,
  MapFilterState,
  MapLyceumFilterQuery,
} from '../types'

type UseMapExplorerDataOptions = {
  state: MapFilterState
  lyceumQuery: MapLyceumFilterQuery
  courseQuery: MapCourseFilterQuery
  locale: string
}

type UseMapExplorerDataResult = {
  items: MapExplorerItem[]
  summary: MapExplorerSummary
  isLoading: boolean
  isFetching: boolean
  error: AppError | null
}

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const EARTH_RADIUS_KM = 6371

const toRadians = (value: number) => (value * Math.PI) / 180

const calculateDistanceKm = (
  fromLatitude: number,
  fromLongitude: number,
  toLatitude: number,
  toLongitude: number,
) => {
  const latitudeDelta = toRadians(toLatitude - fromLatitude)
  const longitudeDelta = toRadians(toLongitude - fromLongitude)

  const fromLatitudeRad = toRadians(fromLatitude)
  const toLatitudeRad = toRadians(toLatitude)

  const haversineValue =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitudeRad) *
      Math.cos(toLatitudeRad) *
      Math.sin(longitudeDelta / 2) ** 2

  const centralAngle =
    2 * Math.atan2(Math.sqrt(haversineValue), Math.sqrt(1 - haversineValue))

  return EARTH_RADIUS_KM * centralAngle
}

const normalizeAverageRating = (
  value: number | null | undefined,
): number | null => {
  if (!isFiniteNumber(value)) {
    return null
  }

  return Math.min(Math.max(value, 0), 5)
}

const getLyceumCoursesMap = (courses: CourseResponse[]) => {
  const byLyceumId = new Map<number, CourseResponse[]>()

  courses.forEach((course) => {
    if (!isFiniteNumber(course.lyceumId)) return

    const existing = byLyceumId.get(course.lyceumId) ?? []
    existing.push(course)
    byLyceumId.set(course.lyceumId, existing)
  })

  return byLyceumId
}

const getCourseTypes = (courses: CourseResponse[]) => {
  const uniqueTypes: CourseType[] = []

  courses.forEach((course) => {
    if (!course.type || uniqueTypes.includes(course.type)) {
      return
    }
    uniqueTypes.push(course.type)
  })

  return uniqueTypes
}

const buildSearchText = (item: MapExplorerItem) => {
  const parts = [item.name, item.town, item.address]

  item.activities.forEach((activity) => {
    if (activity.name) {
      parts.push(activity.name)
    }
  })

  return parts
    .filter((value): value is string => Boolean(value))
    .join(' ')
}

export const useMapExplorerData = ({
  state,
  lyceumQuery,
  courseQuery,
  locale,
}: UseMapExplorerDataOptions): UseMapExplorerDataResult => {
  const lyceumsQueryResult = useMapExplorerLyceums(lyceumQuery)
  const coursesQueryResult = useMapExplorerCourses(courseQuery)

  const items = useMemo(() => {
    const lyceums = lyceumsQueryResult.data ?? []
    const courses = coursesQueryResult.data ?? []
    const coursesByLyceumId = getLyceumCoursesMap(courses)
    const hasUserCoordinates =
      isFiniteNumber(lyceumQuery.latitude) &&
      isFiniteNumber(lyceumQuery.longitude)
    const shouldSortByDistance =
      state.lyceumSort === 'closest' && hasUserCoordinates
    const userLatitude = hasUserCoordinates ? lyceumQuery.latitude : null
    const userLongitude = hasUserCoordinates ? lyceumQuery.longitude : null
    const hasActivityFilters =
      (state.courseTypes?.length ?? 0) > 0 ||
      (state.ageGroups?.length ?? 0) > 0 ||
      (state.dayOfWeek?.length ?? 0) > 0 ||
      Boolean(state.startTimeFrom) ||
      Boolean(state.startTimeTo) ||
      state.minPrice != null ||
      state.maxPrice != null

    const normalizedSearch = state.search
      .trim()
      .toLocaleLowerCase(locale)

    const builtItems = lyceums
      .filter(
        (lyceum) =>
          lyceum.verificationStatus === 'VERIFIED' &&
          isFiniteNumber(lyceum.id) &&
          isFiniteNumber(lyceum.latitude) &&
          isFiniteNumber(lyceum.longitude),
      )
      .map<MapExplorerItem>((lyceum) => {
        const lyceumId = lyceum.id as number
        const activities = coursesByLyceumId.get(lyceumId) ?? []
        const mainImage = lyceum.mainImage

        return {
          lyceumId,
          name: lyceum.name?.trim() || `#${lyceumId}`,
          town: lyceum.town?.trim() || null,
          address: lyceum.address?.trim() || null,
          averageRating: normalizeAverageRating(lyceum.averageRating),
          latitude: lyceum.latitude as number,
          longitude: lyceum.longitude as number,
          imageUrl: resolveLyceumImageUrl(mainImage),
          imageAlt: mainImage?.altText?.trim() || null,
          distanceKm:
            userLatitude != null && userLongitude != null
              ? calculateDistanceKm(
                  userLatitude,
                  userLongitude,
                  lyceum.latitude as number,
                  lyceum.longitude as number,
                )
              : null,
          activityCount: activities.length,
          categories: getCourseTypes(activities),
          activities,
          lyceum,
        }
      })
      .filter((item) => {
        if (!hasActivityFilters) {
          return true
        }

        return item.activityCount > 0
      })
      .filter((item) => {
        if (!normalizedSearch) {
          return true
        }

        return buildSearchText(item)
          .toLocaleLowerCase(locale)
          .includes(normalizedSearch)
      })

    const collator = new Intl.Collator(locale, {
      usage: 'sort',
      sensitivity: 'base',
    })

    builtItems.sort((left, right) => {
      if (shouldSortByDistance) {
        const leftDistance = left.distanceKm ?? Number.POSITIVE_INFINITY
        const rightDistance = right.distanceKm ?? Number.POSITIVE_INFINITY
        const byDistance = leftDistance - rightDistance

        if (Math.abs(byDistance) >= 0.01) {
          return byDistance
        }
      }

      const leftRating = left.averageRating ?? -1
      const rightRating = right.averageRating ?? -1
      const byRating = rightRating - leftRating
      if (Math.abs(byRating) >= 0.01) {
        return byRating
      }

      const byActivities = right.activityCount - left.activityCount
      if (byActivities !== 0) {
        return byActivities
      }

      return collator.compare(left.name, right.name)
    })

    return builtItems
  }, [
    lyceumsQueryResult.data,
    coursesQueryResult.data,
    state.courseTypes,
    state.ageGroups,
    state.dayOfWeek,
    state.startTimeFrom,
    state.startTimeTo,
    state.minPrice,
    state.maxPrice,
    state.search,
    state.lyceumSort,
    lyceumQuery.latitude,
    lyceumQuery.longitude,
    locale,
  ])

  const summary = useMemo<MapExplorerSummary>(
    () => ({
      lyceumsCount: items.length,
      totalActivities: items.reduce(
        (total, item) => total + item.activityCount,
        0,
      ),
    }),
    [items],
  )

  return {
    items,
    summary,
    isLoading:
      lyceumsQueryResult.isLoading || coursesQueryResult.isLoading,
    isFetching:
      lyceumsQueryResult.isFetching || coursesQueryResult.isFetching,
    error: lyceumsQueryResult.error ?? coursesQueryResult.error ?? null,
  }
}
