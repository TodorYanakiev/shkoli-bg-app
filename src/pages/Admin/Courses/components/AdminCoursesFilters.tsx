import type { FormEvent } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import CourseFilterPanel from '../../../Shkoli/components/CourseFilterPanel'
import type { CourseFilterState } from '../../../Shkoli/types'
import type { CourseFilterFormValues } from '../../../Shkoli/validations/courseFilterSchema'

type AdminCoursesFiltersProps = {
  form: UseFormReturn<CourseFilterFormValues>
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  filterState: CourseFilterState
  isExpanded: boolean
  onToggleExpanded: () => void
  onClear: () => void
  isFetching: boolean
  locale: string
}

export const AdminCoursesFilters = ({
  form,
  onSubmit,
  filterState,
  isExpanded,
  onToggleExpanded,
  onClear,
  isFetching,
  locale,
}: AdminCoursesFiltersProps) => {
  const { t } = useTranslation()

  return (
    <CourseFilterPanel
      form={form}
      onSubmit={onSubmit}
      isExpanded={isExpanded}
      onToggleExpanded={onToggleExpanded}
      onClear={onClear}
      isFetching={isFetching}
      courseTypes={filterState.courseTypes}
      ageGroups={filterState.ageGroups}
      dayOfWeek={filterState.dayOfWeek}
      town={filterState.town}
      startTimeFrom={filterState.startTimeFrom}
      startTimeTo={filterState.startTimeTo}
      minPrice={filterState.minPrice}
      maxPrice={filterState.maxPrice}
      locale={locale}
      t={t}
      compact
    />
  )
}
