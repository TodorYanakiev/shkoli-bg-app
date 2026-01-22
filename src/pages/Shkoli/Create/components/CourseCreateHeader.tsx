import type { TFunction } from 'i18next'
import { Link } from 'react-router-dom'

import type { LyceumResponse } from '../../../../types/lyceums'

type CourseCreateHeaderProps = {
  lyceum?: LyceumResponse
  isValidLyceumId: boolean
  lyceumId: number | null
  t: TFunction
}

export const CourseCreateHeader = ({
  lyceum,
  isValidLyceumId,
  lyceumId,
  t,
}: CourseCreateHeaderProps) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">
        {t('pages.shkoli.create.title')}
      </h1>
      <p className="text-sm text-slate-600">
        {lyceum?.name
          ? t('pages.shkoli.create.subtitleWithLyceum', {
              name: lyceum.name,
            })
          : t('pages.shkoli.create.subtitle')}
      </p>
    </div>
    <Link
      to={isValidLyceumId ? `/lyceums/${lyceumId}` : '/shkoli'}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900 sm:w-auto"
    >
      {isValidLyceumId
        ? t('pages.shkoli.create.backLink')
        : t('pages.shkoli.create.backFallback')}
    </Link>
  </div>
)
