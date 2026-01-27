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
import { courseEditStyles } from './courseEditStyles'
import { RequiredIndicator } from './RequiredIndicator'
import {
  defaultScheduleSlot,
  defaultSpecialCase,
} from '../services/courseEditFormUtils'
import type { CourseEditFormValues } from '../validations/courseEditSchema'

type CourseEditScheduleSectionProps = {
  register: UseFormRegister<CourseEditFormValues>
  errors: FieldErrors<CourseEditFormValues>
  scheduleSlots: UseFieldArrayReturn<CourseEditFormValues, 'scheduleSlots'>
  scheduleSpecialCases: UseFieldArrayReturn<
    CourseEditFormValues,
    'scheduleSpecialCases'
  >
  scheduleSlotValues: CourseEditFormValues['scheduleSlots']
  timePickerLang: string
  isSubmitting: boolean
  t: TFunction
}

type ScheduleSlotsProps = Pick<
  CourseEditScheduleSectionProps,
  | 'register'
  | 'errors'
  | 'scheduleSlots'
  | 'scheduleSlotValues'
  | 'timePickerLang'
  | 'isSubmitting'
  | 't'
>

const ScheduleSlots = ({
  register,
  errors,
  scheduleSlots,
  scheduleSlotValues,
  timePickerLang,
  isSubmitting,
  t,
}: ScheduleSlotsProps) => (
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
                    className={courseEditStyles.inputClassName(
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
                    <span className={courseEditStyles.errorTextClassName}>
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
                      className={courseEditStyles.inputClassName(
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
                      <span className={courseEditStyles.errorTextClassName}>
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
                      className={courseEditStyles.inputClassName(
                        Boolean(slotErrors?.dayOfMonth),
                      )}
                    />
                    {slotErrors?.dayOfMonth ? (
                      <span className={courseEditStyles.errorTextClassName}>
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
                    className={courseEditStyles.inputClassName(
                      Boolean(slotErrors?.startTime),
                    )}
                    disabled={isSubmitting}
                  />
                  {slotErrors?.startTime ? (
                    <span className={courseEditStyles.errorTextClassName}>
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
                    className={courseEditStyles.inputClassName(
                      Boolean(slotErrors?.endTime),
                    )}
                    disabled={isSubmitting}
                  />
                  {slotErrors?.endTime ? (
                    <span className={courseEditStyles.errorTextClassName}>
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
                    className={courseEditStyles.inputClassName(
                      Boolean(slotErrors?.singleClassDurationMinutes),
                    )}
                  />
                  {slotErrors?.singleClassDurationMinutes ? (
                    <span className={courseEditStyles.errorTextClassName}>
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

type ScheduleSpecialCasesProps = Pick<
  CourseEditScheduleSectionProps,
  'register' | 'errors' | 'scheduleSpecialCases' | 't'
>

const ScheduleSpecialCases = ({
  register,
  errors,
  scheduleSpecialCases,
  t,
}: ScheduleSpecialCasesProps) => (
  <div className="space-y-4 pt-4">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-slate-700">
        {t('pages.shkoli.create.schedule.specialCasesTitle')}
      </p>
      <button
        type="button"
        onClick={() => scheduleSpecialCases.append(defaultSpecialCase)}
        className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
      >
        {t('pages.shkoli.create.schedule.addSpecialCase')}
      </button>
    </div>
    <p className="text-xs text-slate-500">
      {t('pages.shkoli.create.schedule.specialCasesHelp')}
    </p>
    {scheduleSpecialCases.fields.length === 0 ? (
      <p className="text-sm text-slate-600">
        {t('pages.shkoli.create.schedule.specialCasesEmpty')}
      </p>
    ) : (
      <div className="space-y-3">
        {scheduleSpecialCases.fields.map((field, index) => {
          const caseErrors = errors.scheduleSpecialCases?.[index]
          return (
            <div
              key={field.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">
                  {t('pages.shkoli.create.schedule.date')}
                  <RequiredIndicator />
                  <input
                    type="date"
                    {...register(`scheduleSpecialCases.${index}.date`)}
                    className={courseEditStyles.inputClassName(
                      Boolean(caseErrors?.date),
                    )}
                  />
                  {caseErrors?.date ? (
                    <span className={courseEditStyles.errorTextClassName}>
                      {caseErrors.date.message}
                    </span>
                  ) : null}
                </label>
                <label className="text-sm font-medium text-slate-700">
                  {t('pages.shkoli.create.schedule.reason')}
                  <input
                    type="text"
                    {...register(`scheduleSpecialCases.${index}.reason`)}
                    className={courseEditStyles.inputClassName(
                      Boolean(caseErrors?.reason),
                    )}
                  />
                  {caseErrors?.reason ? (
                    <span className={courseEditStyles.errorTextClassName}>
                      {caseErrors.reason.message}
                    </span>
                  ) : null}
                </label>
              </div>
              <label className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  {...register(
                    `scheduleSpecialCases.${index}.cancelled`,
                  )}
                  className="h-4 w-4 rounded border-slate-300 text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                />
                {t('pages.shkoli.create.schedule.cancelled')}
              </label>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => scheduleSpecialCases.remove(index)}
                  className="text-xs font-semibold text-rose-600 transition hover:text-rose-700"
                >
                  {t('pages.shkoli.create.schedule.removeSpecialCase')}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    )}
  </div>
)

export const CourseEditScheduleSection = ({
  register,
  errors,
  scheduleSlots,
  scheduleSpecialCases,
  scheduleSlotValues,
  timePickerLang,
  isSubmitting,
  t,
}: CourseEditScheduleSectionProps) => (
  <fieldset className={courseEditStyles.fieldsetClassName}>
    <legend className={courseEditStyles.legendClassName}>
      {t('pages.shkoli.create.form.sections.schedule')}
    </legend>
    <ScheduleSlots
      register={register}
      errors={errors}
      scheduleSlots={scheduleSlots}
      scheduleSlotValues={scheduleSlotValues}
      timePickerLang={timePickerLang}
      isSubmitting={isSubmitting}
      t={t}
    />
    <ScheduleSpecialCases
      register={register}
      errors={errors}
      scheduleSpecialCases={scheduleSpecialCases}
      t={t}
    />
  </fieldset>
)
