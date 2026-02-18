import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Controller, type Control } from 'react-hook-form'
import type { TFunction } from 'i18next'

import { PUBLIC_LYCEUM_TOWNS } from '../../../../constants/lyceums'
import { useDropdownPanelPosition } from '../../hooks/useDropdownPanelPosition'
import type { LyceumFilterFormValues } from '../../validations/lyceumFilterSchema'

type LyceumFilterTownSelectProps = {
  control: Control<LyceumFilterFormValues>
  t: TFunction
  closeSignal: number
}

const LyceumFilterTownSelect = ({
  control,
  t,
  closeSignal,
}: LyceumFilterTownSelectProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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
    <Controller
      control={control}
      name="town"
      render={({ field }) => {
        const selectedTown = field.value?.trim() ?? ''

        return (
          <div className="relative w-full sm:flex-1" ref={menuRef}>
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen((previous) => !previous)
              }}
              className="flex h-12 w-full items-center gap-3 rounded-full border border-slate-200/90 bg-slate-50 px-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] transition hover:border-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 sm:rounded-r-none sm:rounded-l-full"
              aria-label={t('pages.lyceums.list.filters.townLabel')}
              aria-expanded={isMenuOpen}
            >
              <svg
                viewBox="0 0 20 20"
                className="h-5 w-5 shrink-0 text-slate-400"
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

              <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">
                {selectedTown || t('pages.lyceums.list.filters.townPlaceholder')}
              </span>

              <svg
                viewBox="0 0 20 20"
                className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
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
                        <span>{t('pages.lyceums.list.filters.townPlaceholder')}</span>
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
  )
}

export default LyceumFilterTownSelect
