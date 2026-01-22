import type { TFunction } from 'i18next'
import { Link } from 'react-router-dom'

import type { LyceumEditSummaryItem } from '../types'

type LyceumEditHeaderProps = {
  backLink: string
  title: string
  subtitle: string
  badgeLabel?: string
  summaryItems: LyceumEditSummaryItem[]
  t: TFunction
}

export const LyceumEditHeader = ({
  backLink,
  title,
  subtitle,
  badgeLabel,
  summaryItems,
  t,
}: LyceumEditHeaderProps) => (
  <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-sm backdrop-blur sm:p-6 lg:p-8">
    <div className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-sky-200/40 blur-3xl" />
    <div className="relative z-10 space-y-4">
      <Link
        to={backLink}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-brand/30 hover:text-brand"
      >
        <svg
          viewBox="0 0 20 20"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12.5 4.5L7 10l5.5 5.5" />
        </svg>
        {t('pages.lyceums.edit.backLink')}
      </Link>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          {badgeLabel ? (
            <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
              {badgeLabel}
            </span>
          ) : null}
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-600">{subtitle}</p>
        </div>
        {summaryItems.length > 0 ? (
          <dl className="grid gap-3 rounded-2xl border border-slate-200/70 bg-white/70 p-4 text-sm shadow-sm sm:grid-cols-3">
            {summaryItems.map((item) => (
              <div key={item.label} className="space-y-1">
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  {item.label}
                </dt>
                <dd className="font-semibold text-slate-900">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </div>
  </div>
)
