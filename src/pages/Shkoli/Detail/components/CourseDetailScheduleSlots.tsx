import type { TFunction } from 'i18next'

import type { CourseScheduleSlot } from '../../../../types/courses'
import {
  formatScheduleTime,
  getScheduleBadge,
} from '../services/courseDetailFormatters'

type CourseDetailScheduleSlotsProps = {
  scheduleSlots: CourseScheduleSlot[]
  fallbackValue: string
  t: TFunction
}

export const CourseDetailScheduleSlots = ({
  scheduleSlots,
  fallbackValue,
  t,
}: CourseDetailScheduleSlotsProps) => {
  if (scheduleSlots.length === 0) {
    return null
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {scheduleSlots.map((slot, index) => {
        const badge = getScheduleBadge(slot, fallbackValue, t)
        const metaItems = [
          badge.kind !== 'dayOfWeek' && slot.dayOfWeek
            ? {
                label: t('pages.shkoli.detail.schedule.dayOfWeek'),
                value: t(`courses.daysOfWeek.${slot.dayOfWeek}`),
              }
            : null,
          badge.kind !== 'dayOfMonth' &&
          typeof slot.dayOfMonth === 'number'
            ? {
                label: t('pages.shkoli.detail.schedule.dayOfMonth'),
                value: String(slot.dayOfMonth),
              }
            : null,
        ].filter(Boolean) as Array<{ label: string; value: string }>
        const startTimeValue = slot.startTime
          ? formatScheduleTime(slot.startTime)
          : null
        const durationValue =
          typeof slot.singleClassDurationMinutes === 'number'
            ? t('pages.shkoli.detail.schedule.minutes', {
                count: slot.singleClassDurationMinutes,
              })
            : null
        const hasLeftColumn = Boolean(startTimeValue || durationValue)
        const hasMetaItems = metaItems.length > 0
        return (
          <div
            key={`${slot.recurrence}-${index}`}
            className="w-full max-w-full rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 p-3 shadow-sm sm:w-fit sm:justify-self-start sm:p-4"
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="h-1.5 bg-brand/20" />
                  <div className="px-3 py-2 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      {badge.label}
                    </p>
                    <p className="text-base font-semibold text-slate-900">
                      {badge.value}
                    </p>
                  </div>
                </div>
              </div>
              {hasLeftColumn || hasMetaItems ? (
                <div className="flex flex-wrap gap-2">
                  {hasLeftColumn ? (
                    <div className="flex flex-col gap-2">
                      {startTimeValue ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                          <span className="text-slate-400">
                            {t('pages.shkoli.detail.schedule.startTime')}
                          </span>
                          <span className="font-semibold text-slate-900">
                            {startTimeValue}
                          </span>
                        </span>
                      ) : null}
                      {durationValue ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                          <span className="text-slate-400">
                            {t('pages.shkoli.detail.schedule.duration')}
                          </span>
                          <span className="font-semibold text-slate-900">
                            {durationValue}
                          </span>
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                  {hasMetaItems ? (
                    <div className="flex flex-wrap gap-2">
                      {metaItems.map((item) => (
                        <span
                          key={`${item.label}-${item.value}`}
                          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600"
                        >
                          <span className="text-slate-400">
                            {item.label}
                          </span>
                          <span className="font-semibold text-slate-900">
                            {item.value}
                          </span>
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm text-slate-600">{fallbackValue}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
