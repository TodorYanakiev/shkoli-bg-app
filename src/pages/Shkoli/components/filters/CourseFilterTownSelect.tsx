import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Controller, type Control } from 'react-hook-form'
import type { TFunction } from 'i18next'

import { PUBLIC_LYCEUM_TOWNS } from '../../../../constants/lyceums'
import type { CourseFilterFormValues } from '../../validations/courseFilterSchema'
import { useDropdownPanelPosition } from '../../hooks/useDropdownPanelPosition'

type CourseFilterTownSelectProps = {
  control: Control<CourseFilterFormValues>
  t: TFunction
  closeSignal: number
}

const CourseFilterTownSelect = ({
  control,
  t,
  closeSignal,
}: CourseFilterTownSelectProps) => {
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
    <div
      className="flex w-full min-w-0 flex-1 items-center gap-3 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 shadow-sm transition focus-within:border-emerald-200 sm:min-w-[220px]"
      ref={menuRef}
    >
      <svg
        viewBox="0 0 20 20"
        className="h-4 w-4 text-emerald-700"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path
          d="M10 2.5c-2.9 0-5.2 2.2-5.2 5 0 3.5 4.2 8.5 5.2 8.5s5.2-5 5.2-8.5c0-2.8-2.3-5-5.2-5z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="7.5" r="1.8" />
      </svg>
      <Controller
        control={control}
        name="town"
        render={({ field }) => {
          const selectedTown = field.value?.trim() ?? ''

          return (
            <div className="relative flex w-full items-center gap-2">
              <input
                type="text"
                readOnly
                value={selectedTown}
                onFocus={() => setIsMenuOpen(true)}
                placeholder={t('pages.shkoli.list.filters.townPlaceholder')}
                className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-500"
                aria-label={t('pages.shkoli.list.filters.townLabel')}
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
                aria-label={t('pages.shkoli.list.filters.townLabel')}
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
                        <button
                          type="button"
                          onClick={() => {
                            field.onChange('')
                            setIsMenuOpen(false)
                          }}
                          className={`flex w-full items-center justify-between rounded-lg px-2 py-1 text-left text-sm transition ${
                            selectedTown === ''
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'text-slate-700 hover:bg-emerald-50/80'
                          }`}
                        >
                          <span>
                            {t('pages.shkoli.list.filters.townPlaceholder')}
                          </span>
                        </button>
                        {PUBLIC_LYCEUM_TOWNS.map((option) => {
                          const isSelected = option === selectedTown
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => {
                                field.onChange(option)
                                setIsMenuOpen(false)
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
  )
}

export default CourseFilterTownSelect
