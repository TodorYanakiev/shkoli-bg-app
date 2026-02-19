import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  COURSE_AGE_GROUPS,
  COURSE_DAYS_OF_WEEK,
  COURSE_TYPES,
} from '../../../constants/courses'
import { PUBLIC_LYCEUM_TOWNS } from '../../../constants/lyceums'
import type { CourseFilterFormValues } from '../validations/courseFilterSchema'
import {
  COURSE_SORT_OPTIONS,
  type CourseFilterQuery,
  type CourseFilterState,
  type CourseSortKey,
} from '../types'

const COURSE_PAGE_SIZE = 10
const DEFAULT_PAGE = 1

const parseNumber = (value: string | null) => {
  if (!value) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

const parseTime = (value: string | null) => {
  if (!value) return undefined
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value) ? value : undefined
}

const pickAllowedList = <T extends string>(
  values: string[],
  allowed: readonly T[],
): T[] => {
  const picked: T[] = []
  for (const raw of values) {
    const normalizedValues = raw
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean)
    for (const value of normalizedValues) {
      if (allowed.includes(value as T) && !picked.includes(value as T)) {
        picked.push(value as T)
      }
    }
  }
  return picked
}

const parsePage = (value: string | null) => {
  if (!value) return DEFAULT_PAGE
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_PAGE
  return parsed
}

const parseSort = (value: string | null): CourseSortKey | undefined => {
  if (!value) return undefined
  return COURSE_SORT_OPTIONS.includes(value as CourseSortKey)
    ? (value as CourseSortKey)
    : undefined
}

const parseTown = (value: string | null) => {
  if (!value) return ''
  const trimmed = value.trim()
  if (!trimmed) return ''
  return PUBLIC_LYCEUM_TOWNS.includes(
    trimmed as (typeof PUBLIC_LYCEUM_TOWNS)[number],
  )
    ? trimmed
    : ''
}

export const useCourseFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

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

  const town = useMemo(
    () => parseTown(searchParams.get('town')),
    [searchParams],
  )

  const sort = useMemo(
    () => parseSort(searchParams.get('sort')),
    [searchParams],
  )

  const page = useMemo(
    () => parsePage(searchParams.get('page')),
    [searchParams],
  )

  const minPriceRaw = searchParams.get('minPrice') ?? ''
  const maxPriceRaw = searchParams.get('maxPrice') ?? ''
  const minPrice = parseNumber(minPriceRaw)
  const maxPrice = parseNumber(maxPriceRaw)
  const startTimeFrom =
    parseTime(searchParams.get('startTimeFrom')) ?? ''
  const startTimeTo = parseTime(searchParams.get('startTimeTo')) ?? ''

  const state = useMemo<CourseFilterState>(
    () => ({
      courseTypes: courseTypes.length > 0 ? courseTypes : undefined,
      ageGroups: ageGroups.length > 0 ? ageGroups : undefined,
      dayOfWeek: dayOfWeek.length > 0 ? dayOfWeek : undefined,
      town: town || undefined,
      startTimeFrom: startTimeFrom || undefined,
      startTimeTo: startTimeTo || undefined,
      minPrice,
      maxPrice,
      sort,
      page,
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
      sort,
      page,
    ],
  )

  const formDefaults = useMemo<CourseFilterFormValues>(
    () => ({
      courseTypes,
      ageGroups,
      dayOfWeek,
      town,
      startTimeFrom,
      startTimeTo,
      minPrice: minPrice != null ? minPriceRaw : '',
      maxPrice: maxPrice != null ? maxPriceRaw : '',
      sort: sort ?? '',
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
      sort,
      minPriceRaw,
      maxPriceRaw,
    ],
  )

  const query = useMemo<CourseFilterQuery>(
    () => ({
      page: Math.max(0, page - 1),
      size: COURSE_PAGE_SIZE,
      courseTypes: courseTypes.length > 0 ? courseTypes : undefined,
      ageGroups: ageGroups.length > 0 ? ageGroups : undefined,
      dayOfWeek: dayOfWeek.length > 0 ? dayOfWeek : undefined,
      town: town || undefined,
      startTimeFrom: startTimeFrom || undefined,
      startTimeTo: startTimeTo || undefined,
      minPrice,
      maxPrice,
      sort,
    }),
    [
      page,
      courseTypes,
      ageGroups,
      dayOfWeek,
      town,
      startTimeFrom,
      startTimeTo,
      minPrice,
      maxPrice,
      sort,
    ],
  )

  const applyFilters = useCallback(
    (values: CourseFilterFormValues) => {
      const nextParams = new URLSearchParams()

      values.courseTypes.forEach((type) => {
        nextParams.append('courseTypes', type)
      })

      values.ageGroups.forEach((group) => {
        nextParams.append('ageGroups', group)
      })

      values.dayOfWeek.forEach((day) => {
        nextParams.append('dayOfWeek', day)
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

  const setPage = useCallback(
    (nextPage: number) => {
      const nextParams = new URLSearchParams(searchParams)
      if (nextPage <= 1) {
        nextParams.delete('page')
      } else {
        nextParams.set('page', String(nextPage))
      }
      setSearchParams(nextParams)
    },
    [searchParams, setSearchParams],
  )

  return {
    state,
    query,
    formDefaults,
    applyFilters,
    clearFilters,
    setPage,
    pageSize: COURSE_PAGE_SIZE,
  }
}
