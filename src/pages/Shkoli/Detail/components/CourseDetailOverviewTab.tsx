import type { TFunction } from 'i18next'
import type { LyceumResponse } from '../../../../types/lyceums'
import LyceumCard from '../../../Lyceums/components/LyceumCard'
import CourseDetailMiniMap from './CourseDetailMiniMap'
type CourseDetailOverviewTabProps = {
  courseDescription: string
  normalizedAchievements: string | null
  fallbackValue: string
  locationValue: string
  lyceumId?: number
  lyceum?: LyceumResponse
  isLyceumLoading: boolean
  lyceumErrorMessage: string | null
  t: TFunction
}
const getMapLink = ({
  lyceum,
  locationValue,
}: {
  lyceum?: LyceumResponse
  locationValue: string
}) => {
  const hasCoordinates =
    typeof lyceum?.latitude === 'number' &&
    Number.isFinite(lyceum.latitude) &&
    typeof lyceum?.longitude === 'number' &&
    Number.isFinite(lyceum.longitude)
  if (hasCoordinates) {
    return `https://www.google.com/maps/search/?api=1&query=${lyceum.latitude},${lyceum.longitude}`
  }
  if (locationValue.trim().length > 0) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      locationValue,
    )}`
  }
  return '/map'
}
export const CourseDetailOverviewTab = ({
  courseDescription,
  normalizedAchievements,
  fallbackValue,
  locationValue,
  lyceumId,
  lyceum,
  isLyceumLoading,
  lyceumErrorMessage,
  t,
}: CourseDetailOverviewTabProps) => {
  const mapLink = getMapLink({ lyceum, locationValue })
  const achievementLines = (normalizedAchievements ?? '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  const lyceumAddress =
    [lyceum?.town, lyceum?.address].filter(Boolean).join(', ') ||
    locationValue ||
    fallbackValue
  return (
    <div
      id="course-overview"
      className="grid scroll-mt-24 items-start gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]"
    >
      <section className="max-w-[46rem]">
        <h3 className="text-4xl font-semibold text-slate-900">
          {t('pages.shkoli.detail.overview.descriptionTitle')}
        </h3>
        <p className="mt-6 whitespace-pre-line text-xl leading-relaxed text-slate-700">
          {courseDescription}
        </p>
        <div className="mt-9 border-t border-slate-200 pt-6">
          <h4 className="text-2xl font-medium uppercase tracking-wide text-brand">
            {t('pages.shkoli.detail.fields.achievements')}
          </h4>
          {achievementLines.length > 0 ? (
            <ul className="mt-4 space-y-2 text-lg leading-relaxed text-slate-700">
              {achievementLines.map((line, index) => (
                <li key={`${line}-${index}`}>{line}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-base text-slate-600">
              {t('pages.shkoli.detail.achievementsPlaceholder')}
            </p>
          )}
        </div>
      </section>
      <div className="grid items-start gap-4 xl:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <CourseDetailMiniMap
            latitude={lyceum?.latitude}
            longitude={lyceum?.longitude}
            className="aspect-[4/3]"
          />
          <div className="flex items-start justify-between gap-4 border-t border-slate-200 px-4 py-3">
            <p className="text-sm font-medium text-slate-700">
              {lyceumAddress}
            </p>
            <a
              href={mapLink}
              target={mapLink.startsWith('http') ? '_blank' : undefined}
              rel={mapLink.startsWith('http') ? 'noreferrer' : undefined}
              className="text-sm font-medium text-brand underline decoration-brand/30 underline-offset-2 hover:text-brand-dark"
            >
              {t('pages.shkoli.detail.actions.openMap')}
            </a>
          </div>
        </section>
        <section
          id="course-lyceum"
          className="scroll-mt-24 self-start"
        >
          {!lyceumId ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-600">
                {t('pages.shkoli.detail.lyceumPlaceholder')}
              </p>
            </div>
          ) : isLyceumLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-600">
                {t('pages.shkoli.detail.lyceumLoading')}
              </p>
            </div>
          ) : lyceumErrorMessage ? (
            <div
              className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
              role="alert"
            >
              {lyceumErrorMessage}
            </div>
          ) : lyceum ? (
            <LyceumCard lyceum={lyceum} compact className="w-full" />
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-600">
                {t('pages.shkoli.detail.lyceumPlaceholder')}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
