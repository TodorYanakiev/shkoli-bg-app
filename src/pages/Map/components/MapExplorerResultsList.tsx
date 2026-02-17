import { useEffect, useMemo, useState } from 'react'
import type { TFunction } from 'i18next'

import type { AppError } from '../../../types/appError'
import type { MapExplorerItem } from '../types'
import MapExplorerResultCard from './MapExplorerResultCard'

type MapExplorerResultsListProps = {
  isLoading: boolean
  error: AppError | null
  items: MapExplorerItem[]
  selectedLyceumId: number | null
  hoveredLyceumId: number | null
  onHoverLyceum: (lyceumId: number | null) => void
  onSelectLyceum: (lyceumId: number) => void
  locale: string
  t: TFunction
}

const MAP_RESULTS_PAGE_SIZE = 8

const MapExplorerListSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 3 }, (_, index) => (
      <div
        key={`map-card-skeleton-${index}`}
        className="h-28 animate-pulse rounded-3xl bg-white/80 shadow-sm"
      />
    ))}
  </div>
)

const MapExplorerResultsList = ({
  isLoading,
  error,
  items,
  selectedLyceumId,
  hoveredLyceumId,
  onHoverLyceum,
  onSelectLyceum,
  locale,
  t,
}: MapExplorerResultsListProps) => {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(items.length / MAP_RESULTS_PAGE_SIZE)),
    [items.length],
  )

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  useEffect(() => {
    if (selectedLyceumId == null) {
      return
    }

    const selectedIndex = items.findIndex(
      (item) => item.lyceumId === selectedLyceumId,
    )
    if (selectedIndex < 0) {
      return
    }

    const selectedPage = Math.floor(selectedIndex / MAP_RESULTS_PAGE_SIZE) + 1
    setCurrentPage((previousPage) =>
      previousPage === selectedPage ? previousPage : selectedPage,
    )
  }, [selectedLyceumId, items])

  if (isLoading) {
    return <MapExplorerListSkeleton />
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
      >
        {t(error.messageKey)}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white/65 px-4 py-8 text-sm text-slate-600">
        {t('pages.map.states.empty')}
      </div>
    )
  }

  const startIndex = (currentPage - 1) * MAP_RESULTS_PAGE_SIZE
  const pagedItems = items.slice(startIndex, startIndex + MAP_RESULTS_PAGE_SIZE)
  const rangeStart = startIndex + 1
  const rangeEnd = startIndex + pagedItems.length

  return (
    <div>
      <div className="space-y-3">
        {pagedItems.map((item) => (
          <MapExplorerResultCard
            key={item.lyceumId}
            item={item}
            isHovered={item.lyceumId === hoveredLyceumId}
            isSelected={item.lyceumId === selectedLyceumId}
            onHoverChange={onHoverLyceum}
            onSelect={onSelectLyceum}
            locale={locale}
            t={t}
          />
        ))}
      </div>

      {totalPages > 1 ? (
        <div className="mt-3 rounded-2xl border border-white/80 bg-white/70 px-3 py-2">
          <p className="text-[11px] font-medium text-slate-500">
            {t('pages.map.results.pagination.range', {
              from: rangeStart,
              to: rangeEnd,
              total: items.length,
            })}
          </p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t('pages.map.results.pagination.prev')}
            </button>
            <span className="text-xs font-semibold text-slate-700">
              {t('pages.map.results.pagination.page', {
                current: currentPage,
                total: totalPages,
              })}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t('pages.map.results.pagination.next')}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default MapExplorerResultsList
