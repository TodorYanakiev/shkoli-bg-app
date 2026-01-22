import type { TFunction } from 'i18next'
import type {
  FieldErrors,
  UseFieldArrayReturn,
  UseFormRegister,
} from 'react-hook-form'

import { courseCreateStyles } from './courseCreateStyles'
import { RequiredIndicator } from './RequiredIndicator'
import { defaultSpecialCase } from '../services/courseCreateFormUtils'
import type { CourseCreateFormValues } from '../validations/courseCreateSchema'

type CourseCreateScheduleSpecialCasesProps = {
  register: UseFormRegister<CourseCreateFormValues>
  errors: FieldErrors<CourseCreateFormValues>
  scheduleSpecialCases: UseFieldArrayReturn<
    CourseCreateFormValues,
    'scheduleSpecialCases'
  >
  t: TFunction
}

export const CourseCreateScheduleSpecialCases = ({
  register,
  errors,
  scheduleSpecialCases,
  t,
}: CourseCreateScheduleSpecialCasesProps) => (
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
                    className={courseCreateStyles.inputClassName(
                      Boolean(caseErrors?.date),
                    )}
                  />
                  {caseErrors?.date ? (
                    <span className={courseCreateStyles.errorTextClassName}>
                      {caseErrors.date.message}
                    </span>
                  ) : null}
                </label>
                <label className="text-sm font-medium text-slate-700">
                  {t('pages.shkoli.create.schedule.reason')}
                  <input
                    type="text"
                    {...register(`scheduleSpecialCases.${index}.reason`)}
                    className={courseCreateStyles.inputClassName(
                      Boolean(caseErrors?.reason),
                    )}
                  />
                  {caseErrors?.reason ? (
                    <span className={courseCreateStyles.errorTextClassName}>
                      {caseErrors.reason.message}
                    </span>
                  ) : null}
                </label>
              </div>
              <label className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  {...register(`scheduleSpecialCases.${index}.cancelled`)}
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
