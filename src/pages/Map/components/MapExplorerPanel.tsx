import { useMemo, useState, type BaseSyntheticEvent } from 'react'
import type { TFunction } from 'i18next'
import type { UseFormReturn } from 'react-hook-form'

import type { AppError } from '../../../types/appError'
import type { CourseFilterFormValues } from '../../Shkoli/validations/courseFilterSchema'
import type {
  MapFilterState,
  MapExplorerItem,
  MapExplorerSummary,
} from '../types'
import MapExplorerAdvancedFiltersModal from './MapExplorerAdvancedFiltersModal'
import MapExplorerResultsList from './MapExplorerResultsList'

type MapExplorerPanelProps = {
  form: UseFormReturn<CourseFilterFormValues>
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void> | void
  onClearFilters: () => void
  isFetching: boolean
  isLoading: boolean
  error: AppError | null
  items: MapExplorerItem[]
  summary: MapExplorerSummary
  selectedLyceumId: number | null
  hoveredLyceumId: number | null
  onHoverLyceum: (lyceumId: number | null) => void
  onSelectLyceum: (lyceumId: number) => void
  locale: string
  searchValue: string
  onSearchValueChange: (value: string) => void
  onApplySearch: () => void
  filtersState: MapFilterState
  showUseCurrentLocation: boolean
  isLocating: boolean
  onUseCurrentLocation: () => void
  onPickLocationOnMap: () => void
  t: TFunction
}

const MapExplorerPanel = ({
  form,
  onSubmit,
  onClearFilters,
  isFetching,
  isLoading,
  error,
  items,
  summary,
  selectedLyceumId,
  hoveredLyceumId,
  onHoverLyceum,
  onSelectLyceum,
  locale,
  searchValue,
  onSearchValueChange,
  onApplySearch,
  filtersState,
  showUseCurrentLocation,
  isLocating,
  onUseCurrentLocation,
  onPickLocationOnMap,
  t,
}: MapExplorerPanelProps) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const activeFiltersCount = useMemo(() => {
    let count = 0
    count += filtersState.courseTypes?.length ?? 0
    count += filtersState.ageGroups?.length ?? 0
    count += filtersState.dayOfWeek?.length ?? 0
    if (filtersState.town) count += 1
    if (filtersState.startTimeFrom) count += 1
    if (filtersState.startTimeTo) count += 1
    if (filtersState.minPrice != null) count += 1
    if (filtersState.maxPrice != null) count += 1
    if (filtersState.courseSort) count += 1
    return count
  }, [filtersState])

  const hasPickedLocation =
    filtersState.referenceLatitude != null &&
    filtersState.referenceLongitude != null

  return (
    <aside className="relative flex h-full min-h-0 w-full flex-col bg-gradient-to-b from-[#edf4ef] via-[#f3f6f3] to-[#eef3ef] px-3 pb-4 pt-4 sm:px-4 lg:w-[min(420px,34vw)] lg:min-w-[360px]">
      <div className="mb-3 px-1">
        <h1 className="text-[2rem] font-semibold leading-tight text-emerald-950">
          {t('pages.map.title')}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {t('pages.map.subtitle')}
        </p>
      </div>

      <div className="mb-3 border-b border-emerald-100/80 px-1 pb-3">
        <div className="relative">
          <svg
            viewBox="0 0 20 20"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <circle cx="9" cy="9" r="6" />
            <path d="M13.5 13.5L18 18" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={searchValue}
            onChange={(event) => onSearchValueChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                onApplySearch()
              }
            }}
            placeholder={t('pages.map.filters.searchPlaceholder')}
            className="w-full rounded-2xl border border-white/90 bg-white/95 py-2.5 pl-9 pr-3 text-sm text-slate-700 shadow-[0_8px_18px_-14px_rgba(15,23,42,0.55)] outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onApplySearch}
            className="rounded-xl bg-emerald-700 px-3 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-16px_rgba(6,95,70,0.85)] transition hover:bg-emerald-800"
          >
            {t('pages.map.filters.apply')}
          </button>
          <button
            type="button"
            onClick={() => setIsFiltersOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white/90 px-3 py-2.5 text-sm font-semibold text-emerald-800 transition hover:border-emerald-300 hover:bg-white"
          >
            <span>{t('pages.shkoli.list.filters.moreFilters')}</span>
            {activeFiltersCount > 0 ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-700 px-1 text-[11px] font-bold text-white">
                {activeFiltersCount}
              </span>
            ) : null}
          </button>
        </div>

        <div
          className={`mt-2 grid gap-2 ${
            showUseCurrentLocation ? 'grid-cols-2' : 'grid-cols-1'
          }`}
        >
          {showUseCurrentLocation ? (
            <button
              type="button"
              onClick={onUseCurrentLocation}
              disabled={isLocating}
              className="rounded-xl border border-emerald-600 bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_-16px_rgba(6,95,70,0.85)] transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLocating
                ? t('pages.map.locationSort.locating')
                : t('pages.map.locationSort.useMyLocation')}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onPickLocationOnMap}
            className="rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold text-emerald-800 transition hover:border-emerald-300"
          >
            {t(
              hasPickedLocation
                ? 'pages.map.locationSort.changeLocation'
                : 'pages.map.locationSort.pickOnMap',
            )}
          </button>
        </div>

        {activeFiltersCount > 0 ? (
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={onClearFilters}
              className="rounded-full px-2 py-1 text-xs font-semibold text-slate-500 transition hover:text-slate-700"
            >
              {t('pages.map.filters.clearAll')}
            </button>
          </div>
        ) : null}
      </div>

      <p className="mb-3 mt-2 px-1 text-sm font-semibold text-slate-700">
        {t('pages.map.results.summary', {
          lyceums: summary.lyceumsCount,
          activities: summary.totalActivities,
        })}
      </p>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <MapExplorerResultsList
          isLoading={isLoading}
          error={error}
          items={items}
          selectedLyceumId={selectedLyceumId}
          hoveredLyceumId={hoveredLyceumId}
          onHoverLyceum={onHoverLyceum}
          onSelectLyceum={onSelectLyceum}
          locale={locale}
          t={t}
        />
      </div>

      <MapExplorerAdvancedFiltersModal
        isOpen={isFiltersOpen}
        form={form}
        onClose={() => setIsFiltersOpen(false)}
        onSubmit={(event) => {
          onSubmit(event)
          setIsFiltersOpen(false)
        }}
        onClear={onClearFilters}
        isFetching={isFetching}
        courseTypes={filtersState.courseTypes}
        ageGroups={filtersState.ageGroups}
        dayOfWeek={filtersState.dayOfWeek}
        town={filtersState.town}
        startTimeFrom={filtersState.startTimeFrom}
        startTimeTo={filtersState.startTimeTo}
        minPrice={filtersState.minPrice}
        maxPrice={filtersState.maxPrice}
        locale={locale}
        t={t}
      />
    </aside>
  )
}

export default MapExplorerPanel
