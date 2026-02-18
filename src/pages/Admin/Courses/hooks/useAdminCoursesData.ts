import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { UseFormReturn } from 'react-hook-form'

import type { AppError } from '../../../../types/appError'
import type { CourseResponse } from '../../../../types/courses'
import { useCourseFilterForm } from '../../../Shkoli/hooks/useCourseFilterForm'
import { useCourseFilters } from '../../../Shkoli/hooks/useCourseFilters'
import type { CourseFilterState } from '../../../Shkoli/types'
import type { CourseFilterFormValues } from '../../../Shkoli/validations/courseFilterSchema'
import { getAdminCoursesLoadError } from '../services/adminCoursesErrors'
import type { AdminCoursesPagination } from '../types'
import { useAdminCourses } from './useAdminCourses'

const hasExpandedFilterValues = (state: CourseFilterState) =>
  Boolean(
    state.sort ||
      state.minPrice != null ||
      state.maxPrice != null ||
      state.town ||
      (state.dayOfWeek?.length ?? 0) > 0 ||
      state.startTimeFrom ||
      state.startTimeTo,
  )

const hasActiveFilters = (state: CourseFilterState) =>
  Boolean(
    hasExpandedFilterValues(state) ||
      (state.courseTypes?.length ?? 0) > 0 ||
      (state.ageGroups?.length ?? 0) > 0,
  )

type AdminCoursesData = {
  form: UseFormReturn<CourseFilterFormValues>
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  filterState: CourseFilterState
  isExpanded: boolean
  toggleExpanded: () => void
  clearFilters: () => void
  locale: string
  courses: CourseResponse[]
  isLoading: boolean
  isFetching: boolean
  error: AppError | null
  hasActiveFilters: boolean
  pagination: AdminCoursesPagination
}

export const useAdminCoursesData = (): AdminCoursesData => {
  const { t, i18n } = useTranslation()
  const {
    state,
    query,
    formDefaults,
    applyFilters,
    clearFilters,
    setPage,
    pageSize,
  } = useCourseFilters()
  const form = useCourseFilterForm({ t, defaultValues: formDefaults })
  const onSubmit = form.handleSubmit(applyFilters)
  const hasExpandedFilters = hasExpandedFilterValues(state)
  const [isExpanded, setIsExpanded] = useState(
    hasExpandedFilters,
  )
  const hasActiveCourseFilters = hasActiveFilters(state)

  useEffect(() => {
    if (hasExpandedFilters) {
      setIsExpanded(true)
    }
  }, [hasExpandedFilters])

  const { data, isLoading, isFetching, error } = useAdminCourses(query)
  const appError = useMemo(
    () => getAdminCoursesLoadError(error ?? null),
    [error],
  )

  const courses = data?.content ?? []
  const totalItems = data?.totalElements ?? 0
  const totalPages = Math.max(1, data?.totalPages ?? 1)
  const currentPage = Math.min(Math.max(state.page, 1), totalPages)

  useEffect(() => {
    if (isLoading || isFetching) return
    if (totalItems === 0 && state.page !== 1) {
      setPage(1)
      return
    }
    if (state.page > totalPages) {
      setPage(totalPages)
    }
  }, [
    isLoading,
    isFetching,
    state.page,
    totalPages,
    totalItems,
    setPage,
  ])

  const pageStart = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const pageEnd =
    totalItems === 0
      ? 0
      : Math.min(pageStart + courses.length - 1, totalItems)
  const canGoPrev = currentPage > 1
  const canGoNext = currentPage < totalPages

  return {
    form,
    onSubmit,
    filterState: state,
    isExpanded,
    toggleExpanded: () => setIsExpanded((previous) => !previous),
    clearFilters,
    locale: i18n.language,
    courses,
    isLoading,
    isFetching,
    error: appError,
    hasActiveFilters: hasActiveCourseFilters,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      pageStart,
      pageEnd,
      canGoPrev,
      canGoNext,
      hasMultiplePages: totalPages > 1,
      goToPrev: () => setPage(currentPage - 1),
      goToNext: () => setPage(currentPage + 1),
    },
  }
}
