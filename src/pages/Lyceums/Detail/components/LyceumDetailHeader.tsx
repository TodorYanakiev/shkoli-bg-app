import type { TFunction } from 'i18next'
import { Link } from 'react-router-dom'

type LyceumDetailHeaderProps = {
  title: string
  subtitle: string
  t: TFunction
}

export const LyceumDetailHeader = ({
  title,
  subtitle,
  t,
}: LyceumDetailHeaderProps) => (
  <div className="hidden flex-col gap-3 sm:flex sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
        {title}
      </h1>
      <p className="text-sm text-slate-600">{subtitle}</p>
    </div>
    <Link
      to="/lyceums"
      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900 sm:w-auto"
    >
      <span aria-hidden="true">&larr;</span>
      {t('pages.lyceums.detail.back')}
    </Link>
  </div>
)
