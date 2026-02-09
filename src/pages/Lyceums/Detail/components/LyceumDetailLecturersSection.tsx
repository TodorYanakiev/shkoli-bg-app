import type { TFunction } from 'i18next'

import type { UserResponse } from '../../../../types/users'
import { getUserDisplayName } from '../../../../utils/user'
import LyceumLecturerCard from './LyceumLecturerCard'
import { CAROUSEL_CARD_STYLE } from '../services/lyceumDetailCarousel'
import type { CarouselState } from '../types'

type LyceumDetailLecturersSectionProps = {
  lecturers?: UserResponse[]
  lecturersCount: number
  isLecturersLoading: boolean
  lecturersErrorMessage: string | null
  fallbackValue: string
  carousel: CarouselState
  onOpenLecturerReviews?: (lecturer: UserResponse) => void
  t: TFunction
}

export const LyceumDetailLecturersSection = ({
  lecturers,
  lecturersCount,
  isLecturersLoading,
  lecturersErrorMessage,
  fallbackValue,
  carousel,
  onOpenLecturerReviews,
  t,
}: LyceumDetailLecturersSectionProps) => (
  <div
    id="lyceum-lecturers"
    className="scroll-mt-24 rounded-2xl border border-slate-200/60 bg-transparent p-4 shadow-none sm:p-5"
  >
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
          {t('pages.lyceums.detail.sections.lecturers')}
        </h3>
      </div>
      <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
        {t('pages.lyceums.detail.countLabel', { count: lecturersCount })}
      </span>
    </div>
    {isLecturersLoading ? (
      <div className="mt-4 animate-pulse rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-600">
        {t('pages.lyceums.detail.lecturersLoading')}
      </div>
    ) : lecturersErrorMessage ? (
      <div
        className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
        role="alert"
      >
        {lecturersErrorMessage}
      </div>
    ) : lecturers && lecturers.length > 0 ? (
      <>
        <div className="relative mt-4 overflow-hidden rounded-2xl bg-slate-100/60 p-2">
          <div className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -right-8 bottom-0 h-28 w-28 rounded-full bg-sky-200/40 blur-3xl" />
          <ul
            ref={carousel.trackRef}
            className="relative z-10 flex flex-nowrap gap-2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform motion-reduce:transition-none [--carousel-cols:1] sm:[--carousel-cols:2] md:[--carousel-cols:3] lg:[--carousel-cols:5] [--carousel-gap:0.5rem]"
            style={{ transform: `translateX(-${carousel.offset}px)` }}
          >
            {lecturers.map((lecturer, index) => {
              const displayName =
                getUserDisplayName(lecturer) || fallbackValue
              const isLeadingEdge =
                carousel.canGoPrev && index === carousel.startIndex
              const isTrailingEdge =
                carousel.canGoNext &&
                index === carousel.startIndex + carousel.perView - 1
              const edgeClass =
                isLeadingEdge || isTrailingEdge
                  ? 'opacity-80 translate-y-1'
                  : 'opacity-100'
              return (
                <li
                  key={lecturer.id ?? `${displayName}-${index}`}
                  ref={index === 0 ? carousel.cardRef : undefined}
                  className={`h-full flex-none transition-transform transition-opacity duration-300 ${edgeClass}`}
                  style={CAROUSEL_CARD_STYLE}
                >
                  <LyceumLecturerCard
                    lecturer={lecturer}
                    displayName={displayName}
                    fallbackValue={fallbackValue}
                    onOpenReviews={
                      onOpenLecturerReviews
                        ? () => onOpenLecturerReviews(lecturer)
                        : undefined
                    }
                  />
                </li>
              )
            })}
          </ul>
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-6 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-6 bg-gradient-to-l from-white/90 via-white/60 to-transparent" />
        </div>
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={carousel.onPrev}
            disabled={!carousel.canGoPrev}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/90 p-2 text-slate-600 shadow-sm transition hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={t('pages.lyceums.detail.lecturersCarousel.previous')}
            title={t('pages.lyceums.detail.lecturersCarousel.previous')}
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
            aria-label={t('pages.lyceums.detail.lecturersCarousel.next')}
            title={t('pages.lyceums.detail.lecturersCarousel.next')}
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
      <div className="mt-4 rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-600">
        {t('pages.lyceums.detail.lecturersPlaceholder')}
      </div>
    )}
  </div>
)
