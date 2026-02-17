import { useEffect, useState, type CSSProperties } from 'react'
import type { TFunction } from 'i18next'
import { Link } from 'react-router-dom'

import {
  getActivityAgeGroupLabel,
  getCourseName,
  formatMapAverageRating,
  getMapLyceumLocation,
} from '../services/mapExplorerFormatters'
import type { MapExplorerItem } from '../types'

type MapExplorerPinDetailsProps = {
  item: MapExplorerItem
  style: CSSProperties
  t: TFunction
  onClose: () => void
}

const hasImage = (value: string | null) => {
  const trimmed = value?.trim()
  return Boolean(trimmed)
}

const MapExplorerPinDetails = ({
  item,
  style,
  t,
  onClose,
}: MapExplorerPinDetailsProps) => {
  const [isImageVisible, setIsImageVisible] = useState(hasImage(item.imageUrl))
  const locationLabel = getMapLyceumLocation(item, t)
  const visibleActivities = item.activities

  const averageRatingLabel =
    item.averageRating != null
      ? t('pages.map.details.ratingLabel', {
          rating: formatMapAverageRating(item.averageRating),
        })
      : t('pages.map.details.ratingEmpty')

  useEffect(() => {
    setIsImageVisible(hasImage(item.imageUrl))
  }, [item.imageUrl])

  return (
    <article
      style={style}
      className="absolute z-[500] flex max-h-[min(520px,calc(100%-2rem))] w-[min(22rem,calc(100%-2rem))] flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/95 shadow-[0_28px_50px_-25px_rgba(15,23,42,0.45)] backdrop-blur"
    >
      <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold shadow-sm backdrop-blur ${
            item.averageRating != null
              ? 'bg-amber-50/95 text-amber-700'
              : 'bg-white/90 text-slate-600'
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
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm transition hover:bg-white hover:text-slate-700"
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

      {isImageVisible && item.imageUrl ? (
        <div className="relative h-36 shrink-0">
          <img
            src={item.imageUrl}
            alt={
              item.imageAlt ??
              t('pages.map.results.card.imageAlt', { name: item.name })
            }
            loading="lazy"
            onError={() => setIsImageVisible(false)}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/65 via-slate-900/20 to-transparent" />
          <h3 className="absolute bottom-3 left-4 right-4 line-clamp-2 text-[1.35rem] font-semibold leading-tight text-white drop-shadow">
            {item.name}
          </h3>
        </div>
      ) : (
        <div className="px-4 pb-2 pt-4">
          <h3 className="line-clamp-2 pr-28 text-[1.35rem] font-semibold leading-tight text-slate-900">
            {item.name}
          </h3>
        </div>
      )}

      <div className="px-4 pb-3 pt-2">
        <p className="flex items-start gap-1.5 text-sm text-slate-500">
          <svg
            viewBox="0 0 20 20"
            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600"
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
          <span className="line-clamp-2">{locationLabel}</span>
        </p>
      </div>

      <div
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain border-y border-slate-100/90 px-4 py-2 touch-pan-y"
        onTouchMove={(event) => event.stopPropagation()}
        onWheel={(event) => event.stopPropagation()}
      >
        <div className="space-y-2 pr-1">
          {visibleActivities.length > 0 ? (
            visibleActivities.map((activity) => (
              typeof activity.id === 'number' ? (
                <Link
                  key={activity.id}
                  to={`/shkoli/${activity.id}`}
                  className="block rounded-xl border border-slate-100 bg-slate-50/75 px-3 py-2 transition hover:border-emerald-200 hover:bg-emerald-50/60"
                >
                  <p className="line-clamp-2 text-[1.02rem] font-semibold leading-snug text-slate-800">
                    {getCourseName(activity, t)}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-sm text-slate-500">
                    {getActivityAgeGroupLabel(activity, t)}
                  </p>
                  <div className="mt-1">
                    {activity.type ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                        {t(`courses.types.${activity.type}`)}
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                        {t('pages.map.results.card.noCategories')}
                      </span>
                    )}
                  </div>
                </Link>
              ) : (
                <div
                  key={`${item.lyceumId}-${activity.name}`}
                  className="rounded-xl border border-slate-100 bg-slate-50/75 px-3 py-2"
                >
                  <p className="line-clamp-2 text-[1.02rem] font-semibold leading-snug text-slate-800">
                    {getCourseName(activity, t)}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-sm text-slate-500">
                    {getActivityAgeGroupLabel(activity, t)}
                  </p>
                  <div className="mt-1">
                    {activity.type ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                        {t(`courses.types.${activity.type}`)}
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                        {t('pages.map.results.card.noCategories')}
                      </span>
                    )}
                  </div>
                </div>
              )
            ))
          ) : (
            <p className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500">
              {t('pages.map.details.noActivities')}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 bg-white/90 px-4 py-3">
        <span className="text-xs font-semibold text-slate-600">
          {t('pages.map.details.activitiesCount', {
            count: item.activityCount,
          })}
        </span>
        <Link
          to={`/lyceums/${item.lyceumId}`}
          className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          {t('pages.map.details.openLyceum')}
        </Link>
      </div>
    </article>
  )
}

export default MapExplorerPinDetails
