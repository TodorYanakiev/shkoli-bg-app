import { Controller, type Control } from 'react-hook-form'
import type { TFunction } from 'i18next'

import type { CourseAgeGroup } from '../../../../types/courses'
import type { CourseFilterFormValues } from '../../validations/courseFilterSchema'

type CourseFilterAgeGroupToggleProps = {
  control: Control<CourseFilterFormValues>
  t: TFunction
}

const ageOptions: { value: CourseAgeGroup; key: string }[] = [
  { value: 'TODDLER', key: 'toddler' },
  { value: 'CHILD', key: 'child' },
  { value: 'TEEN', key: 'teen' },
  { value: 'ADULT', key: 'adult' },
  { value: 'SENIOR', key: 'senior' },
]

const CourseFilterAgeGroupToggle = ({
  control,
  t,
}: CourseFilterAgeGroupToggleProps) => (
  <div className="flex w-full min-w-0 flex-[1.2] flex-wrap items-center gap-2 rounded-full border border-emerald-100/80 bg-emerald-50/70 px-3 py-1.5 sm:min-w-[240px] sm:flex-nowrap">
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-emerald-700"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path
        d="M7.5 15.5c.8 1.7 2.6 3 4.8 3 3.1 0 5.7-2.3 5.7-5.1 0-2.5-2-4.6-4.6-5"
        strokeLinecap="round"
      />
      <path
        d="M11.5 6.5c-.7-1.6-2.3-2.7-4.2-2.7-2.7 0-4.8 2-4.8 4.4 0 2.2 1.8 4 4.2 4"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="2" />
    </svg>
    <span className="text-xs font-semibold text-emerald-800">
      {t('pages.shkoli.list.filters.ageLabel')}
    </span>
    <Controller
      control={control}
      name="ageGroups"
      render={({ field }) => {
        const selectedGroups = Array.isArray(field.value) ? field.value : []

        const toggleGroup = (value: CourseAgeGroup) => {
          if (selectedGroups.includes(value)) {
            field.onChange(
              selectedGroups.filter((group) => group !== value),
            )
            return
          }
          field.onChange([...selectedGroups, value])
        }

        return (
          <div className="relative flex flex-1 overflow-hidden rounded-full bg-white/90 p-0.5 shadow-inner">
            {ageOptions.map((option) => {
              const isActive = selectedGroups.includes(option.value)
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleGroup(option.value)}
                  className={`relative z-10 flex-1 -ml-1 rounded-full px-2 py-1 text-[11px] font-semibold transition first:ml-0 ${
                    isActive
                      ? 'bg-emerald-100/90 text-emerald-900 shadow-sm'
                      : 'text-slate-500 hover:text-emerald-800'
                  }`}
                  aria-pressed={isActive}
                >
                  {t(`pages.shkoli.list.filters.ageShort.${option.key}`)}
                </button>
              )
            })}
          </div>
        )
      }}
    />
  </div>
)

export default CourseFilterAgeGroupToggle
