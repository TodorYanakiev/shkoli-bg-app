import { useMemo } from 'react'

import type { CourseResponse, CourseType } from '../../../types/courses'
import type { AppError } from '../../../types/appError'
import {
  getPreferredLyceumImage,
  resolveLyceumImageUrl,
} from '../../../utils/lyceumImages'
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
        const mainImage = getPreferredLyceumImage(lyceum.images, 'MAIN')

        return {
          lyceumId,
          name: lyceum.name?.trim() || `#${lyceumId}`,
          town: lyceum.town?.trim() || null,
          address: lyceum.address?.trim() || null,
          latitude: lyceum.latitude as number,
          longitude: lyceum.longitude as number,
          imageUrl: resolveLyceumImageUrl(mainImage),
          imageAlt: mainImage?.altText?.trim() || null,
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
