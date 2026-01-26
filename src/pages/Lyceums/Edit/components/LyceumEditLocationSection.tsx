import type { TFunction } from 'i18next'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'

import type { LyceumUpdateFormValues } from '../validations/lyceumUpdateSchema'
import { LyceumEditField } from './LyceumEditField'
import { LyceumEditFormSection } from './LyceumEditFormSection'

type LyceumEditLocationSectionProps = {
  register: UseFormRegister<LyceumUpdateFormValues>
  errors: FieldErrors<LyceumUpdateFormValues>
  t: TFunction
}

export const LyceumEditLocationSection = ({
  register,
  errors,
  t,
}: LyceumEditLocationSectionProps) => (
  <LyceumEditFormSection
    title={t('pages.lyceums.edit.form.sections.location')}
  >
    <div className="grid gap-4 sm:grid-cols-2">
      <LyceumEditField
        id="lyceum-edit-address"
        name="address"
        label={t('pages.lyceums.edit.form.fields.address')}
        placeholder={t('pages.lyceums.edit.form.fields.address')}
        register={register}
        error={errors.address}
      />
      <LyceumEditField
        id="lyceum-edit-region"
        name="region"
        label={t('pages.lyceums.edit.form.fields.region')}
        placeholder={t('pages.lyceums.edit.form.fields.region')}
        register={register}
        error={errors.region}
      />
      <LyceumEditField
        id="lyceum-edit-municipality"
        name="municipality"
        label={t('pages.lyceums.edit.form.fields.municipality')}
        placeholder={t('pages.lyceums.edit.form.fields.municipality')}
        register={register}
        error={errors.municipality}
      />
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      <LyceumEditField
        id="lyceum-edit-latitude"
        name="latitude"
        label={t('pages.lyceums.edit.form.fields.latitude')}
        placeholder={t('pages.lyceums.edit.form.fields.latitude')}
        type="number"
        step="any"
        register={register}
        error={errors.latitude}
      />
      <LyceumEditField
        id="lyceum-edit-longitude"
        name="longitude"
        label={t('pages.lyceums.edit.form.fields.longitude')}
        placeholder={t('pages.lyceums.edit.form.fields.longitude')}
        type="number"
        step="any"
        register={register}
        error={errors.longitude}
      />
    </div>
  </LyceumEditFormSection>
)
