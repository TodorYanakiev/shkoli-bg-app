import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import placeholderImage from '../../../assets/lyceum-placeholder.svg'
import type { ApiError } from '../../../types/api'
import { useLyceum } from '../hooks/useLyceum'

const getLyceumErrorMessage = (
  error: ApiError | null,
  t: (key: string) => string,
) => {
  if (!error) return t('pages.lyceums.detail.loadFailed')
  if (error.kind === 'network') {
    return t('errors.network')
  }
  if (error.kind === 'unauthorized' || error.kind === 'forbidden') {
    return t('errors.auth.forbidden')
  }
  if (error.kind === 'notFound') {
    return t('pages.lyceums.detail.notFound')
  }
  return t('pages.lyceums.detail.loadFailed')
}

const LyceumDetailPage = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()

  const lyceumId = Number(id)
  const isValidId = Number.isFinite(lyceumId)

  const {
    data: lyceum,
    isLoading,
    error,
  } = useLyceum(lyceumId, { enabled: isValidId })

  const fallbackValue = t('pages.lyceums.detail.notProvided')

  const verificationStatusLabel = lyceum?.verificationStatus
    ? t(
        `pages.lyceums.detail.verificationStatus.${lyceum.verificationStatus}`,
      )
    : fallbackValue

  const detailSections = [
    {
      title: t('pages.lyceums.detail.sections.identity'),
      items: [
        {
          label: t('pages.lyceums.detail.fields.status'),
          value: lyceum?.status ?? fallbackValue,
        },
        {
          label: t('pages.lyceums.detail.fields.verificationStatus'),
          value: verificationStatusLabel,
        },
        {
          label: t('pages.lyceums.detail.fields.bulstat'),
          value: lyceum?.bulstat ?? fallbackValue,
        },
        {
          label: t('pages.lyceums.detail.fields.registrationNumber'),
          value:
            typeof lyceum?.registrationNumber === 'number'
              ? lyceum.registrationNumber
              : fallbackValue,
        },
      ],
    },
    {
      title: t('pages.lyceums.detail.sections.location'),
      items: [
        { label: t('pages.lyceums.detail.fields.region'), value: lyceum?.region ?? fallbackValue },
        {
          label: t('pages.lyceums.detail.fields.municipality'),
          value: lyceum?.municipality ?? fallbackValue,
        },
        { label: t('pages.lyceums.detail.fields.town'), value: lyceum?.town ?? fallbackValue },
        {
          label: t('pages.lyceums.detail.fields.address'),
          value: lyceum?.address ?? fallbackValue,
        },
        {
          label: t('pages.lyceums.detail.fields.latitude'),
          value:
            typeof lyceum?.latitude === 'number'
              ? lyceum.latitude.toFixed(5)
              : fallbackValue,
        },
        {
          label: t('pages.lyceums.detail.fields.longitude'),
          value:
            typeof lyceum?.longitude === 'number'
              ? lyceum.longitude.toFixed(5)
              : fallbackValue,
        },
      ],
    },
    {
      title: t('pages.lyceums.detail.sections.contacts'),
      items: [
        {
          label: t('pages.lyceums.detail.fields.phone'),
          value: lyceum?.phone ?? fallbackValue,
        },
        {
          label: t('pages.lyceums.detail.fields.email'),
          value: lyceum?.email ?? fallbackValue,
        },
        {
          label: t('pages.lyceums.detail.fields.urlToLibrariesSite'),
          value: lyceum?.urlToLibrariesSite ? (
            <a
              href={lyceum.urlToLibrariesSite}
              target="_blank"
              rel="noreferrer"
              className="text-brand hover:text-brand-dark underline"
            >
              {lyceum.urlToLibrariesSite}
            </a>
          ) : (
            fallbackValue
          ),
        },
        {
          label: t('pages.lyceums.detail.fields.chitalishtaUrl'),
          value: lyceum?.chitalishtaUrl ? (
            <a
              href={lyceum.chitalishtaUrl}
              target="_blank"
              rel="noreferrer"
              className="text-brand hover:text-brand-dark underline"
            >
              {lyceum.chitalishtaUrl}
            </a>
          ) : (
            fallbackValue
          ),
        },
      ],
    },
    {
      title: t('pages.lyceums.detail.sections.people'),
      items: [
        {
          label: t('pages.lyceums.detail.fields.chairman'),
          value: lyceum?.chairman ?? fallbackValue,
        },
        {
          label: t('pages.lyceums.detail.fields.secretary'),
          value: lyceum?.secretary ?? fallbackValue,
        },
      ],
    },
  ]

  const pageTitle = lyceum?.name
    ? `${lyceum.name} | ${t('app.title')}`
    : `${t('pages.lyceums.detail.title')} | ${t('app.title')}`

  const heroSubtitle = lyceum?.town ?? lyceum?.region ?? ''

  return (
    <section className="space-y-6">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {lyceum?.name ?? t('pages.lyceums.detail.title')}
          </h1>
          <p className="text-sm text-slate-600">
            {heroSubtitle || t('pages.lyceums.detail.subtitle')}
          </p>
        </div>
        <Link
          to="/lyceums"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
        >
          ← {t('pages.lyceums.detail.back')}
        </Link>
      </div>
      {!isValidId ? (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
          role="alert"
        >
          {t('pages.lyceums.detail.invalidId')}
        </div>
      ) : isLoading ? (
        <div className="space-y-4">
          <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />
          </div>
        </div>
      ) : error ? (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
          role="alert"
        >
          {getLyceumErrorMessage(error ?? null, t)}
        </div>
      ) : !lyceum ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
          {t('pages.lyceums.detail.notFound')}
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="p-6 lg:p-8">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                  {t('pages.lyceums.detail.heroLabel')}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  {lyceum.name}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {heroSubtitle || fallbackValue}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                    {t('pages.lyceums.detail.labels.verification', {
                      status: verificationStatusLabel,
                    })}
                  </span>
                  {lyceum.status ? (
                    <span className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                      {lyceum.status}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="relative">
                <img
                  src={placeholderImage}
                  alt={t('components.lyceumCard.imageAlt')}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {detailSections.map((section) => (
              <div
                key={section.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-sm font-semibold text-slate-900">
                  {section.title}
                </h3>
                <dl className="mt-4 space-y-3 text-sm">
                  {section.items.map((item) => (
                    <div key={item.label} className="space-y-1">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {item.label}
                      </dt>
                      <dd className="font-medium text-slate-900">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export default LyceumDetailPage
