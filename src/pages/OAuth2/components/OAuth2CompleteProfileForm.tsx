import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useToast } from '../../../components/feedback/ToastContext'
import { useLocalizedNavigate } from '../../../hooks/useLocalizedNavigate'
import { consumeStoredPostLoginRedirect } from '../../../services/authRedirect'
import { setTokens } from '../../../utils/authStorage'
import { useCompleteOAuth2RegistrationMutation } from '../hooks/useCompleteOAuth2RegistrationMutation'
import { useOAuth2CompleteProfileForm } from '../hooks/useOAuth2CompleteProfileForm'
import { applyOAuth2CompleteFieldErrors } from '../services/oauth2FieldErrors'
import type {
  OAuth2CompleteRegistrationRequest,
  OAuth2PendingFieldName,
} from '../types'

type OAuth2CompleteProfileFormProps = {
  registrationToken: string
  missingFields: OAuth2PendingFieldName[]
}

const OAuth2CompleteProfileForm = ({
  registrationToken,
  missingFields,
}: OAuth2CompleteProfileFormProps) => {
  const { t } = useTranslation()
  const navigate = useLocalizedNavigate()
  const routerNavigate = useNavigate()
  const { showToast } = useToast()
  const mutation = useCompleteOAuth2RegistrationMutation()
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useOAuth2CompleteProfileForm({ missingFields, t })

  const shouldShowEmailField = missingFields.includes('email')
  const shouldShowFirstnameField = missingFields.includes('firstname')
  const shouldShowLastnameField = missingFields.includes('lastname')

  const onSubmit = (values: {
    username: string
    email: string
    firstname: string
    lastname: string
    description: string
  }) => {
    clearErrors()

    const payload: OAuth2CompleteRegistrationRequest = {
      registrationToken,
      username: values.username.trim(),
    }

    const normalizedEmail = values.email.trim()
    const normalizedFirstname = values.firstname.trim()
    const normalizedLastname = values.lastname.trim()
    const normalizedDescription = values.description.trim()

    if (normalizedEmail) {
      payload.email = normalizedEmail
    }
    if (normalizedFirstname) {
      payload.firstname = normalizedFirstname
    }
    if (normalizedLastname) {
      payload.lastname = normalizedLastname
    }
    if (normalizedDescription) {
      payload.description = normalizedDescription
    }

    mutation.mutate(payload, {
      onSuccess: (data) => {
        setTokens({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        })
        showToast({
          message: t('feedback.auth.oauth2Success'),
          tone: 'success',
        })

        const postLoginRedirect = consumeStoredPostLoginRedirect()

        if (postLoginRedirect) {
          routerNavigate(postLoginRedirect, { replace: true })
          return
        }

        navigate('/profile', { replace: true })
      },
      onError: (error) => {
        applyOAuth2CompleteFieldErrors({
          error,
          setError,
          t,
        })
      },
    })
  }

  const inputClassName = (hasError: boolean, extraClasses?: string) =>
    [
      'mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm transition',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
      hasError
        ? 'border-rose-300 bg-rose-50/40 focus-visible:outline-rose-300'
        : 'border-slate-200 bg-white',
      extraClasses,
    ].join(' ')

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-6 w-full max-w-2xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      aria-busy={mutation.isPending}
    >
      <div>
        <label
          htmlFor="oauth2-username"
          className="text-sm font-semibold text-slate-800"
        >
          {t('pages.oauth2.completeProfile.form.usernameLabel')}
        </label>
        <input
          id="oauth2-username"
          type="text"
          autoComplete="username"
          placeholder={t('pages.oauth2.completeProfile.form.usernamePlaceholder')}
          aria-invalid={Boolean(errors.username)}
          aria-describedby={errors.username ? 'oauth2-username-error' : undefined}
          className={inputClassName(Boolean(errors.username))}
          {...register('username')}
        />
        {errors.username ? (
          <p
            id="oauth2-username-error"
            className="mt-1 text-xs text-rose-600"
            role="alert"
          >
            {errors.username.message}
          </p>
        ) : null}
      </div>
      {shouldShowEmailField ? (
        <div>
          <label
            htmlFor="oauth2-email"
            className="text-sm font-semibold text-slate-800"
          >
            {t('pages.oauth2.completeProfile.form.emailLabel')}
          </label>
          <input
            id="oauth2-email"
            type="email"
            autoComplete="email"
            placeholder={t('pages.oauth2.completeProfile.form.emailPlaceholder')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'oauth2-email-error' : undefined}
            className={inputClassName(Boolean(errors.email))}
            {...register('email')}
          />
          {errors.email ? (
            <p
              id="oauth2-email-error"
              className="mt-1 text-xs text-rose-600"
              role="alert"
            >
              {errors.email.message}
            </p>
          ) : null}
        </div>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        {shouldShowFirstnameField ? (
          <div>
            <label
              htmlFor="oauth2-firstname"
              className="text-sm font-semibold text-slate-800"
            >
              {t('pages.oauth2.completeProfile.form.firstnameLabel')}
            </label>
            <input
              id="oauth2-firstname"
              type="text"
              autoComplete="given-name"
              placeholder={t('pages.oauth2.completeProfile.form.firstnamePlaceholder')}
              aria-invalid={Boolean(errors.firstname)}
              aria-describedby={
                errors.firstname ? 'oauth2-firstname-error' : undefined
              }
              className={inputClassName(Boolean(errors.firstname))}
              {...register('firstname')}
            />
            {errors.firstname ? (
              <p
                id="oauth2-firstname-error"
                className="mt-1 text-xs text-rose-600"
                role="alert"
              >
                {errors.firstname.message}
              </p>
            ) : null}
          </div>
        ) : null}
        {shouldShowLastnameField ? (
          <div>
            <label
              htmlFor="oauth2-lastname"
              className="text-sm font-semibold text-slate-800"
            >
              {t('pages.oauth2.completeProfile.form.lastnameLabel')}
            </label>
            <input
              id="oauth2-lastname"
              type="text"
              autoComplete="family-name"
              placeholder={t('pages.oauth2.completeProfile.form.lastnamePlaceholder')}
              aria-invalid={Boolean(errors.lastname)}
              aria-describedby={
                errors.lastname ? 'oauth2-lastname-error' : undefined
              }
              className={inputClassName(Boolean(errors.lastname))}
              {...register('lastname')}
            />
            {errors.lastname ? (
              <p
                id="oauth2-lastname-error"
                className="mt-1 text-xs text-rose-600"
                role="alert"
              >
                {errors.lastname.message}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
      <div>
        <label
          htmlFor="oauth2-description"
          className="text-sm font-semibold text-slate-800"
        >
          {t('pages.oauth2.completeProfile.form.descriptionLabel')}
        </label>
        <textarea
          id="oauth2-description"
          rows={4}
          placeholder={t('pages.oauth2.completeProfile.form.descriptionPlaceholder')}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description ? 'oauth2-description-error' : undefined
          }
          className={inputClassName(Boolean(errors.description), 'min-h-28')}
          {...register('description')}
        />
        {errors.description ? (
          <p
            id="oauth2-description-error"
            className="mt-1 text-xs text-rose-600"
            role="alert"
          >
            {errors.description.message}
          </p>
        ) : null}
      </div>
      {mutation.error ? (
        <div
          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
          role="alert"
        >
          {t(mutation.error.messageKey)}
        </div>
      ) : null}
      <button
        type="submit"
        disabled={mutation.isPending}
        className="inline-flex w-full items-center justify-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {mutation.isPending
          ? t('pages.oauth2.completeProfile.form.submitting')
          : t('pages.oauth2.completeProfile.form.submit')}
      </button>
    </form>
  )
}

export default OAuth2CompleteProfileForm
