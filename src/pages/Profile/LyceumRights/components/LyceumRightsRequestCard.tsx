import { Controller, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { CONTACT_EMAIL } from '../../../../constants/contact'
import { LYCEUM_TOWNS } from '../../../../constants/lyceums'
import type { RequestOutcome } from '../types'
import {
  getRequestOutcomeClassName,
  getRequestOutcomeMessageKey,
} from '../services/lyceumRightsOutcome'
import type { LyceumRightsRequestFormValues } from '../validations/lyceumRightsSchemas'
import TownSelect from './TownSelect'
import { getInputClassName } from './lyceumRightsFormStyles'

type LyceumRightsRequestCardProps = {
  form: UseFormReturn<LyceumRightsRequestFormValues>
  onSubmit: (values: LyceumRightsRequestFormValues) => void
  isSubmitting: boolean
  isVerifySubmitting: boolean
  isRequestLocked: boolean
  hasRequested: boolean
  requestOutcome: RequestOutcome | null
  requestedLyceum: LyceumRightsRequestFormValues | null
  requestErrorKey: string | null
  shouldShowRequestError: boolean
  suggestionNames: string[]
  suggestionMessageKey: string | null
  suggestionMessageTone: string
  onStartOver: () => void
}

const LyceumRightsRequestCard = ({
  form,
  onSubmit,
  isSubmitting,
  isVerifySubmitting,
  isRequestLocked,
  hasRequested,
  requestOutcome,
  requestedLyceum,
  requestErrorKey,
  shouldShowRequestError,
  suggestionNames,
  suggestionMessageKey,
  suggestionMessageTone,
  onStartOver,
}: LyceumRightsRequestCardProps) => {
  const { t } = useTranslation()
  const { register, handleSubmit, control, formState: { errors } } = form
  const requestOutcomeMessageKey = requestOutcome
    ? getRequestOutcomeMessageKey(requestOutcome)
    : null
  const shouldShowContact =
    hasRequested || Boolean(requestOutcome) || shouldShowRequestError
  const contactElement = (
    <p className="text-xs text-slate-500">
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="font-semibold text-brand transition-colors hover:text-brand-dark"
      >
        {t('pages.profile.lyceumRights.request.contact', {
          email: CONTACT_EMAIL,
        })}
      </a>
    </p>
  )

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">
        {t('pages.profile.lyceumRights.request.title')}
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        {t('pages.profile.lyceumRights.request.description')}
      </p>
      {hasRequested ? (
        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {t('pages.profile.lyceumRights.request.outcomes.emailSent', {
              email: requestOutcome?.email
                ? requestOutcome.email
                : t('pages.profile.lyceumRights.request.outcomes.emailFallback'),
            })}
          </div>
          <div className="text-xs font-medium text-slate-500">
            {t('pages.profile.lyceumRights.request.outcomes.requestedLyceum', {
              lyceumName: requestedLyceum?.lyceumName ?? '',
              town: requestedLyceum?.town ?? '',
            })}
          </div>
          {contactElement}
          <button
            type="button"
            onClick={onStartOver}
            disabled={isVerifySubmitting}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-400"
          >
            {t('pages.profile.lyceumRights.request.startOver')}
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 space-y-4"
          aria-busy={isSubmitting}
        >
          {requestOutcome && requestOutcomeMessageKey ? (
            <div
              className={[
                'rounded-lg border border-l-4 px-3 py-2 text-sm font-semibold',
                getRequestOutcomeClassName(requestOutcome),
              ].join(' ')}
              role="status"
            >
              {t(requestOutcomeMessageKey, { email: CONTACT_EMAIL })}
            </div>
          ) : null}
          {shouldShowContact ? contactElement : null}
          <div>
            <label
              htmlFor="lyceum-rights-name"
              className="text-sm font-semibold text-slate-800"
            >
              {t('pages.profile.lyceumRights.request.form.lyceumNameLabel')}
            </label>
            <input
              id="lyceum-rights-name"
              type="text"
              autoComplete="organization"
              list="lyceum-rights-suggestions"
              placeholder={t(
                'pages.profile.lyceumRights.request.form.lyceumNamePlaceholder',
              )}
              aria-invalid={Boolean(errors.lyceumName)}
              aria-describedby={
                errors.lyceumName ? 'lyceum-rights-name-error' : undefined
              }
              disabled={isSubmitting || isRequestLocked}
              className={getInputClassName(Boolean(errors.lyceumName))}
              {...register('lyceumName')}
            />
            <datalist id="lyceum-rights-suggestions">
              {suggestionNames.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
            {errors.lyceumName ? (
              <p
                id="lyceum-rights-name-error"
                className="mt-1 text-xs text-rose-600"
                role="alert"
              >
                {errors.lyceumName.message}
              </p>
            ) : null}
            {suggestionMessageKey ? (
              <p className={`mt-2 text-xs ${suggestionMessageTone}`}>
                {t(suggestionMessageKey)}
              </p>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="lyceum-rights-town"
              className="text-sm font-semibold text-slate-800"
            >
              {t('pages.profile.lyceumRights.request.form.townLabel')}
            </label>
            <Controller
              control={control}
              name="town"
              render={({ field }) => (
                <TownSelect
                  id="lyceum-rights-town"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  options={LYCEUM_TOWNS}
                  placeholder={t(
                    'pages.profile.lyceumRights.request.form.townPlaceholder',
                  )}
                  disabled={isSubmitting || isRequestLocked}
                  hasError={Boolean(errors.town)}
                  describedById={
                    errors.town ? 'lyceum-rights-town-error' : undefined
                  }
                />
              )}
            />
            {errors.town ? (
              <p
                id="lyceum-rights-town-error"
                className="mt-1 text-xs text-rose-600"
                role="alert"
              >
                {errors.town.message}
              </p>
            ) : null}
          </div>
          {shouldShowRequestError && requestErrorKey ? (
            <div
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
              role="alert"
            >
              {t(requestErrorKey)}
            </div>
          ) : null}
          <button
            type="submit"
            disabled={isSubmitting || isRequestLocked}
            className="inline-flex w-full items-center justify-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting
              ? t('pages.profile.lyceumRights.request.form.submitting')
              : t('pages.profile.lyceumRights.request.form.submit')}
          </button>
        </form>
      )}
    </div>
  )
}

export default LyceumRightsRequestCard
