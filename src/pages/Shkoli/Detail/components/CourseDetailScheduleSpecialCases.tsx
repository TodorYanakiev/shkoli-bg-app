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
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {t('pages.shkoli.detail.schedule.specialCases')}
      </p>
      <p className="mt-1 text-xs text-slate-500">
        {t('pages.shkoli.detail.schedule.specialCasesHelp')}
      </p>
      <ul className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
        {scheduleSpecialCases.map((entry, index) => (
          <li
            key={`${entry.date}-${index}`}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
          >
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div
                className={`h-1.5 ${
                  entry.cancelled ? 'bg-rose-200' : 'bg-emerald-200'
                }`}
              />
              <div className="px-3 py-2 text-center">
                <p className="text-sm font-semibold text-slate-900">
                  {formatScheduleDate(entry.date, locale)}
                </p>
              </div>
            </div>
            <div className="flex-1">
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                  entry.cancelled
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {getSpecialCaseStatus(entry, t)}
              </span>
              {entry.reason ? (
                <p className="mt-2 text-xs text-slate-500">
                  {t('pages.shkoli.detail.schedule.reason')}: {entry.reason}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
