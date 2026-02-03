import type { TFunction } from 'i18next'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'

import {
  COURSE_AGE_GROUPS,
  COURSE_EXECUTION_TYPES,
  COURSE_TYPES,
} from '../../../../constants/courses'
import { courseEditStyles } from './courseEditStyles'
import { RequiredIndicator } from './RequiredIndicator'
import type { CourseEditFormValues } from '../validations/courseEditSchema'

type CourseEditOverviewSectionProps = {
  register: UseFormRegister<CourseEditFormValues>
  errors: FieldErrors<CourseEditFormValues>
  t: TFunction
}

export const CourseEditOverviewSection = ({
  register,
  errors,
  t,
}: CourseEditOverviewSectionProps) => (
  <fieldset className={courseEditStyles.fieldsetClassName}>
    <legend className={courseEditStyles.legendClassName}>
      {t('pages.shkoli.create.form.sections.overview')}
    </legend>
    <div className="grid gap-4 md:grid-cols-2">
      <label className="text-sm font-medium text-slate-700">
        {t('pages.shkoli.create.form.fields.name')}
        <RequiredIndicator />
        <input
          type="text"
          {...register('name')}
          placeholder={t('pages.shkoli.create.form.fields.name')}
          className={courseEditStyles.inputClassName(Boolean(errors.name))}
        />
        {errors.name ? (
          <span className={courseEditStyles.errorTextClassName}>
            {errors.name.message}
          </span>
        ) : null}
      </label>
      <label className="text-sm font-medium text-slate-700">
        {t('pages.shkoli.create.form.fields.type')}
        <RequiredIndicator />
        <select
          {...register('type')}
          className={courseEditStyles.inputClassName(Boolean(errors.type))}
        >
          <option value="">
            {t('pages.shkoli.create.form.fields.typePlaceholder')}
          </option>
          {COURSE_TYPES.map((value) => (
            <option key={value} value={value}>
              {t(`courses.types.${value}`)}
            </option>
          ))}
        </select>
        {errors.type ? (
          <span className={courseEditStyles.errorTextClassName}>
            {errors.type.message}
          </span>
        ) : null}
      </label>
      <label className="text-sm font-medium text-slate-700">
        {t('pages.shkoli.create.form.fields.executionType')}
        <select
          {...register('executionType')}
          className={courseEditStyles.inputClassName(
            Boolean(errors.executionType),
          )}
        >
          <option value="">
            {t(
              'pages.shkoli.create.form.fields.executionTypePlaceholder',
            )}
          </option>
          {COURSE_EXECUTION_TYPES.map((value) => (
            <option key={value} value={value}>
              {t(`courses.executionTypes.${value}`)}
            </option>
          ))}
        </select>
        {errors.executionType ? (
          <span className={courseEditStyles.errorTextClassName}>
            {errors.executionType.message}
          </span>
        ) : null}
      </label>
    </div>
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-700">
        {t('pages.shkoli.create.form.fields.ageGroups')}
        <RequiredIndicator />
      </p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {COURSE_AGE_GROUPS.map((group) => (
          <label
            key={group}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          >
            <input
              type="checkbox"
              value={group}
              {...register('ageGroupList')}
              className="h-4 w-4 rounded border-slate-300 text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            />
            <span>{t(`courses.ageGroups.${group}`)}</span>
          </label>
        ))}
      </div>
      {errors.ageGroupList ? (
        <span className={courseEditStyles.errorTextClassName}>
          {errors.ageGroupList.message}
        </span>
      ) : null}
    </div>
    <label className="text-sm font-medium text-slate-700">
      {t('pages.shkoli.create.form.fields.description')}
      <RequiredIndicator />
      <textarea
        {...register('description')}
        rows={4}
        placeholder={t('pages.shkoli.create.form.fields.description')}
        className={courseEditStyles.inputClassName(
          Boolean(errors.description),
        )}
      />
      {errors.description ? (
        <span className={courseEditStyles.errorTextClassName}>
          {errors.description.message}
        </span>
      ) : null}
    </label>
  </fieldset>
)
