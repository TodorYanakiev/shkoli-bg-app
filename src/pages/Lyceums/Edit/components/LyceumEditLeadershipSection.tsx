import type { TFunction } from 'i18next'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'

import type { LyceumUpdateFormValues } from '../validations/lyceumUpdateSchema'
import { LyceumEditField } from './LyceumEditField'
import { LyceumEditFormSection } from './LyceumEditFormSection'

type LyceumEditLeadershipSectionProps = {
  register: UseFormRegister<LyceumUpdateFormValues>
  errors: FieldErrors<LyceumUpdateFormValues>
  t: TFunction
}

export const LyceumEditLeadershipSection = ({
  register,
  errors,
  t,
}: LyceumEditLeadershipSectionProps) => (
  <LyceumEditFormSection
    title={t('pages.lyceums.edit.form.sections.leadership')}
  >
    <div className="grid gap-4 sm:grid-cols-2">
      <LyceumEditField
        id="lyceum-edit-chairman"
        name="chairman"
        label={t('pages.lyceums.edit.form.fields.chairman')}
        placeholder={t('pages.lyceums.edit.form.fields.chairman')}
        register={register}
        error={errors.chairman}
      />
      <LyceumEditField
        id="lyceum-edit-secretary"
        name="secretary"
        label={t('pages.lyceums.edit.form.fields.secretary')}
        placeholder={t('pages.lyceums.edit.form.fields.secretary')}
        register={register}
        error={errors.secretary}
      />
    </div>
  </LyceumEditFormSection>
)
