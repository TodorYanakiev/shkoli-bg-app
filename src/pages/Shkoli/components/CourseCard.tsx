import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import courseMainPlaceholder from '../../../assets/course-main-placeholder.svg'
import type { CourseAgeGroup, CourseResponse } from '../../../types/courses'
import {
  getPreferredCourseImage,
  resolveCourseImageUrl,
} from '../../../utils/courseImages'
import { RatingStars } from './RatingStars'
import { useCourseCardLocation } from '../hooks/useCourseCardLocation'

type CourseCardProps = {
  course: CourseResponse
}

const CourseCard = ({ course }: CourseCardProps) => {
  const { t, i18n } = useTranslation()
  const courseName = course.name ?? t('pages.shkoli.list.card.untitled')
  const courseType = course.type
  const ageGroups = (course.ageGroupList ?? []).filter(
    Boolean,
  ) as CourseAgeGroup[]

  const mainImage = getPreferredCourseImage(course.images, 'MAIN')
  const mainImageUrl =
    resolveCourseImageUrl(mainImage) ?? courseMainPlaceholder

  const formatter = useMemo(
    () => new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 0 }),
    [i18n.language],
  )

  const priceLabel =
    course.price != null
      ? `${formatter.format(course.price)} ${t(
          'pages.shkoli.list.card.priceUnit',
        )}`
      : null

  const { resolvedAddress, isLoading: isLyceumLoading } =
    useCourseCardLocation({
      courseAddress: course.address,
      lyceumId: course.lyceumId,
    })

  const addressLabel =
    resolvedAddress ??
    (isLyceumLoading
      ? t('pages.shkoli.list.card.locationLoading')
      : t('pages.shkoli.list.card.locationFallback'))

  const cardContent = (
    <article className="group relative overflow-hidden rounded-[28px] border border-white/70 bg-white/80 shadow-[0_32px_80px_-55px_rgba(15,23,42,0.6)] backdrop-blur transition-transform duration-300 hover:-translate-y-1">
      <div className="relative h-56 overflow-hidden sm:h-60">
        <img
          src={mainImageUrl}
          alt={
            mainImage?.altText ??
            t('pages.shkoli.list.card.imageAlt', { name: courseName })
          }
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={(event) => {
            const target = event.currentTarget
            target.onerror = null
            target.src = courseMainPlaceholder
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
        {courseType ? (
          <span
            className="absolute left-0 top-0 rounded-br-md px-4 py-2 pr-10 text-[11px] font-semibold uppercase tracking-[0.2em] text-white"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(5,150,105,0.95) 0%, rgba(5,150,105,0.95) calc(100% - 2.5rem), rgba(5,150,105,0) 100%)',
            }}
          >
            {t(`courses.types.${courseType}`)}
          </span>
        ) : null}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="line-clamp-1 text-lg font-semibold text-white drop-shadow-sm">
            {courseName}
          </h3>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <div className="min-w-0">
          <div className="flex min-h-[24px] flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-700">
            {priceLabel ? (
              <p className="text-sm font-semibold text-emerald-700">
                {priceLabel}
              </p>
            ) : null}
            {ageGroups.length > 0
              ? ageGroups.slice(0, 2).map((group) => (
                  <span
                    key={group}
                    className="rounded-full bg-slate-100 px-3 py-1"
                  >
                    {t(`courses.ageGroups.${group}`)}
                  </span>
                ))
              : null}
            {ageGroups.length > 2 ? (
              <span className="rounded-full bg-slate-100 px-3 py-1">
                {t('pages.shkoli.list.card.ageMore', {
                  count: ageGroups.length - 2,
                })}
              </span>
            ) : null}
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4 text-emerald-600"
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
            <span className="truncate">{addressLabel}</span>
          </div>
        </div>
        <div className="rounded-full bg-amber-50 px-3 py-1 shadow-sm">
          <RatingStars
            rating={5}
            max={5}
            ariaLabel={t('pages.shkoli.list.card.ratingLabel', {
              rating: 5,
              max: 5,
            })}
          />
        </div>
      </div>
    </article>
  )

  if (!course.id) {
    return cardContent
  }

  return (
    <Link
      to={`/shkoli/${course.id}`}
      aria-label={t('pages.shkoli.list.card.openCourse', {
        name: courseName,
      })}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2"
    >
      {cardContent}
    </Link>
  )
}

export default CourseCard
