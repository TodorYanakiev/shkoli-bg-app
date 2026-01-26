import type { TFunction } from 'i18next'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'

import { courseCreateStyles } from './courseCreateStyles'
import type { CourseCreateFormValues } from '../validations/courseCreateSchema'

type CourseCreateLinksSectionProps = {
  register: UseFormRegister<CourseCreateFormValues>
  errors: FieldErrors<CourseCreateFormValues>
  t: TFunction
}

export const CourseCreateLinksSection = ({
  register,
  errors,
  t,
}: CourseCreateLinksSectionProps) => (
  <fieldset className={courseCreateStyles.fieldsetClassName}>
    <legend className={courseCreateStyles.legendClassName}>
      {t('pages.shkoli.create.form.sections.links')}
    </legend>
    <div className="grid gap-4 md:grid-cols-2">
      <label className="text-sm font-medium text-slate-700">
        {t('pages.shkoli.create.form.fields.websiteLink')}
        <input
          type="url"
          {...register('websiteLink')}
          placeholder={t('pages.shkoli.create.form.fields.websiteLink')}
          className={courseCreateStyles.inputClassName(
            Boolean(errors.websiteLink),
          )}
        />
        {errors.websiteLink ? (
          <span className={courseCreateStyles.errorTextClassName}>
            {errors.websiteLink.message}
          </span>
        ) : null}
      </label>
      <label className="text-sm font-medium text-slate-700">
        {t('pages.shkoli.create.form.fields.facebookLink')}
        <input
          type="url"
          {...register('facebookLink')}
          placeholder={t('pages.shkoli.create.form.fields.facebookLink')}
          className={courseCreateStyles.inputClassName(
            Boolean(errors.facebookLink),
          )}
        />
        {errors.facebookLink ? (
          <span className={courseCreateStyles.errorTextClassName}>
            {errors.facebookLink.message}
          </span>
        ) : null}
      </label>
    </div>
  </fieldset>
)
