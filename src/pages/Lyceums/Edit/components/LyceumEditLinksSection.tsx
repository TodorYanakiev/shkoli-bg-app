import type { TFunction } from 'i18next'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'

import type { LyceumUpdateFormValues } from '../validations/lyceumUpdateSchema'
import { LyceumEditField } from './LyceumEditField'
import { LyceumEditFormSection } from './LyceumEditFormSection'

type LyceumEditLinksSectionProps = {
  register: UseFormRegister<LyceumUpdateFormValues>
  errors: FieldErrors<LyceumUpdateFormValues>
  t: TFunction
}

export const LyceumEditLinksSection = ({
  register,
  errors,
  t,
}: LyceumEditLinksSectionProps) => (
  <LyceumEditFormSection
    title={t('pages.lyceums.edit.form.sections.links')}
  >
    <div className="grid gap-4 sm:grid-cols-2">
      <LyceumEditField
        id="lyceum-edit-library-url"
        name="urlToLibrariesSite"
        label={t('pages.lyceums.edit.form.fields.urlToLibrariesSite')}
        placeholder={t('pages.lyceums.edit.form.fields.urlToLibrariesSite')}
        type="url"
        register={register}
        error={errors.urlToLibrariesSite}
      />
      <LyceumEditField
        id="lyceum-edit-chitalishta-url"
        name="chitalishtaUrl"
        label={t('pages.lyceums.edit.form.fields.chitalishtaUrl')}
        placeholder={t('pages.lyceums.edit.form.fields.chitalishtaUrl')}
        type="url"
        register={register}
        error={errors.chitalishtaUrl}
      />
    </div>
  </LyceumEditFormSection>
)
