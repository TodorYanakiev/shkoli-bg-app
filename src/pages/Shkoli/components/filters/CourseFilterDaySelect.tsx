import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from 'react-hook-form'
import type { TFunction } from 'i18next'

import type { CourseScheduleDayOfWeek } from '../../../../types/courses'
import { COURSE_DAYS_OF_WEEK } from '../../../../constants/courses'
import type { CourseFilterFormValues } from '../../validations/courseFilterSchema'
import { useDropdownPanelPosition } from '../../hooks/useDropdownPanelPosition'
import CourseFilterDayMenu from './CourseFilterDayMenu'

type CourseFilterDaySelectProps = {
  control: Control<CourseFilterFormValues>
  register: UseFormRegister<CourseFilterFormValues>
  errors: FieldErrors<CourseFilterFormValues>
  locale: string
  t: TFunction
  closeSignal: number
}

const dayOptions = COURSE_DAYS_OF_WEEK.map((day) => ({
  value: day,
  labelKey: `courses.daysOfWeek.${day}`,
}))

const CourseFilterDaySelect = ({
  control,
  register,
  errors,
  locale,
  t,
  closeSignal,
}: CourseFilterDaySelectProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [dayQuery, setDayQuery] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const panelStyles = useDropdownPanelPosition(isMenuOpen, menuRef)

  useEffect(() => {
    if (!isMenuOpen) return

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (menuRef.current?.contains(target)) return
      if (panelRef.current?.contains(target)) return
      setIsMenuOpen(false)
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (isMenuOpen) return
    setDayQuery('')
  }, [isMenuOpen])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [closeSignal])

  const filteredDayOptions = useMemo(() => {
    const normalizedQuery = dayQuery.trim().toLocaleLowerCase(locale)
    if (!normalizedQuery) return dayOptions
    return dayOptions.filter((option) =>
      t(option.labelKey).toLocaleLowerCase(locale).includes(normalizedQuery),
    )
  }, [dayQuery, locale, t])

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 shadow-sm">
      <label className="text-xs font-semibold text-slate-600">
        {t('pages.shkoli.list.filters.dayLabel')}
      </label>
      <Controller
        control={control}
        name="dayOfWeek"
        render={({ field }) => {
          const selectedDays = Array.isArray(field.value) ? field.value : []
          const selectedLabels = dayOptions
            .filter((option) => selectedDays.includes(option.value))
            .map((option) => t(option.labelKey))
          const selectedText =
            selectedLabels.length === 0
              ? t('pages.shkoli.list.filters.dayPlaceholder')
              : selectedLabels.length <= 2
                ? selectedLabels.join(', ')
                : `${selectedLabels.slice(0, 2).join(', ')} ${t(
                    'pages.shkoli.list.filters.dayMore',
                    { count: selectedLabels.length - 2 },
                  )}`

          const toggleDay = (value: CourseScheduleDayOfWeek) => {
            if (selectedDays.includes(value)) {
              field.onChange(selectedDays.filter((day) => day !== value))
              return
            }
            field.onChange([...selectedDays, value])
          }

          return (
            <div className="relative mt-2 flex items-center gap-2" ref={menuRef}>
              <input
                type="text"
                value={dayQuery}
                onChange={(event) => {
                  setDayQuery(event.target.value)
                  if (!isMenuOpen) {
                    setIsMenuOpen(true)
                  }
                }}
                onFocus={() => setIsMenuOpen(true)}
                placeholder={selectedText}
                className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-500"
                aria-label={t('pages.shkoli.list.filters.dayLabel')}
                ref={inputRef}
              />
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen((prev) => !prev)
                  if (!isMenuOpen) {
                    inputRef.current?.focus()
                  }
                }}
                className="flex h-5 w-5 items-center justify-center"
                aria-label={t('pages.shkoli.list.filters.dayLabel')}
                aria-expanded={isMenuOpen}
              >
                <svg
                  viewBox="0 0 20 20"
                  className={`h-4 w-4 text-slate-400 transition-transform ${
                    isMenuOpen ? 'rotate-180' : ''
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
              <CourseFilterDayMenu
                isOpen={isMenuOpen}
                panelStyles={panelStyles}
                panelRef={panelRef}
                filteredOptions={filteredDayOptions}
                selectedDays={selectedDays}
                onToggleDay={toggleDay}
                t={t}
              />
            </div>
          )
        }}
      />
      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-600 sm:flex-nowrap">
        <span className="shrink-0 whitespace-nowrap">
          {t('pages.shkoli.list.filters.timeFrom')}
        </span>
        <input
          type="time"
          {...register('startTimeFrom')}
          className="w-[84px] shrink-0 rounded-lg border border-slate-200/80 bg-white px-2 py-1 text-xs text-slate-700 outline-none focus:border-emerald-200 sm:w-[90px]"
        />
        <span className="shrink-0 whitespace-nowrap">
          {t('pages.shkoli.list.filters.timeTo')}
        </span>
        <input
          type="time"
          {...register('startTimeTo')}
          className="w-[84px] shrink-0 rounded-lg border border-slate-200/80 bg-white px-2 py-1 text-xs text-slate-700 outline-none focus:border-emerald-200 sm:w-[90px]"
        />
      </div>
      {errors.startTimeFrom ? (
        <p className="mt-2 text-xs text-rose-600">
          {errors.startTimeFrom.message}
        </p>
      ) : null}
      {errors.startTimeTo ? (
        <p className="mt-1 text-xs text-rose-600">
          {errors.startTimeTo.message}
        </p>
      ) : null}
    </div>
  )
}

export default CourseFilterDaySelect
