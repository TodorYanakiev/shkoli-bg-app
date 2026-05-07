import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import type {
  FeedbackReadFilter,
  FeedbackSortParam,
} from '../../../../types/feedback'
import type { AdminFeedbackFilterState } from '../types'

const PAGE_PARAM = 'page'
const FILTER_PARAM = 'filter'
const SORT_PARAM = 'sort'
const DEFAULT_PAGE = 1
export const DEFAULT_ADMIN_FEEDBACK_SORT = 'createdAt,desc' as const
const DEFAULT_FILTER: FeedbackReadFilter = 'all'

export const adminFeedbackSortOptions = [
  'createdAt,desc',
  'createdAt,asc',
  'read,asc',
  'read,desc',
  'fullName,asc',
  'email,asc',
  'title,asc',
] as const satisfies readonly FeedbackSortParam[]

const isFeedbackFilter = (value: string | null): value is FeedbackReadFilter =>
  value === 'all' || value === 'read' || value === 'unread'

const isFeedbackSort = (value: string | null): value is FeedbackSortParam =>
  Boolean(
    value &&
      adminFeedbackSortOptions.includes(
        value as (typeof adminFeedbackSortOptions)[number],
      ),
  )

const parsePageParam = (value: string | null) => {
  if (!value) return DEFAULT_PAGE
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_PAGE
  return parsed
}

const parseFilterParam = (value: string | null): FeedbackReadFilter =>
  isFeedbackFilter(value) ? value : DEFAULT_FILTER

const parseSortParam = (value: string | null): FeedbackSortParam =>
  isFeedbackSort(value) ? value : DEFAULT_ADMIN_FEEDBACK_SORT

export const useAdminFeedbackFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const state = useMemo<AdminFeedbackFilterState>(
    () => ({
      page: parsePageParam(searchParams.get(PAGE_PARAM)),
      filter: parseFilterParam(searchParams.get(FILTER_PARAM)),
      sort: parseSortParam(searchParams.get(SORT_PARAM)),
    }),
    [searchParams],
  )

  const hasActiveFilters =
    state.filter !== DEFAULT_FILTER ||
    state.sort !== DEFAULT_ADMIN_FEEDBACK_SORT

  const setPage = useCallback(
    (value: number) => {
      const nextPage = Number.isFinite(value) ? Math.floor(value) : DEFAULT_PAGE
      const normalizedPage = nextPage > 0 ? nextPage : DEFAULT_PAGE
      const nextParams = new URLSearchParams(searchParams)
      if (normalizedPage === DEFAULT_PAGE) {
        nextParams.delete(PAGE_PARAM)
      } else {
        nextParams.set(PAGE_PARAM, String(normalizedPage))
      }
      setSearchParams(nextParams)
    },
    [searchParams, setSearchParams],
  )

  const setFilter = useCallback(
    (value: FeedbackReadFilter) => {
      const nextParams = new URLSearchParams(searchParams)
      if (value === DEFAULT_FILTER) {
        nextParams.delete(FILTER_PARAM)
      } else {
        nextParams.set(FILTER_PARAM, value)
      }
      nextParams.delete(PAGE_PARAM)
      setSearchParams(nextParams, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  const setSort = useCallback(
    (value: FeedbackSortParam) => {
      const nextParams = new URLSearchParams(searchParams)
      if (value === DEFAULT_ADMIN_FEEDBACK_SORT) {
        nextParams.delete(SORT_PARAM)
      } else {
        nextParams.set(SORT_PARAM, value)
      }
      nextParams.delete(PAGE_PARAM)
      setSearchParams(nextParams, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  const clearFilters = useCallback(() => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete(FILTER_PARAM)
    nextParams.delete(SORT_PARAM)
    nextParams.delete(PAGE_PARAM)
    setSearchParams(nextParams, { replace: true })
  }, [searchParams, setSearchParams])

  return {
    state,
    hasActiveFilters,
    setPage,
    setFilter,
    setSort,
    clearFilters,
  }
}
