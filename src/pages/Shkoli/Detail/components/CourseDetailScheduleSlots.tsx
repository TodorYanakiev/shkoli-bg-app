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
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {scheduleSlots.map((slot, index) => {
        const badge = getScheduleBadge(slot, fallbackValue, t)
        const startTimeValue = slot.startTime
          ? formatScheduleTime(slot.startTime)
          : null
        const endTimeValue = slot.endTime
          ? formatScheduleTime(slot.endTime)
          : null
        const timeRangeValue =
          startTimeValue && endTimeValue
            ? `${startTimeValue} - ${endTimeValue}`
            : startTimeValue ?? endTimeValue ?? fallbackValue
        const durationValue =
          typeof slot.singleClassDurationMinutes === 'number'
            ? t('pages.shkoli.detail.schedule.minutes', {
                count: slot.singleClassDurationMinutes,
              })
            : fallbackValue

        return (
          <article
            key={`${slot.recurrence}-${index}`}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {badge.label}
            </p>
            <h4 className="mt-1.5 text-xl font-semibold text-slate-900">
              {badge.value}
            </h4>
            <div className="mt-4 space-y-2.5 border-t border-slate-200 pt-3.5">
              <div className="flex items-center justify-between gap-3 text-base">
                <span className="font-medium text-slate-500">
                  {t('pages.shkoli.detail.schedule.time')}
                </span>
                <span className="text-lg font-semibold text-slate-900">
                  {timeRangeValue}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 text-base">
                <span className="font-medium text-slate-500">
                  {t('pages.shkoli.detail.schedule.duration')}
                </span>
                <span className="text-lg font-semibold text-slate-900">
                  {durationValue}
                </span>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
