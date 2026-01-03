import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import { useToast } from '../../../components/feedback/ToastContext'
import { LYCEUM_TOWNS } from '../../../constants/lyceums'
import type { ApiError } from '../../../types/api'
import {
  getLyceumRightsRequestSchema,
  getLyceumRightsVerificationSchema,
  type LyceumRightsRequestFormValues,
  type LyceumRightsVerificationFormValues,
} from '../../../validations/lyceums'
import TownSelect from './components/TownSelect'
import { useLyceumSuggestions } from './hooks/useLyceumSuggestions'
import { useRequestLyceumRightsMutation } from './hooks/useRequestLyceumRightsMutation'
import { useVerifyLyceumRightsMutation } from './hooks/useVerifyLyceumRightsMutation'

const MAX_SUGGESTIONS = 8

const getRequestRightsErrorMessage = (
  error: ApiError | null,
  t: (key: string) => string,
) => {
  if (!error) return null
  if (error.kind === 'network') {
    return t('errors.network')
  }
  if (error.kind === 'unauthorized' || error.kind === 'forbidden') {
    return t('errors.profile.lyceumRightsUnauthorized')
  }
  if (error.status === 409) {
    return t('errors.profile.lyceumRightsAlreadyAdminOther')
  }
  if (error.status === 400) {
    return t('errors.profile.lyceumRightsInvalid')
  }
  if (error.status >= 500) {
    return t('errors.profile.lyceumRightsServer')
  }
  return t('errors.profile.lyceumRightsRequestFailed')
}

const getVerifyRightsErrorMessage = (
  error: ApiError | null,
  t: (key: string) => string,
) => {
  if (!error) return null
  if (error.kind === 'network') {
    return t('errors.network')
  }
  if (error.kind === 'unauthorized' || error.kind === 'forbidden') {
    return t('errors.auth.forbidden')
  }
  return t('errors.profile.lyceumRightsVerifyFailed')
}

type RequestOutcomeType =
  | 'emailSent'
  | 'alreadyAdmin'
  | 'alreadyAdminOther'
  | 'missingEmail'
  | 'notFound'
  | 'unknown'

type RequestOutcome = {
  type: RequestOutcomeType
  email?: string
}

const EMAIL_SENT_PREFIX = 'We have sent you an email at'
const ALREADY_ADMIN_MESSAGE = 'You already administrate this lyceum.'
const MISSING_EMAIL_MESSAGE =
  'We could not reach the lyceum via email. Please contact us.'
const NOT_FOUND_MESSAGE =
  'We are sorry, we could not find such lyceum. Please contact us.'

const parseRequestOutcome = (message: string): RequestOutcome => {
  const normalized = message.trim()

  if (normalized.startsWith(EMAIL_SENT_PREFIX)) {
    const emailMatch = normalized.match(/email at\s+([^\s]+)\s+with/i)
    return { type: 'emailSent', email: emailMatch?.[1] }
  }
  if (normalized === ALREADY_ADMIN_MESSAGE) {
    return { type: 'alreadyAdmin' }
  }
  if (normalized === MISSING_EMAIL_MESSAGE) {
    return { type: 'missingEmail' }
  }
  if (normalized === NOT_FOUND_MESSAGE) {
    return { type: 'notFound' }
  }
  return { type: 'unknown' }
}

const LyceumRightsPage = () => {
  const { t } = useTranslation()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const requestSchema = useMemo(() => getLyceumRightsRequestSchema(t), [t])
  const verifySchema = useMemo(() => getLyceumRightsVerificationSchema(t), [t])
  const requestMutation = useRequestLyceumRightsMutation()
  const verifyMutation = useVerifyLyceumRightsMutation()
  const [requestedLyceum, setRequestedLyceum] =
    useState<LyceumRightsRequestFormValues | null>(null)
  const [requestOutcome, setRequestOutcome] = useState<RequestOutcome | null>(
    null,
  )

  const {
    register: registerRequest,
    handleSubmit: handleRequestSubmit,
    reset: resetRequest,
    watch: watchRequest,
    control,
    formState: { errors: requestErrors },
  } = useForm<LyceumRightsRequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      lyceumName: '',
      town: '',
    },
  })

  const {
    register: registerVerify,
    handleSubmit: handleVerifySubmit,
    reset: resetVerify,
    formState: { errors: verifyErrors },
  } = useForm<LyceumRightsVerificationFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      verificationCode: '',
    },
  })

  const selectedTown = watchRequest('town')
  const lyceumNameValue = watchRequest('lyceumName')
  const trimmedLyceumName = lyceumNameValue?.trim() ?? ''
  const shouldFetchSuggestions =
    Boolean(selectedTown) || Boolean(trimmedLyceumName)
  const {
    data: lyceumSuggestions,
    isLoading: isSuggestionsLoading,
    isError: isSuggestionsError,
  } = useLyceumSuggestions(selectedTown, {
    enabled: shouldFetchSuggestions,
  })

  const onRequestSubmit = (values: LyceumRightsRequestFormValues) => {
    setRequestOutcome(null)
    requestMutation.mutate(values, {
      onSuccess: (message) => {
        const outcome = parseRequestOutcome(message)
        setRequestOutcome(outcome)
        if (outcome.type === 'emailSent') {
          setRequestedLyceum(values)
          showToast({
            message: t('feedback.profile.lyceumRightsRequested'),
            tone: 'success',
          })
        } else {
          setRequestedLyceum(null)
        }
      },
      onError: (error) => {
        setRequestedLyceum(null)
        if (error.status === 409) {
          setRequestOutcome({ type: 'alreadyAdminOther' })
        }
      },
    })
  }

  const onVerifySubmit = (values: LyceumRightsVerificationFormValues) => {
    verifyMutation.mutate(values, {
      onSuccess: () => {
        showToast({
          message: t('feedback.profile.lyceumRightsVerified'),
          tone: 'success',
        })
        resetVerify()
        resetRequest()
        setRequestedLyceum(null)
        setRequestOutcome(null)
        navigate('/profile', { replace: true })
      },
    })
  }

  const handleStartOver = () => {
    setRequestedLyceum(null)
    setRequestOutcome(null)
    resetRequest()
    resetVerify()
    requestMutation.reset()
    verifyMutation.reset()
  }

  const requestErrorMessage = getRequestRightsErrorMessage(
    requestMutation.error ?? null,
    t,
  )
  const verifyErrorMessage = getVerifyRightsErrorMessage(
    verifyMutation.error ?? null,
    t,
  )
  const hasSelectedTown = Boolean(selectedTown)
  const isRequestLocked =
    requestOutcome?.type === 'alreadyAdmin' ||
    requestOutcome?.type === 'alreadyAdminOther'
  const hasRequested = requestOutcome?.type === 'emailSent'
  const shouldShowRequestError =
    Boolean(requestErrorMessage) && requestOutcome?.type !== 'alreadyAdminOther'

  const suggestionNames = useMemo(() => {
    if (!lyceumSuggestions) {
      return []
    }
    const query = lyceumNameValue?.trim().toLowerCase()
    const names = lyceumSuggestions
      .map((lyceum) => lyceum.name)
      .filter((name): name is string => Boolean(name))
    const filtered = query
      ? names.filter((name) => name.toLowerCase().includes(query))
      : names
    const uniqueNames = Array.from(new Set(filtered))
    return uniqueNames.slice(0, MAX_SUGGESTIONS)
  }, [hasSelectedTown, lyceumSuggestions, lyceumNameValue])

  const suggestionMessage = useMemo(() => {
    if (isRequestLocked) {
      return null
    }
    if (!hasSelectedTown && !trimmedLyceumName) {
      return t('pages.profile.lyceumRights.request.suggestions.selectTown')
    }
    if (isSuggestionsLoading) {
      return t('pages.profile.lyceumRights.request.suggestions.loading')
    }
    if (isSuggestionsError) {
      return t('pages.profile.lyceumRights.request.suggestions.error')
    }
    if (shouldFetchSuggestions && suggestionNames.length === 0) {
      return t('pages.profile.lyceumRights.request.suggestions.empty')
    }
    if (!trimmedLyceumName) {
      return t('pages.profile.lyceumRights.request.suggestions.hint')
    }
    return null
  }, [
    isRequestLocked,
    hasSelectedTown,
    trimmedLyceumName,
    isSuggestionsLoading,
    isSuggestionsError,
    suggestionNames.length,
    shouldFetchSuggestions,
    t,
  ])

  const suggestionMessageTone = isSuggestionsError
    ? 'text-rose-600'
    : shouldFetchSuggestions && suggestionNames.length === 0
      ? 'text-amber-700'
      : 'text-slate-500'

  const inputClassName = (hasError: boolean, extraClasses?: string) =>
    [
      'mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm transition',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
      'disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400',
      hasError
        ? 'border-rose-300 bg-rose-50/40 focus-visible:outline-rose-300'
        : 'border-slate-200 bg-white',
      extraClasses,
    ].join(' ')

  const getRequestOutcomeMessage = (outcome: RequestOutcome) => {
    switch (outcome.type) {
      case 'alreadyAdmin':
        return t('pages.profile.lyceumRights.request.outcomes.alreadyAdmin')
      case 'alreadyAdminOther':
        return t('pages.profile.lyceumRights.request.outcomes.alreadyAdminOther')
      case 'missingEmail':
        return t('pages.profile.lyceumRights.request.outcomes.missingEmail')
      case 'notFound':
        return t('pages.profile.lyceumRights.request.outcomes.notFound')
      case 'unknown':
        return t('pages.profile.lyceumRights.request.outcomes.unknown')
      default:
        return null
    }
  }

  const getOutcomeClassName = (outcome: RequestOutcome) => {
    if (outcome.type === 'alreadyAdmin' || outcome.type === 'alreadyAdminOther') {
      return 'border-rose-300 bg-rose-50 text-rose-800 border-l-rose-400'
    }
    return 'border-amber-300 bg-amber-50 text-amber-900 border-l-amber-400'
  }

  return (
    <section className="space-y-4">
      <Helmet>
        <title>{`${t('pages.profile.lyceumRights.title')} | ${t(
          'app.title',
        )}`}</title>
      </Helmet>
      <Link to="/profile" className="text-sm font-semibold text-brand">
        {t('pages.profile.lyceumRights.backLink')}
      </Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          {t('pages.profile.lyceumRights.title')}
        </h1>
        <p className="text-sm text-slate-600">
          {t('pages.profile.lyceumRights.subtitle')}
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
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
                    : t(
                        'pages.profile.lyceumRights.request.outcomes.emailFallback',
                      ),
                })}
              </div>
              <div className="text-xs font-medium text-slate-500">
                {t('pages.profile.lyceumRights.request.outcomes.requestedLyceum', {
                  lyceumName: requestedLyceum?.lyceumName ?? '',
                  town: requestedLyceum?.town ?? '',
                })}
              </div>
              <button
                type="button"
                onClick={handleStartOver}
                disabled={verifyMutation.isPending}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-400"
              >
                {t('pages.profile.lyceumRights.request.startOver')}
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleRequestSubmit(onRequestSubmit)}
              className="mt-4 space-y-4"
              aria-busy={requestMutation.isPending}
            >
              {requestOutcome ? (
                <div
                  className={[
                    'rounded-lg border border-l-4 px-3 py-2 text-sm font-semibold',
                    getOutcomeClassName(requestOutcome),
                  ].join(' ')}
                  role="status"
                >
                  {getRequestOutcomeMessage(requestOutcome)}
                </div>
              ) : null}
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
                  aria-invalid={Boolean(requestErrors.lyceumName)}
                  aria-describedby={
                    requestErrors.lyceumName
                      ? 'lyceum-rights-name-error'
                      : undefined
                  }
                  disabled={requestMutation.isPending || isRequestLocked}
                  className={inputClassName(Boolean(requestErrors.lyceumName))}
                  {...registerRequest('lyceumName')}
                />
                <datalist id="lyceum-rights-suggestions">
                  {suggestionNames.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
                {requestErrors.lyceumName ? (
                  <p
                    id="lyceum-rights-name-error"
                    className="mt-1 text-xs text-rose-600"
                    role="alert"
                  >
                    {requestErrors.lyceumName.message}
                  </p>
                ) : null}
                {suggestionMessage ? (
                  <p className={`mt-2 text-xs ${suggestionMessageTone}`}>
                    {suggestionMessage}
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
                      disabled={requestMutation.isPending || isRequestLocked}
                      hasError={Boolean(requestErrors.town)}
                      describedById={
                        requestErrors.town ? 'lyceum-rights-town-error' : undefined
                      }
                    />
                  )}
                />
                {requestErrors.town ? (
                  <p
                    id="lyceum-rights-town-error"
                    className="mt-1 text-xs text-rose-600"
                    role="alert"
                  >
                    {requestErrors.town.message}
                  </p>
                ) : null}
              </div>
              {shouldShowRequestError ? (
                <div
                  className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
                  role="alert"
                >
                  {requestErrorMessage}
                </div>
              ) : null}
              <button
                type="submit"
                disabled={requestMutation.isPending || isRequestLocked}
                className="inline-flex w-full items-center justify-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {requestMutation.isPending
                  ? t('pages.profile.lyceumRights.request.form.submitting')
                  : t('pages.profile.lyceumRights.request.form.submit')}
              </button>
            </form>
          )}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">
            {t('pages.profile.lyceumRights.verify.title')}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {t('pages.profile.lyceumRights.verify.description')}
          </p>
          {hasRequested ? (
            <form
              onSubmit={handleVerifySubmit(onVerifySubmit)}
              className="mt-4 space-y-4"
              aria-busy={verifyMutation.isPending}
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
                  aria-invalid={Boolean(verifyErrors.verificationCode)}
                  aria-describedby={
                    verifyErrors.verificationCode
                      ? 'lyceum-rights-code-error'
                      : undefined
                  }
                  className={inputClassName(
                    Boolean(verifyErrors.verificationCode),
                  )}
                  {...registerVerify('verificationCode')}
                />
                {verifyErrors.verificationCode ? (
                  <p
                    id="lyceum-rights-code-error"
                    className="mt-1 text-xs text-rose-600"
                    role="alert"
                  >
                    {verifyErrors.verificationCode.message}
                  </p>
                ) : null}
              </div>
              {verifyErrorMessage ? (
                <div
                  className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
                  role="alert"
                >
                  {verifyErrorMessage}
                </div>
              ) : null}
              <button
                type="submit"
                disabled={verifyMutation.isPending}
                className="inline-flex w-full items-center justify-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {verifyMutation.isPending
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
      </div>
    </section>
  )
}

export default LyceumRightsPage
