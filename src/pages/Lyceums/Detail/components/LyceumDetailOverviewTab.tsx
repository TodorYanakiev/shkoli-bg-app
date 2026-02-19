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
    <section id="lyceum-overview" className="scroll-mt-24">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div>
          <h3 className="text-3xl font-semibold text-slate-900">
            {t('pages.lyceums.detail.sections.overview')}
          </h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {overviewDetails.map((item) => (
              <article
                key={item.label}
                className="rounded-xl border border-slate-200 bg-white p-4"
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
                      className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-brand underline decoration-brand/40 underline-offset-2 hover:text-brand-dark"
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

        <div className="space-y-4">
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="h-64 border-b border-slate-200">
              <CourseDetailMiniMap
                latitude={lyceum?.latitude}
                longitude={lyceum?.longitude}
                className="h-full w-full"
              />
            </div>
            <div className="flex items-center justify-between gap-4 p-4">
              <p className="text-base font-medium text-slate-800">
                {heroLocation || fallbackValue}
              </p>
              {mapLink ? (
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-base font-semibold text-brand underline decoration-brand/40 underline-offset-2 hover:text-brand-dark"
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
