import type { TFunction } from 'i18next'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'

import { COURSE_ACTIVE_MONTHS } from '../../../../constants/courses'
import { courseCreateStyles } from './courseCreateStyles'
import { RequiredIndicator } from './RequiredIndicator'
import type { CourseCreateFormValues } from '../validations/courseCreateSchema'

type CourseCreateDetailsSectionProps = {
  register: UseFormRegister<CourseCreateFormValues>
  errors: FieldErrors<CourseCreateFormValues>
  isInLyceum: boolean
  t: TFunction
}

export const CourseCreateDetailsSection = ({
  register,
  errors,
  isInLyceum,
  t,
}: CourseCreateDetailsSectionProps) => (
  <fieldset className={courseCreateStyles.fieldsetClassName}>
    <legend className={courseCreateStyles.legendClassName}>
      {t('pages.shkoli.create.form.sections.details')}
    </legend>
    <div className="grid gap-4 md:grid-cols-3">
      <label className="text-sm font-medium text-slate-700">
        {t('pages.shkoli.create.form.fields.price')}
        <input
          type="number"
          step="0.01"
          min="0"
          {...register('price')}
          placeholder={t('pages.shkoli.create.form.fields.price')}
          className={courseCreateStyles.inputClassName(
            Boolean(errors.price),
          )}
        />
        {errors.price ? (
          <span className={courseCreateStyles.errorTextClassName}>
            {errors.price.message}
          </span>
        ) : null}
        <p className="mt-1 text-xs text-slate-500">
          {t('pages.shkoli.create.form.fields.priceHintEuro')}
        </p>
      </label>
      <label className="text-sm font-medium text-slate-700">
        {t('pages.shkoli.create.form.fields.activeStartMonth')}
        <select
          {...register('activeStartMonth')}
          className={courseCreateStyles.inputClassName(
            Boolean(errors.activeStartMonth),
          )}
        >
          <option value="">
            {t('pages.shkoli.create.form.fields.activeMonthPlaceholder')}
          </option>
          {COURSE_ACTIVE_MONTHS.map((value) => (
            <option key={value} value={value}>
              {t(`courses.months.${value}`)}
            </option>
          ))}
        </select>
        {errors.activeStartMonth ? (
          <span className={courseCreateStyles.errorTextClassName}>
            {errors.activeStartMonth.message}
          </span>
        ) : null}
      </label>
      <label className="text-sm font-medium text-slate-700">
        {t('pages.shkoli.create.form.fields.activeEndMonth')}
        <select
          {...register('activeEndMonth')}
          className={courseCreateStyles.inputClassName(
            Boolean(errors.activeEndMonth),
          )}
        >
          <option value="">
            {t('pages.shkoli.create.form.fields.activeMonthPlaceholder')}
          </option>
          {COURSE_ACTIVE_MONTHS.map((value) => (
            <option key={value} value={value}>
              {t(`courses.months.${value}`)}
            </option>
          ))}
        </select>
        {errors.activeEndMonth ? (
          <span className={courseCreateStyles.errorTextClassName}>
            {errors.activeEndMonth.message}
          </span>
        ) : null}
      </label>
      <p className="text-xs text-slate-500 md:col-span-3">
        {t('pages.shkoli.create.form.fields.activeMonthsHint')}
      </p>
      <div className="space-y-2 md:col-span-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            {...register('isInLyceum')}
            className="h-4 w-4 rounded border-slate-300 text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          />
          <span>{t('pages.shkoli.create.form.fields.isInLyceum')}</span>
        </label>
        <p className="text-xs text-slate-500">
          {t('pages.shkoli.create.form.fields.isInLyceumHint')}
        </p>
      </div>
      {!isInLyceum ? (
        <label className="text-sm font-medium text-slate-700 md:col-span-3">
          {t('pages.shkoli.create.form.fields.address')}
          <RequiredIndicator />
          <input
            type="text"
            {...register('address')}
            placeholder={t('pages.shkoli.create.form.fields.address')}
            className={courseCreateStyles.inputClassName(
              Boolean(errors.address),
            )}
          />
          {errors.address ? (
            <span className={courseCreateStyles.errorTextClassName}>
              {errors.address.message}
            </span>
          ) : null}
        </label>
      ) : null}
    </div>
    <label className="text-sm font-medium text-slate-700">
      {t('pages.shkoli.create.form.fields.achievements')}
      <textarea
        {...register('achievements')}
        rows={3}
        placeholder={t('pages.shkoli.create.form.fields.achievements')}
        className={courseCreateStyles.inputClassName(
          Boolean(errors.achievements),
        )}
      />
      {errors.achievements ? (
        <span className={courseCreateStyles.errorTextClassName}>
          {errors.achievements.message}
        </span>
      ) : null}
    </label>
  </fieldset>
)
