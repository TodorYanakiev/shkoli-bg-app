import type { TFunction } from 'i18next'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'

import type { LyceumUpdateFormValues } from '../validations/lyceumUpdateSchema'
import { LyceumEditField } from './LyceumEditField'
import { LyceumEditFormSection } from './LyceumEditFormSection'

type LyceumEditBasicsSectionProps = {
  register: UseFormRegister<LyceumUpdateFormValues>
  errors: FieldErrors<LyceumUpdateFormValues>
  t: TFunction
}

export const LyceumEditBasicsSection = ({
  register,
  errors,
  t,
}: LyceumEditBasicsSectionProps) => (
  <LyceumEditFormSection
    title={t('pages.lyceums.edit.form.sections.basics')}
  >
    <div className="grid gap-4 sm:grid-cols-2">
      <LyceumEditField
        id="lyceum-edit-name"
        name="name"
        label={t('pages.lyceums.edit.form.fields.name')}
        placeholder={t('pages.lyceums.edit.form.fields.name')}
        register={register}
        error={errors.name}
      />
      <LyceumEditField
        id="lyceum-edit-town"
        name="town"
        label={t('pages.lyceums.edit.form.fields.town')}
        placeholder={t('pages.lyceums.edit.form.fields.town')}
        register={register}
        error={errors.town}
      />
    </div>
    <div className="grid gap-4 sm:grid-cols-3">
      <LyceumEditField
        id="lyceum-edit-status"
        name="status"
        label={t('pages.lyceums.edit.form.fields.status')}
        placeholder={t('pages.lyceums.edit.form.fields.status')}
        register={register}
        error={errors.status}
      />
      <LyceumEditField
        id="lyceum-edit-bulstat"
        name="bulstat"
        label={t('pages.lyceums.edit.form.fields.bulstat')}
        placeholder={t('pages.lyceums.edit.form.fields.bulstat')}
        register={register}
        error={errors.bulstat}
      />
      <LyceumEditField
        id="lyceum-edit-registration"
        name="registrationNumber"
        label={t('pages.lyceums.edit.form.fields.registrationNumber')}
        placeholder={t('pages.lyceums.edit.form.fields.registrationNumber')}
        type="number"
        step="1"
        register={register}
        error={errors.registrationNumber}
      />
    </div>
  </LyceumEditFormSection>
)
