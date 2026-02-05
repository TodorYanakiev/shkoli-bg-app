import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import { COURSE_AGE_GROUPS, COURSE_TYPES } from '../../../constants/courses'
import type { CourseFilterFormValues } from '../validations/courseFilterSchema'
import {
  COURSE_SORT_OPTIONS,
  type CourseFilterQuery,
  type CourseFilterState,
  type CourseSortKey,
} from '../types'

const COURSE_PAGE_SIZE = 6
const DEFAULT_PAGE = 1

const parseNumber = (value: string | null) => {
  if (!value) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

const pickFirstAllowed = <T extends string>(
  values: string[],
  allowed: readonly T[],
): T | undefined => {
  for (const raw of values) {
    const normalizedValues = raw
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean)
    for (const value of normalizedValues) {
      if (allowed.includes(value as T)) {
        return value as T
      }
    }
  }
  return undefined
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

export const useCourseFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const courseType = useMemo(
    () =>
      pickFirstAllowed(searchParams.getAll('courseTypes'), COURSE_TYPES),
    [searchParams],
  )

  const ageGroup = useMemo(
    () =>
      pickFirstAllowed(searchParams.getAll('ageGroups'), COURSE_AGE_GROUPS),
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

  const state = useMemo<CourseFilterState>(
    () => ({
      courseType,
      ageGroup,
      minPrice,
      maxPrice,
      sort,
      page,
    }),
    [courseType, ageGroup, minPrice, maxPrice, sort, page],
  )

  const formDefaults = useMemo<CourseFilterFormValues>(
    () => ({
      courseType: courseType ?? '',
      ageGroup: ageGroup ?? '',
      minPrice: minPrice != null ? minPriceRaw : '',
      maxPrice: maxPrice != null ? maxPriceRaw : '',
      sort: sort ?? '',
    }),
    [courseType, ageGroup, minPrice, maxPrice, sort, minPriceRaw, maxPriceRaw],
  )

  const query = useMemo<CourseFilterQuery>(
    () => ({
      page: Math.max(0, page - 1),
      size: COURSE_PAGE_SIZE,
      courseTypes: courseType ? [courseType] : undefined,
      ageGroups: ageGroup ? [ageGroup] : undefined,
      minPrice,
      maxPrice,
      sort,
    }),
    [page, courseType, ageGroup, minPrice, maxPrice, sort],
  )

  const applyFilters = useCallback(
    (values: CourseFilterFormValues) => {
      const nextParams = new URLSearchParams()

      if (values.courseType) {
        nextParams.set('courseTypes', values.courseType)
      }

      if (values.ageGroup) {
        nextParams.set('ageGroups', values.ageGroup)
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
