import {
  type Dispatch,
  type FormEvent,
  type RefObject,
  type SetStateAction,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { Controller, type UseFormReturn } from 'react-hook-form'
import type { TFunction } from 'i18next'

import type {
  CourseAgeGroup,
  CourseScheduleDayOfWeek,
  CourseType,
} from '../../../types/courses'
import { COURSE_DAYS_OF_WEEK } from '../../../constants/courses'
import { LYCEUM_TOWNS } from '../../../constants/lyceums'
import { getSortedCourseTypes } from '../../../utils/courseTypes'
import type { CourseFilterFormValues } from '../validations/courseFilterSchema'
import { CourseFilterChips } from './CourseFilterChips'
import { CoursePriceRangeSlider } from './CoursePriceRangeSlider'

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
}

const ageOptions: { value: CourseAgeGroup; key: string }[] = [
  { value: 'TODDLER', key: 'toddler' },
  { value: 'CHILD', key: 'child' },
  { value: 'TEEN', key: 'teen' },
  { value: 'ADULT', key: 'adult' },
  { value: 'SENIOR', key: 'senior' },
]

const sortOptions = [
  { value: '', key: 'default' },
  { value: 'price,asc', key: 'priceAsc' },
  { value: 'price,desc', key: 'priceDesc' },
  { value: 'name,asc', key: 'nameAsc' },
  { value: 'name,desc', key: 'nameDesc' },
]

const dayOptions = COURSE_DAYS_OF_WEEK.map((day) => ({
  value: day,
  labelKey: `courses.daysOfWeek.${day}`,
}))

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
  const typePanelRef = useRef<HTMLDivElement | null>(null)
  const [typePanelStyles, setTypePanelStyles] = useState<{
    top: number
    left: number
    width: number
    maxHeight: number
  } | null>(null)
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false)
  const sortInputRef = useRef<HTMLInputElement | null>(null)
  const sortMenuRef = useRef<HTMLDivElement | null>(null)
  const sortPanelRef = useRef<HTMLDivElement | null>(null)
  const [sortPanelStyles, setSortPanelStyles] = useState<{
    top: number
    left: number
    width: number
    maxHeight: number
  } | null>(null)
  const [isDayMenuOpen, setIsDayMenuOpen] = useState(false)
  const [dayQuery, setDayQuery] = useState('')
  const dayInputRef = useRef<HTMLInputElement | null>(null)
  const dayMenuRef = useRef<HTMLDivElement | null>(null)
  const dayPanelRef = useRef<HTMLDivElement | null>(null)
  const [dayPanelStyles, setDayPanelStyles] = useState<{
    top: number
    left: number
    width: number
    maxHeight: number
  } | null>(null)
  const [isTownMenuOpen, setIsTownMenuOpen] = useState(false)
  const townInputRef = useRef<HTMLInputElement | null>(null)
  const townMenuRef = useRef<HTMLDivElement | null>(null)
  const townPanelRef = useRef<HTMLDivElement | null>(null)
  const [townPanelStyles, setTownPanelStyles] = useState<{
    top: number
    left: number
    width: number
    maxHeight: number
  } | null>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    setIsTypeMenuOpen(false)
    setIsSortMenuOpen(false)
    setIsDayMenuOpen(false)
    setIsTownMenuOpen(false)
    onSubmit(event)
  }

  useEffect(() => {
    if (
      !isTypeMenuOpen &&
      !isSortMenuOpen &&
      !isDayMenuOpen &&
      !isTownMenuOpen
    )
      return
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        typeMenuRef.current &&
        !typeMenuRef.current.contains(event.target as Node) &&
        !typePanelRef.current?.contains(event.target as Node)
      ) {
        setIsTypeMenuOpen(false)
      }
      if (
        sortMenuRef.current &&
        !sortMenuRef.current.contains(event.target as Node) &&
        !sortPanelRef.current?.contains(event.target as Node)
      ) {
        setIsSortMenuOpen(false)
      }
      if (
        dayMenuRef.current &&
        !dayMenuRef.current.contains(event.target as Node) &&
        !dayPanelRef.current?.contains(event.target as Node)
      ) {
        setIsDayMenuOpen(false)
      }
      if (
        townMenuRef.current &&
        !townMenuRef.current.contains(event.target as Node) &&
        !townPanelRef.current?.contains(event.target as Node)
      ) {
        setIsTownMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isTypeMenuOpen, isSortMenuOpen, isDayMenuOpen, isTownMenuOpen])

  useEffect(() => {
    if (isTypeMenuOpen) return
    setTypeQuery('')
  }, [isTypeMenuOpen])

  useEffect(() => {
    if (isDayMenuOpen) return
    setDayQuery('')
  }, [isDayMenuOpen])

  const getPanelPosition = (target: HTMLElement | null) => {
    if (!target) return null
    const rect = target.getBoundingClientRect()
    const gap = 8
    const viewportPadding = 16
    const maxHeight = 288
    const minHeight = 140
    const spaceBelow = window.innerHeight - rect.bottom - viewportPadding
    const spaceAbove = rect.top - viewportPadding
    const openDown = spaceBelow >= minHeight || spaceBelow >= spaceAbove
    const availableSpace = openDown ? spaceBelow : spaceAbove
    const panelMaxHeight = Math.min(
      maxHeight,
      Math.max(availableSpace, minHeight),
    )
    const maxLeft = Math.max(
      viewportPadding,
      window.innerWidth - viewportPadding - rect.width,
    )
    const left = Math.min(Math.max(rect.left, viewportPadding), maxLeft)
    const top = openDown
      ? rect.bottom + gap
      : Math.max(viewportPadding, rect.top - gap - panelMaxHeight)
    return {
      top,
      left,
      width: rect.width,
      maxHeight: panelMaxHeight,
    }
  }

  const usePanelPosition = (
    isOpen: boolean,
    targetRef: RefObject<HTMLElement>,
    setStyles: Dispatch<
      SetStateAction<{
        top: number
        left: number
        width: number
        maxHeight: number
      } | null>
    >,
  ) => {
    useLayoutEffect(() => {
      if (!isOpen) {
        setStyles(null)
        return
      }
      const update = () => {
        setStyles(getPanelPosition(targetRef.current))
      }
      update()
      window.addEventListener('resize', update)
      window.addEventListener('scroll', update, true)
      return () => {
        window.removeEventListener('resize', update)
        window.removeEventListener('scroll', update, true)
      }
    }, [isOpen, targetRef, setStyles])
  }

  usePanelPosition(isTypeMenuOpen, typeMenuRef, setTypePanelStyles)
  usePanelPosition(isSortMenuOpen, sortMenuRef, setSortPanelStyles)
  usePanelPosition(isDayMenuOpen, dayMenuRef, setDayPanelStyles)
  usePanelPosition(isTownMenuOpen, townMenuRef, setTownPanelStyles)

  const filteredCourseTypes = useMemo(() => {
    const normalizedQuery = typeQuery.trim().toLocaleLowerCase(locale)
    if (!normalizedQuery) return sortedCourseTypes
    return sortedCourseTypes.filter((type) =>
      t(`courses.types.${type}`)
        .toLocaleLowerCase(locale)
        .includes(normalizedQuery),
    )
  }, [sortedCourseTypes, typeQuery, locale, t])

  const filteredDayOptions = useMemo(() => {
    const normalizedQuery = dayQuery.trim().toLocaleLowerCase(locale)
    if (!normalizedQuery) return dayOptions
    return dayOptions.filter((option) =>
      t(option.labelKey).toLocaleLowerCase(locale).includes(normalizedQuery),
    )
  }, [dayQuery, locale, t])

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <div className="relative z-30 rounded-[32px] border border-white/80 bg-white/90 p-4 shadow-[0_45px_90px_-65px_rgba(15,23,42,0.5)] backdrop-blur-md sm:p-6">
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
                    {isTypeMenuOpen && typePanelStyles
                      ? createPortal(
                          <div
                            ref={typePanelRef}
                            className="fixed z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg"
                            style={{
                              top: typePanelStyles.top,
                              left: typePanelStyles.left,
                              width: typePanelStyles.width,
                            }}
                          >
                            <div
                              className="max-h-64 overflow-y-auto p-2"
                              style={{ maxHeight: typePanelStyles.maxHeight }}
                            >
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
                                      <span>
                                        {t(`courses.types.${type}`)}
                                      </span>
                                    </label>
                                  )
                                })
                              )}
                            </div>
                          </div>,
                          document.body,
                        )
                      : null}
                  </div>
                )
              }}
            />
          </div>
          <div className="flex min-w-[240px] flex-[1.2] items-center gap-2 rounded-full border border-emerald-100/80 bg-emerald-50/70 px-3 py-1.5">
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
                const selectedGroups = Array.isArray(field.value)
                  ? field.value
                  : []

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
              <Controller
                control={control}
                name="sort"
                render={({ field }) => {
                  const currentOption =
                    sortOptions.find(
                      (option) => option.value === field.value,
                    ) ?? sortOptions[0]
                  const currentLabel = t(
                    `pages.shkoli.list.filters.sort.${currentOption.key}`,
                  )

                  return (
                    <div
                      className="relative mt-2 flex items-center gap-2"
                      ref={sortMenuRef}
                    >
                      <input
                        type="text"
                        readOnly
                        value={currentLabel}
                        onFocus={() => setIsSortMenuOpen(true)}
                        className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none"
                        aria-label={t('pages.shkoli.list.filters.sortLabel')}
                        aria-expanded={isSortMenuOpen}
                        ref={sortInputRef}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsSortMenuOpen((prev) => !prev)
                          if (!isSortMenuOpen) {
                            sortInputRef.current?.focus()
                          }
                        }}
                        className="flex h-5 w-5 items-center justify-center"
                        aria-label={t('pages.shkoli.list.filters.sortLabel')}
                      >
                        <svg
                          viewBox="0 0 20 20"
                          className={`h-4 w-4 text-slate-400 transition-transform ${
                            isSortMenuOpen ? 'rotate-180' : ''
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
                      {isSortMenuOpen && sortPanelStyles
                        ? createPortal(
                            <div
                              ref={sortPanelRef}
                              className="fixed z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg"
                              style={{
                                top: sortPanelStyles.top,
                                left: sortPanelStyles.left,
                                width: sortPanelStyles.width,
                              }}
                            >
                              <div
                                className="max-h-56 overflow-y-auto p-2"
                                style={{
                                  maxHeight: sortPanelStyles.maxHeight,
                                }}
                              >
                                {sortOptions.map((option) => {
                                  const isSelected =
                                    option.value === field.value
                                  return (
                                    <button
                                      key={option.key}
                                      type="button"
                                      onClick={() => {
                                        field.onChange(option.value)
                                        setIsSortMenuOpen(false)
                                      }}
                                      className={`flex w-full items-center justify-between rounded-lg px-2 py-1 text-left text-sm transition ${
                                        isSelected
                                          ? 'bg-emerald-50 text-emerald-800'
                                          : 'text-slate-700 hover:bg-emerald-50/80'
                                      }`}
                                    >
                                      <span>
                                        {t(
                                          `pages.shkoli.list.filters.sort.${option.key}`,
                                        )}
                                      </span>
                                    </button>
                                  )
                                })}
                              </div>
                            </div>,
                            document.body,
                          )
                        : null}
                    </div>
                  )
                }}
              />
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 shadow-sm">
              <label className="text-xs font-semibold text-slate-600">
                {t('pages.shkoli.list.filters.townLabel')}
              </label>
              <Controller
                control={control}
                name="town"
                render={({ field }) => {
                  const selectedTown = field.value?.trim() ?? ''
                  return (
                    <div
                      className="relative mt-2 flex items-center gap-2"
                      ref={townMenuRef}
                    >
                      <input
                        type="text"
                        readOnly
                        value={selectedTown}
                        onFocus={() => setIsTownMenuOpen(true)}
                        placeholder={t(
                          'pages.shkoli.list.filters.townPlaceholder',
                        )}
                        className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-500"
                        aria-label={t('pages.shkoli.list.filters.townLabel')}
                        aria-expanded={isTownMenuOpen}
                        ref={townInputRef}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsTownMenuOpen((prev) => !prev)
                          if (!isTownMenuOpen) {
                            townInputRef.current?.focus()
                          }
                        }}
                        className="flex h-5 w-5 items-center justify-center"
                        aria-label={t('pages.shkoli.list.filters.townLabel')}
                      >
                        <svg
                          viewBox="0 0 20 20"
                          className={`h-4 w-4 text-slate-400 transition-transform ${
                            isTownMenuOpen ? 'rotate-180' : ''
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
                      {isTownMenuOpen && townPanelStyles
                        ? createPortal(
                            <div
                              ref={townPanelRef}
                              className="fixed z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg"
                              style={{
                                top: townPanelStyles.top,
                                left: townPanelStyles.left,
                                width: townPanelStyles.width,
                              }}
                            >
                              <div
                                className="max-h-56 overflow-y-auto p-2"
                                style={{
                                  maxHeight: townPanelStyles.maxHeight,
                                }}
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    field.onChange('')
                                    setIsTownMenuOpen(false)
                                  }}
                                  className={`flex w-full items-center justify-between rounded-lg px-2 py-1 text-left text-sm transition ${
                                    selectedTown === ''
                                      ? 'bg-emerald-50 text-emerald-800'
                                      : 'text-slate-700 hover:bg-emerald-50/80'
                                  }`}
                                >
                                  <span>
                                    {t(
                                      'pages.shkoli.list.filters.townPlaceholder',
                                    )}
                                  </span>
                                </button>
                                {LYCEUM_TOWNS.map((option) => {
                                  const isSelected =
                                    option === selectedTown
                                  return (
                                    <button
                                      key={option}
                                      type="button"
                                      onClick={() => {
                                        field.onChange(option)
                                        setIsTownMenuOpen(false)
                                      }}
                                      className={`flex w-full items-center justify-between rounded-lg px-2 py-1 text-left text-sm transition ${
                                        isSelected
                                          ? 'bg-emerald-50 text-emerald-800'
                                          : 'text-slate-700 hover:bg-emerald-50/80'
                                      }`}
                                    >
                                      <span>{option}</span>
                                    </button>
                                  )
                                })}
                              </div>
                            </div>,
                            document.body,
                          )
                        : null}
                    </div>
                  )
                }}
              />
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 shadow-sm">
              <label className="text-xs font-semibold text-slate-600">
                {t('pages.shkoli.list.filters.dayLabel')}
              </label>
              <Controller
                control={control}
                name="dayOfWeek"
                render={({ field }) => {
                  const selectedDays = Array.isArray(field.value)
                    ? field.value
                    : []
                  const selectedLabels = dayOptions
                    .filter((option) =>
                      selectedDays.includes(option.value),
                    )
                    .map((option) => t(option.labelKey))
                  const selectedText =
                    selectedLabels.length === 0
                      ? t('pages.shkoli.list.filters.dayPlaceholder')
                      : selectedLabels.length <= 2
                        ? selectedLabels.join(', ')
                        : `${selectedLabels
                            .slice(0, 2)
                            .join(', ')} ${t(
                            'pages.shkoli.list.filters.dayMore',
                            { count: selectedLabels.length - 2 },
                          )}`

                  const toggleDay = (value: CourseScheduleDayOfWeek) => {
                    if (selectedDays.includes(value)) {
                      field.onChange(
                        selectedDays.filter((day) => day !== value),
                      )
                      return
                    }
                    field.onChange([...selectedDays, value])
                  }

                  return (
                    <div
                      className="relative mt-2 flex items-center gap-2"
                      ref={dayMenuRef}
                    >
                      <input
                        type="text"
                        value={dayQuery}
                        onChange={(event) => {
                          setDayQuery(event.target.value)
                          if (!isDayMenuOpen) {
                            setIsDayMenuOpen(true)
                          }
                        }}
                        onFocus={() => setIsDayMenuOpen(true)}
                        placeholder={selectedText}
                        className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-500"
                        aria-label={t('pages.shkoli.list.filters.dayLabel')}
                        aria-expanded={isDayMenuOpen}
                        ref={dayInputRef}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsDayMenuOpen((prev) => !prev)
                          if (!isDayMenuOpen) {
                            dayInputRef.current?.focus()
                          }
                        }}
                        className="flex h-5 w-5 items-center justify-center"
                        aria-label={t('pages.shkoli.list.filters.dayLabel')}
                      >
                        <svg
                          viewBox="0 0 20 20"
                          className={`h-4 w-4 text-slate-400 transition-transform ${
                            isDayMenuOpen ? 'rotate-180' : ''
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
                      {isDayMenuOpen && dayPanelStyles
                        ? createPortal(
                            <div
                              ref={dayPanelRef}
                              className="fixed z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg"
                              style={{
                                top: dayPanelStyles.top,
                                left: dayPanelStyles.left,
                                width: dayPanelStyles.width,
                              }}
                            >
                              <div
                                className="max-h-56 overflow-y-auto p-2"
                                style={{
                                  maxHeight: dayPanelStyles.maxHeight,
                                }}
                              >
                                {filteredDayOptions.length === 0 ? (
                                  <p className="px-3 py-2 text-xs text-slate-500">
                                    {t(
                                      'pages.shkoli.list.filters.dayNoResults',
                                    )}
                                  </p>
                                ) : (
                                  filteredDayOptions.map((option) => {
                                    const isSelected =
                                      selectedDays.includes(option.value)
                                    return (
                                      <label
                                        key={option.value}
                                        className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-emerald-50/80"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isSelected}
                                          onChange={() =>
                                            toggleDay(option.value)
                                          }
                                          className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                                        />
                                        <span>{t(option.labelKey)}</span>
                                      </label>
                                    )
                                  })
                                )}
                              </div>
                            </div>,
                            document.body,
                          )
                        : null}
                    </div>
                  )
                }}
              />
              <div className="mt-2 flex flex-nowrap items-center gap-1 text-[11px] font-semibold text-slate-600">
                <span className="shrink-0 whitespace-nowrap">
                  {t('pages.shkoli.list.filters.timeFrom')}
                </span>
                <input
                  type="time"
                  {...register('startTimeFrom')}
                  className="w-[90px] shrink-0 rounded-lg border border-slate-200/80 bg-white px-2 py-1 text-xs text-slate-700 outline-none focus:border-emerald-200"
                />
                <span className="shrink-0 whitespace-nowrap">
                  {t('pages.shkoli.list.filters.timeTo')}
                </span>
                <input
                  type="time"
                  {...register('startTimeTo')}
                  className="w-[90px] shrink-0 rounded-lg border border-slate-200/80 bg-white px-2 py-1 text-xs text-slate-700 outline-none focus:border-emerald-200"
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
            <CoursePriceRangeSlider
              control={control}
              errors={errors}
              locale={locale}
              t={t}
            />
          </div>
        ) : null}

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
      </div>
    </form>
  )
}

export default CourseFilterPanel
