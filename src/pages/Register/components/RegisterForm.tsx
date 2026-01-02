import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import PasswordVisibilityToggle from '../../../components/form/PasswordVisibilityToggle'
import { useToast } from '../../../components/feedback/ToastContext'
import { useRegisterMutation } from '../hooks/useRegisterMutation'
import type { ApiError } from '../../../types/api'
import { setTokens } from '../../../utils/authStorage'
import {
  getRegisterSchema,
  type RegisterFormValues,
} from '../../../validations/auth'

const getRegisterErrorMessage = (
  error: ApiError | null,
  t: (key: string) => string,
) => {
  if (!error) return null

  if (error.kind === 'network') {
    return t('errors.network')
  }

  if (error.status === 409) {
    return t('errors.auth.userExists')
  }

  return t('errors.auth.registerFailed')
}

const RegisterForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const schema = useMemo(() => getRegisterSchema(t), [t])
  const mutation = useRegisterMutation()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isRepeatVisible, setIsRepeatVisible] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstname: '',
      lastname: '',
      username: '',
      email: '',
      password: '',
      repeatedPassword: '',
    },
  })

  const onSubmit = (values: RegisterFormValues) => {
    mutation.mutate(values, {
      onSuccess: (data) => {
        setTokens({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        })
        showToast({
          message: t('feedback.auth.registerSuccess'),
          tone: 'success',
        })
        navigate('/shkoli', { replace: true })
      },
    })
  }

  const errorMessage = getRegisterErrorMessage(mutation.error ?? null, t)

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
      className="mt-6 w-full max-w-2xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      aria-busy={mutation.isPending}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="register-firstname"
            className="text-sm font-semibold text-slate-800"
          >
            {t('pages.register.form.firstnameLabel')}
          </label>
          <input
            id="register-firstname"
            type="text"
            autoComplete="given-name"
            placeholder={t('pages.register.form.firstnamePlaceholder')}
            aria-invalid={Boolean(errors.firstname)}
            aria-describedby={
              errors.firstname ? 'register-firstname-error' : undefined
            }
            className={inputClassName(Boolean(errors.firstname))}
            {...register('firstname')}
          />
          {errors.firstname ? (
            <p
              id="register-firstname-error"
              className="mt-1 text-xs text-rose-600"
              role="alert"
            >
              {errors.firstname.message}
            </p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="register-lastname"
            className="text-sm font-semibold text-slate-800"
          >
            {t('pages.register.form.lastnameLabel')}
          </label>
          <input
            id="register-lastname"
            type="text"
            autoComplete="family-name"
            placeholder={t('pages.register.form.lastnamePlaceholder')}
            aria-invalid={Boolean(errors.lastname)}
            aria-describedby={
              errors.lastname ? 'register-lastname-error' : undefined
            }
            className={inputClassName(Boolean(errors.lastname))}
            {...register('lastname')}
          />
          {errors.lastname ? (
            <p
              id="register-lastname-error"
              className="mt-1 text-xs text-rose-600"
              role="alert"
            >
              {errors.lastname.message}
            </p>
          ) : null}
        </div>
      </div>
      <div>
        <label
          htmlFor="register-username"
          className="text-sm font-semibold text-slate-800"
        >
          {t('pages.register.form.usernameLabel')}
        </label>
        <input
          id="register-username"
          type="text"
          autoComplete="username"
          placeholder={t('pages.register.form.usernamePlaceholder')}
          aria-invalid={Boolean(errors.username)}
          aria-describedby={errors.username ? 'register-username-error' : undefined}
          className={inputClassName(Boolean(errors.username))}
          {...register('username')}
        />
        {errors.username ? (
          <p
            id="register-username-error"
            className="mt-1 text-xs text-rose-600"
            role="alert"
          >
            {errors.username.message}
          </p>
        ) : null}
      </div>
      <div>
        <label
          htmlFor="register-email"
          className="text-sm font-semibold text-slate-800"
        >
          {t('pages.register.form.emailLabel')}
        </label>
        <input
          id="register-email"
          type="email"
          autoComplete="email"
          placeholder={t('pages.register.form.emailPlaceholder')}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'register-email-error' : undefined}
          className={inputClassName(Boolean(errors.email))}
          {...register('email')}
        />
        {errors.email ? (
          <p
            id="register-email-error"
            className="mt-1 text-xs text-rose-600"
            role="alert"
          >
            {errors.email.message}
          </p>
        ) : null}
      </div>
      <div>
        <label
          htmlFor="register-password"
          className="text-sm font-semibold text-slate-800"
        >
          {t('pages.register.form.passwordLabel')}
        </label>
        <div className="relative mt-1">
          <input
            id="register-password"
            type={isPasswordVisible ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder={t('pages.register.form.passwordPlaceholder')}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? 'register-password-error' : undefined
            }
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
            id="register-password-error"
            className="mt-1 text-xs text-rose-600"
            role="alert"
          >
            {errors.password.message}
          </p>
        ) : null}
      </div>
      <div>
        <label
          htmlFor="register-password-repeat"
          className="text-sm font-semibold text-slate-800"
        >
          {t('pages.register.form.repeatedPasswordLabel')}
        </label>
        <div className="relative mt-1">
          <input
            id="register-password-repeat"
            type={isRepeatVisible ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder={t('pages.register.form.repeatedPasswordPlaceholder')}
            aria-invalid={Boolean(errors.repeatedPassword)}
            aria-describedby={
              errors.repeatedPassword
                ? 'register-repeated-password-error'
                : undefined
            }
            className={inputClassName(
              Boolean(errors.repeatedPassword),
              'pr-14 mt-0',
            )}
            {...register('repeatedPassword')}
          />
          <PasswordVisibilityToggle
            isVisible={isRepeatVisible}
            onToggle={() => setIsRepeatVisible((prev) => !prev)}
            ariaLabel={getToggleLabel(isRepeatVisible)}
          />
        </div>
        {errors.repeatedPassword ? (
          <p
            id="register-repeated-password-error"
            className="mt-1 text-xs text-rose-600"
            role="alert"
          >
            {errors.repeatedPassword.message}
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
          ? t('pages.register.form.submitting')
          : t('pages.register.form.submit')}
      </button>
      <p className="text-sm text-slate-600">
        {t('pages.register.form.loginPrompt')}{' '}
        <Link to="/auth/login" className="font-semibold text-brand">
          {t('pages.register.form.loginLink')}
        </Link>
      </p>
    </form>
  )
}

export default RegisterForm
