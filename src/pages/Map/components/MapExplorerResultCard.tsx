import type { MapExplorerItem } from '../types'
import {
  formatMapAverageRating,
  getMapLyceumLocation,
} from '../services/mapExplorerFormatters'
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
  const visibleCategories = item.categories.slice(0, 2)
  const hiddenCategoriesCount = Math.max(item.categories.length - 2, 0)
  const averageRatingLabel =
    item.averageRating != null
      ? t('pages.map.results.card.ratingLabel', {
          rating: formatMapAverageRating(item.averageRating),
        })
      : t('pages.map.results.card.ratingEmpty')

  return (
    <button
      type="button"
      onMouseEnter={() => onHoverChange(item.lyceumId)}
      onMouseLeave={() => onHoverChange(null)}
      onFocus={() => onHoverChange(item.lyceumId)}
      onBlur={() => onHoverChange(null)}
      onClick={() => onSelect(item.lyceumId)}
      className={`group w-full rounded-3xl border bg-white/95 p-3 text-left shadow-sm transition ${
        isSelected
          ? 'border-emerald-400 shadow-emerald-200/40'
          : isHovered
            ? 'border-emerald-300 shadow-emerald-100/50'
            : 'border-transparent hover:border-emerald-200'
      }`}
    >
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 min-w-0 flex-1 text-[1.03rem] font-semibold text-slate-900">
            {item.name}
          </h3>
          <span className="inline-flex h-10 min-w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 px-1 text-sm font-bold text-white">
            {item.activityCount}
          </span>
        </div>

        <p className="mt-1 line-clamp-2 text-xs text-slate-500">{locationLabel}</p>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              item.averageRating != null
                ? 'bg-amber-50 text-amber-700'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            <svg
              viewBox="0 0 20 20"
              className={`h-3.5 w-3.5 ${
                item.averageRating != null ? 'text-amber-500' : 'text-slate-400'
              }`}
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M10 1.6l2.46 4.96 5.48.8-3.97 3.86.94 5.46L10 14.86l-4.9 2.57.93-5.46L2.06 7.36l5.48-.8L10 1.6z" />
            </svg>
            <span>{averageRatingLabel}</span>
          </span>

          {item.categories.length > 0 ? (
            visibleCategories.map((category) => (
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

          {hiddenCategoriesCount > 0 ? (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
              +{hiddenCategoriesCount}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  )
}

export default MapExplorerResultCard
