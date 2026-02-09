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
import LyceumNameSelect from './LyceumNameSelect'
import LyceumRightsRequestSentState from './LyceumRightsRequestSentState'
import TownSelect from './TownSelect'

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
  onOpenManualPicker: () => void
  isManualPickerDisabled: boolean
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
  onOpenManualPicker,
  isManualPickerDisabled,
  onStartOver,
}: LyceumRightsRequestCardProps) => {
  const { t } = useTranslation()
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form
  const requestOutcomeMessageKey = requestOutcome
    ? getRequestOutcomeMessageKey(requestOutcome)
    : null
  const contactMessageKey =
    requestOutcome?.type === 'notFound'
      ? 'pages.profile.lyceumRights.request.contactNotFound'
      : 'pages.profile.lyceumRights.request.contact'
  const contactElement = (
    <p className="text-xs text-slate-500">
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="font-semibold text-brand transition-colors hover:text-brand-dark"
      >
        {t(contactMessageKey, {
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
      {contactElement}
      {hasRequested ? (
        <LyceumRightsRequestSentState
          requestOutcome={requestOutcome}
          requestedLyceum={requestedLyceum}
          isVerifySubmitting={isVerifySubmitting}
          onStartOver={onStartOver}
        />
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
          <button
            type="button"
            onClick={onOpenManualPicker}
            disabled={isManualPickerDisabled}
            className="inline-flex w-full items-center justify-center rounded-2xl border-2 border-brand/70 bg-gradient-to-r from-brand/20 via-amber-100/80 to-brand/10 px-5 py-3 text-sm font-extrabold text-brand-dark shadow-sm transition hover:border-brand hover:from-brand/25 hover:to-brand/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t('pages.profile.lyceumRights.request.manualPicker.trigger')}
          </button>
          <div>
            <label
              htmlFor="lyceum-rights-name"
              className="text-sm font-semibold text-slate-800"
            >
              {t('pages.profile.lyceumRights.request.form.lyceumNameLabel')}
            </label>
            <Controller
              control={control}
              name="lyceumName"
              render={({ field }) => (
                <LyceumNameSelect
                  id="lyceum-rights-name"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  options={suggestionNames}
                  placeholder={t(
                    'pages.profile.lyceumRights.request.form.lyceumNamePlaceholder',
                  )}
                  disabled={isSubmitting || isRequestLocked}
                  hasError={Boolean(errors.lyceumName)}
                  describedById={
                    errors.lyceumName ? 'lyceum-rights-name-error' : undefined
                  }
                />
              )}
            />
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
