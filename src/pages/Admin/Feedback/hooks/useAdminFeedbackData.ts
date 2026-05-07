import { useEffect, useMemo } from 'react'

import type { AppError } from '../../../../types/appError'
import type { FeedbackResponse } from '../../../../types/feedback'
import { getAdminFeedbackError } from '../services/adminFeedbackErrors'
import type { AdminFeedbackFilterState, AdminFeedbackPagination } from '../types'
import { useAdminFeedback } from './useAdminFeedback'
import { useAdminFeedbackFilters } from './useAdminFeedbackFilters'

const ADMIN_FEEDBACK_PAGE_SIZE = 9
const EMPTY_FEEDBACK: FeedbackResponse[] = []

type AdminFeedbackFiltersController = {
  state: AdminFeedbackFilterState
  hasActiveFilters: boolean
  setPage: (value: number) => void
  setFilter: ReturnType<typeof useAdminFeedbackFilters>['setFilter']
  setSort: ReturnType<typeof useAdminFeedbackFilters>['setSort']
  clearFilters: () => void
}

type AdminFeedbackData = {
  feedbacks: FeedbackResponse[]
  isLoading: boolean
  isFetching: boolean
  error: AppError | null
  pagination: AdminFeedbackPagination
  filters: AdminFeedbackFiltersController
}

export const useAdminFeedbackData = (): AdminFeedbackData => {
  const {
    state: filterState,
    hasActiveFilters,
    setPage,
    setFilter,
    setSort,
    clearFilters,
  } = useAdminFeedbackFilters()

  const query = useMemo(
    () => ({
      page: Math.max(filterState.page - 1, 0),
      size: ADMIN_FEEDBACK_PAGE_SIZE,
      filter: filterState.filter,
      sort: filterState.sort,
    }),
    [filterState.filter, filterState.page, filterState.sort],
  )

  const feedbackQuery = useAdminFeedback(query)
  const feedbacks = feedbackQuery.data?.content ?? EMPTY_FEEDBACK
  const totalItems = feedbackQuery.data?.totalElements ?? 0
  const totalPages = Math.max(feedbackQuery.data?.totalPages ?? 1, 1)
  const currentPage = Math.min(Math.max(filterState.page, 1), totalPages)
  const pageSize = feedbackQuery.data?.size || ADMIN_FEEDBACK_PAGE_SIZE

  useEffect(() => {
    if (feedbackQuery.isLoading || feedbackQuery.isFetching) return
    if (totalItems === 0 && filterState.page !== 1) {
      setPage(1)
      return
    }
    if (filterState.page > totalPages) {
      setPage(totalPages)
    }
  }, [
    feedbackQuery.isFetching,
    feedbackQuery.isLoading,
    filterState.page,
    setPage,
    totalItems,
    totalPages,
  ])

  const pageStart =
    totalItems === 0 || feedbacks.length === 0
      ? 0
      : (currentPage - 1) * pageSize + 1
  const pageEnd =
    totalItems === 0 || feedbacks.length === 0
      ? 0
      : Math.min(pageStart + feedbacks.length - 1, totalItems)
  const error = getAdminFeedbackError(feedbackQuery.error ?? null, 'load')

  return {
    feedbacks,
    isLoading: feedbackQuery.isLoading,
    isFetching: feedbackQuery.isFetching,
    error,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      pageStart,
      pageEnd,
      canGoPrev: currentPage > 1,
      canGoNext: currentPage < totalPages && totalItems > 0,
      hasMultiplePages: totalPages > 1,
      goToPrev: () => setPage(currentPage - 1),
      goToNext: () => setPage(currentPage + 1),
    },
    filters: {
      state: filterState,
      hasActiveFilters,
      setPage,
      setFilter,
      setSort,
      clearFilters,
    },
  }
}
