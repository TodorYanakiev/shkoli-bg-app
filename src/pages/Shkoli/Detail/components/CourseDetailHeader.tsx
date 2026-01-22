import type { TFunction } from 'i18next'
import { Link } from 'react-router-dom'

type CourseDetailHeaderProps = {
  title: string
  subtitle: string
  t: TFunction
}

export const CourseDetailHeader = ({
  title,
  subtitle,
  t,
}: CourseDetailHeaderProps) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="text-sm text-slate-600">{subtitle}</p>
    </div>
    <Link
      to="/shkoli"
      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900 sm:w-auto"
    >
      {t('pages.shkoli.detail.back')}
    </Link>
  </div>
)
