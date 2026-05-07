import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'

import type {
  FeedbackReadFilter,
  FeedbackSortParam,
} from '../../../../types/feedback'
import { useDropdownPanelPosition } from '../../../Shkoli/hooks/useDropdownPanelPosition'
import { adminFeedbackSortOptions } from '../hooks/useAdminFeedbackFilters'
import type { AdminFeedbackFilterState } from '../types'

type AdminFeedbackFiltersProps = {
  state: AdminFeedbackFilterState
  hasActiveFilters: boolean
  isLoading: boolean
  isFetching: boolean
  onFilterChange: (value: FeedbackReadFilter) => void
  onSortChange: (value: FeedbackSortParam) => void
  onClear: () => void
}

const filterOptions: FeedbackReadFilter[] = ['all', 'unread', 'read']

export const AdminFeedbackFilters = ({
  state,
  hasActiveFilters,
  isLoading,
  isFetching,
  onFilterChange,
  onSortChange,
  onClear,
}: AdminFeedbackFiltersProps) => {
  const { t } = useTranslation()
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false)
  const sortInputRef = useRef<HTMLInputElement | null>(null)
  const sortMenuRef = useRef<HTMLDivElement | null>(null)
  const sortPanelRef = useRef<HTMLDivElement | null>(null)
  const sortPanelStyles = useDropdownPanelPosition(
    isSortMenuOpen,
    sortMenuRef,
  )
  const selectedSortLabel = t(`pages.admin.feedback.filters.sort.${state.sort}`)

  useEffect(() => {
    if (!isSortMenuOpen) return

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (sortMenuRef.current?.contains(target)) return
      if (sortPanelRef.current?.contains(target)) return
      setIsSortMenuOpen(false)
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isSortMenuOpen])

  useEffect(() => {
    if (isLoading) {
      setIsSortMenuOpen(false)
    }
  }, [isLoading])

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(240px,0.8fr)_auto] lg:items-end">
        <fieldset className="space-y-2">
          <legend className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t('pages.admin.feedback.filters.statusLabel')}
          </legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {filterOptions.map((option) => {
              const isSelected = state.filter === option
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onFilterChange(option)}
                  disabled={isLoading}
                  className={[
                    'inline-flex h-11 items-center justify-center rounded-xl border px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50',
                    isSelected
                      ? 'border-brand bg-brand text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-brand/40 hover:text-brand',
                  ].join(' ')}
                >
                  {t(`pages.admin.feedback.filters.${option}`)}
                </button>
              )
            })}
          </div>
        </fieldset>

        <div className="space-y-2 text-sm text-slate-700">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t('pages.admin.feedback.filters.sortLabel')}
          </span>
          <div
            className="relative flex h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm transition focus-within:border-brand/60 focus-within:ring-2 focus-within:ring-brand/20"
            ref={sortMenuRef}
          >
            <input
              type="text"
              readOnly
              value={selectedSortLabel}
              onFocus={() => {
                if (!isLoading) {
                  setIsSortMenuOpen(true)
                }
              }}
              disabled={isLoading}
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none disabled:cursor-not-allowed disabled:text-slate-400"
              aria-label={t('pages.admin.feedback.filters.sortLabel')}
              ref={sortInputRef}
            />
            <button
              type="button"
              onClick={() => {
                if (isLoading) return
                setIsSortMenuOpen((prev) => !prev)
                if (!isSortMenuOpen) {
                  sortInputRef.current?.focus()
                }
              }}
              disabled={isLoading}
              className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={t('pages.admin.feedback.filters.sortLabel')}
              aria-expanded={isSortMenuOpen}
            >
              <svg
                viewBox="0 0 20 20"
                className={`h-4 w-4 transition-transform ${
                  isSortMenuOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path
                  d="M5 7l5 5 5-5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {isSortMenuOpen &&
            sortPanelStyles &&
            typeof document !== 'undefined'
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
                      style={{ maxHeight: sortPanelStyles.maxHeight }}
                    >
                      {adminFeedbackSortOptions.map((option) => {
                        const isSelected = option === state.sort
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              onSortChange(option)
                              setIsSortMenuOpen(false)
                            }}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                              isSelected
                                ? 'bg-emerald-50 text-emerald-800'
                                : 'text-slate-700 hover:bg-emerald-50/80'
                            }`}
                          >
                            <span>
                              {t(`pages.admin.feedback.filters.sort.${option}`)}
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
        </div>

        <div className="flex items-center gap-3 lg:justify-end">
          {isFetching ? (
            <span
              className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-brand/30 border-t-brand"
              aria-hidden="true"
            />
          ) : null}
          <button
            type="button"
            onClick={onClear}
            disabled={!hasActiveFilters || isLoading}
            className="h-11 min-w-32 rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm font-semibold text-slate-700 transition hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t('pages.admin.feedback.filters.clear')}
          </button>
        </div>
      </div>
    </div>
  )
}
