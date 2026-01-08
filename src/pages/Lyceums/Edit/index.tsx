import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import { useToast } from '../../../components/feedback/ToastContext'
import type { ApiError } from '../../../types/api'
import type { LyceumRequest } from '../../../types/lyceums'
import {
  getLyceumUpdateSchema,
  type LyceumUpdateFormValues,
} from '../../../validations/lyceums'
import { useUserProfile } from '../../Profile/hooks/useUserProfile'
import { lyceumDetailQueryKey, useLyceum } from '../hooks/useLyceum'
import { useUpdateLyceumMutation } from '../hooks/useUpdateLyceumMutation'
import LyceumLecturerManager from './components/LyceumLecturerManager'

const getLyceumLoadErrorMessage = (
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
  return t('pages.lyceums.detail.loadFailed')
}

const getLyceumUpdateErrorMessage = (
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
  return t('errors.lyceums.updateFailed')
}

const LyceumEditPage = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  const schema = useMemo(() => getLyceumUpdateSchema(t), [t])

  const lyceumId = Number(id)
  const isValidId = Number.isFinite(lyceumId)

  const {
    data: lyceum,
    isLoading: isLyceumLoading,
    error: lyceumError,
  } = useLyceum(lyceumId, { enabled: isValidId })
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useUserProfile()

  const hasEditAccess =
    user?.role === 'ADMIN' || user?.administratedLyceumId === lyceumId

  const mutation = useUpdateLyceumMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LyceumUpdateFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      town: '',
      status: '',
      bulstat: '',
      registrationNumber: '',
      address: '',
      region: '',
      municipality: '',
      latitude: '',
      longitude: '',
      phone: '',
      email: '',
      urlToLibrariesSite: '',
      chitalishtaUrl: '',
      chairman: '',
      secretary: '',
    },
  })

  useEffect(() => {
    if (!lyceum) return
    reset({
      name: lyceum.name ?? '',
      town: lyceum.town ?? '',
      status: lyceum.status ?? '',
      bulstat: lyceum.bulstat ?? '',
      registrationNumber: lyceum.registrationNumber?.toString() ?? '',
      address: lyceum.address ?? '',
      region: lyceum.region ?? '',
      municipality: lyceum.municipality ?? '',
      latitude: lyceum.latitude?.toString() ?? '',
      longitude: lyceum.longitude?.toString() ?? '',
      phone: lyceum.phone ?? '',
      email: lyceum.email ?? '',
      urlToLibrariesSite: lyceum.urlToLibrariesSite ?? '',
      chitalishtaUrl: lyceum.chitalishtaUrl ?? '',
      chairman: lyceum.chairman ?? '',
      secretary: lyceum.secretary ?? '',
    })
  }, [lyceum, reset])

  const inputClassName = (hasError: boolean, extraClasses?: string) =>
    [
      'mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
      hasError
        ? 'border-rose-300 bg-rose-50/40 focus-visible:outline-rose-300'
        : 'border-slate-200/80 bg-white',
      extraClasses,
    ].join(' ')
  const fieldsetClassName =
    'space-y-4 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 sm:p-5'
  const legendClassName =
    'text-xs font-semibold uppercase tracking-wide text-slate-500'
  const actionBarClassName =
    'flex flex-wrap gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4'
  const primaryActionButtonClassName =
    'inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300'
  const secondaryActionButtonClassName =
    'inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-400'
  const actionIconClassName = 'h-4 w-4'

  const normalizeOptionalText = (value: string) => {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : undefined
  }

  const normalizeOptionalNumber = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return undefined
    const parsed = Number(trimmed)
    return Number.isFinite(parsed) ? parsed : undefined
  }

  const onSubmit = (values: LyceumUpdateFormValues) => {
    if (!isValidId) return

    const payload: LyceumRequest = {
      name: values.name.trim(),
      town: values.town.trim(),
      status: normalizeOptionalText(values.status),
      bulstat: normalizeOptionalText(values.bulstat),
      registrationNumber: normalizeOptionalNumber(values.registrationNumber),
      address: normalizeOptionalText(values.address),
      region: normalizeOptionalText(values.region),
      municipality: normalizeOptionalText(values.municipality),
      latitude: normalizeOptionalNumber(values.latitude),
      longitude: normalizeOptionalNumber(values.longitude),
      phone: normalizeOptionalText(values.phone),
      email: normalizeOptionalText(values.email),
      urlToLibrariesSite: normalizeOptionalText(values.urlToLibrariesSite),
      chitalishtaUrl: normalizeOptionalText(values.chitalishtaUrl),
      chairman: normalizeOptionalText(values.chairman),
      secretary: normalizeOptionalText(values.secretary),
    }

    mutation.mutate(
      { id: lyceumId, payload },
      {
        onSuccess: (data) => {
          queryClient.setQueryData(lyceumDetailQueryKey(lyceumId), data)
          showToast({
            message: t('feedback.lyceums.updateSuccess'),
            tone: 'success',
          })
          navigate(`/lyceums/${lyceumId}`, { replace: true })
        },
      },
    )
  }

  const isLoading = isLyceumLoading || isUserLoading
  const loadErrorMessage = getLyceumLoadErrorMessage(
    lyceumError ?? userError ?? null,
    t,
  )
  const updateErrorMessage = getLyceumUpdateErrorMessage(
    mutation.error ?? null,
    t,
  )
  const fallbackValue = t('pages.lyceums.detail.notProvided')
  const verificationStatusLabel = lyceum?.verificationStatus
    ? t(`pages.lyceums.detail.verificationStatus.${lyceum.verificationStatus}`)
    : fallbackValue
  const summaryItems =
    lyceum && hasEditAccess
      ? [
          {
            label: t('pages.lyceums.edit.form.fields.name'),
            value: lyceum.name ?? fallbackValue,
          },
          {
            label: t('pages.lyceums.edit.form.fields.town'),
            value: lyceum.town ?? fallbackValue,
          },
          {
            label: t('pages.lyceums.detail.fields.verificationStatus'),
            value: verificationStatusLabel,
          },
        ]
      : []

  return (
    <section className="relative space-y-6 pb-10">
      <Helmet>
        <title>{`${t('pages.lyceums.edit.title')} | ${t('app.title')}`}</title>
      </Helmet>
      <div className="pointer-events-none absolute -top-10 right-8 h-28 w-28 rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute left-0 top-16 h-24 w-24 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-8">
        <div className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="relative z-10 space-y-4">
          <Link
            to={isValidId ? `/lyceums/${lyceumId}` : '/lyceums'}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-brand/30 hover:text-brand"
          >
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12.5 4.5L7 10l5.5 5.5" />
            </svg>
            {t('pages.lyceums.edit.backLink')}
          </Link>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              {lyceum?.name ? (
                <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                  {lyceum.name}
                </span>
              ) : null}
              <h1 className="text-2xl font-semibold text-slate-900">
                {t('pages.lyceums.edit.title')}
              </h1>
              <p className="text-sm text-slate-600">
                {t('pages.lyceums.edit.subtitle')}
              </p>
            </div>
            {summaryItems.length > 0 ? (
              <dl className="grid gap-3 rounded-2xl border border-slate-200/70 bg-white/70 p-4 text-sm shadow-sm sm:grid-cols-3">
                {summaryItems.map((item) => (
                  <div key={item.label} className="space-y-1">
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {item.label}
                    </dt>
                    <dd className="font-semibold text-slate-900">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </div>
      </div>
      {!isValidId ? (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
          role="alert"
        >
          {t('pages.lyceums.detail.invalidId')}
        </div>
      ) : isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          {t('pages.lyceums.edit.loading')}
        </div>
      ) : loadErrorMessage ? (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
          role="alert"
        >
          {loadErrorMessage}
        </div>
      ) : !lyceum ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
          {t('pages.lyceums.edit.notFound')}
        </div>
      ) : !hasEditAccess ? (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
          role="alert"
        >
          {t('errors.auth.forbidden')}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-start">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full space-y-6 rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-8"
            aria-busy={mutation.isPending}
          >
            <fieldset className={fieldsetClassName}>
              <legend className={legendClassName}>
                {t('pages.lyceums.edit.form.sections.basics')}
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="lyceum-edit-name"
                    className="text-sm font-semibold text-slate-800"
                  >
                    {t('pages.lyceums.edit.form.fields.name')}
                  </label>
                  <input
                    id="lyceum-edit-name"
                    type="text"
                    placeholder={t('pages.lyceums.edit.form.fields.name')}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={
                      errors.name ? 'lyceum-edit-name-error' : undefined
                    }
                    className={inputClassName(Boolean(errors.name))}
                    {...register('name')}
                  />
                  {errors.name ? (
                    <p
                      id="lyceum-edit-name-error"
                      className="mt-1 text-xs text-rose-600"
                      role="alert"
                    >
                      {errors.name.message}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label
                    htmlFor="lyceum-edit-town"
                    className="text-sm font-semibold text-slate-800"
                  >
                    {t('pages.lyceums.edit.form.fields.town')}
                  </label>
                  <input
                    id="lyceum-edit-town"
                    type="text"
                    placeholder={t('pages.lyceums.edit.form.fields.town')}
                    aria-invalid={Boolean(errors.town)}
                    aria-describedby={
                      errors.town ? 'lyceum-edit-town-error' : undefined
                    }
                    className={inputClassName(Boolean(errors.town))}
                    {...register('town')}
                  />
                  {errors.town ? (
                    <p
                      id="lyceum-edit-town-error"
                      className="mt-1 text-xs text-rose-600"
                      role="alert"
                    >
                      {errors.town.message}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="lyceum-edit-status"
                    className="text-sm font-semibold text-slate-800"
                  >
                    {t('pages.lyceums.edit.form.fields.status')}
                  </label>
                  <input
                    id="lyceum-edit-status"
                    type="text"
                    placeholder={t('pages.lyceums.edit.form.fields.status')}
                    aria-invalid={Boolean(errors.status)}
                    aria-describedby={
                      errors.status ? 'lyceum-edit-status-error' : undefined
                    }
                    className={inputClassName(Boolean(errors.status))}
                    {...register('status')}
                  />
                  {errors.status ? (
                    <p
                      id="lyceum-edit-status-error"
                      className="mt-1 text-xs text-rose-600"
                      role="alert"
                    >
                      {errors.status.message}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label
                    htmlFor="lyceum-edit-bulstat"
                    className="text-sm font-semibold text-slate-800"
                  >
                    {t('pages.lyceums.edit.form.fields.bulstat')}
                  </label>
                  <input
                    id="lyceum-edit-bulstat"
                    type="text"
                    placeholder={t('pages.lyceums.edit.form.fields.bulstat')}
                    aria-invalid={Boolean(errors.bulstat)}
                    aria-describedby={
                      errors.bulstat ? 'lyceum-edit-bulstat-error' : undefined
                    }
                    className={inputClassName(Boolean(errors.bulstat))}
                    {...register('bulstat')}
                  />
                  {errors.bulstat ? (
                    <p
                      id="lyceum-edit-bulstat-error"
                      className="mt-1 text-xs text-rose-600"
                      role="alert"
                    >
                      {errors.bulstat.message}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label
                    htmlFor="lyceum-edit-registration"
                    className="text-sm font-semibold text-slate-800"
                  >
                    {t('pages.lyceums.edit.form.fields.registrationNumber')}
                  </label>
                  <input
                    id="lyceum-edit-registration"
                    type="number"
                    step="1"
                    placeholder={t('pages.lyceums.edit.form.fields.registrationNumber')}
                    aria-invalid={Boolean(errors.registrationNumber)}
                    aria-describedby={
                      errors.registrationNumber
                        ? 'lyceum-edit-registration-error'
                        : undefined
                    }
                    className={inputClassName(Boolean(errors.registrationNumber))}
                    {...register('registrationNumber')}
                  />
                  {errors.registrationNumber ? (
                    <p
                      id="lyceum-edit-registration-error"
                      className="mt-1 text-xs text-rose-600"
                      role="alert"
                    >
                      {errors.registrationNumber.message}
                    </p>
                  ) : null}
                </div>
              </div>
            </fieldset>
            <fieldset className={fieldsetClassName}>
              <legend className={legendClassName}>
                {t('pages.lyceums.edit.form.sections.location')}
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="lyceum-edit-address"
                    className="text-sm font-semibold text-slate-800"
                  >
                    {t('pages.lyceums.edit.form.fields.address')}
                  </label>
                  <input
                    id="lyceum-edit-address"
                    type="text"
                    placeholder={t('pages.lyceums.edit.form.fields.address')}
                    aria-invalid={Boolean(errors.address)}
                    aria-describedby={
                      errors.address ? 'lyceum-edit-address-error' : undefined
                    }
                    className={inputClassName(Boolean(errors.address))}
                    {...register('address')}
                  />
                  {errors.address ? (
                    <p
                      id="lyceum-edit-address-error"
                      className="mt-1 text-xs text-rose-600"
                      role="alert"
                    >
                      {errors.address.message}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label
                    htmlFor="lyceum-edit-region"
                    className="text-sm font-semibold text-slate-800"
                  >
                    {t('pages.lyceums.edit.form.fields.region')}
                  </label>
                  <input
                    id="lyceum-edit-region"
                    type="text"
                    placeholder={t('pages.lyceums.edit.form.fields.region')}
                    aria-invalid={Boolean(errors.region)}
                    aria-describedby={
                      errors.region ? 'lyceum-edit-region-error' : undefined
                    }
                    className={inputClassName(Boolean(errors.region))}
                    {...register('region')}
                  />
                  {errors.region ? (
                    <p
                      id="lyceum-edit-region-error"
                      className="mt-1 text-xs text-rose-600"
                      role="alert"
                    >
                      {errors.region.message}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label
                    htmlFor="lyceum-edit-municipality"
                    className="text-sm font-semibold text-slate-800"
                  >
                    {t('pages.lyceums.edit.form.fields.municipality')}
                  </label>
                  <input
                    id="lyceum-edit-municipality"
                    type="text"
                    placeholder={t('pages.lyceums.edit.form.fields.municipality')}
                    aria-invalid={Boolean(errors.municipality)}
                    aria-describedby={
                      errors.municipality
                        ? 'lyceum-edit-municipality-error'
                        : undefined
                    }
                    className={inputClassName(Boolean(errors.municipality))}
                    {...register('municipality')}
                  />
                  {errors.municipality ? (
                    <p
                      id="lyceum-edit-municipality-error"
                      className="mt-1 text-xs text-rose-600"
                      role="alert"
                    >
                      {errors.municipality.message}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="lyceum-edit-latitude"
                    className="text-sm font-semibold text-slate-800"
                  >
                    {t('pages.lyceums.edit.form.fields.latitude')}
                  </label>
                  <input
                    id="lyceum-edit-latitude"
                    type="number"
                    step="any"
                    placeholder={t('pages.lyceums.edit.form.fields.latitude')}
                    aria-invalid={Boolean(errors.latitude)}
                    aria-describedby={
                      errors.latitude ? 'lyceum-edit-latitude-error' : undefined
                    }
                    className={inputClassName(Boolean(errors.latitude))}
                    {...register('latitude')}
                  />
                  {errors.latitude ? (
                    <p
                      id="lyceum-edit-latitude-error"
                      className="mt-1 text-xs text-rose-600"
                      role="alert"
                    >
                      {errors.latitude.message}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label
                    htmlFor="lyceum-edit-longitude"
                    className="text-sm font-semibold text-slate-800"
                  >
                    {t('pages.lyceums.edit.form.fields.longitude')}
                  </label>
                  <input
                    id="lyceum-edit-longitude"
                    type="number"
                    step="any"
                    placeholder={t('pages.lyceums.edit.form.fields.longitude')}
                    aria-invalid={Boolean(errors.longitude)}
                    aria-describedby={
                      errors.longitude ? 'lyceum-edit-longitude-error' : undefined
                    }
                    className={inputClassName(Boolean(errors.longitude))}
                    {...register('longitude')}
                  />
                  {errors.longitude ? (
                    <p
                      id="lyceum-edit-longitude-error"
                      className="mt-1 text-xs text-rose-600"
                      role="alert"
                    >
                      {errors.longitude.message}
                    </p>
                  ) : null}
                </div>
              </div>
            </fieldset>
            <fieldset className={fieldsetClassName}>
              <legend className={legendClassName}>
                {t('pages.lyceums.edit.form.sections.contacts')}
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="lyceum-edit-phone"
                    className="text-sm font-semibold text-slate-800"
                  >
                    {t('pages.lyceums.edit.form.fields.phone')}
                  </label>
                  <input
                    id="lyceum-edit-phone"
                    type="text"
                    placeholder={t('pages.lyceums.edit.form.fields.phone')}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={
                      errors.phone ? 'lyceum-edit-phone-error' : undefined
                    }
                    className={inputClassName(Boolean(errors.phone))}
                    {...register('phone')}
                  />
                  {errors.phone ? (
                    <p
                      id="lyceum-edit-phone-error"
                      className="mt-1 text-xs text-rose-600"
                      role="alert"
                    >
                      {errors.phone.message}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label
                    htmlFor="lyceum-edit-email"
                    className="text-sm font-semibold text-slate-800"
                  >
                    {t('pages.lyceums.edit.form.fields.email')}
                  </label>
                  <input
                    id="lyceum-edit-email"
                    type="email"
                    placeholder={t('pages.lyceums.edit.form.fields.email')}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={
                      errors.email ? 'lyceum-edit-email-error' : undefined
                    }
                    className={inputClassName(Boolean(errors.email))}
                    {...register('email')}
                  />
                  {errors.email ? (
                    <p
                      id="lyceum-edit-email-error"
                      className="mt-1 text-xs text-rose-600"
                      role="alert"
                    >
                      {errors.email.message}
                    </p>
                  ) : null}
                </div>
              </div>
            </fieldset>
            <fieldset className={fieldsetClassName}>
              <legend className={legendClassName}>
                {t('pages.lyceums.edit.form.sections.links')}
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="lyceum-edit-library-url"
                    className="text-sm font-semibold text-slate-800"
                  >
                    {t('pages.lyceums.edit.form.fields.urlToLibrariesSite')}
                  </label>
                  <input
                    id="lyceum-edit-library-url"
                    type="url"
                    placeholder={t('pages.lyceums.edit.form.fields.urlToLibrariesSite')}
                    aria-invalid={Boolean(errors.urlToLibrariesSite)}
                    aria-describedby={
                      errors.urlToLibrariesSite
                        ? 'lyceum-edit-library-url-error'
                        : undefined
                    }
                    className={inputClassName(Boolean(errors.urlToLibrariesSite))}
                    {...register('urlToLibrariesSite')}
                  />
                  {errors.urlToLibrariesSite ? (
                    <p
                      id="lyceum-edit-library-url-error"
                      className="mt-1 text-xs text-rose-600"
                      role="alert"
                    >
                      {errors.urlToLibrariesSite.message}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label
                    htmlFor="lyceum-edit-chitalishta-url"
                    className="text-sm font-semibold text-slate-800"
                  >
                    {t('pages.lyceums.edit.form.fields.chitalishtaUrl')}
                  </label>
                  <input
                    id="lyceum-edit-chitalishta-url"
                    type="url"
                    placeholder={t('pages.lyceums.edit.form.fields.chitalishtaUrl')}
                    aria-invalid={Boolean(errors.chitalishtaUrl)}
                    aria-describedby={
                      errors.chitalishtaUrl
                        ? 'lyceum-edit-chitalishta-url-error'
                        : undefined
                    }
                    className={inputClassName(Boolean(errors.chitalishtaUrl))}
                    {...register('chitalishtaUrl')}
                  />
                  {errors.chitalishtaUrl ? (
                    <p
                      id="lyceum-edit-chitalishta-url-error"
                      className="mt-1 text-xs text-rose-600"
                      role="alert"
                    >
                      {errors.chitalishtaUrl.message}
                    </p>
                  ) : null}
                </div>
              </div>
            </fieldset>
            <fieldset className={fieldsetClassName}>
              <legend className={legendClassName}>
                {t('pages.lyceums.edit.form.sections.leadership')}
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="lyceum-edit-chairman"
                    className="text-sm font-semibold text-slate-800"
                  >
                    {t('pages.lyceums.edit.form.fields.chairman')}
                  </label>
                  <input
                    id="lyceum-edit-chairman"
                    type="text"
                    placeholder={t('pages.lyceums.edit.form.fields.chairman')}
                    aria-invalid={Boolean(errors.chairman)}
                    aria-describedby={
                      errors.chairman ? 'lyceum-edit-chairman-error' : undefined
                    }
                    className={inputClassName(Boolean(errors.chairman))}
                    {...register('chairman')}
                  />
                  {errors.chairman ? (
                    <p
                      id="lyceum-edit-chairman-error"
                      className="mt-1 text-xs text-rose-600"
                      role="alert"
                    >
                      {errors.chairman.message}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label
                    htmlFor="lyceum-edit-secretary"
                    className="text-sm font-semibold text-slate-800"
                  >
                    {t('pages.lyceums.edit.form.fields.secretary')}
                  </label>
                  <input
                    id="lyceum-edit-secretary"
                    type="text"
                    placeholder={t('pages.lyceums.edit.form.fields.secretary')}
                    aria-invalid={Boolean(errors.secretary)}
                    aria-describedby={
                      errors.secretary ? 'lyceum-edit-secretary-error' : undefined
                    }
                    className={inputClassName(Boolean(errors.secretary))}
                    {...register('secretary')}
                  />
                  {errors.secretary ? (
                    <p
                      id="lyceum-edit-secretary-error"
                      className="mt-1 text-xs text-rose-600"
                      role="alert"
                    >
                      {errors.secretary.message}
                    </p>
                  ) : null}
                </div>
              </div>
            </fieldset>
            {updateErrorMessage ? (
              <div
                className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
                role="alert"
              >
                {updateErrorMessage}
              </div>
            ) : null}
            <div className={actionBarClassName}>
              <button
                type="submit"
                disabled={mutation.isPending}
                className={primaryActionButtonClassName}
              >
                <svg
                  viewBox="0 0 24 24"
                  className={actionIconClassName}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6.5l-9.5 9.5L4 9.5" />
                </svg>
                {mutation.isPending
                  ? t('pages.lyceums.edit.form.submitting')
                  : t('pages.lyceums.edit.form.submit')}
              </button>
              <Link
                to={`/lyceums/${lyceumId}`}
                className={secondaryActionButtonClassName}
              >
                <svg
                  viewBox="0 0 24 24"
                  className={actionIconClassName}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6.5 6.5l11 11" />
                  <path d="M17.5 6.5l-11 11" />
                </svg>
                {t('pages.lyceums.edit.form.cancel')}
              </Link>
            </div>
          </form>
          <div className="lg:sticky lg:top-24">
            <LyceumLecturerManager lyceumId={lyceumId} />
          </div>
        </div>
      )}
    </section>
  )
}

export default LyceumEditPage
