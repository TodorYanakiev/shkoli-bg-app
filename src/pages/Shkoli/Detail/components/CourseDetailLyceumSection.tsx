import type { TFunction } from 'i18next'
import { Link } from 'react-router-dom'

import type { LyceumResponse } from '../../../../types/lyceums'

type CourseDetailLyceumSectionProps = {
  lyceumId?: number
  lyceum?: LyceumResponse
  isLyceumLoading: boolean
  lyceumErrorMessage: string | null
  fallbackValue: string
  t: TFunction
}

export const CourseDetailLyceumSection = ({
  lyceumId,
  lyceum,
  isLyceumLoading,
  lyceumErrorMessage,
  fallbackValue,
  t,
}: CourseDetailLyceumSectionProps) => (
  <div
    id="course-lyceum"
    className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
  >
    <h3 className="text-sm font-semibold text-slate-900">
      {t('pages.shkoli.detail.sections.lyceum')}
    </h3>
    {!lyceumId ? (
      <p className="mt-3 text-sm text-slate-600">
        {t('pages.shkoli.detail.lyceumPlaceholder')}
      </p>
    ) : isLyceumLoading ? (
      <p className="mt-3 text-sm text-slate-600">
        {t('pages.shkoli.detail.lyceumLoading')}
      </p>
    ) : lyceumErrorMessage ? (
      <div
        className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
        role="alert"
      >
        {lyceumErrorMessage}
      </div>
    ) : lyceum ? (
      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
        <p className="text-sm font-semibold text-slate-900">
          {lyceum.name ?? fallbackValue}
        </p>
        <p className="mt-1 text-xs text-slate-600">
          {[lyceum.town, lyceum.address].filter(Boolean).join(', ') ||
            fallbackValue}
        </p>
        <Link
          to={`/lyceums/${lyceumId}`}
          className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-brand transition hover:text-brand-dark"
        >
          {t('pages.shkoli.detail.actions.openLyceum')}
        </Link>
      </div>
    ) : (
      <p className="mt-3 text-sm text-slate-600">
        {t('pages.shkoli.detail.lyceumPlaceholder')}
      </p>
    )}
  </div>
)
