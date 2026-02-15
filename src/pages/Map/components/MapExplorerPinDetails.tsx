import type { CSSProperties } from 'react'
import type { TFunction } from 'i18next'
import { Link } from 'react-router-dom'

import {
  getActivityAgeGroupLabel,
  getActivityScheduleLabel,
  getCourseName,
  getMapLyceumLocation,
} from '../services/mapExplorerFormatters'
import type { MapExplorerItem } from '../types'

type MapExplorerPinDetailsProps = {
  item: MapExplorerItem
  style: CSSProperties
  t: TFunction
  onClose: () => void
}

const MapExplorerPinDetails = ({
  item,
  style,
  t,
  onClose,
}: MapExplorerPinDetailsProps) => {
  const locationLabel = getMapLyceumLocation(item, t)
  const visibleActivities = item.activities.slice(0, 5)

  return (
    <article
      style={style}
      className="absolute z-[500] w-[min(22rem,calc(100%-2rem))] rounded-3xl bg-white/95 p-4 shadow-[0_28px_50px_-25px_rgba(15,23,42,0.45)] backdrop-blur"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-lg font-semibold text-slate-900">
            {item.name}
          </h3>
          <p className="mt-1 text-xs text-slate-500">{locationLabel}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
          aria-label={t('pages.map.details.close')}
        >
          <svg
            viewBox="0 0 20 20"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {item.categories.length > 0 ? (
          item.categories.slice(0, 4).map((category) => (
            <span
              key={`${item.lyceumId}-details-${category}`}
              className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700"
            >
              {t(`courses.types.${category}`)}
            </span>
          ))
        ) : (
          <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500">
            {t('pages.map.results.card.noCategories')}
          </span>
        )}
      </div>

      <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
        {visibleActivities.length > 0 ? (
          visibleActivities.map((activity) => (
            <div
              key={activity.id ?? `${item.lyceumId}-${activity.name}`}
              className="rounded-2xl border border-slate-100 bg-slate-50/70 px-3 py-2"
            >
              <p className="text-sm font-semibold text-slate-800">
                {getCourseName(activity, t)}
              </p>
              <p className="text-xs text-slate-500">
                {getActivityAgeGroupLabel(activity, t)}
              </p>
              <p className="text-xs text-slate-500">
                {getActivityScheduleLabel(activity, t)}
              </p>
            </div>
          ))
        ) : (
          <p className="rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
            {t('pages.map.details.noActivities')}
          </p>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-600">
          {t('pages.map.details.activitiesCount', {
            count: item.activityCount,
          })}
        </span>
        <Link
          to={`/lyceums/${item.lyceumId}`}
          className="rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-800"
        >
          {t('pages.map.details.openLyceum')}
        </Link>
      </div>
    </article>
  )
}

export default MapExplorerPinDetails
