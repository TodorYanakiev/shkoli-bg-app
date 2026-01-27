import type { TFunction } from 'i18next'
import type {
  FieldErrors,
  UseFieldArrayReturn,
  UseFormRegister,
} from 'react-hook-form'

import {
  COURSE_DAYS_OF_WEEK,
  COURSE_SCHEDULE_RECURRENCES,
} from '../../../../constants/courses'
import { courseCreateStyles } from './courseCreateStyles'
import { RequiredIndicator } from './RequiredIndicator'
import { defaultScheduleSlot } from '../services/courseCreateFormUtils'
import type { CourseCreateFormValues } from '../validations/courseCreateSchema'

type CourseCreateScheduleSlotsProps = {
  register: UseFormRegister<CourseCreateFormValues>
  errors: FieldErrors<CourseCreateFormValues>
  scheduleSlots: UseFieldArrayReturn<CourseCreateFormValues, 'scheduleSlots'>
  scheduleSlotValues: CourseCreateFormValues['scheduleSlots']
  timePickerLang: string
  isSubmitting: boolean
  t: TFunction
}

export const CourseCreateScheduleSlots = ({
  register,
  errors,
  scheduleSlots,
  scheduleSlotValues,
  timePickerLang,
  isSubmitting,
  t,
}: CourseCreateScheduleSlotsProps) => (
  <div className="space-y-4">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-slate-700">
        {t('pages.shkoli.create.schedule.slotsTitle')}
      </p>
      <button
        type="button"
        onClick={() => scheduleSlots.append(defaultScheduleSlot)}
        className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
      >
        {t('pages.shkoli.create.schedule.addSlot')}
      </button>
    </div>
    {scheduleSlots.fields.length === 0 ? (
      <p className="text-sm text-slate-600">
        {t('pages.shkoli.create.schedule.slotsEmpty')}
      </p>
    ) : (
      <div className="space-y-4">
        {scheduleSlots.fields.map((field, index) => {
          const slotErrors = errors.scheduleSlots?.[index]
          const recurrenceValue =
            scheduleSlotValues[index]?.recurrence ?? field.recurrence
          const isWeekly = recurrenceValue === 'WEEKLY'
          const isMonthly = recurrenceValue === 'MONTHLY'
          return (
            <div
              key={field.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">
                  {t('pages.shkoli.detail.schedule.recurrence')}
                  <RequiredIndicator />
                  <select
                    {...register(`scheduleSlots.${index}.recurrence`)}
                    className={courseCreateStyles.inputClassName(
                      Boolean(slotErrors?.recurrence),
                    )}
                  >
                    {COURSE_SCHEDULE_RECURRENCES.map((recurrence) => (
                      <option key={recurrence} value={recurrence}>
                        {t(`courses.recurrence.${recurrence}`)}
                      </option>
                    ))}
                  </select>
                  {slotErrors?.recurrence ? (
                    <span className={courseCreateStyles.errorTextClassName}>
                      {slotErrors.recurrence.message}
                    </span>
                  ) : null}
                </label>
                {isWeekly ? (
                  <label className="text-sm font-medium text-slate-700">
                    {t('pages.shkoli.detail.schedule.dayOfWeek')}
                    <RequiredIndicator />
                    <select
                      {...register(`scheduleSlots.${index}.dayOfWeek`)}
                      className={courseCreateStyles.inputClassName(
                        Boolean(slotErrors?.dayOfWeek),
                      )}
                    >
                      <option value="">
                        {t(
                          'pages.shkoli.create.schedule.dayOfWeekPlaceholder',
                        )}
                      </option>
                      {COURSE_DAYS_OF_WEEK.map((day) => (
                        <option key={day} value={day}>
                          {t(`courses.daysOfWeek.${day}`)}
                        </option>
                      ))}
                    </select>
                    {slotErrors?.dayOfWeek ? (
                      <span className={courseCreateStyles.errorTextClassName}>
                        {slotErrors.dayOfWeek.message}
                      </span>
                    ) : null}
                  </label>
                ) : null}
                {isMonthly ? (
                  <label className="text-sm font-medium text-slate-700">
                    {t('pages.shkoli.detail.schedule.dayOfMonth')}
                    <RequiredIndicator />
                    <input
                      type="number"
                      min="1"
                      max="31"
                      {...register(`scheduleSlots.${index}.dayOfMonth`)}
                      className={courseCreateStyles.inputClassName(
                        Boolean(slotErrors?.dayOfMonth),
                      )}
                    />
                    {slotErrors?.dayOfMonth ? (
                      <span className={courseCreateStyles.errorTextClassName}>
                        {slotErrors.dayOfMonth.message}
                      </span>
                    ) : null}
                  </label>
                ) : null}
                <label className="text-sm font-medium text-slate-700">
                  {t('pages.shkoli.detail.schedule.startTime')}
                  <input
                    type="time"
                    lang={timePickerLang}
                    step={60}
                    {...register(`scheduleSlots.${index}.startTime`)}
                    className={courseCreateStyles.inputClassName(
                      Boolean(slotErrors?.startTime),
                    )}
                    disabled={isSubmitting}
                  />
                  {slotErrors?.startTime ? (
                    <span className={courseCreateStyles.errorTextClassName}>
                      {slotErrors.startTime.message}
                    </span>
                  ) : null}
                </label>
                <label className="text-sm font-medium text-slate-700">
                  {t('pages.shkoli.detail.schedule.endTime')}
                  <input
                    type="time"
                    lang={timePickerLang}
                    step={60}
                    {...register(`scheduleSlots.${index}.endTime`)}
                    className={courseCreateStyles.inputClassName(
                      Boolean(slotErrors?.endTime),
                    )}
                    disabled={isSubmitting}
                  />
                  {slotErrors?.endTime ? (
                    <span className={courseCreateStyles.errorTextClassName}>
                      {slotErrors.endTime.message}
                    </span>
                  ) : null}
                </label>
                <label className="text-sm font-medium text-slate-700">
                  {t('pages.shkoli.detail.schedule.duration')}
                  <input
                    type="number"
                    min="1"
                    {...register(
                      `scheduleSlots.${index}.singleClassDurationMinutes`,
                    )}
                    className={courseCreateStyles.inputClassName(
                      Boolean(slotErrors?.singleClassDurationMinutes),
                    )}
                  />
                  {slotErrors?.singleClassDurationMinutes ? (
                    <span className={courseCreateStyles.errorTextClassName}>
                      {slotErrors.singleClassDurationMinutes.message}
                    </span>
                  ) : null}
                </label>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => scheduleSlots.remove(index)}
                  className="text-xs font-semibold text-rose-600 transition hover:text-rose-700"
                >
                  {t('pages.shkoli.create.schedule.removeSlot')}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    )}
  </div>
)
