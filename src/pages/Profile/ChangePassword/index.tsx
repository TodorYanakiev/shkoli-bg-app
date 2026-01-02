import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import PasswordVisibilityToggle from '../../../components/form/PasswordVisibilityToggle'
import { useToast } from '../../../components/feedback/ToastProvider'
import type { ApiError } from '../../../types/api'
import {
  getChangePasswordSchema,
  type ChangePasswordFormValues,
} from '../../../validations/users'
import { useChangePasswordMutation } from '../hooks/useChangePasswordMutation'

const getChangePasswordErrorMessage = (
  error: ApiError | null,
  t: (key: string) => string,
) => {
  if (!error) return null
  if (error.kind === 'network') {
    return t('errors.network')
  }
  return t('errors.profile.changePasswordFailed')
}

const ChangePasswordPage = () => {
  const { t, i18n } = useTranslation()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const schema = useMemo(() => getChangePasswordSchema(t), [t, i18n.language])
  const mutation = useChangePasswordMutation()
  const [isCurrentVisible, setIsCurrentVisible] = useState(false)
  const [isNewVisible, setIsNewVisible] = useState(false)
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmationPassword: '',
    },
  })

  const onSubmit = (values: ChangePasswordFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        showToast({
          message: t('feedback.profile.passwordChanged'),
          tone: 'success',
        })
        reset()
        navigate('/profile', { replace: true })
      },
    })
  }

  const errorMessage = getChangePasswordErrorMessage(mutation.error ?? null, t)

  const inputClassName = (hasError: boolean, extraClasses?: string) =>
    [
      'mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm transition',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
      hasError
        ? 'border-rose-300 bg-rose-50/40 focus-visible:outline-rose-300'
        : 'border-slate-200 bg-white',
      extraClasses,
    ].join(' ')

  const getToggleLabel = (isVisible: boolean) =>
    isVisible ? t('form.passwordToggle.hide') : t('form.passwordToggle.show')


  return (
    <section className="space-y-4">
      <Helmet>
        <title>{`${t('pages.profile.changePassword.title')} | ${t(
          'app.title',
        )}`}</title>
      </Helmet>
      <Link to="/profile" className="text-sm font-semibold text-brand">
        {t('pages.profile.changePassword.backLink')}
      </Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          {t('pages.profile.changePassword.title')}
        </h1>
        <p className="text-sm text-slate-600">
          {t('pages.profile.changePassword.subtitle')}
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        aria-busy={mutation.isPending}
      >
        <div>
          <label
            htmlFor="change-password-current"
            className="text-sm font-semibold text-slate-800"
          >
            {t('pages.profile.changePassword.form.currentPasswordLabel')}
          </label>
          <div className="relative mt-1">
            <input
              id="change-password-current"
              type={isCurrentVisible ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder={t(
                'pages.profile.changePassword.form.currentPasswordPlaceholder',
              )}
              aria-invalid={Boolean(errors.currentPassword)}
              aria-describedby={
                errors.currentPassword ? 'change-password-current-error' : undefined
              }
              className={inputClassName(
                Boolean(errors.currentPassword),
                'pr-14 mt-0',
              )}
              {...register('currentPassword')}
            />
            <PasswordVisibilityToggle
              isVisible={isCurrentVisible}
              onToggle={() => setIsCurrentVisible((prev) => !prev)}
              ariaLabel={getToggleLabel(isCurrentVisible)}
            />
          </div>
          {errors.currentPassword ? (
            <p
              id="change-password-current-error"
              className="mt-1 text-xs text-rose-600"
              role="alert"
            >
              {errors.currentPassword.message}
            </p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="change-password-new"
            className="text-sm font-semibold text-slate-800"
          >
            {t('pages.profile.changePassword.form.newPasswordLabel')}
          </label>
          <div className="relative mt-1">
            <input
              id="change-password-new"
              type={isNewVisible ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder={t(
                'pages.profile.changePassword.form.newPasswordPlaceholder',
              )}
              aria-invalid={Boolean(errors.newPassword)}
              aria-describedby={
                errors.newPassword ? 'change-password-new-error' : undefined
              }
              className={inputClassName(Boolean(errors.newPassword), 'pr-14 mt-0')}
              {...register('newPassword')}
            />
            <PasswordVisibilityToggle
              isVisible={isNewVisible}
              onToggle={() => setIsNewVisible((prev) => !prev)}
              ariaLabel={getToggleLabel(isNewVisible)}
            />
          </div>
          {errors.newPassword ? (
            <p
              id="change-password-new-error"
              className="mt-1 text-xs text-rose-600"
              role="alert"
            >
              {errors.newPassword.message}
            </p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="change-password-confirm"
            className="text-sm font-semibold text-slate-800"
          >
            {t('pages.profile.changePassword.form.confirmationPasswordLabel')}
          </label>
          <div className="relative mt-1">
            <input
              id="change-password-confirm"
              type={isConfirmationVisible ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder={t(
                'pages.profile.changePassword.form.confirmationPasswordPlaceholder',
              )}
              aria-invalid={Boolean(errors.confirmationPassword)}
              aria-describedby={
                errors.confirmationPassword
                  ? 'change-password-confirm-error'
                  : undefined
              }
              className={inputClassName(
                Boolean(errors.confirmationPassword),
                'pr-14 mt-0',
              )}
              {...register('confirmationPassword')}
            />
            <PasswordVisibilityToggle
              isVisible={isConfirmationVisible}
              onToggle={() => setIsConfirmationVisible((prev) => !prev)}
              ariaLabel={getToggleLabel(isConfirmationVisible)}
            />
          </div>
          {errors.confirmationPassword ? (
            <p
              id="change-password-confirm-error"
              className="mt-1 text-xs text-rose-600"
              role="alert"
            >
              {errors.confirmationPassword.message}
            </p>
          ) : null}
        </div>
        {errorMessage ? (
          <div
            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
            role="alert"
          >
            {errorMessage}
          </div>
        ) : null}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex w-full items-center justify-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {mutation.isPending
            ? t('pages.profile.changePassword.form.submitting')
            : t('pages.profile.changePassword.form.submit')}
        </button>
      </form>
    </section>
  )
}

export default ChangePasswordPage
