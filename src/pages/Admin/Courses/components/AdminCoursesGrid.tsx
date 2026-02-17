import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { AppError } from '../../../../types/appError'
import type { CourseResponse } from '../../../../types/courses'
import { useAdminCourseActions } from '../hooks/useAdminCourseActions'
import type { AdminCoursesPagination } from '../types'
import { AdminCourseCard } from './AdminCourseCard'
import { AdminCourseDeleteModal } from './AdminCourseDeleteModal'
import { AdminCoursesPaginationControls } from './AdminCoursesPagination'

type AdminCoursesGridProps = {
  courses: CourseResponse[]
  isLoading: boolean
  isFetching: boolean
  error: AppError | null
  hasActiveFilters: boolean
  pagination: AdminCoursesPagination
}

const AdminCoursesSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={`admin-course-skeleton-${index}`}
        className="flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="h-6 w-24 animate-pulse rounded-full bg-slate-200" />
          <div className="h-6 w-28 animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
          <div className="h-5 w-48 animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-40 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="space-y-3">
          <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
        </div>
        <div className="h-8 w-36 animate-pulse rounded-full bg-slate-200" />
      </div>
    ))}
  </div>
)

export const AdminCoursesGrid = ({
  courses,
  isLoading,
  isFetching,
  error,
  hasActiveFilters,
  pagination,
}: AdminCoursesGridProps) => {
  const { t } = useTranslation()
  const { onDelete, isDeleting } = useAdminCourseActions()
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number
    name?: string
  } | null>(null)

  const isDeleteSubmitting = deleteTarget
    ? isDeleting(deleteTarget.id)
    : false

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl px-3 py-6 shadow-sm sm:p-6">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-8 left-10 h-24 w-24 rounded-full bg-brand/10 blur-2xl" />
          <div className="absolute bottom-6 right-8 h-28 w-28 rounded-full bg-emerald-100/80 blur-3xl" />
        </div>
        {isLoading ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              {t('pages.admin.courses.loading')}
            </p>
            <AdminCoursesSkeleton />
          </div>
        ) : error ? (
          <div
            className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
            role="alert"
          >
            {t(error.messageKey)}
          </div>
        ) : pagination.totalItems === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-600">
            {hasActiveFilters
              ? t('pages.admin.courses.emptyFiltered')
              : t('pages.admin.courses.empty')}
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                {t('pages.admin.courses.rangeLabel', {
                  start: pagination.pageStart,
                  end: pagination.pageEnd,
                  total: pagination.totalItems,
                })}
              </span>
              <div className="flex items-center gap-2">
                {isFetching ? (
                  <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-brand/30 border-t-brand" />
                ) : null}
                <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                  {t('pages.admin.courses.countLabel', {
                    count: pagination.totalItems,
                  })}
                </span>
              </div>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {courses.map((course, index) => (
                <li key={course.id ?? `admin-course-${index}`} className="h-full">
                  <AdminCourseCard
                    course={course}
                    onRequestDelete={(id, name) => {
                      if (!id) return
                      setDeleteTarget({ id, name })
                    }}
                    isDeleting={isDeleting(course.id)}
                  />
                </li>
              ))}
            </ul>
            {pagination.hasMultiplePages ? (
              <AdminCoursesPaginationControls pagination={pagination} />
            ) : null}
          </div>
        )}
      </div>
      <AdminCourseDeleteModal
        isOpen={Boolean(deleteTarget)}
        courseName={deleteTarget?.name}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return
          const didDelete = await onDelete(deleteTarget.id)
          if (didDelete) {
            setDeleteTarget(null)
          }
        }}
        isSubmitting={isDeleteSubmitting}
      />
    </>
  )
}
