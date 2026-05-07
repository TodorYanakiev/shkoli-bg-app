import type { CSSProperties } from 'react'
import type { TFunction } from 'i18next'

import type { AppError } from '../../../types/appError'
import { scrollToPageTopAfterLayout } from '../../../utils/scrollToPageTop'
import type { PageCourseResponse } from '../types'
import CourseCard from './CourseCard'

type CourseResultsSectionProps = {
  data?: PageCourseResponse
  isLoading: boolean
  isFetching: boolean
  error: AppError | null
  page: number
  pageSize: number
  onNextPage: (nextPage: number) => void
  t: TFunction
}

const CourseCardSkeleton = () => (
  <div className="animate-pulse rounded-[28px] border border-white/60 bg-white/70 shadow-[0_24px_60px_-50px_rgba(15,23,42,0.45)]">
    <div className="h-56 w-full rounded-t-[28px] bg-slate-200/80" />
    <div className="space-y-3 px-4 py-4">
      <div className="h-4 w-2/3 rounded-full bg-slate-200/80" />
      <div className="h-3 w-full rounded-full bg-slate-200/70" />
      <div className="h-3 w-4/5 rounded-full bg-slate-200/70" />
      <div className="flex gap-2">
        <div className="h-6 w-20 rounded-full bg-slate-200/70" />
        <div className="h-6 w-24 rounded-full bg-slate-200/70" />
      </div>
    </div>
  </div>
)

const CourseResultsSection = ({
  data,
  isLoading,
  isFetching,
  error,
  page,
  pageSize,
  onNextPage,
  t,
}: CourseResultsSectionProps) => {
  const courses = data?.content ?? []
  const totalElements = data?.totalElements ?? 0
  const shownCount = data?.numberOfElements ?? courses.length
  const totalPages = data?.totalPages ?? 1
  const canPaginate = !isLoading && !error && totalElements > 0
  const handlePageChange = (nextPage: number) => {
    scrollToPageTopAfterLayout()
    onNextPage(nextPage)
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
            {t('pages.shkoli.list.results.title')}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isFetching && !isLoading ? (
            <span className="inline-flex h-5 w-5 animate-spin items-center justify-center rounded-full border-2 border-emerald-200 border-t-emerald-600" />
          ) : null}
          <span className="rounded-full bg-emerald-100 px-4 py-1 text-[11px] font-semibold text-emerald-800 sm:text-xs">
            {t('pages.shkoli.list.results.totalBadge', {
              total: totalElements,
            })}
          </span>
        </div>
      </div>

      <div>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {Array.from({ length: pageSize }, (_, index) => (
              <CourseCardSkeleton key={`course-skeleton-${index}`} />
            ))}
          </div>
        ) : error ? (
          <div
            className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 shadow-sm"
            role="alert"
          >
            {t(error.messageKey)}
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-slate-200 bg-white/80 px-5 py-6 text-sm text-slate-600 shadow-sm">
            {t('pages.shkoli.list.states.empty')}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {courses.map((course, index) => {
              const style: CSSProperties = {
                animationDelay: `${index * 70}ms`,
              }
              const shouldPrioritizeImage = page === 1 && index === 0
              return (
                <div
                  key={course.id ?? `${course.name ?? 'course'}-${index}`}
                  className="shkoli-fade-up"
                  style={style}
                >
                  <CourseCard
                    course={course}
                    imageLoading={shouldPrioritizeImage ? 'eager' : 'lazy'}
                    imageFetchPriority={
                      shouldPrioritizeImage ? 'high' : 'low'
                    }
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>

      {canPaginate ? (
        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-600 sm:text-xs">
              {t('pages.shkoli.list.pagination.shown', {
                shown: shownCount,
                total: totalElements,
              })}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1 rounded-full border border-white/80 bg-white/90 px-2 py-2 shadow-sm backdrop-blur-md sm:gap-2 sm:px-3">
              <button
                type="button"
                onClick={() => handlePageChange(1)}
                disabled={page <= 1 || isFetching}
                className="rounded-full border border-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-800 transition hover:border-emerald-200 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-[11px]"
              >
                {t('pages.shkoli.list.pagination.first')}
              </button>
              <button
                type="button"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1 || isFetching}
                className="rounded-full border border-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-800 transition hover:border-emerald-200 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-[11px]"
              >
                {t('pages.shkoli.list.pagination.prev')}
              </button>
              <span className="px-2 text-[10px] font-semibold text-slate-700 sm:text-[11px]">
                {t('pages.shkoli.list.pagination.page', {
                  current: page,
                  total: totalPages,
                })}
              </span>
              <button
                type="button"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages || isFetching}
                className="rounded-full border border-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-800 transition hover:border-emerald-200 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-[11px]"
              >
                {t('pages.shkoli.list.pagination.next')}
              </button>
              <button
                type="button"
                onClick={() => handlePageChange(totalPages)}
                disabled={page >= totalPages || isFetching}
                className="rounded-full border border-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-800 transition hover:border-emerald-200 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-[11px]"
              >
                {t('pages.shkoli.list.pagination.last')}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default CourseResultsSection
