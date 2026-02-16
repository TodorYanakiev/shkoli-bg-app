import lyceumPlaceholder from '../../../assets/lyceum-placeholder.svg'
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
        <p
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
        </p>
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
