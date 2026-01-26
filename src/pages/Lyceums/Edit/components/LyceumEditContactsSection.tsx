import type { TFunction } from 'i18next'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'

import type { LyceumUpdateFormValues } from '../validations/lyceumUpdateSchema'
import { LyceumEditField } from './LyceumEditField'
import { LyceumEditFormSection } from './LyceumEditFormSection'

type LyceumEditContactsSectionProps = {
  register: UseFormRegister<LyceumUpdateFormValues>
  errors: FieldErrors<LyceumUpdateFormValues>
  t: TFunction
}

export const LyceumEditContactsSection = ({
  register,
  errors,
  t,
}: LyceumEditContactsSectionProps) => (
  <LyceumEditFormSection
    title={t('pages.lyceums.edit.form.sections.contacts')}
  >
    <div className="grid gap-4 sm:grid-cols-2">
      <LyceumEditField
        id="lyceum-edit-phone"
        name="phone"
        label={t('pages.lyceums.edit.form.fields.phone')}
        placeholder={t('pages.lyceums.edit.form.fields.phone')}
        register={register}
        error={errors.phone}
      />
      <LyceumEditField
        id="lyceum-edit-email"
        name="email"
        label={t('pages.lyceums.edit.form.fields.email')}
        placeholder={t('pages.lyceums.edit.form.fields.email')}
        type="email"
        register={register}
        error={errors.email}
      />
    </div>
  </LyceumEditFormSection>
)
