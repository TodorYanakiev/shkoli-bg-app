import { useEffect, useRef, useState } from 'react'
import type { TFunction } from 'i18next'

import type { CourseImageResponse } from '../../../../types/courses'
import { RatingStars } from '../../../../components/ui/RatingStars'
import courseMainPlaceholder from '../../../../assets/course-main-placeholder.svg'

type CourseDetailHeroBandProps = {
  courseName: string
  courseTypeLabel: string
  hasCourseType: boolean
  averageRating?: number | null
  reviewsCount: number
  ageGroups: string[]
  description: string
  pricePrimary: string
  priceSecondary?: string | null
  mainImage?: CourseImageResponse
  mainImageUrl: string
  onOpenReviewsTab: () => void
  onOpenOverviewTab: () => void
  className?: string
  t: TFunction
}

export const CourseDetailHeroBand = ({
  courseName,
  courseTypeLabel,
  hasCourseType,
  averageRating,
  reviewsCount,
  ageGroups,
  description,
  pricePrimary,
  priceSecondary,
  mainImage,
  mainImageUrl,
  onOpenReviewsTab,
  onOpenOverviewTab,
  className,
  t,
}: CourseDetailHeroBandProps) => {
  const hasRating =
    typeof averageRating === 'number' && Number.isFinite(averageRating)
  const hasPriceData =
    pricePrimary !== t('pages.shkoli.detail.notProvided') ||
    Boolean(priceSecondary)
  const maxVisibleLines = hasPriceData ? 11 : 15
  const descriptionLength = description.trim().length
  const isLikelyLongDescription = hasPriceData
    ? descriptionLength > 260
    : descriptionLength > 360
  const descriptionRef = useRef<HTMLParagraphElement | null>(null)
  const [isDescriptionTruncated, setIsDescriptionTruncated] = useState(false)
  const shouldShowMoreLink = isDescriptionTruncated || isLikelyLongDescription

  useEffect(() => {
    const descriptionElement = descriptionRef.current
    if (!descriptionElement) return

    const checkOverflow = () => {
      const hasOverflow =
        descriptionElement.scrollHeight > descriptionElement.clientHeight + 1
      setIsDescriptionTruncated(hasOverflow)
    }

    checkOverflow()

    if (typeof ResizeObserver === 'undefined') {
      return
    }

    const observer = new ResizeObserver(() => {
      checkOverflow()
    })
    observer.observe(descriptionElement)

    return () => {
      observer.disconnect()
    }
  }, [description, hasPriceData])

  return (
    <section
      className={['min-h-0 overflow-hidden bg-white', className ?? '']
        .join(' ')
        .trim()}
    >
      <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)] gap-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="flex min-h-0 min-w-0 items-start overflow-hidden px-8 py-7 lg:px-9 lg:pb-8 lg:pt-9">
          <div className="flex h-full min-h-0 max-w-[32rem] flex-col overflow-hidden">
            <div className="space-y-1">
              <h1 className="line-clamp-2 text-4xl font-semibold leading-[1.08] text-slate-900">
                {courseName}
              </h1>
              <p className="text-xl font-medium uppercase tracking-[0.01em] text-slate-500">
                {courseTypeLabel}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2.5 text-sm text-slate-600">
              <RatingStars
                rating={averageRating ?? 0}
                showValue={false}
                ariaLabel={
                  hasRating
                    ? t('pages.shkoli.detail.averageRatingLabel', {
                        rating: averageRating.toFixed(1),
                        max: 5,
                      })
                    : t('pages.shkoli.detail.noRating')
                }
                className={hasRating ? undefined : 'opacity-60'}
              />
              <span className="font-semibold text-amber-600">
                {hasRating
                  ? averageRating.toFixed(1)
                  : t('pages.shkoli.detail.noRating')}
              </span>
              <button
                type="button"
                onClick={onOpenReviewsTab}
                className="font-medium text-slate-600 underline decoration-slate-300 underline-offset-2 hover:text-slate-900"
              >
                {t('pages.shkoli.detail.reviewCount', { count: reviewsCount })}
              </button>
            </div>

            {hasCourseType || ageGroups.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {hasCourseType ? (
                  <span className="inline-flex items-center rounded-full bg-brand/12 px-3 py-1 text-sm font-medium text-brand">
                    {courseTypeLabel}
                  </span>
                ) : null}
                {ageGroups.map((group) => (
                  <span
                    key={group}
                    className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700"
                  >
                    {t(`courses.ageGroups.${group}`)}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-5 min-h-0 flex flex-1 flex-col">
              <p
                ref={descriptionRef}
                className="min-h-0 max-w-[30rem] flex-1 overflow-hidden text-ellipsis text-lg leading-relaxed text-slate-700 [display:-webkit-box] [-webkit-box-orient:vertical]"
                style={{
                  WebkitLineClamp: maxVisibleLines,
                }}
              >
                {description}
              </p>
              {shouldShowMoreLink ? (
                <button
                  type="button"
                  onClick={onOpenOverviewTab}
                  className="mt-2 inline-flex shrink-0 items-center text-sm font-medium text-brand underline decoration-brand/40 underline-offset-2 hover:text-brand-dark"
                >
                  {t('pages.shkoli.detail.actions.seeMore')}
                </button>
              ) : null}
            </div>

            {hasPriceData ? (
              <p className="mt-4 inline-flex self-start items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
                <span className="font-semibold text-slate-900">
                  {pricePrimary}
                </span>
                {priceSecondary ? (
                  <>
                    <span aria-hidden="true" className="text-slate-400">
                      |
                    </span>
                    <span>{priceSecondary}</span>
                  </>
                ) : null}
              </p>
            ) : null}
          </div>
        </div>

        <div className="relative min-h-[240px] h-full">
          <img
            src={mainImageUrl}
            alt={
              mainImage?.altText ??
              t('pages.shkoli.detail.images.mainAlt', {
                name: courseName,
              })
            }
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(event) => {
              const target = event.currentTarget
              target.onerror = null
              target.src = courseMainPlaceholder
            }}
          />
        </div>
      </div>
    </section>
  )
}
