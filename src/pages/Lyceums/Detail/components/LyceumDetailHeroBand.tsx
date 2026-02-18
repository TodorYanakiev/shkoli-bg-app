import type { TFunction } from 'i18next'

import placeholderImage from '../../../../assets/lyceum-placeholder.svg'
import { RatingStars } from '../../../../components/ui/RatingStars'
import type { LyceumImageResponse } from '../../../../types/lyceums'

type LyceumDetailHeroBandProps = {
  lyceumName: string
  heroLabel: string
  heroLocation: string
  averageRating?: number | null
  reviewsCount: number
  courseTypeLabels: string[]
  phoneValue: string | null
  emailValue: string | null
  fallbackValue: string
  mainImage?: LyceumImageResponse
  mainImageUrl: string | null
  onOpenReviewsTab: () => void
  className?: string
  t: TFunction
}

export const LyceumDetailHeroBand = ({
  lyceumName,
  heroLabel,
  heroLocation,
  averageRating,
  reviewsCount,
  courseTypeLabels,
  phoneValue,
  emailValue,
  fallbackValue,
  mainImage,
  mainImageUrl,
  onOpenReviewsTab,
  className,
  t,
}: LyceumDetailHeroBandProps) => {
  const hasRating =
    typeof averageRating === 'number' && Number.isFinite(averageRating)
  const hasLocation = heroLocation.trim().length > 0
  const normalizedPhone = phoneValue?.trim() ? phoneValue.trim() : null
  const normalizedEmail = emailValue?.trim() ? emailValue.trim() : null
  const phoneHref = normalizedPhone
    ? `tel:${normalizedPhone.replace(/\s+/g, '')}`
    : null
  const emailHref = normalizedEmail ? `mailto:${normalizedEmail}` : null

  return (
    <section
      className={['min-h-0 overflow-hidden bg-white', className ?? '']
        .join(' ')
        .trim()}
    >
      <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)] gap-0 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] xl:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
        <div className="flex min-h-0 min-w-0 items-start overflow-hidden px-8 py-7 lg:px-9 lg:pb-8 lg:pt-9">
          <div className="max-w-[34rem] overflow-hidden">
            <div className="space-y-1">
              <h1 className="line-clamp-2 text-4xl font-semibold leading-[1.08] text-slate-900">
                {lyceumName}
              </h1>
              <p className="text-xl font-medium uppercase tracking-[0.01em] text-slate-500">
                {heroLabel}
              </p>
              <p className="text-lg text-slate-600">
                {hasLocation ? heroLocation : t('pages.lyceums.detail.notProvided')}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2.5 text-sm text-slate-600">
              <RatingStars
                rating={hasRating ? averageRating : 0}
                showValue={false}
                className={hasRating ? '' : 'opacity-50'}
                ariaLabel={t('pages.lyceums.detail.averageRatingLabel', {
                  rating: hasRating ? averageRating.toFixed(1) : '0.0',
                  max: 5,
                })}
              />
              <span
                className={`font-semibold ${
                  hasRating ? 'text-amber-600' : 'text-slate-500'
                }`}
              >
                {hasRating ? averageRating.toFixed(1) : '0.0'}
              </span>
              <button
                type="button"
                onClick={onOpenReviewsTab}
                className="font-medium text-slate-600 underline decoration-slate-300 underline-offset-2 transition hover:text-slate-900 hover:decoration-slate-500"
              >
                {t('pages.shkoli.detail.reviewCount', { count: reviewsCount })}
              </button>
            </div>

            {courseTypeLabels.length > 0 ? (
              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                {courseTypeLabels.map((courseTypeLabel) => (
                  <span
                    key={courseTypeLabel}
                    className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700"
                  >
                    {courseTypeLabel}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-6 grid max-w-[30rem] gap-3 text-base text-slate-700">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {t('pages.lyceums.detail.fields.phone')}
                </p>
                {phoneHref ? (
                  <a
                    href={phoneHref}
                    className="mt-1 block truncate text-base font-medium text-brand underline decoration-brand/40 underline-offset-2 hover:text-brand-dark"
                    title={normalizedPhone ?? undefined}
                  >
                    {normalizedPhone}
                  </a>
                ) : (
                  <p className="mt-1 truncate text-base font-medium text-slate-700">
                    {fallbackValue}
                  </p>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {t('pages.lyceums.detail.fields.email')}
                </p>
                {emailHref ? (
                  <a
                    href={emailHref}
                    className="mt-1 block truncate text-base font-medium text-brand underline decoration-brand/40 underline-offset-2 hover:text-brand-dark"
                    title={normalizedEmail ?? undefined}
                  >
                    {normalizedEmail}
                  </a>
                ) : (
                  <p className="mt-1 truncate text-base font-medium text-slate-700">
                    {fallbackValue}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="relative h-full min-h-[240px]">
          <img
            src={mainImageUrl ?? placeholderImage}
            alt={
              mainImage?.altText ??
              t('pages.lyceums.detail.images.mainAlt', {
                name: lyceumName,
              })
            }
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(event) => {
              const target = event.currentTarget
              target.onerror = null
              target.src = placeholderImage
            }}
          />
        </div>
      </div>
    </section>
  )
}
