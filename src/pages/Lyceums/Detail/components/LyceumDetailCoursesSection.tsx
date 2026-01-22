import type { TFunction } from 'i18next'

import type { CourseResponse } from '../../../../types/courses'
import LyceumCourseCard from './LyceumCourseCard'
import { CAROUSEL_CARD_STYLE } from '../services/lyceumDetailCarousel'
import type { CarouselState } from '../types'

type LyceumDetailCoursesSectionProps = {
  courses?: CourseResponse[]
  coursesCount: number
  isCoursesLoading: boolean
  coursesErrorMessage: string | null
  courseLecturersById: Map<number, string>
  fallbackValue: string
  carousel: CarouselState
  t: TFunction
}

export const LyceumDetailCoursesSection = ({
  courses,
  coursesCount,
  isCoursesLoading,
  coursesErrorMessage,
  courseLecturersById,
  fallbackValue,
  carousel,
  t,
}: LyceumDetailCoursesSectionProps) => (
  <div
    id="lyceum-courses"
    className="relative scroll-mt-24 overflow-hidden rounded-3xl px-3 py-6 sm:px-5"
  >
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute -top-6 left-8 h-24 w-24 rounded-full bg-brand/10 blur-2xl" />
      <div className="absolute bottom-4 right-6 h-32 w-32 rounded-full bg-emerald-100/80 blur-3xl" />
    </div>
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
          {t('pages.lyceums.detail.sections.courses')}
        </h3>
      </div>
      <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
        {t('pages.lyceums.detail.countLabel', { count: coursesCount })}
      </span>
    </div>
    {isCoursesLoading ? (
      <div className="mt-4 animate-pulse rounded-2xl border border-dashed border-slate-200 bg-white/80 p-4 text-sm text-slate-600 shadow-sm">
        {t('pages.lyceums.detail.coursesLoading')}
      </div>
    ) : coursesErrorMessage ? (
      <div
        className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
        role="alert"
      >
        {coursesErrorMessage}
      </div>
    ) : courses && courses.length > 0 ? (
      <>
        <div className="mt-4 overflow-hidden">
          <ul
            ref={carousel.trackRef}
            className="flex flex-nowrap gap-4 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-reduce:transition-none [--carousel-cols:1] sm:[--carousel-cols:2] lg:[--carousel-cols:4] [--carousel-gap:1rem]"
            style={{ transform: `translateX(-${carousel.offset}px)` }}
          >
            {courses.map((course, index) => {
              const lecturerIds = course.lecturerIds ?? []
              const primaryLecturerId = lecturerIds[0]
              const primaryLecturerName =
                (primaryLecturerId
                  ? courseLecturersById.get(primaryLecturerId)
                  : '') || fallbackValue
              const additionalLecturers = Math.max(
                0,
                lecturerIds.length - 1,
              )

              return (
                <li
                  key={course.id ?? `${course.name ?? 'course'}-${index}`}
                  ref={index === 0 ? carousel.cardRef : undefined}
                  className="h-full flex-none"
                  style={CAROUSEL_CARD_STYLE}
                >
                  <LyceumCourseCard
                    course={course}
                    lecturerName={primaryLecturerName}
                    additionalLecturers={additionalLecturers}
                    fallbackValue={fallbackValue}
                  />
                </li>
              )
            })}
          </ul>
        </div>
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={carousel.onPrev}
            disabled={!carousel.canGoPrev}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/90 p-2 text-slate-600 shadow-sm transition hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={t('pages.lyceums.detail.coursesCarousel.previous')}
            title={t('pages.lyceums.detail.coursesCarousel.previous')}
          >
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M12.5 4.5L7 10l5.5 5.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={carousel.onNext}
            disabled={!carousel.canGoNext}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/90 p-2 text-slate-600 shadow-sm transition hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={t('pages.lyceums.detail.coursesCarousel.next')}
            title={t('pages.lyceums.detail.coursesCarousel.next')}
          >
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M7.5 4.5L13 10l-5.5 5.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </>
    ) : (
      <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white/80 p-4 text-sm text-slate-600 shadow-sm">
        {t('pages.lyceums.detail.coursesPlaceholder')}
      </div>
    )}
  </div>
)
