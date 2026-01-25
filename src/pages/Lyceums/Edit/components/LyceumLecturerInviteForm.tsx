import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import type { LyceumLecturerFormValues } from '../../validations/lyceumLecturerSchema'
import { actionButtonClassName, getInputClassName } from './lyceumLecturerStyles'

type LyceumLecturerInviteFormProps = {
  form: UseFormReturn<LyceumLecturerFormValues>
  onSubmit: (values: LyceumLecturerFormValues) => void
  suggestionEmails: string[]
  suggestionMessageKey: string | null
  suggestionMessageTone: string
  inviteErrorKey: string | null
  isSubmitting: boolean
}

const LyceumLecturerInviteForm = ({
  form,
  onSubmit,
  suggestionEmails,
  suggestionMessageKey,
  suggestionMessageTone,
  inviteErrorKey,
  isSubmitting,
}: LyceumLecturerInviteFormProps) => {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">
        {t('pages.lyceums.edit.lecturers.addTitle')}
      </h3>
      <p className="mt-1 text-sm text-slate-600">
        {t('pages.lyceums.edit.lecturers.addDescription')}
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 space-y-3"
        aria-busy={isSubmitting}
      >
        <div>
          <label
            htmlFor="lyceum-lecturer-email"
            className="text-sm font-semibold text-slate-800"
          >
            {t('pages.lyceums.edit.lecturers.form.emailLabel')}
          </label>
          <input
            id="lyceum-lecturer-email"
            type="email"
            autoComplete="email"
            list="lyceum-lecturer-suggestions"
            placeholder={t(
              'pages.lyceums.edit.lecturers.form.emailPlaceholder',
            )}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={
              errors.email ? 'lyceum-lecturer-email-error' : undefined
            }
            disabled={isSubmitting}
            className={`${getInputClassName(Boolean(errors.email))} hide-datalist-indicator`}
            {...register('email')}
          />
          <datalist id="lyceum-lecturer-suggestions">
            {suggestionEmails.map((email) => (
              <option key={email} value={email} />
            ))}
          </datalist>
          {errors.email ? (
            <p
              id="lyceum-lecturer-email-error"
              className="mt-1 text-xs text-rose-600"
              role="alert"
            >
              {errors.email.message}
            </p>
          ) : null}
          {suggestionMessageKey ? (
            <p className={`mt-2 text-xs ${suggestionMessageTone}`}>
              {t(suggestionMessageKey)}
            </p>
          ) : null}
        </div>
        {inviteErrorKey ? (
          <div
            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
            role="alert"
          >
            {t(inviteErrorKey)}
          </div>
        ) : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className={actionButtonClassName}
        >
          {isSubmitting
            ? t('pages.lyceums.edit.lecturers.form.submitting')
            : t('pages.lyceums.edit.lecturers.form.submit')}
        </button>
      </form>
    </div>
  )
}

export default LyceumLecturerInviteForm
