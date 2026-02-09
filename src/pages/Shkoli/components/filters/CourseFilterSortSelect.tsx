import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Controller, type Control } from 'react-hook-form'
import type { TFunction } from 'i18next'

import type { CourseFilterFormValues } from '../../validations/courseFilterSchema'
import { useDropdownPanelPosition } from '../../hooks/useDropdownPanelPosition'

type CourseFilterSortSelectProps = {
  control: Control<CourseFilterFormValues>
  t: TFunction
  closeSignal: number
}

type SortOption = {
  value: string
  key: string
}

const sortOptions: SortOption[] = [
  { value: '', key: 'default' },
  { value: 'price,asc', key: 'priceAsc' },
  { value: 'price,desc', key: 'priceDesc' },
  { value: 'name,asc', key: 'nameAsc' },
  { value: 'name,desc', key: 'nameDesc' },
]

const CourseFilterSortSelect = ({
  control,
  t,
  closeSignal,
}: CourseFilterSortSelectProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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
    setIsMenuOpen(false)
  }, [closeSignal])

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 shadow-sm">
      <label className="text-xs font-semibold text-slate-600">
        {t('pages.shkoli.list.filters.sortLabel')}
      </label>
      <Controller
        control={control}
        name="sort"
        render={({ field }) => {
          const currentOption =
            sortOptions.find((option) => option.value === field.value) ??
            sortOptions[0]
          const currentLabel = t(
            `pages.shkoli.list.filters.sort.${currentOption.key}`,
          )

          return (
            <div className="relative mt-2 flex items-center gap-2" ref={menuRef}>
              <input
                type="text"
                readOnly
                value={currentLabel}
                onFocus={() => setIsMenuOpen(true)}
                className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none"
                aria-label={t('pages.shkoli.list.filters.sortLabel')}
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
                aria-label={t('pages.shkoli.list.filters.sortLabel')}
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
              {isMenuOpen && panelStyles && typeof document !== 'undefined'
                ? createPortal(
                    <div
                      ref={panelRef}
                      className="fixed z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg"
                      style={{
                        top: panelStyles.top,
                        left: panelStyles.left,
                        width: panelStyles.width,
                      }}
                    >
                      <div
                        className="max-h-56 overflow-y-auto p-2"
                        style={{ maxHeight: panelStyles.maxHeight }}
                      >
                        {sortOptions.map((option) => {
                          const isSelected = option.value === field.value
                          return (
                            <button
                              key={option.key}
                              type="button"
                              onClick={() => {
                                field.onChange(option.value)
                                setIsMenuOpen(false)
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
  )
}

export default CourseFilterSortSelect
