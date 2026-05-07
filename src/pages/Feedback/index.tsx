import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useToast } from '../../components/feedback/ToastContext'
import SeoHead from '../../components/ui/SeoHead'
import { useCurrentLocale } from '../../hooks/useCurrentLocale'
import { useLocalizedPath } from '../../hooks/useLocalizedPath'
import type { ApiError } from '../../types/api'
import type { FeedbackResponse } from '../../types/feedback'
import {
  getFeedbackSchema,
  type FeedbackFormValues,
} from '../../validations/feedback'
import { useCreateFeedbackMutation } from './hooks/useCreateFeedbackMutation'
import { applyFeedbackServerFieldErrors } from './services/feedbackFieldErrors'

const MESSAGE_MAX_LENGTH = 5000

const getFeedbackErrorMessage = (
  error: ApiError | null,
  t: (key: string) => string,
) => {
  if (!error) return null

  if (error.kind === 'network') {
    return t('errors.network')
  }

  if (error.status === 400) {
    return t('errors.feedback.submitInvalid')
  }

  if (error.status >= 500) {
    return t('errors.feedback.server')
  }

  return t('errors.feedback.submitFailed')
}

const inputClassName = (hasError: boolean, extraClasses?: string) =>
  [
    'mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm transition',
    'placeholder:text-slate-400',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
    hasError
      ? 'border-rose-300 bg-rose-50/40 focus-visible:outline-rose-300'
      : 'border-slate-200 bg-white',
    extraClasses,
  ].join(' ')

const SupportIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
  >
    <path
      d="M4.5 7.5A3.5 3.5 0 0 1 8 4h8a3.5 3.5 0 0 1 3.5 3.5v5A3.5 3.5 0 0 1 16 16h-3.6l-3.7 3.2A.75.75 0 0 1 7.5 18.6V16H8a3.5 3.5 0 0 1-3.5-3.5v-5Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.3 8.2h7.4M8.3 11.4h4.9"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
)

const FeedbackPage = () => {
  const { t } = useTranslation()
  const locale = useCurrentLocale()
  const localizedPath = useLocalizedPath()
  const { showToast } = useToast()
  const schema = useMemo(() => getFeedbackSchema(t), [t])
  const mutation = useCreateFeedbackMutation()
  const [submittedFeedback, setSubmittedFeedback] =
    useState<FeedbackResponse | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors },
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      title: '',
      message: '',
    },
  })

  const messageLength = watch('message')?.length ?? 0
  const errorMessage = getFeedbackErrorMessage(mutation.error ?? null, t)

  const onSubmit = (values: FeedbackFormValues) => {
    setSubmittedFeedback(null)
    const payload = {
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      title: values.title.trim(),
      message: values.message.trim(),
    }

    mutation.mutate(payload, {
      onSuccess: (feedback) => {
        setSubmittedFeedback(feedback)
        reset()
        showToast({
          message: t('feedback.support.submitted'),
          tone: 'success',
        })
      },
      onError: (error) => {
        applyFeedbackServerFieldErrors({
          error,
          setError,
          t,
        })
      },
    })
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6">
      <SeoHead
        title={`${t('pages.feedback.title')} | ${t('app.title')}`}
        description={t('pages.feedback.subtitle')}
        canonicalPath="/help"
        locale={locale}
        breadcrumbs={[
          { label: t('nav.shkoli'), path: '/shkoli' },
          { label: t('pages.feedback.title'), path: '/help' },
        ]}
      />

      <Link
        to={localizedPath('/shkoli')}
        className="inline-flex text-sm font-semibold text-brand transition hover:text-brand-dark"
      >
        {t('pages.feedback.backLink')}
      </Link>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.48fr)] lg:items-start">
        <div className="space-y-5">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-brand-dark">
              <SupportIcon />
              {t('pages.feedback.kicker')}
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-slate-950 sm:text-4xl">
              {t('pages.feedback.title')}
            </h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
              {t('pages.feedback.subtitle')}
            </p>
          </div>

          {submittedFeedback ? (
            <div
              className="max-w-3xl rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
              role="status"
            >
              {t('pages.feedback.successMessage')}
            </div>
          ) : null}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-3xl space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            aria-busy={mutation.isPending}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="feedback-full-name"
                  className="text-sm font-semibold text-slate-800"
                >
                  {t('pages.feedback.form.fullNameLabel')}
                </label>
                <input
                  id="feedback-full-name"
                  type="text"
                  autoComplete="name"
                  placeholder={t('pages.feedback.form.fullNamePlaceholder')}
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={
                    errors.fullName ? 'feedback-full-name-error' : undefined
                  }
                  className={inputClassName(Boolean(errors.fullName))}
                  {...register('fullName')}
                />
                {errors.fullName ? (
                  <p
                    id="feedback-full-name-error"
                    className="mt-1 text-xs text-rose-600"
                    role="alert"
                  >
                    {errors.fullName.message}
                  </p>
                ) : null}
              </div>
              <div>
                <label
                  htmlFor="feedback-email"
                  className="text-sm font-semibold text-slate-800"
                >
                  {t('pages.feedback.form.emailLabel')}
                </label>
                <input
                  id="feedback-email"
                  type="email"
                  autoComplete="email"
                  placeholder={t('pages.feedback.form.emailPlaceholder')}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? 'feedback-email-error' : undefined
                  }
                  className={inputClassName(Boolean(errors.email))}
                  {...register('email')}
                />
                {errors.email ? (
                  <p
                    id="feedback-email-error"
                    className="mt-1 text-xs text-rose-600"
                    role="alert"
                  >
                    {errors.email.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div>
              <label
                htmlFor="feedback-title"
                className="text-sm font-semibold text-slate-800"
              >
                {t('pages.feedback.form.titleLabel')}
              </label>
              <input
                id="feedback-title"
                type="text"
                placeholder={t('pages.feedback.form.titlePlaceholder')}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={
                  errors.title ? 'feedback-title-error' : undefined
                }
                className={inputClassName(Boolean(errors.title))}
                {...register('title')}
              />
              {errors.title ? (
                <p
                  id="feedback-title-error"
                  className="mt-1 text-xs text-rose-600"
                  role="alert"
                >
                  {errors.title.message}
                </p>
              ) : null}
            </div>

            <div>
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="feedback-message"
                  className="text-sm font-semibold text-slate-800"
                >
                  {t('pages.feedback.form.messageLabel')}
                </label>
                <span className="text-xs font-medium text-slate-500">
                  {t('pages.feedback.form.messageCounter', {
                    count: messageLength,
                    max: MESSAGE_MAX_LENGTH,
                  })}
                </span>
              </div>
              <textarea
                id="feedback-message"
                rows={7}
                placeholder={t('pages.feedback.form.messagePlaceholder')}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={
                  errors.message ? 'feedback-message-error' : undefined
                }
                className={inputClassName(
                  Boolean(errors.message),
                  'min-h-44 resize-y',
                )}
                {...register('message')}
              />
              {errors.message ? (
                <p
                  id="feedback-message-error"
                  className="mt-1 text-xs text-rose-600"
                  role="alert"
                >
                  {errors.message.message}
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
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
            >
              <SupportIcon />
              {mutation.isPending
                ? t('pages.feedback.form.submitting')
                : t('pages.feedback.form.submit')}
            </button>
          </form>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm backdrop-blur sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            {t('pages.feedback.aside.title')}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {t('pages.feedback.aside.description')}
          </p>
          <dl className="mt-5 space-y-4">
            <div>
              <dt className="text-sm font-semibold text-brand-dark">
                {t('pages.feedback.aside.items.ideas.title')}
              </dt>
              <dd className="mt-1 text-sm leading-6 text-slate-600">
                {t('pages.feedback.aside.items.ideas.description')}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-brand-dark">
                {t('pages.feedback.aside.items.issues.title')}
              </dt>
              <dd className="mt-1 text-sm leading-6 text-slate-600">
                {t('pages.feedback.aside.items.issues.description')}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-brand-dark">
                {t('pages.feedback.aside.items.questions.title')}
              </dt>
              <dd className="mt-1 text-sm leading-6 text-slate-600">
                {t('pages.feedback.aside.items.questions.description')}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  )
}

export default FeedbackPage
