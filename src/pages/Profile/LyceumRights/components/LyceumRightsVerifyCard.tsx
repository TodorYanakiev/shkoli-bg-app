import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import type { LyceumRightsVerificationFormValues } from '../validations/lyceumRightsSchemas'
import { getInputClassName } from './lyceumRightsFormStyles'

type LyceumRightsVerifyCardProps = {
  form: UseFormReturn<LyceumRightsVerificationFormValues>
  onSubmit: (values: LyceumRightsVerificationFormValues) => void
  hasRequested: boolean
  isSubmitting: boolean
  verifyErrorKey: string | null
}

const LyceumRightsVerifyCard = ({
  form,
  onSubmit,
  hasRequested,
  isSubmitting,
  verifyErrorKey,
}: LyceumRightsVerifyCardProps) => {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">
        {t('pages.profile.lyceumRights.verify.title')}
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        {t('pages.profile.lyceumRights.verify.description')}
      </p>
      {hasRequested ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 space-y-4"
          aria-busy={isSubmitting}
        >
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {t('pages.profile.lyceumRights.verify.emailSent')}
          </div>
          <div>
            <label
              htmlFor="lyceum-rights-code"
              className="text-sm font-semibold text-slate-800"
            >
              {t('pages.profile.lyceumRights.verify.form.codeLabel')}
            </label>
            <input
              id="lyceum-rights-code"
              type="text"
              autoComplete="one-time-code"
              placeholder={t(
                'pages.profile.lyceumRights.verify.form.codePlaceholder',
              )}
              aria-invalid={Boolean(errors.verificationCode)}
              aria-describedby={
                errors.verificationCode ? 'lyceum-rights-code-error' : undefined
              }
              className={getInputClassName(
                Boolean(errors.verificationCode),
              )}
              {...register('verificationCode')}
            />
            {errors.verificationCode ? (
              <p
                id="lyceum-rights-code-error"
                className="mt-1 text-xs text-rose-600"
                role="alert"
              >
                {errors.verificationCode.message}
              </p>
            ) : null}
          </div>
          {verifyErrorKey ? (
            <div
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
              role="alert"
            >
              {t(verifyErrorKey)}
            </div>
          ) : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting
              ? t('pages.profile.lyceumRights.verify.form.submitting')
              : t('pages.profile.lyceumRights.verify.form.submit')}
          </button>
        </form>
      ) : (
        <div
          className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
          role="status"
        >
          {t('pages.profile.lyceumRights.verify.pending')}
        </div>
      )}
    </div>
  )
}

export default LyceumRightsVerifyCard
