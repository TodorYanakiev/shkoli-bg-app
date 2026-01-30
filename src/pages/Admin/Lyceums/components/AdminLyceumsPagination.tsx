import { useTranslation } from 'react-i18next'

import type { AdminLyceumsPagination } from '../types'

type AdminLyceumsPaginationProps = {
  pagination: AdminLyceumsPagination
}

export const AdminLyceumsPaginationControls = ({
  pagination,
}: AdminLyceumsPaginationProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-between gap-4">
      <button
        type="button"
        onClick={pagination.goToPrev}
        disabled={!pagination.canGoPrev}
        className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
        aria-label={t('pages.admin.lyceums.pagination.previous')}
        title={t('pages.admin.lyceums.pagination.previous')}
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
      <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm">
        {t('pages.admin.lyceums.pagination.page', {
          current: pagination.currentPage,
          total: pagination.totalPages,
        })}
      </span>
      <button
        type="button"
        onClick={pagination.goToNext}
        disabled={!pagination.canGoNext}
        className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
        aria-label={t('pages.admin.lyceums.pagination.next')}
        title={t('pages.admin.lyceums.pagination.next')}
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
  )
}
