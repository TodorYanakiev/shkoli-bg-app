import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import PasswordVisibilityToggle from '../../../components/form/PasswordVisibilityToggle'
import { useLoginMutation } from '../hooks/useLoginMutation'
import { useToast } from '../../../components/feedback/ToastProvider'
import type { ApiError } from '../../../types/api'
import { setTokens } from '../../../utils/authStorage'
import {
  getLoginSchema,
  type LoginFormValues,
} from '../../../validations/auth'

const getLoginErrorMessage = (error: ApiError | null, t: (key: string) => string) => {
  if (!error) return null

  if (error.kind === 'unauthorized') {
    return t('pages.login.form.errors.invalidCredentials')
  }

  if (error.kind === 'forbidden') {
    return t('errors.auth.forbidden')
  }

  if (error.kind === 'network') {
    return t('errors.network')
  }

  return t('errors.generic')
}

const LoginForm = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const schema = useMemo(() => getLoginSchema(t), [t, i18n.language])
  const mutation = useLoginMutation()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (values: LoginFormValues) => {
    mutation.mutate(values, {
      onSuccess: (data) => {
        setTokens({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        })
        showToast({
          message: t('feedback.auth.loginSuccess'),
          tone: 'success',
        })
        navigate('/shkoli', { replace: true })
      },
    })
  }

  const errorMessage = getLoginErrorMessage(mutation.error ?? null, t)

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-6 w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      aria-busy={mutation.isPending}
    >
      <div>
        <label
          htmlFor="login-email"
          className="text-sm font-semibold text-slate-800"
        >
          {t('pages.login.form.emailLabel')}
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder={t('pages.login.form.emailPlaceholder')}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'login-email-error' : undefined}
          className={inputClassName(Boolean(errors.email))}
          {...register('email')}
        />
        {errors.email ? (
          <p
            id="login-email-error"
            className="mt-1 text-xs text-rose-600"
            role="alert"
          >
            {errors.email.message}
          </p>
        ) : null}
      </div>
      <div>
        <label
          htmlFor="login-password"
          className="text-sm font-semibold text-slate-800"
        >
          {t('pages.login.form.passwordLabel')}
        </label>
        <div className="relative mt-1">
          <input
            id="login-password"
            type={isPasswordVisible ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder={t('pages.login.form.passwordPlaceholder')}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'login-password-error' : undefined}
            className={inputClassName(Boolean(errors.password), 'pr-14 mt-0')}
            {...register('password')}
          />
          <PasswordVisibilityToggle
            isVisible={isPasswordVisible}
            onToggle={() => setIsPasswordVisible((prev) => !prev)}
            ariaLabel={getToggleLabel(isPasswordVisible)}
          />
        </div>
        {errors.password ? (
          <p
            id="login-password-error"
            className="mt-1 text-xs text-rose-600"
            role="alert"
          >
            {errors.password.message}
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
          ? t('pages.login.form.submitting')
          : t('pages.login.form.submit')}
      </button>
    </form>
  )
}

export default LoginForm
