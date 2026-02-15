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
  MapFilterState,
  MapLyceumFilterQuery,
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

  const state = useMemo<MapFilterState>(
    () => ({
      search,
      town,
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
    [setSearchParams],
  )

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams())
  }, [setSearchParams])

  return {
    state,
    search,
    courseFormDefaults,
    lyceumQuery,
    courseQuery,
    applyFilters,
    clearFilters,
  }
}
