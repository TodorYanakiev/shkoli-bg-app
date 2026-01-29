import { useTranslation } from 'react-i18next'

import type { AppError } from '../../../../types/appError'
import type { LyceumResponse } from '../../../../types/lyceums'
import type { AdminLyceumsPagination } from '../types'
import { AdminLyceumCard } from './AdminLyceumCard'
import { AdminLyceumsPaginationControls } from './AdminLyceumsPagination'

type AdminLyceumsGridProps = {
  lyceums: LyceumResponse[]
  isLoading: boolean
  error: AppError | null
  pagination: AdminLyceumsPagination
}

const AdminLyceumsSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={`admin-lyceum-skeleton-${index}`}
        className="flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="h-11 w-11 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-6 w-32 animate-pulse rounded-full bg-slate-200" />
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

export const AdminLyceumsGrid = ({
  lyceums,
  isLoading,
  error,
  pagination,
}: AdminLyceumsGridProps) => {
  const { t } = useTranslation()

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 shadow-sm">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-8 left-10 h-24 w-24 rounded-full bg-brand/10 blur-2xl" />
        <div className="absolute bottom-6 right-8 h-28 w-28 rounded-full bg-emerald-100/80 blur-3xl" />
      </div>
      {isLoading ? (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            {t('pages.admin.lyceums.loading')}
          </p>
          <AdminLyceumsSkeleton />
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
          {t('pages.admin.lyceums.empty')}
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              {t('pages.admin.lyceums.rangeLabel', {
                start: pagination.pageStart,
                end: pagination.pageEnd,
                total: pagination.totalItems,
              })}
            </span>
            <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
              {t('pages.admin.lyceums.countLabel', {
                count: pagination.totalItems,
              })}
            </span>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {lyceums.map((lyceum, index) => (
              <li key={lyceum.id ?? `admin-lyceum-${index}`} className="h-full">
                <AdminLyceumCard lyceum={lyceum} />
              </li>
            ))}
          </ul>
          {pagination.hasMultiplePages ? (
            <AdminLyceumsPaginationControls pagination={pagination} />
          ) : null}
        </div>
      )}
    </div>
  )
}
