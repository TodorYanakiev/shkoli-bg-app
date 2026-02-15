import lyceumPlaceholder from '../../../assets/lyceum-placeholder.svg'
import type { MapExplorerItem } from '../types'
import { getMapLyceumLocation } from '../services/mapExplorerFormatters'
import type { TFunction } from 'i18next'

type MapExplorerResultCardProps = {
  item: MapExplorerItem
  isHovered: boolean
  isSelected: boolean
  onHoverChange: (lyceumId: number | null) => void
  onSelect: (lyceumId: number) => void
  t: TFunction
}

const MapExplorerResultCard = ({
  item,
  isHovered,
  isSelected,
  onHoverChange,
  onSelect,
  t,
}: MapExplorerResultCardProps) => {
  const locationLabel = getMapLyceumLocation(item, t)

  return (
    <button
      type="button"
      onMouseEnter={() => onHoverChange(item.lyceumId)}
      onMouseLeave={() => onHoverChange(null)}
      onFocus={() => onHoverChange(item.lyceumId)}
      onBlur={() => onHoverChange(null)}
      onClick={() => onSelect(item.lyceumId)}
      className={`group flex w-full items-start gap-3 rounded-3xl border bg-white p-3 text-left shadow-sm transition ${
        isSelected
          ? 'border-emerald-400 shadow-emerald-200/40'
          : isHovered
            ? 'border-emerald-300 shadow-emerald-100/50'
            : 'border-transparent hover:border-emerald-200'
      }`}
    >
      <img
        src={item.imageUrl ?? lyceumPlaceholder}
        alt={
          item.imageAlt ??
          t('pages.map.results.card.imageAlt', { name: item.name })
        }
        className="h-20 w-20 shrink-0 rounded-2xl object-cover"
        loading="lazy"
        onError={(event) => {
          const image = event.currentTarget
          image.onerror = null
          image.src = lyceumPlaceholder
        }}
      />

      <div className="min-w-0 flex-1 space-y-2">
        <h3 className="line-clamp-2 text-base font-semibold text-slate-900">
          {item.name}
        </h3>
        <p className="line-clamp-2 text-xs text-slate-500">{locationLabel}</p>
        <div className="flex flex-wrap gap-1">
          {item.categories.length > 0 ? (
            item.categories.slice(0, 3).map((category) => (
              <span
                key={`${item.lyceumId}-${category}`}
                className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700"
              >
                {t(`courses.types.${category}`)}
              </span>
            ))
          ) : (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
              {t('pages.map.results.card.noCategories')}
            </span>
          )}
        </div>
      </div>

      <span className="ml-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
        {item.activityCount}
      </span>
    </button>
  )
}

export default MapExplorerResultCard