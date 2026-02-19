import { type FormEvent, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { TFunction } from 'i18next'

import type {
  CourseAgeGroup,
  CourseScheduleDayOfWeek,
  CourseType,
} from '../../../types/courses'
import type { CourseFilterFormValues } from '../validations/courseFilterSchema'
import { CourseFilterChips } from './CourseFilterChips'
import CourseFilterExpandedSection from './filters/CourseFilterExpandedSection'
import CourseFilterTownSelect from './filters/CourseFilterTownSelect'
import CourseFilterTypeSelect from './filters/CourseFilterTypeSelect'

type CourseFilterPanelProps = {
  form: UseFormReturn<CourseFilterFormValues>
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  isExpanded: boolean
  onToggleExpanded: () => void
  onClear: () => void
  isFetching: boolean
  courseTypes?: CourseType[]
  ageGroups?: CourseAgeGroup[]
  dayOfWeek?: CourseScheduleDayOfWeek[]
  town?: string
  startTimeFrom?: string
  startTimeTo?: string
  minPrice?: number
  maxPrice?: number
  locale: string
  t: TFunction
  compact?: boolean
}

const CourseFilterPanel = ({
  form,
  onSubmit,
  isExpanded,
  onToggleExpanded,
  onClear,
  isFetching,
  courseTypes,
  ageGroups,
  dayOfWeek,
  town,
  startTimeFrom,
  startTimeTo,
  minPrice,
  maxPrice,
  locale,
  t,
  compact = false,
}: CourseFilterPanelProps) => {
  const { control } = form
  const [closeSignal, setCloseSignal] = useState(0)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    setCloseSignal((prev) => prev + 1)
    onSubmit(event)
  }

  const formClassName = compact ? 'mt-0' : 'mt-8'
  const panelClassName = compact
    ? 'relative z-30 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4'
    : 'relative z-30 rounded-[32px] border border-white/80 bg-white/90 p-3 shadow-[0_45px_90px_-65px_rgba(15,23,42,0.5)] backdrop-blur-md sm:p-6'

  return (
    <form onSubmit={handleSubmit} className={formClassName}>
      <div className={panelClassName}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <CourseFilterTypeSelect
            control={control}
            locale={locale}
            t={t}
            closeSignal={closeSignal}
          />
          <CourseFilterTownSelect
            control={control}
            t={t}
            closeSignal={closeSignal}
          />
          <button
            type="button"
            onClick={onToggleExpanded}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200/80 bg-white/85 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-200 sm:w-auto sm:min-w-[180px]"
          >
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4 text-emerald-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path
                d="M3 5h14M5 10h10M7 15h6"
                strokeLinecap="round"
              />
            </svg>
            {t('pages.shkoli.list.filters.moreFilters')}
            <svg
              viewBox="0 0 20 20"
              className={`h-4 w-4 text-slate-400 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path
                d="M5 7l5 5 5-5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="submit"
            disabled={isFetching}
            className="flex w-full items-center justify-center rounded-full bg-emerald-800 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-[150px]"
          >
            {t('pages.shkoli.list.filters.apply')}
          </button>
        </div>

        {isExpanded ? (
          <CourseFilterExpandedSection
            form={form}
            locale={locale}
            t={t}
            closeSignal={closeSignal}
          />
        ) : null}

        <CourseFilterChips
          courseTypes={courseTypes}
          ageGroups={ageGroups}
          dayOfWeek={dayOfWeek}
          town={town}
          startTimeFrom={startTimeFrom}
          startTimeTo={startTimeTo}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onClear={onClear}
          locale={locale}
          t={t}
          className={compact ? 'mt-2' : 'mt-4'}
        />
      </div>
    </form>
  )
}

export default CourseFilterPanel
