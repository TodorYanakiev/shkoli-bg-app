import type { TFunction } from 'i18next'

import type { LyceumResponse } from '../../../../types/lyceums'

type CourseCreateLyceumCardProps = {
  lyceum: LyceumResponse
  t: TFunction
}

export const CourseCreateLyceumCard = ({
  lyceum,
  t,
}: CourseCreateLyceumCardProps) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
      {t('pages.shkoli.create.lyceumLabel')}
    </p>
    <p className="mt-2 text-lg font-semibold text-slate-900">
      {lyceum.name ?? t('pages.shkoli.create.lyceumFallback')}
    </p>
    <p className="mt-1 text-sm text-slate-600">
      {[lyceum.town, lyceum.address].filter(Boolean).join(', ') ||
        t('pages.shkoli.create.lyceumFallback')}
    </p>
  </div>
)
