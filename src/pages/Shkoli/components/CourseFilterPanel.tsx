import {
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Controller, type UseFormReturn } from 'react-hook-form'
import type { TFunction } from 'i18next'

import type { CourseAgeGroup, CourseType } from '../../../types/courses'
import { getSortedCourseTypes } from '../../../utils/courseTypes'
import type { CourseFilterFormValues } from '../validations/courseFilterSchema'
import { CourseFilterChips } from './CourseFilterChips'

type CourseFilterPanelProps = {
  form: UseFormReturn<CourseFilterFormValues>
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  isExpanded: boolean
  onToggleExpanded: () => void
  onClear: () => void
  isFetching: boolean
  courseTypes?: CourseType[]
  ageGroup?: CourseAgeGroup
  minPrice?: number
  maxPrice?: number
  locale: string
  t: TFunction
}

const ageOptions: { value: CourseAgeGroup; key: string }[] = [
  { value: 'TODDLER', key: 'toddler' },
  { value: 'CHILD', key: 'child' },
  { value: 'TEEN', key: 'teen' },
]

const sortOptions = [
  { value: '', key: 'default' },
  { value: 'price,asc', key: 'priceAsc' },
  { value: 'price,desc', key: 'priceDesc' },
  { value: 'name,asc', key: 'nameAsc' },
  { value: 'name,desc', key: 'nameDesc' },
]

const CourseFilterPanel = ({
  form,
  onSubmit,
  isExpanded,
  onToggleExpanded,
  onClear,
  isFetching,
  courseTypes,
  ageGroup,
  minPrice,
  maxPrice,
  locale,
  t,
}: CourseFilterPanelProps) => {
  const {
    register,
    control,
    formState: { errors },
  } = form
  const sortedCourseTypes = useMemo(
    () => getSortedCourseTypes(t, locale),
    [locale, t],
  )
  const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false)
  const [typeQuery, setTypeQuery] = useState('')
  const typeInputRef = useRef<HTMLInputElement | null>(null)
  const typeMenuRef = useRef<HTMLDivElement | null>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    setIsTypeMenuOpen(false)
    onSubmit(event)
  }

  useEffect(() => {
    if (!isTypeMenuOpen) return
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        typeMenuRef.current &&
        !typeMenuRef.current.contains(event.target as Node)
      ) {
        setIsTypeMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isTypeMenuOpen])

  useEffect(() => {
    if (isTypeMenuOpen) return
    setTypeQuery('')
  }, [isTypeMenuOpen])

  const filteredCourseTypes = useMemo(() => {
    const normalizedQuery = typeQuery.trim().toLocaleLowerCase(locale)
    if (!normalizedQuery) return sortedCourseTypes
    return sortedCourseTypes.filter((type) =>
      t(`courses.types.${type}`)
        .toLocaleLowerCase(locale)
        .includes(normalizedQuery),
    )
  }, [sortedCourseTypes, typeQuery, locale, t])

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <div className="rounded-[32px] border border-white/80 bg-white/90 p-4 shadow-[0_45px_90px_-65px_rgba(15,23,42,0.5)] backdrop-blur-md sm:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex min-w-[220px] flex-1 items-center gap-3 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 shadow-sm transition focus-within:border-emerald-200">
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4 text-emerald-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <circle cx="9" cy="9" r="6" />
              <path d="M13.5 13.5L18 18" strokeLinecap="round" />
            </svg>
            <Controller
              control={control}
              name="courseTypes"
              render={({ field }) => {
                const selectedTypes = Array.isArray(field.value)
                  ? field.value
                  : []
                const selectedLabels = sortedCourseTypes
                  .filter((type) => selectedTypes.includes(type))
                  .map((type) => t(`courses.types.${type}`))
                const selectedText =
                  selectedLabels.length === 0
                    ? t('pages.shkoli.list.filters.typePlaceholder')
                    : selectedLabels.length <= 2
                      ? selectedLabels.join(', ')
                      : `${selectedLabels.slice(0, 2).join(', ')} ${t(
                          'pages.shkoli.list.filters.typeMore',
                          { count: selectedLabels.length - 2 },
                        )}`

                const toggleType = (value: CourseType) => {
                  if (selectedTypes.includes(value)) {
                    field.onChange(
                      selectedTypes.filter((type) => type !== value),
                    )
                    return
                  }
                  field.onChange([...selectedTypes, value])
                }

                return (
                  <div
                    className="relative flex w-full items-center gap-2"
                    ref={typeMenuRef}
                  >
                    <input
                      type="text"
                      value={typeQuery}
                      onChange={(event) => {
                        setTypeQuery(event.target.value)
                        if (!isTypeMenuOpen) {
                          setIsTypeMenuOpen(true)
                        }
                      }}
                      onFocus={() => setIsTypeMenuOpen(true)}
                      placeholder={selectedText}
                      className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-500"
                      aria-label={t('pages.shkoli.list.filters.typeLabel')}
                      aria-expanded={isTypeMenuOpen}
                      ref={typeInputRef}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setIsTypeMenuOpen((prev) => !prev)
                        if (!isTypeMenuOpen) {
                          typeInputRef.current?.focus()
                        }
                      }}
                      className="flex h-5 w-5 items-center justify-center"
                      aria-label={t('pages.shkoli.list.filters.typeLabel')}
                    >
                      <svg
                        viewBox="0 0 20 20"
                        className={`h-4 w-4 text-slate-400 transition-transform ${
                          isTypeMenuOpen ? 'rotate-180' : ''
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
                    {isTypeMenuOpen ? (
                      <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
                        {filteredCourseTypes.length === 0 ? (
                          <p className="px-3 py-2 text-xs text-slate-500">
                            {t(
                              'pages.shkoli.list.filters.typeNoResults',
                            )}
                          </p>
                        ) : (
                          filteredCourseTypes.map((type) => {
                            const isSelected =
                              selectedTypes.includes(type)
                            return (
                              <label
                                key={type}
                                className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-emerald-50/80"
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleType(type)}
                                  className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                                />
                                <span>{t(`courses.types.${type}`)}</span>
                              </label>
                            )
                          })
                        )}
                      </div>
                    ) : null}
                  </div>
                )
              }}
            />
          </div>
          <div className="flex min-w-[260px] flex-[1.2] items-center gap-3 rounded-full border border-emerald-100/80 bg-emerald-50/70 px-4 py-2">
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
              name="ageGroup"
              render={({ field }) => {
                const activeIndex = ageOptions.findIndex(
                  (option) => option.value === field.value,
                )

                return (
                  <div className="relative flex flex-1 rounded-full bg-white/90 p-1 shadow-inner">
                    <div
                      className="absolute inset-y-1 left-1 rounded-full bg-emerald-100/90 shadow-sm transition-transform duration-300"
                      style={{
                        width: 'calc((100% - 0.5rem) / 3)',
                        transform:
                          activeIndex >= 0
                            ? `translateX(${activeIndex * 100}%)`
                            : 'translateX(0%)',
                        opacity: activeIndex >= 0 ? 1 : 0,
                      }}
                    />
                    {ageOptions.map((option) => {
                      const isActive = field.value === option.value
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            field.onChange(
                              isActive ? '' : option.value,
                            )
                          }
                          className={`relative z-10 flex-1 rounded-full px-2 py-1 text-[11px] font-semibold transition ${
                            isActive
                              ? 'text-emerald-900'
                              : 'text-slate-500'
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
          <button
            type="button"
            onClick={onToggleExpanded}
            className="flex min-w-[180px] items-center justify-center gap-2 rounded-full border border-slate-200/80 bg-white/85 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-200"
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
            className="flex min-w-[150px] items-center justify-center rounded-full bg-emerald-800 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {t('pages.shkoli.list.filters.apply')}
          </button>
        </div>

        {isExpanded ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 shadow-sm">
              <label className="text-xs font-semibold text-slate-600">
                {t('pages.shkoli.list.filters.sortLabel')}
              </label>
              <div className="mt-2 flex items-center gap-2">
                <select
                  {...register('sort')}
                  className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none"
                  aria-label={t('pages.shkoli.list.filters.sortLabel')}
                >
                  {sortOptions.map((option) => (
                    <option key={option.key} value={option.value}>
                      {t(`pages.shkoli.list.filters.sort.${option.key}`)}
                    </option>
                  ))}
                </select>
                <svg
                  viewBox="0 0 20 20"
                  className="h-4 w-4 text-slate-400"
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
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 shadow-sm">
              <label className="text-xs font-semibold text-slate-600">
                {t('pages.shkoli.list.filters.priceFrom')}
              </label>
              <input
                type="text"
                inputMode="decimal"
                {...register('minPrice')}
                className="mt-2 w-full rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-200"
                placeholder="0"
              />
              {errors.minPrice ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.minPrice.message}
                </p>
              ) : null}
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 shadow-sm">
              <label className="text-xs font-semibold text-slate-600">
                {t('pages.shkoli.list.filters.priceTo')}
              </label>
              <input
                type="text"
                inputMode="decimal"
                {...register('maxPrice')}
                className="mt-2 w-full rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-200"
                placeholder="300"
              />
              {errors.maxPrice ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.maxPrice.message}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="mt-4">
          <CourseFilterChips
            courseTypes={courseTypes}
            ageGroup={ageGroup}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onClear={onClear}
            locale={locale}
            t={t}
          />
        </div>
      </div>
    </form>
  )
}

export default CourseFilterPanel
