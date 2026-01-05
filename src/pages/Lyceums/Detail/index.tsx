import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import placeholderImage from '../../../assets/lyceum-placeholder.svg'
import type { ApiError } from '../../../types/api'
import { getUserDisplayName } from '../../../utils/user'
import { useLyceum } from '../hooks/useLyceum'
import { useLyceumCourses } from '../hooks/useLyceumCourses'
import { useLyceumLecturers } from '../hooks/useLyceumLecturers'

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

const getSectionErrorMessage = (
  error: ApiError | null,
  fallbackKey: string,
  t: (key: string) => string,
) => {
  if (error?.kind === 'network') {
    return t('errors.network')
  }
  if (error?.kind === 'unauthorized' || error?.kind === 'forbidden') {
    return t('errors.auth.forbidden')
  }
  return t(fallbackKey)
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
  const {
    data: courses,
    isLoading: isCoursesLoading,
    error: coursesError,
  } = useLyceumCourses(lyceumId, { enabled: isValidId })
  const {
    data: lecturers,
    isLoading: isLecturersLoading,
    error: lecturersError,
  } = useLyceumLecturers(lyceumId, { enabled: isValidId })

  const fallbackValue = t('pages.lyceums.detail.notProvided')
  const coursesCount = courses?.length ?? 0
  const lecturersCount = lecturers?.length ?? 0
  const coursesErrorMessage = getSectionErrorMessage(
    coursesError ?? null,
    'pages.lyceums.detail.coursesError',
    t,
  )
  const lecturersErrorMessage = getSectionErrorMessage(
    lecturersError ?? null,
    'pages.lyceums.detail.lecturersError',
    t,
  )

  const overviewDetails = [
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
          className="block max-w-full truncate text-brand underline hover:text-brand-dark"
          title={lyceum.urlToLibrariesSite}
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
          className="block max-w-full truncate text-brand underline hover:text-brand-dark"
          title={lyceum.chitalishtaUrl}
        >
          {lyceum.chitalishtaUrl}
        </a>
      ) : (
        fallbackValue
      ),
    },
    {
      label: t('pages.lyceums.detail.fields.chairman'),
      value: lyceum?.chairman ?? fallbackValue,
    },
    {
      label: t('pages.lyceums.detail.fields.secretary'),
      value: lyceum?.secretary ?? fallbackValue,
    },
  ]

  const pageTitle = lyceum?.name
    ? `${lyceum.name} | ${t('app.title')}`
    : `${t('pages.lyceums.detail.title')} | ${t('app.title')}`

  const heroLocation = [lyceum?.address, lyceum?.town]
    .filter(Boolean)
    .join(', ')

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
            {heroLocation || t('pages.lyceums.detail.subtitle')}
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
                  {heroLocation || fallbackValue}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href="#lyceum-courses"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-800 transition hover:border-brand/30 hover:text-brand"
                  >
                    {t('pages.lyceums.detail.overviewLinks.courses', {
                      count: coursesCount,
                    })}
                  </a>
                  <a
                    href="#lyceum-lecturers"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-800 transition hover:border-brand/30 hover:text-brand"
                  >
                    {t('pages.lyceums.detail.overviewLinks.lecturers', {
                      count: lecturersCount,
                    })}
                  </a>
                </div>
                <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
                  {overviewDetails.map((item) => (
                    <div key={item.label} className="space-y-1">
                      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        {item.label}
                      </dt>
                      <dd className="font-medium text-slate-900">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
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
          <div
            id="lyceum-courses"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {t('pages.lyceums.detail.sections.courses')}
                </h3>
                <p className="text-xs text-slate-500">
                  {t('pages.lyceums.detail.sections.coursesSubtitle')}
                </p>
              </div>
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                {t('pages.lyceums.detail.countLabel', { count: coursesCount })}
              </span>
            </div>
            {isCoursesLoading ? (
              <div className="mt-4 animate-pulse rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-600">
                {t('pages.lyceums.detail.coursesLoading')}
              </div>
            ) : coursesError ? (
              <div
                className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
                role="alert"
              >
                {coursesErrorMessage}
              </div>
            ) : courses && courses.length > 0 ? (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {courses.map((course, index) => (
                  <li
                    key={course.id ?? `${course.name ?? 'course'}-${index}`}
                    className="rounded-lg border border-slate-100 bg-slate-50 p-4"
                  >
                    <p className="text-sm font-semibold text-slate-900">
                      {course.name ?? fallbackValue}
                    </p>
                    {course.description ? (
                      <p className="mt-1 text-xs text-slate-600">
                        {course.description}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-4 rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-600">
                {t('pages.lyceums.detail.coursesPlaceholder')}
              </div>
            )}
          </div>
          <div
            id="lyceum-lecturers"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {t('pages.lyceums.detail.sections.lecturers')}
                </h3>
                <p className="text-xs text-slate-500">
                  {t('pages.lyceums.detail.sections.lecturersSubtitle')}
                </p>
              </div>
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                {t('pages.lyceums.detail.countLabel', {
                  count: lecturersCount,
                })}
              </span>
            </div>
            {isLecturersLoading ? (
              <div className="mt-4 animate-pulse rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-600">
                {t('pages.lyceums.detail.lecturersLoading')}
              </div>
            ) : lecturersError ? (
              <div
                className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
                role="alert"
              >
                {lecturersErrorMessage}
              </div>
            ) : lecturers && lecturers.length > 0 ? (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {lecturers.map((lecturer, index) => {
                  const displayName =
                    getUserDisplayName(lecturer) || fallbackValue
                  return (
                    <li
                      key={lecturer.id ?? `${displayName}-${index}`}
                      className="rounded-lg border border-slate-100 bg-slate-50 p-4"
                    >
                      <p className="text-sm font-semibold text-slate-900">
                        {displayName}
                      </p>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div className="mt-4 rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-600">
                {t('pages.lyceums.detail.lecturersPlaceholder')}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  )
}

export default LyceumDetailPage
