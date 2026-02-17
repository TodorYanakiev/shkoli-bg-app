import { type FormEvent, useState } from 'react'
import type { TFunction } from 'i18next'
import type { UseFormReturn } from 'react-hook-form'

import type { CourseAgeGroup, CourseScheduleDayOfWeek, CourseType } from '../../../types/courses'
import type { CourseFilterFormValues } from '../../Shkoli/validations/courseFilterSchema'
import { CoursePriceRangeSlider } from '../../Shkoli/components/CoursePriceRangeSlider'
import CourseFilterAgeGroupToggle from '../../Shkoli/components/filters/CourseFilterAgeGroupToggle'
import CourseFilterDaySelect from '../../Shkoli/components/filters/CourseFilterDaySelect'
import CourseFilterSortSelect from '../../Shkoli/components/filters/CourseFilterSortSelect'
import CourseFilterTownSelect from '../../Shkoli/components/filters/CourseFilterTownSelect'
import CourseFilterTypeSelect from '../../Shkoli/components/filters/CourseFilterTypeSelect'
import { CourseFilterChips } from '../../Shkoli/components/CourseFilterChips'

type MapExplorerAdvancedFiltersModalProps = {
  isOpen: boolean
  form: UseFormReturn<CourseFilterFormValues>
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
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
}

const MapExplorerAdvancedFiltersModal = ({
  isOpen,
  form,
  onClose,
  onSubmit,
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
}: MapExplorerAdvancedFiltersModalProps) => {
  const {
    control,
    register,
    formState: { errors },
  } = form
  const [closeSignal, setCloseSignal] = useState(0)

  if (!isOpen) {
    return null
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    setCloseSignal((previous) => previous + 1)
    onSubmit(event)
  }

  return (
    <div className="fixed inset-0 z-[720] flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-slate-900/35"
        onClick={onClose}
        aria-hidden="true"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-label={t('pages.shkoli.list.filters.moreFilters')}
        className="relative z-10 w-full max-w-4xl rounded-[30px] border border-white/70 bg-[#f5f7f4] shadow-[0_34px_90px_-45px_rgba(15,23,42,0.65)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-200/80 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {t('pages.shkoli.list.filters.moreFilters')}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {t('pages.map.subtitle')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:bg-slate-100 hover:text-slate-700"
            aria-label={t('pages.map.mobile.closeFilters')}
          >
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <form onSubmit={handleSubmit} className="max-h-[78vh] overflow-y-auto px-5 py-5 sm:px-6">
          <div className="grid gap-3 lg:grid-cols-[1.1fr_1fr]">
            <CourseFilterTypeSelect
              control={control}
              locale={locale}
              t={t}
              closeSignal={closeSignal}
            />
            <CourseFilterAgeGroupToggle control={control} t={t} />
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[0.9fr_1.25fr_0.85fr]">
            <CourseFilterTownSelect
              control={control}
              t={t}
              closeSignal={closeSignal}
            />
            <CourseFilterDaySelect
              control={control}
              register={register}
              errors={errors}
              locale={locale}
              t={t}
              closeSignal={closeSignal}
            />
            <CourseFilterSortSelect
              control={control}
              t={t}
              closeSignal={closeSignal}
            />
          </div>

          <div className="mt-3 max-w-[360px]">
            <CoursePriceRangeSlider
              control={control}
              errors={errors}
              locale={locale}
              t={t}
            />
          </div>

          <div className="mt-4">
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
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-slate-200/80 pt-4">
            <button
              type="button"
              onClick={onClear}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              {t('pages.shkoli.list.filters.clearAll')}
            </button>
            <button
              type="submit"
              disabled={isFetching}
              className="rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-65"
            >
              {isFetching
                ? t('pages.map.filters.applying')
                : t('pages.map.filters.apply')}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default MapExplorerAdvancedFiltersModal
