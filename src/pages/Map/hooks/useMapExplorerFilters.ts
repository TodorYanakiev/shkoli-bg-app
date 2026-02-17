import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  COURSE_AGE_GROUPS,
  COURSE_DAYS_OF_WEEK,
  COURSE_TYPES,
} from '../../../constants/courses'
import type { CourseFilterFormValues } from '../../Shkoli/validations/courseFilterSchema'
import {
  COURSE_SORT_OPTIONS,
  type CourseSortKey,
} from '../../Shkoli/types'
import type {
  MapCourseFilterQuery,
  MapDistanceRadiusKm,
  MapFilterState,
  MapLocationSource,
  MapLyceumFilterQuery,
  MapLyceumSortKey,
} from '../types'

const normalizeText = (value: string | null) => {
  if (!value) return ''
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : ''
}

const parseNumber = (value: string | null) => {
  if (!value) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

const parseTime = (value: string | null) => {
  if (!value) return undefined
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value) ? value : undefined
}

const parseCourseSort = (value: string | null): CourseSortKey | undefined =>
  value && COURSE_SORT_OPTIONS.includes(value as CourseSortKey)
    ? (value as CourseSortKey)
    : undefined

const parseLyceumSort = (value: string | null): MapLyceumSortKey =>
  value === 'closest' ? 'closest' : 'default'

const parseLocationSource = (
  value: string | null,
): MapLocationSource | undefined => {
  if (value === 'gps' || value === 'manual' || value === 'mapCenter') {
    return value
  }
  return undefined
}

const parseDistanceRadius = (
  value: string | null,
): MapDistanceRadiusKm | undefined => {
  if (value === '1' || value === '3' || value === '5' || value === '10') {
    return Number(value) as MapDistanceRadiusKm
  }
  return undefined
}

const pickAllowedList = <T extends string>(
  values: string[],
  allowed: readonly T[],
): T[] => {
  const result: T[] = []

  for (const raw of values) {
    const normalizedValues = raw
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean)

    for (const value of normalizedValues) {
      if (allowed.includes(value as T) && !result.includes(value as T)) {
        result.push(value as T)
      }
    }
  }

  return result
}

export const useMapExplorerFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const updateSearchParams = useCallback(
    (updater: (params: URLSearchParams) => void) => {
      const nextParams = new URLSearchParams(searchParams)
      updater(nextParams)

      if (nextParams.toString() === searchParams.toString()) {
        return
      }

      setSearchParams(nextParams, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  const search = useMemo(
    () => normalizeText(searchParams.get('search')),
    [searchParams],
  )

  const town = useMemo(
    () => normalizeText(searchParams.get('town')),
    [searchParams],
  )

  const courseTypes = useMemo(
    () => pickAllowedList(searchParams.getAll('courseTypes'), COURSE_TYPES),
    [searchParams],
  )

  const ageGroups = useMemo(
    () => pickAllowedList(searchParams.getAll('ageGroups'), COURSE_AGE_GROUPS),
    [searchParams],
  )

  const dayOfWeek = useMemo(
    () =>
      pickAllowedList(searchParams.getAll('dayOfWeek'), COURSE_DAYS_OF_WEEK),
    [searchParams],
  )

  const startTimeFrom = useMemo(
    () => parseTime(searchParams.get('startTimeFrom')) ?? '',
    [searchParams],
  )

  const startTimeTo = useMemo(
    () => parseTime(searchParams.get('startTimeTo')) ?? '',
    [searchParams],
  )

  const minPriceRaw = searchParams.get('minPrice') ?? ''
  const maxPriceRaw = searchParams.get('maxPrice') ?? ''
  const minPrice = parseNumber(minPriceRaw)
  const maxPrice = parseNumber(maxPriceRaw)
  const courseSort = useMemo(
    () => parseCourseSort(searchParams.get('sort')),
    [searchParams],
  )
  const lyceumSort = useMemo(
    () => parseLyceumSort(searchParams.get('lyceumSort')),
    [searchParams],
  )
  const locationSource = useMemo(
    () => parseLocationSource(searchParams.get('locationSource')),
    [searchParams],
  )
  const referenceLatitude = useMemo(
    () => parseNumber(searchParams.get('referenceLatitude')),
    [searchParams],
  )
  const referenceLongitude = useMemo(
    () => parseNumber(searchParams.get('referenceLongitude')),
    [searchParams],
  )
  const distanceRadiusKm = useMemo(
    () => parseDistanceRadius(searchParams.get('distanceRadiusKm')),
    [searchParams],
  )

  const state = useMemo<MapFilterState>(
    () => ({
      search,
      town,
      lyceumSort,
      locationSource,
      referenceLatitude,
      referenceLongitude,
      distanceRadiusKm,
      courseTypes: courseTypes.length > 0 ? courseTypes : undefined,
      ageGroups: ageGroups.length > 0 ? ageGroups : undefined,
      dayOfWeek: dayOfWeek.length > 0 ? dayOfWeek : undefined,
      startTimeFrom: startTimeFrom || undefined,
      startTimeTo: startTimeTo || undefined,
      minPrice,
      maxPrice,
      courseSort,
    }),
    [
      search,
      town,
      lyceumSort,
      locationSource,
      referenceLatitude,
      referenceLongitude,
      distanceRadiusKm,
      courseTypes,
      ageGroups,
      dayOfWeek,
      startTimeFrom,
      startTimeTo,
      minPrice,
      maxPrice,
      courseSort,
    ],
  )

  const courseFormDefaults = useMemo<CourseFilterFormValues>(
    () => ({
      courseTypes,
      ageGroups,
      dayOfWeek,
      town,
      startTimeFrom,
      startTimeTo,
      minPrice: minPrice != null ? minPriceRaw : '',
      maxPrice: maxPrice != null ? maxPriceRaw : '',
      sort: courseSort ?? '',
    }),
    [
      courseTypes,
      ageGroups,
      dayOfWeek,
      town,
      startTimeFrom,
      startTimeTo,
      minPrice,
      maxPrice,
      minPriceRaw,
      maxPriceRaw,
      courseSort,
    ],
  )

  const lyceumQuery = useMemo<MapLyceumFilterQuery>(
    () => ({
      town: town || undefined,
    }),
    [town],
  )

  const courseQuery = useMemo<MapCourseFilterQuery>(
    () => ({
      town: town || undefined,
      courseTypes: courseTypes.length > 0 ? courseTypes : undefined,
      ageGroups: ageGroups.length > 0 ? ageGroups : undefined,
      dayOfWeek: dayOfWeek.length > 0 ? dayOfWeek : undefined,
      startTimeFrom: startTimeFrom || undefined,
      startTimeTo: startTimeTo || undefined,
      minPrice,
      maxPrice,
      sort: courseSort,
    }),
    [
      town,
      courseTypes,
      ageGroups,
      dayOfWeek,
      startTimeFrom,
      startTimeTo,
      minPrice,
      maxPrice,
      courseSort,
    ],
  )

  const applyFilters = useCallback(
    (values: CourseFilterFormValues, searchValue: string) => {
      const nextParams = new URLSearchParams()
      const normalizedSearch = searchValue.trim()

      if (lyceumSort === 'closest') {
        nextParams.set('lyceumSort', 'closest')
      }

      if (locationSource) {
        nextParams.set('locationSource', locationSource)
      }

      if (referenceLatitude != null) {
        nextParams.set('referenceLatitude', referenceLatitude.toString())
      }

      if (referenceLongitude != null) {
        nextParams.set('referenceLongitude', referenceLongitude.toString())
      }

      if (distanceRadiusKm != null) {
        nextParams.set('distanceRadiusKm', distanceRadiusKm.toString())
      }

      if (normalizedSearch) {
        nextParams.set('search', normalizedSearch)
      }

      values.courseTypes.forEach((value) => {
        nextParams.append('courseTypes', value)
      })

      values.ageGroups.forEach((value) => {
        nextParams.append('ageGroups', value)
      })

      values.dayOfWeek.forEach((value) => {
        nextParams.append('dayOfWeek', value)
      })

      if (values.town.trim() !== '') {
        nextParams.set('town', values.town.trim())
      }

      if (values.startTimeFrom) {
        nextParams.set('startTimeFrom', values.startTimeFrom)
      }

      if (values.startTimeTo) {
        nextParams.set('startTimeTo', values.startTimeTo)
      }

      if (values.minPrice.trim() !== '') {
        nextParams.set('minPrice', values.minPrice.trim())
      }

      if (values.maxPrice.trim() !== '') {
        nextParams.set('maxPrice', values.maxPrice.trim())
      }

      if (values.sort) {
        nextParams.set('sort', values.sort)
      }

      setSearchParams(nextParams)
    },
    [
      lyceumSort,
      locationSource,
      referenceLatitude,
      referenceLongitude,
      distanceRadiusKm,
      setSearchParams,
    ],
  )

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams())
  }, [setSearchParams])

  const setLyceumSort = useCallback(
    (nextSort: MapLyceumSortKey) => {
      updateSearchParams((nextParams) => {
        if (nextSort === 'closest') {
          nextParams.set('lyceumSort', 'closest')
        } else {
          nextParams.delete('lyceumSort')
        }
      })
    },
    [updateSearchParams],
  )

  const setLocationContext = useCallback(
    (
      location: { latitude: number; longitude: number } | null,
      source?: MapLocationSource,
      nextSort?: MapLyceumSortKey,
    ) => {
      updateSearchParams((nextParams) => {
        if (nextSort) {
          if (nextSort === 'closest') {
            nextParams.set('lyceumSort', 'closest')
          } else {
            nextParams.delete('lyceumSort')
          }
        }

        if (location) {
          nextParams.set('referenceLatitude', location.latitude.toString())
          nextParams.set('referenceLongitude', location.longitude.toString())
        } else {
          nextParams.delete('referenceLatitude')
          nextParams.delete('referenceLongitude')
        }

        if (source) {
          nextParams.set('locationSource', source)
        } else if (!location) {
          nextParams.delete('locationSource')
        }
      })
    },
    [updateSearchParams],
  )

  const setDistanceRadiusKm = useCallback(
    (radiusKm?: MapDistanceRadiusKm) => {
      updateSearchParams((nextParams) => {
        if (radiusKm != null) {
          nextParams.set('distanceRadiusKm', radiusKm.toString())
        } else {
          nextParams.delete('distanceRadiusKm')
        }
      })
    },
    [updateSearchParams],
  )

  const setLocationSource = useCallback(
    (source?: MapLocationSource) => {
      updateSearchParams((nextParams) => {
        if (source) {
          nextParams.set('locationSource', source)
        } else {
          nextParams.delete('locationSource')
        }
      })
    },
    [updateSearchParams],
  )

  return {
    state,
    search,
    courseFormDefaults,
    lyceumQuery,
    courseQuery,
    applyFilters,
    clearFilters,
    setLyceumSort,
    setLocationContext,
    setDistanceRadiusKm,
    setLocationSource,
  }
}
