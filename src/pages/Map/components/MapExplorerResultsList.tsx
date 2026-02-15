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
  t: TFunction
}

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
  t,
}: MapExplorerResultsListProps) => {
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

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <MapExplorerResultCard
          key={item.lyceumId}
          item={item}
          isHovered={item.lyceumId === hoveredLyceumId}
          isSelected={item.lyceumId === selectedLyceumId}
          onHoverChange={onHoverLyceum}
          onSelect={onSelectLyceum}
          t={t}
        />
      ))}
    </div>
  )
}

export default MapExplorerResultsList