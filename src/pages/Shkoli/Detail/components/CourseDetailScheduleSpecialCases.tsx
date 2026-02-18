import type { TFunction } from 'i18next'

import type { CourseScheduleSpecialCase } from '../../../../types/courses'
import {
  formatScheduleDate,
  getSpecialCaseStatus,
} from '../services/courseDetailFormatters'

type CourseDetailScheduleSpecialCasesProps = {
  scheduleSpecialCases: CourseScheduleSpecialCase[]
  locale: string
  t: TFunction
}

export const CourseDetailScheduleSpecialCases = ({
  scheduleSpecialCases,
  locale,
  t,
}: CourseDetailScheduleSpecialCasesProps) => {
  if (scheduleSpecialCases.length === 0) {
    return null
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {t('pages.shkoli.detail.schedule.specialCases')}
      </p>
      <p className="mt-1 text-xs text-slate-500">
        {t('pages.shkoli.detail.schedule.specialCasesHelp')}
      </p>
      <ul className="mt-4 space-y-2 text-sm text-slate-700">
        {scheduleSpecialCases.map((entry, index) => (
          <li
            key={`${entry.date}-${index}`}
            className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
              entry.cancelled
                ? 'border-rose-200 bg-rose-50'
                : 'border-emerald-200 bg-emerald-50/70'
            }`}
          >
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {formatScheduleDate(entry.date, locale)}
              </p>
              {entry.reason ? (
                <p className="mt-1 text-xs text-slate-600">
                  {t('pages.shkoli.detail.schedule.reason')}: {entry.reason}
                </p>
              ) : null}
            </div>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                entry.cancelled
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {getSpecialCaseStatus(entry, t)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
