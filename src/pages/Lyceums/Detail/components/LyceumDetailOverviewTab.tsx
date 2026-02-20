import type { TFunction } from 'i18next'

import type { LyceumResponse } from '../../../../types/lyceums'
import CourseDetailMiniMap from '../../../Shkoli/Detail/components/CourseDetailMiniMap'
import type { OverviewDetail } from '../types'

type LyceumDetailOverviewTabProps = {
  lyceum?: LyceumResponse
  heroLocation: string
  fallbackValue: string
  overviewDetails: OverviewDetail[]
  t: TFunction
}

const buildMapLink = (
  latitude?: number,
  longitude?: number,
  locationText?: string,
) => {
  const hasCoordinates =
    typeof latitude === 'number' &&
    Number.isFinite(latitude) &&
    typeof longitude === 'number' &&
    Number.isFinite(longitude)

  if (hasCoordinates) {
    return `https://www.google.com/maps?q=${latitude},${longitude}`
  }

  if (!locationText) {
    return null
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationText)}`
}

export const LyceumDetailOverviewTab = ({
  lyceum,
  heroLocation,
  fallbackValue,
  overviewDetails,
  t,
}: LyceumDetailOverviewTabProps) => {
  const mapLink = buildMapLink(
    lyceum?.latitude,
    lyceum?.longitude,
    heroLocation,
  )

  return (
    <section id="lyceum-overview" className="scroll-mt-24 overflow-x-hidden">
      <div className="grid gap-6 lg:gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="min-w-0">
          <h3 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            {t('pages.lyceums.detail.sections.overview')}
          </h3>
          <div className="mt-4 grid gap-4 sm:mt-6 md:grid-cols-2">
            {overviewDetails.map((item) => (
              <article
                key={item.label}
                className="min-w-0 rounded-xl border border-slate-200 bg-white p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {item.label}
                </p>
                <p className="mt-1 min-w-0 text-base font-medium text-slate-900">
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="block max-w-full break-all text-brand underline decoration-brand/40 underline-offset-2 hover:text-brand-dark sm:overflow-hidden sm:text-ellipsis sm:whitespace-nowrap"
                      title={item.value}
                    >
                      {item.value}
                    </a>
                  ) : (
                    item.value
                  )}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="min-w-0 space-y-4">
          <article className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="h-64 min-w-0 border-b border-slate-200">
              <CourseDetailMiniMap
                latitude={lyceum?.latitude}
                longitude={lyceum?.longitude}
                className="h-full w-full"
              />
            </div>
            <div className="flex flex-col items-start gap-2 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <p className="min-w-0 break-words text-sm font-medium text-slate-800 sm:text-base">
                {heroLocation || fallbackValue}
              </p>
              {mapLink ? (
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 text-sm font-semibold text-brand underline decoration-brand/40 underline-offset-2 hover:text-brand-dark sm:text-base"
                >
                  {t('pages.lyceums.detail.actions.openMap')}
                </a>
              ) : null}
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
