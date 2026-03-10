import type { TFunction } from 'i18next'

import courseMainPlaceholder from '../../../../assets/course-main-placeholder.svg'
import type { CourseImageResponse } from '../../../../types/courses'
import type { CourseDetailValue } from '../types'

type CourseDetailOverviewSectionProps = {
  courseName: string
  courseTypeLabel: string
  showCourseTypeBadge: boolean
  courseDescription: string
  ageGroups: string[]
  courseDetails: CourseDetailValue[]
  normalizedAchievements: string | null
  normalizedWebsiteLink: string | null
  normalizedFacebookLink: string | null
  mainImage?: CourseImageResponse
  mainImageUrl: string
  t: TFunction
}

export const CourseDetailOverviewSection = ({
  courseName,
  courseTypeLabel,
  showCourseTypeBadge,
  courseDescription,
  ageGroups,
  courseDetails,
  normalizedAchievements,
  normalizedWebsiteLink,
  normalizedFacebookLink,
  mainImage,
  mainImageUrl,
  t,
}: CourseDetailOverviewSectionProps) => (
  <div
    id="course-overview"
    className="scroll-mt-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
  >
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">
              {t('pages.shkoli.detail.heroLabel')}
            </p>
            <h2 className="text-xl font-semibold text-slate-900">
              {courseName}
            </h2>
            <p className="text-sm text-slate-600">{courseTypeLabel}</p>
          </div>
        </div>
        {showCourseTypeBadge || ageGroups.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {showCourseTypeBadge ? (
              <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                {courseTypeLabel}
              </span>
            ) : null}
            {ageGroups.map((group) => (
              <span
                key={group}
                className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
              >
                {t(`courses.ageGroups.${group}`)}
              </span>
            ))}
          </div>
        ) : null}
        <p className="mt-4 text-sm text-slate-600">{courseDescription}</p>
        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          {courseDetails.map((detail) => (
            <div key={detail.label} className="space-y-1">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {detail.label}
              </dt>
              <dd className="font-medium text-slate-900">
                {detail.value}
              </dd>
            </div>
          ))}
          {normalizedAchievements ? (
            <div className="space-y-1 sm:col-span-2">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {t('pages.shkoli.detail.fields.achievements')}
              </dt>
              <dd className="font-medium text-slate-900">
                {normalizedAchievements}
              </dd>
            </div>
          ) : null}
          {normalizedWebsiteLink ? (
            <div className="space-y-1 sm:col-span-2">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {t('pages.shkoli.detail.fields.website')}
              </dt>
              <dd className="font-medium text-slate-900">
                <a
                  href={normalizedWebsiteLink}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all text-brand underline hover:text-brand-dark"
                >
                  {normalizedWebsiteLink}
                </a>
              </dd>
            </div>
          ) : null}
          {normalizedFacebookLink ? (
            <div className="space-y-1 sm:col-span-2">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {t('pages.shkoli.detail.fields.facebook')}
              </dt>
              <dd className="font-medium text-slate-900">
                <a
                  href={normalizedFacebookLink}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all text-brand underline hover:text-brand-dark"
                >
                  {normalizedFacebookLink}
                </a>
              </dd>
            </div>
          ) : null}
        </dl>
      </div>
      <div className="relative">
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
  </div>
)
