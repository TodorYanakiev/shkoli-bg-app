import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import PasswordVisibilityToggle from '../../components/form/PasswordVisibilityToggle'
import { useToast } from '../../components/feedback/ToastContext'
import SeoHead from '../../components/ui/SeoHead'
import { useCurrentLocale } from '../../hooks/useCurrentLocale'
import { useLocalizedNavigate } from '../../hooks/useLocalizedNavigate'
import { useLocalizedPath } from '../../hooks/useLocalizedPath'
import { clearTokens } from '../../utils/authStorage'
import {
  getForgotPasswordRequestSchema,
  getPasswordResetCodeVerificationSchema,
  getResetForgottenPasswordSchema,
  type ForgotPasswordRequestFormValues,
  type PasswordResetCodeVerificationFormValues,
  type ResetForgottenPasswordFormValues,
} from '../../validations/auth'
import { useRequestPasswordResetMutation } from './hooks/useRequestPasswordResetMutation'
import { useResetForgottenPasswordMutation } from './hooks/useResetForgottenPasswordMutation'
import { useVerifyPasswordResetCodeMutation } from './hooks/useVerifyPasswordResetCodeMutation'
import {
  getPasswordResetErrorMessage,
  getPasswordResetSuccessMessage,
} from './services/passwordResetMessages'

type PasswordResetStep = 'request' | 'verify' | 'reset'

const getInputClassName = (hasError: boolean, extraClasses?: string) =>
  [
    'mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm transition',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
    hasError
      ? 'border-rose-300 bg-rose-50/40 focus-visible:outline-rose-300'
      : 'border-slate-200 bg-white',
    extraClasses,
  ].join(' ')

const ForgotPasswordPage = () => {
  const { t } = useTranslation()
  const locale = useCurrentLocale()
  const navigate = useLocalizedNavigate()
  const localizedPath = useLocalizedPath()
  const { showToast } = useToast()
  const requestMutation = useRequestPasswordResetMutation()
  const verifyMutation = useVerifyPasswordResetCodeMutation()
  const resetMutation = useResetForgottenPasswordMutation()
  const requestSchema = useMemo(
    () => getForgotPasswordRequestSchema(t),
    [t],
  )
  const verifySchema = useMemo(
    () => getPasswordResetCodeVerificationSchema(t),
    [t],
  )
  const resetSchema = useMemo(
    () => getResetForgottenPasswordSchema(t),
    [t],
  )
  const [step, setStep] = useState<PasswordResetStep>('request')
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false)
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false)

  const requestForm = useForm<ForgotPasswordRequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      email: '',
    },
  })
  const verifyForm = useForm<PasswordResetCodeVerificationFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      verificationCode: '',
    },
  })
  const resetForm = useForm<ResetForgottenPasswordFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      newPassword: '',
      confirmationPassword: '',
    },
  })

  const resetCodeState = () => {
    setVerificationCode('')
    verifyForm.reset({ verificationCode: '' })
    resetForm.reset({
      newPassword: '',
      confirmationPassword: '',
    })
    verifyMutation.reset()
    resetMutation.reset()
  }

  const handleRequestSubmit = (values: ForgotPasswordRequestFormValues) => {
    const normalizedEmail = values.email.trim()

    requestMutation.mutate(
      { email: normalizedEmail },
      {
        onSuccess: (message) => {
          setEmail(normalizedEmail)
          resetCodeState()
          setStep('verify')
          showToast({
            message: getPasswordResetSuccessMessage('request', message, t),
            tone: 'success',
          })
        },
      },
    )
  }

  const handleVerifySubmit = (
    values: PasswordResetCodeVerificationFormValues,
  ) => {
    const normalizedCode = values.verificationCode.trim()

    verifyMutation.mutate(
      {
        email,
        verificationCode: normalizedCode,
      },
      {
        onSuccess: (message) => {
          setVerificationCode(normalizedCode)
          resetMutation.reset()
          resetForm.reset({
            newPassword: '',
            confirmationPassword: '',
          })
          setStep('reset')
          showToast({
            message: getPasswordResetSuccessMessage('verify', message, t),
            tone: 'success',
          })
        },
      },
    )
  }

  const handleResetSubmit = (values: ResetForgottenPasswordFormValues) => {
    resetMutation.mutate(
      {
        email,
        verificationCode,
        newPassword: values.newPassword,
        confirmationPassword: values.confirmationPassword,
      },
      {
        onSuccess: (message) => {
          clearTokens()
          showToast({
            message: getPasswordResetSuccessMessage('reset', message, t),
            tone: 'success',
          })
          requestForm.reset({ email: '' })
          resetCodeState()
          setEmail('')
          setStep('request')
          navigate('/auth/login', { replace: true })
        },
      },
    )
  }

  const handleUseDifferentEmail = () => {
    setStep('request')
    setEmail('')
    resetCodeState()
    requestMutation.reset()
  }

  const requestErrorMessage = getPasswordResetErrorMessage(
    'request',
    requestMutation.error ?? null,
    t,
  )
  const verifyErrorMessage = getPasswordResetErrorMessage(
    'verify',
    verifyMutation.error ?? null,
    t,
  )
  const resetErrorMessage = getPasswordResetErrorMessage(
    'reset',
    resetMutation.error ?? null,
    t,
  )
  const getToggleLabel = (isVisible: boolean) =>
    isVisible ? t('form.passwordToggle.hide') : t('form.passwordToggle.show')
  const isBusy =
    requestMutation.isPending ||
    verifyMutation.isPending ||
    resetMutation.isPending

  return (
    <section className="space-y-4">
      <SeoHead
        title={`${t('pages.forgotPassword.title')} | ${t('app.title')}`}
        description={t('pages.forgotPassword.subtitle')}
        canonicalPath="/auth/forgot-password"
        locale={locale}
        forceNoindex
      />
      <Link
        to={localizedPath('/auth/login')}
        className="text-sm font-semibold text-brand"
      >
        {t('pages.forgotPassword.backToLogin')}
      </Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          {t('pages.forgotPassword.title')}
        </h1>
        <p className="mt-1 max-w-xl text-sm text-slate-600">
          {t('pages.forgotPassword.subtitle')}
        </p>
      </div>

      <div className="w-full max-w-xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-3 gap-2" aria-label={t('pages.forgotPassword.steps.label')}>
          {(['request', 'verify', 'reset'] as const).map((item, index) => {
            const isActive = step === item
            return (
              <div
                key={item}
                className={[
                  'rounded-lg border px-3 py-2 text-xs font-semibold',
                  isActive
                    ? 'border-brand bg-brand/10 text-brand-dark'
                    : 'border-slate-200 bg-slate-50 text-slate-500',
                ].join(' ')}
              >
                <span className="block text-[11px] text-slate-500">
                  {t('pages.forgotPassword.steps.step', {
                    number: index + 1,
                  })}
                </span>
                {t(`pages.forgotPassword.steps.${item}`)}
              </div>
            )
          })}
        </div>

        {step === 'request' ? (
          <form
            onSubmit={requestForm.handleSubmit(handleRequestSubmit)}
            className="space-y-4"
            aria-busy={requestMutation.isPending}
          >
            <div>
              <label
                htmlFor="forgot-password-email"
                className="text-sm font-semibold text-slate-800"
              >
                {t('pages.forgotPassword.request.emailLabel')}
              </label>
              <input
                data-testid="forgot-password-email"
                id="forgot-password-email"
                type="email"
                autoComplete="email"
                placeholder={t(
                  'pages.forgotPassword.request.emailPlaceholder',
                )}
                aria-invalid={Boolean(requestForm.formState.errors.email)}
                aria-describedby={
                  requestForm.formState.errors.email
                    ? 'forgot-password-email-error'
                    : undefined
                }
                className={getInputClassName(
                  Boolean(requestForm.formState.errors.email),
                )}
                {...requestForm.register('email')}
              />
              {requestForm.formState.errors.email ? (
                <p
                  id="forgot-password-email-error"
                  className="mt-1 text-xs text-rose-600"
                  role="alert"
                >
                  {requestForm.formState.errors.email.message}
                </p>
              ) : null}
            </div>
            {requestErrorMessage ? (
              <div
                className="whitespace-pre-line rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
                role="alert"
              >
                {requestErrorMessage}
              </div>
            ) : null}
            <button
              data-testid="forgot-password-request-submit"
              type="submit"
              disabled={isBusy}
              className="inline-flex w-full items-center justify-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {requestMutation.isPending
                ? t('pages.forgotPassword.request.submitting')
                : t('pages.forgotPassword.request.submit')}
            </button>
          </form>
        ) : null}

        {step === 'verify' ? (
          <form
            onSubmit={verifyForm.handleSubmit(handleVerifySubmit)}
            className="space-y-4"
            aria-busy={verifyMutation.isPending}
          >
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {t('pages.forgotPassword.verify.emailSent', { email })}
            </div>
            <div>
              <label
                htmlFor="forgot-password-code"
                className="text-sm font-semibold text-slate-800"
              >
                {t('pages.forgotPassword.verify.codeLabel')}
              </label>
              <input
                data-testid="forgot-password-code"
                id="forgot-password-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder={t('pages.forgotPassword.verify.codePlaceholder')}
                aria-invalid={Boolean(
                  verifyForm.formState.errors.verificationCode,
                )}
                aria-describedby={
                  verifyForm.formState.errors.verificationCode
                    ? 'forgot-password-code-error'
                    : undefined
                }
                className={getInputClassName(
                  Boolean(verifyForm.formState.errors.verificationCode),
                )}
                {...verifyForm.register('verificationCode')}
              />
              {verifyForm.formState.errors.verificationCode ? (
                <p
                  id="forgot-password-code-error"
                  className="mt-1 text-xs text-rose-600"
                  role="alert"
                >
                  {verifyForm.formState.errors.verificationCode.message}
                </p>
              ) : null}
            </div>
            {verifyErrorMessage ? (
              <div
                className="whitespace-pre-line rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
                role="alert"
              >
                {verifyErrorMessage}
              </div>
            ) : null}
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                data-testid="forgot-password-verify-submit"
                type="submit"
                disabled={isBusy}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {verifyMutation.isPending
                  ? t('pages.forgotPassword.verify.submitting')
                  : t('pages.forgotPassword.verify.submit')}
              </button>
              <button
                type="button"
                disabled={isBusy}
                onClick={handleUseDifferentEmail}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:text-slate-400"
              >
                {t('pages.forgotPassword.useDifferentEmail')}
              </button>
            </div>
          </form>
        ) : null}

        {step === 'reset' ? (
          <form
            onSubmit={resetForm.handleSubmit(handleResetSubmit)}
            className="space-y-4"
            aria-busy={resetMutation.isPending}
          >
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {t('pages.forgotPassword.reset.codeConfirmed', { email })}
            </div>
            <div>
              <label
                htmlFor="forgot-password-new"
                className="text-sm font-semibold text-slate-800"
              >
                {t('pages.forgotPassword.reset.newPasswordLabel')}
              </label>
              <div className="relative mt-1">
                <input
                  data-testid="forgot-password-new-password"
                  id="forgot-password-new"
                  type={isNewPasswordVisible ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder={t(
                    'pages.forgotPassword.reset.newPasswordPlaceholder',
                  )}
                  aria-invalid={Boolean(resetForm.formState.errors.newPassword)}
                  aria-describedby={
                    resetForm.formState.errors.newPassword
                      ? 'forgot-password-new-error'
                      : undefined
                  }
                  className={getInputClassName(
                    Boolean(resetForm.formState.errors.newPassword),
                    'pr-14 mt-0',
                  )}
                  {...resetForm.register('newPassword')}
                />
                <PasswordVisibilityToggle
                  isVisible={isNewPasswordVisible}
                  onToggle={() => setIsNewPasswordVisible((prev) => !prev)}
                  ariaLabel={getToggleLabel(isNewPasswordVisible)}
                />
              </div>
              {resetForm.formState.errors.newPassword ? (
                <p
                  id="forgot-password-new-error"
                  className="mt-1 text-xs text-rose-600"
                  role="alert"
                >
                  {resetForm.formState.errors.newPassword.message}
                </p>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="forgot-password-confirm"
                className="text-sm font-semibold text-slate-800"
              >
                {t('pages.forgotPassword.reset.confirmationPasswordLabel')}
              </label>
              <div className="relative mt-1">
                <input
                  data-testid="forgot-password-confirm-password"
                  id="forgot-password-confirm"
                  type={isConfirmationVisible ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder={t(
                    'pages.forgotPassword.reset.confirmationPasswordPlaceholder',
                  )}
                  aria-invalid={Boolean(
                    resetForm.formState.errors.confirmationPassword,
                  )}
                  aria-describedby={
                    resetForm.formState.errors.confirmationPassword
                      ? 'forgot-password-confirm-error'
                      : undefined
                  }
                  className={getInputClassName(
                    Boolean(resetForm.formState.errors.confirmationPassword),
                    'pr-14 mt-0',
                  )}
                  {...resetForm.register('confirmationPassword')}
                />
                <PasswordVisibilityToggle
                  isVisible={isConfirmationVisible}
                  onToggle={() => setIsConfirmationVisible((prev) => !prev)}
                  ariaLabel={getToggleLabel(isConfirmationVisible)}
                />
              </div>
              {resetForm.formState.errors.confirmationPassword ? (
                <p
                  id="forgot-password-confirm-error"
                  className="mt-1 text-xs text-rose-600"
                  role="alert"
                >
                  {resetForm.formState.errors.confirmationPassword.message}
                </p>
              ) : null}
            </div>
            {resetErrorMessage ? (
              <div
                className="whitespace-pre-line rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
                role="alert"
              >
                {resetErrorMessage}
              </div>
            ) : null}
            <button
              data-testid="forgot-password-reset-submit"
              type="submit"
              disabled={isBusy}
              className="inline-flex w-full items-center justify-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {resetMutation.isPending
                ? t('pages.forgotPassword.reset.submitting')
                : t('pages.forgotPassword.reset.submit')}
            </button>
          </form>
        ) : null}
      </div>
    </section>
  )
}

export default ForgotPasswordPage
