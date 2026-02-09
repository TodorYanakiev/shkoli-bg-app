import { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, type Control } from 'react-hook-form'
import type { TFunction } from 'i18next'

import type { CourseType } from '../../../../types/courses'
import { getSortedCourseTypes } from '../../../../utils/courseTypes'
import type { CourseFilterFormValues } from '../../validations/courseFilterSchema'
import { useDropdownPanelPosition } from '../../hooks/useDropdownPanelPosition'
import CourseFilterTypeMenu from './CourseFilterTypeMenu'

type CourseFilterTypeSelectProps = {
  control: Control<CourseFilterFormValues>
  locale: string
  t: TFunction
  closeSignal: number
}

const CourseFilterTypeSelect = ({
  control,
  locale,
  t,
  closeSignal,
}: CourseFilterTypeSelectProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [typeQuery, setTypeQuery] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const panelStyles = useDropdownPanelPosition(isMenuOpen, menuRef)
  const sortedCourseTypes = useMemo(
    () => getSortedCourseTypes(t, locale),
    [locale, t],
  )

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
    setTypeQuery('')
  }, [isMenuOpen])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [closeSignal])

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
    <div className="flex w-full min-w-0 flex-1 items-center gap-3 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 shadow-sm transition focus-within:border-emerald-200 sm:min-w-[220px]">
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
            ? field.value.filter(
                (value): value is CourseType =>
                  sortedCourseTypes.includes(value as CourseType),
              )
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
              ref={menuRef}
            >
              <input
                type="text"
                value={typeQuery}
                onChange={(event) => {
                  setTypeQuery(event.target.value)
                  if (!isMenuOpen) {
                    setIsMenuOpen(true)
                  }
                }}
                onFocus={() => setIsMenuOpen(true)}
                placeholder={selectedText}
                className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-500"
                aria-label={t('pages.shkoli.list.filters.typeLabel')}
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
                aria-label={t('pages.shkoli.list.filters.typeLabel')}
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
              <CourseFilterTypeMenu
                isOpen={isMenuOpen}
                panelStyles={panelStyles}
                panelRef={panelRef}
                filteredCourseTypes={filteredCourseTypes}
                selectedTypes={selectedTypes}
                onToggleType={toggleType}
                t={t}
              />
            </div>
          )
        }}
      />
    </div>
  )
}

export default CourseFilterTypeSelect
