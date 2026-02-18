import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import lyceumPlaceholder from '../../../assets/lyceum-placeholder.svg'
import { RatingStars } from '../../../components/ui/RatingStars'
import type { LyceumResponse } from '../../../types/lyceums'
import {
  getPreferredLyceumImage,
  resolveLyceumImageUrl,
} from '../../../utils/lyceumImages'
import { useLyceumCourses } from '../hooks/useLyceumCourses'

type LyceumCardProps = {
  lyceum: LyceumResponse
  compact?: boolean
  className?: string
}

const LyceumCard = ({
  lyceum,
  compact = false,
  className,
}: LyceumCardProps) => {
  const { t } = useTranslation()
  const lyceumName = lyceum.name ?? t('pages.lyceums.list.card.untitled')
  const addressParts = [lyceum.town, lyceum.address].filter(
    (value): value is string => Boolean(value && value.trim().length > 0),
  )
  const addressLabel =
    addressParts.length > 0
      ? addressParts.join(' - ')
      : t('pages.lyceums.list.card.locationFallback')

  const mainImage = getPreferredLyceumImage(lyceum.images, 'MAIN')
  const mainImageUrl =
    resolveLyceumImageUrl(mainImage) ?? lyceumPlaceholder

  const averageRating =
    typeof lyceum.averageRating === 'number' &&
    Number.isFinite(lyceum.averageRating)
      ? lyceum.averageRating
      : null

  const { data: courses, isLoading: isCoursesLoading } = useLyceumCourses(
    lyceum.id,
    { enabled: Boolean(lyceum.id) },
  )
  const coursesCountLabel = isCoursesLoading
    ? t('pages.lyceums.list.card.coursesLoading')
    : t('pages.lyceums.list.card.coursesCount', {
        count: courses?.length ?? 0,
      })

  const cardContent = (
    <article
      className={[
        compact
          ? 'group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-[0_18px_42px_-34px_rgba(15,23,42,0.45)] backdrop-blur transition-transform duration-300 hover:-translate-y-0.5'
          : 'group relative overflow-hidden rounded-[28px] border border-white/70 bg-white/80 shadow-[0_32px_80px_-55px_rgba(15,23,42,0.6)] backdrop-blur transition-transform duration-300 hover:-translate-y-1',
        className ?? '',
      ]
        .join(' ')
        .trim()}
    >
      <div
        className={
          compact
            ? 'relative h-44 overflow-hidden sm:h-48'
            : 'relative h-56 overflow-hidden sm:h-60'
        }
      >
        <img
          src={mainImageUrl}
          alt={
            mainImage?.altText ??
            t('pages.lyceums.list.card.imageAlt', { name: lyceumName })
          }
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={(event) => {
            const target = event.currentTarget
            target.onerror = null
            target.src = lyceumPlaceholder
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
        {lyceum.id ? (
          <span
            className={
              compact
                ? 'absolute left-0 top-0 rounded-br-md px-3 py-1.5 pr-8 text-[10px] font-semibold uppercase tracking-[0.16em] text-white'
                : 'absolute left-0 top-0 rounded-br-md px-4 py-2 pr-10 text-[11px] font-semibold uppercase tracking-[0.2em] text-white'
            }
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(5,150,105,0.95) 0%, rgba(5,150,105,0.95) calc(100% - 2.5rem), rgba(5,150,105,0) 100%)',
            }}
          >
            {coursesCountLabel}
          </span>
        ) : null}
        <div className="absolute bottom-4 left-4 right-4">
          <h3
            className={
              compact
                ? 'line-clamp-2 text-base font-semibold text-white drop-shadow-sm'
                : 'line-clamp-2 text-lg font-semibold text-white drop-shadow-sm'
            }
          >
            {lyceumName}
          </h3>
        </div>
      </div>

      <div
        className={
          compact
            ? 'flex flex-col gap-2 px-3 py-3 sm:flex-row sm:items-center'
            : 'flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center'
        }
      >
        <div className="min-w-0 flex-1">
          <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4 shrink-0 text-emerald-600"
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
            <span className="min-w-0 flex-1 truncate" title={addressLabel}>
              {addressLabel}
            </span>
          </div>
        </div>

        <div
          className={
            compact
              ? 'shrink-0 self-start rounded-full bg-amber-50 px-2.5 py-1 shadow-sm sm:self-auto'
              : 'shrink-0 self-start rounded-full bg-amber-50 px-3 py-1 shadow-sm sm:self-auto'
          }
        >
          {averageRating != null ? (
            <RatingStars
              rating={averageRating}
              max={5}
              ariaLabel={t('pages.lyceums.list.card.ratingLabel', {
                rating: averageRating.toFixed(1),
                max: 5,
              })}
            />
          ) : (
            <span className="whitespace-nowrap text-xs font-semibold text-slate-500">
              {t('pages.lyceums.list.card.ratingEmpty')}
            </span>
          )}
        </div>
      </div>
    </article>
  )

  if (!lyceum.id) {
    return cardContent
  }

  return (
    <Link
      to={`/lyceums/${lyceum.id}`}
      aria-label={t('pages.lyceums.list.card.openLyceum', {
        name: lyceumName,
      })}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2"
    >
      {cardContent}
    </Link>
  )
}

export default LyceumCard
