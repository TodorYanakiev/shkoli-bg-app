import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import courseLogoPlaceholder from '../../../assets/course-logo-placeholder.svg'
import courseMainPlaceholder from '../../../assets/course-main-placeholder.svg'
import { useUsersByIds } from '../../../hooks/useUsersByIds'
import type { ApiError } from '../../../types/api'
import type {
  CourseScheduleSlot,
  CourseScheduleSpecialCase,
} from '../../../types/courses'
import { getPreferredCourseImage, resolveCourseImageUrl } from '../../../utils/courseImages'
import { getUserDisplayName } from '../../../utils/user'
import { useLyceum } from '../../Lyceums/hooks/useLyceum'
import { useCourse } from '../hooks/useCourse'

const getCourseErrorMessage = (
  error: ApiError | null,
  t: (key: string) => string,
) => {
  if (!error) return t('pages.shkoli.detail.loadFailed')
  if (error.kind === 'network') {
    return t('errors.network')
  }
  if (error.kind === 'unauthorized' || error.kind === 'forbidden') {
    return t('errors.auth.forbidden')
  }
  if (error.status === 404) {
    return t('pages.shkoli.detail.notFound')
  }
  return t('pages.shkoli.detail.loadFailed')
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

const formatPrice = (price: number, locale: string, t: (key: string) => string) => {
  if (price === 0) {
    return t('pages.shkoli.detail.priceFree')
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'BGN',
      maximumFractionDigits: 2,
    }).format(price)
  } catch {
    return price.toFixed(2)
  }
}

const formatScheduleDate = (value: string, locale: string) => {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }
  return parsed.toLocaleDateString(locale)
}

const formatScheduleTime = (value: string) => {
  const match = value.match(/(\d{1,2}):(\d{2})/)
  if (!match) return value
  const hours = match[1].padStart(2, '0')
  const minutes = match[2].padStart(2, '0')
  return `${hours}:${minutes}`
}

type ScheduleBadge = {
  label: string
  value: string
  kind: 'dayOfWeek' | 'dayOfMonth' | 'recurrence'
}

const getScheduleBadge = (
  slot: CourseScheduleSlot,
  fallbackValue: string,
  t: (key: string) => string,
): ScheduleBadge => {
  if (slot.dayOfWeek) {
    return {
      label: t('pages.shkoli.detail.schedule.dayOfWeek'),
      value: t(`courses.daysOfWeek.${slot.dayOfWeek}`),
      kind: 'dayOfWeek',
    }
  }

  if (typeof slot.dayOfMonth === 'number') {
    return {
      label: t('pages.shkoli.detail.schedule.dayOfMonth'),
      value: String(slot.dayOfMonth),
      kind: 'dayOfMonth',
    }
  }

  return {
    label: t('pages.shkoli.detail.schedule.recurrence'),
    value: slot.recurrence
      ? t(`courses.recurrence.${slot.recurrence}`)
      : fallbackValue,
    kind: 'recurrence',
  }
}

const getSpecialCaseStatus = (
  entry: CourseScheduleSpecialCase,
  t: (key: string) => string,
) =>
  entry.cancelled
    ? t('pages.shkoli.detail.schedule.cancelled')
    : t('pages.shkoli.detail.schedule.active')

type SideNavItem =
  | {
      key: string
      label: string
      icon: ReactNode
      href: string
      to?: never
    }
  | {
      key: string
      label: string
      icon: ReactNode
      to: string
      href?: never
    }

const CourseDetailPage = () => {
  const { t, i18n } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(min-width: 1024px)').matches
  })
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(min-width: 1024px)').matches
  })

  const courseId = Number(id)
  const isValidId = Number.isFinite(courseId)

  const { data: course, isLoading, error } = useCourse(courseId, {
    enabled: isValidId,
  })
  const lecturerIds = course?.lecturerIds ?? []
  const {
    data: lecturers,
    isLoading: isLecturersLoading,
    error: lecturersError,
  } = useUsersByIds(lecturerIds, {
    enabled: isValidId && lecturerIds.length > 0,
  })
  const lyceumId = course?.lyceumId
  const {
    data: lyceum,
    isLoading: isLyceumLoading,
    error: lyceumError,
  } = useLyceum(lyceumId, { enabled: Boolean(lyceumId) })

  const fallbackValue = t('pages.shkoli.detail.notProvided')
  const courseName = course?.name ?? t('pages.shkoli.detail.title')
  const courseTypeLabel = course?.type
    ? t(`courses.types.${course.type}`)
    : fallbackValue
  const ageGroups = course?.ageGroupList ?? []
  const ageGroupsValue =
    ageGroups.length > 0
      ? ageGroups.map((group) => t(`courses.ageGroups.${group}`)).join(', ')
      : fallbackValue
  const priceValue =
    typeof course?.price === 'number'
      ? formatPrice(course.price, i18n.language, t)
      : fallbackValue
  const courseDetails = [
    { label: t('pages.shkoli.detail.fields.price'), value: priceValue },
    {
      label: t('pages.shkoli.detail.fields.address'),
      value: course?.address ?? fallbackValue,
    },
  ]

  const scheduleSlots = course?.schedule?.slots ?? []
  const scheduleSpecialCases = course?.schedule?.specialCases ?? []

  const mainImage = getPreferredCourseImage(course?.images, 'MAIN')
  const logoImage = getPreferredCourseImage(course?.images, 'LOGO')
  const mainImageUrl =
    resolveCourseImageUrl(mainImage?.url) ?? courseMainPlaceholder
  const logoImageUrl =
    resolveCourseImageUrl(logoImage?.url) ?? courseLogoPlaceholder
  const galleryImages =
    course?.images?.filter(
      (image) => image.role === 'GALLERY' && image.url,
    ) ?? []

  const pageTitle = course?.name
    ? `${course.name} | ${t('app.title')}`
    : `${t('pages.shkoli.detail.title')} | ${t('app.title')}`
  const lecturersErrorMessage = getSectionErrorMessage(
    lecturersError ?? null,
    'pages.shkoli.detail.lecturersError',
    t,
  )
  const lyceumErrorMessage = getSectionErrorMessage(
    lyceumError ?? null,
    'pages.shkoli.detail.lyceumError',
    t,
  )
  const navIconClassName = 'h-5 w-5'
  const sideNavWidth = !isDesktop
    ? '0px'
    : isSideNavExpanded
      ? '16rem'
      : '4.75rem'
  const sideNavItems: SideNavItem[] = [
    {
      key: 'course-overview',
      label: t('pages.shkoli.detail.sideNav.overview'),
      href: '#course-overview',
      icon: (
        <svg
          viewBox="0 0 24 24"
          className={navIconClassName}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 10.5v5" />
          <circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      key: 'course-schedule',
      label: t('pages.shkoli.detail.sideNav.schedule'),
      href: '#course-schedule',
      icon: (
        <svg
          viewBox="0 0 24 24"
          className={navIconClassName}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M8 3v4" />
          <path d="M16 3v4" />
          <path d="M4 9h16" />
        </svg>
      ),
    },
    {
      key: 'course-lecturers',
      label: t('pages.shkoli.detail.sideNav.lecturers'),
      href: '#course-lecturers',
      icon: (
        <svg
          viewBox="0 0 24 24"
          className={navIconClassName}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M8 12.5a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 8 12.5z" />
          <path d="M4 19.5a4 4 0 0 1 8 0" />
          <path d="M17 12a3 3 0 1 0-2.6-4.5" />
          <path d="M14.5 18.5a3.5 3.5 0 0 1 5.5 1" />
        </svg>
      ),
    },
    {
      key: 'course-lyceum',
      label: t('pages.shkoli.detail.sideNav.lyceum'),
      href: '#course-lyceum',
      icon: (
        <svg
          viewBox="0 0 24 24"
          className={navIconClassName}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 9l9-5 9 5" />
          <path d="M4 20h16" />
          <path d="M6 20V9" />
          <path d="M10 20V9" />
          <path d="M14 20V9" />
          <path d="M18 20V9" />
        </svg>
      ),
    },
    {
      key: 'course-gallery',
      label: t('pages.shkoli.detail.sideNav.gallery'),
      href: '#course-gallery',
      icon: (
        <svg
          viewBox="0 0 24 24"
          className={navIconClassName}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="4" y="5" width="16" height="14" rx="2" />
          <circle cx="9" cy="10" r="1.5" />
          <path d="M4 16l4-4 4 4 4-4 4 4" />
        </svg>
      ),
    },
    {
      key: 'course-add',
      label: t('pages.shkoli.detail.sideNav.addCourse'),
      to: '/shkoli/new',
      icon: (
        <svg
          viewBox="0 0 24 24"
          className={navIconClassName}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
      ),
    },
    {
      key: 'course-edit',
      label: t('pages.shkoli.detail.sideNav.editCourse'),
      to: `/shkoli/${courseId}/edit`,
      icon: (
        <svg
          viewBox="0 0 24 24"
          className={navIconClassName}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 16.5V20h3.5L19 8.5l-3.5-3.5L4 16.5z" />
          <path d="M13.5 6.5L17 10" />
        </svg>
      ),
    },
  ]

  const sideNavBaseButtonClassName =
    'group inline-flex items-center rounded-lg text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 lg:text-sm'
  const sideNavItemClassName = [
    sideNavBaseButtonClassName,
    isSideNavExpanded
      ? 'w-full justify-start gap-3 px-3 py-1'
      : 'h-11 w-11 justify-center',
  ].join(' ')
  const sideNavIconClassName =
    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-brand transition group-hover:border-brand/30'
  const sideNavToggleClassName = [
    sideNavBaseButtonClassName,
    'mt-2',
    isSideNavExpanded
      ? 'w-full justify-start gap-3 px-3 py-1'
      : 'h-11 w-11 justify-center',
  ].join(' ')
  const sideNavContainerClassName = [
    'flex h-full w-full flex-col gap-3 px-2 py-4',
    isSideNavExpanded ? 'items-stretch' : 'items-center',
  ].join(' ')
  const sideNavListClassName = [
    'flex flex-1 flex-col gap-2 overflow-y-auto',
    isSideNavExpanded ? 'pr-1' : 'pr-0',
  ].join(' ')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(min-width: 1024px)')
    const handleChange = () => {
      setIsDesktop(media.matches)
      if (!media.matches) {
        setIsSideNavExpanded(false)
      }
    }

    handleChange()

    if (media.addEventListener) {
      media.addEventListener('change', handleChange)
      return () => media.removeEventListener('change', handleChange)
    }

    media.addListener(handleChange)
    return () => media.removeListener(handleChange)
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement

    if (!course || !isDesktop) {
      root.style.removeProperty('--page-sidebar-offset')
      return
    }

    root.style.setProperty('--page-sidebar-offset', sideNavWidth)

    return () => {
      root.style.removeProperty('--page-sidebar-offset')
    }
  }, [course, sideNavWidth, isDesktop])

  return (
    <section className="space-y-6">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {course?.name ?? t('pages.shkoli.detail.title')}
          </h1>
          <p className="text-sm text-slate-600">
            {course?.type
              ? courseTypeLabel
              : t('pages.shkoli.detail.subtitle')}
          </p>
        </div>
        <Link
          to="/shkoli"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900 sm:w-auto"
        >
          {t('pages.shkoli.detail.back')}
        </Link>
      </div>
      {!isValidId ? (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
          role="alert"
        >
          {t('pages.shkoli.detail.invalidId')}
        </div>
      ) : isLoading ? (
        <div className="space-y-4">
          <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
            {t('pages.shkoli.detail.loading')}
          </div>
        </div>
      ) : error ? (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
          role="alert"
        >
          {getCourseErrorMessage(error ?? null, t)}
        </div>
      ) : !course ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
          {t('pages.shkoli.detail.notFound')}
        </div>
      ) : (
        <div className="relative">
          {isDesktop ? (
            <aside
              className="fixed left-0 z-20 flex border-r border-slate-200 bg-white/95 shadow-sm backdrop-blur"
              style={{
                width: sideNavWidth,
                top: 'var(--topnav-height, 76px)',
                height: 'calc(100vh - var(--topnav-height, 76px))',
              }}
            >
              <nav
                aria-label={t('pages.shkoli.detail.sideNav.label')}
                className={sideNavContainerClassName}
              >
                <div className={sideNavListClassName}>
                  {sideNavItems.map((item) =>
                    item.to ? (
                      <Link
                        key={item.key}
                        to={item.to}
                        title={item.label}
                        className={sideNavItemClassName}
                      >
                        <span className={sideNavIconClassName}>
                          {item.icon}
                        </span>
                        {isSideNavExpanded ? (
                          <span>{item.label}</span>
                        ) : (
                          <span className="sr-only">{item.label}</span>
                        )}
                      </Link>
                    ) : (
                      <a
                        key={item.key}
                        href={item.href}
                        title={item.label}
                        className={sideNavItemClassName}
                      >
                        <span className={sideNavIconClassName}>
                          {item.icon}
                        </span>
                        {isSideNavExpanded ? (
                          <span>{item.label}</span>
                        ) : (
                          <span className="sr-only">{item.label}</span>
                        )}
                      </a>
                    ),
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsSideNavExpanded((prev) => !prev)}
                  aria-label={
                    isSideNavExpanded
                      ? t('pages.shkoli.detail.sideNav.collapse')
                      : t('pages.shkoli.detail.sideNav.expand')
                  }
                  title={
                    isSideNavExpanded
                      ? t('pages.shkoli.detail.sideNav.collapse')
                      : t('pages.shkoli.detail.sideNav.expand')
                  }
                  className={sideNavToggleClassName}
                >
                  <span className={sideNavIconClassName}>
                    <svg
                      viewBox="0 0 24 24"
                      className={navIconClassName}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {isSideNavExpanded ? (
                        <path d="M15 6l-6 6 6 6" />
                      ) : (
                        <path d="M9 6l6 6-6 6" />
                      )}
                    </svg>
                  </span>
                  {isSideNavExpanded ? (
                    <span>{t('pages.shkoli.detail.sideNav.collapse')}</span>
                  ) : (
                    <span className="sr-only">
                      {t('pages.shkoli.detail.sideNav.expand')}
                    </span>
                  )}
                </button>
              </nav>
            </aside>
          ) : null}
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
            <div className="space-y-6">
              <div
                id="course-overview"
                className="scroll-mt-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
              >
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                      <img
                        src={logoImageUrl}
                        alt={
                          logoImage?.altText ??
                          t('pages.shkoli.detail.images.logoAlt', {
                            name: courseName,
                          })
                        }
                        className="h-full w-full object-contain"
                        loading="lazy"
                        onError={(event) => {
                          const target = event.currentTarget
                          target.onerror = null
                          target.src = courseLogoPlaceholder
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                        {t('pages.shkoli.detail.heroLabel')}
                      </p>
                      <h2 className="text-xl font-semibold text-slate-900">
                        {courseName}
                      </h2>
                      <p className="text-sm text-slate-600">{courseTypeLabel}</p>
                    </div>
                  </div>
                  {(course.type || ageGroups.length > 0) && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {course.type ? (
                        <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                          {courseTypeLabel}
                        </span>
                      ) : null}
                      {ageGroups.map((group) => (
                        <span
                          key={group}
                          className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                        >
                          {t(`courses.ageGroups.${group}`)}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="mt-4 text-sm text-slate-600">
                    {course.description ??
                      t('pages.shkoli.detail.descriptionPlaceholder')}
                  </p>
                  <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
                    {courseDetails.map((detail) => (
                      <div key={detail.label} className="space-y-1">
                        <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                          {detail.label}
                        </dt>
                        <dd className="font-medium text-slate-900">
                          {detail.value}
                        </dd>
                      </div>
                    ))}
                    <div className="space-y-1 sm:col-span-2">
                      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        {t('pages.shkoli.detail.fields.achievements')}
                      </dt>
                      <dd className="font-medium text-slate-900">
                        {course.achievements ??
                          t('pages.shkoli.detail.achievementsPlaceholder')}
                      </dd>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        {t('pages.shkoli.detail.fields.website')}
                      </dt>
                      <dd className="font-medium text-slate-900">
                        {course.websiteLink ? (
                          <a
                            href={course.websiteLink}
                            target="_blank"
                            rel="noreferrer"
                            className="break-all text-brand underline hover:text-brand-dark"
                          >
                            {course.websiteLink}
                          </a>
                        ) : (
                          fallbackValue
                        )}
                      </dd>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        {t('pages.shkoli.detail.fields.facebook')}
                      </dt>
                      <dd className="font-medium text-slate-900">
                        {course.facebookLink ? (
                          <a
                            href={course.facebookLink}
                            target="_blank"
                            rel="noreferrer"
                            className="break-all text-brand underline hover:text-brand-dark"
                          >
                            {course.facebookLink}
                          </a>
                        ) : (
                          fallbackValue
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div className="relative">
                  <img
                    src={mainImageUrl}
                    alt={
                      mainImage?.altText ??
                      t('pages.shkoli.detail.images.mainAlt', {
                        name: courseName,
                      })
                    }
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={(event) => {
                      const target = event.currentTarget
                      target.onerror = null
                      target.src = courseMainPlaceholder
                    }}
                  />
                </div>
              </div>
            </div>
            <div
              id="course-schedule"
              className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-sm font-semibold text-slate-900">
                {t('pages.shkoli.detail.sections.schedule')}
              </h3>
              {scheduleSlots.length === 0 &&
              scheduleSpecialCases.length === 0 ? (
                <p className="mt-3 text-sm text-slate-600">
                  {t('pages.shkoli.detail.schedule.empty')}
                </p>
              ) : (
                <div className="mt-4 space-y-6">
                  {scheduleSlots.length > 0 ? (
                    <div className="grid gap-4 lg:grid-cols-2">
                      {scheduleSlots.map((slot, index) => {
                        const badge = getScheduleBadge(
                          slot,
                          fallbackValue,
                          t,
                        )
                        const metaItems = [
                          badge.kind !== 'dayOfWeek' && slot.dayOfWeek
                            ? {
                                label: t(
                                  'pages.shkoli.detail.schedule.dayOfWeek',
                                ),
                                value: t(
                                  `courses.daysOfWeek.${slot.dayOfWeek}`,
                                ),
                              }
                            : null,
                          badge.kind !== 'dayOfMonth' &&
                          typeof slot.dayOfMonth === 'number'
                            ? {
                                label: t(
                                  'pages.shkoli.detail.schedule.dayOfMonth',
                                ),
                                value: String(slot.dayOfMonth),
                              }
                            : null,
                          typeof slot.classesCount === 'number'
                            ? {
                                label: t(
                                  'pages.shkoli.detail.schedule.classesCount',
                                ),
                                value: String(slot.classesCount),
                              }
                            : null,
                          typeof slot.gapBetweenClassesMinutes === 'number'
                            ? {
                                label: t('pages.shkoli.detail.schedule.gap'),
                                value: t(
                                  'pages.shkoli.detail.schedule.minutes',
                                  {
                                    count: slot.gapBetweenClassesMinutes,
                                  },
                                ),
                              }
                            : null,
                        ].filter(Boolean) as Array<{
                          label: string
                          value: string
                        }>
                        const startTimeValue = slot.startTime
                          ? formatScheduleTime(slot.startTime)
                          : null
                        const durationValue =
                          typeof slot.singleClassDurationMinutes === 'number'
                            ? t('pages.shkoli.detail.schedule.minutes', {
                                count: slot.singleClassDurationMinutes,
                              })
                            : null
                        const hasLeftColumn = Boolean(
                          startTimeValue || durationValue,
                        )
                        const hasMetaItems = metaItems.length > 0
                        return (
                          <div
                            key={`${slot.recurrence}-${index}`}
                            className="w-full max-w-full rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 p-3 shadow-sm sm:w-fit sm:justify-self-start sm:p-4"
                          >
                            <div className="space-y-3">
                              <div className="flex flex-wrap items-center gap-3">
                                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                  <div className="h-1.5 bg-brand/20" />
                                  <div className="px-3 py-2 text-center">
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                      {badge.label}
                                    </p>
                                    <p className="text-base font-semibold text-slate-900">
                                      {badge.value}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              {hasLeftColumn || hasMetaItems ? (
                                <div className="flex flex-wrap gap-2">
                                  {hasLeftColumn ? (
                                    <div className="flex flex-col gap-2">
                                      {startTimeValue ? (
                                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                                          <span className="text-slate-400">
                                            {t(
                                              'pages.shkoli.detail.schedule.startTime',
                                            )}
                                          </span>
                                          <span className="font-semibold text-slate-900">
                                            {startTimeValue}
                                          </span>
                                        </span>
                                      ) : null}
                                      {durationValue ? (
                                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                                          <span className="text-slate-400">
                                            {t(
                                              'pages.shkoli.detail.schedule.duration',
                                            )}
                                          </span>
                                          <span className="font-semibold text-slate-900">
                                            {durationValue}
                                          </span>
                                        </span>
                                      ) : null}
                                    </div>
                                  ) : null}
                                  {hasMetaItems ? (
                                    <div className="flex flex-wrap gap-2">
                                      {metaItems.map((item) => (
                                        <span
                                          key={`${item.label}-${item.value}`}
                                          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600"
                                        >
                                          <span className="text-slate-400">
                                            {item.label}
                                          </span>
                                          <span className="font-semibold text-slate-900">
                                            {item.value}
                                          </span>
                                        </span>
                                      ))}
                                    </div>
                                  ) : null}
                                </div>
                              ) : (
                                <p className="text-sm text-slate-600">
                                  {fallbackValue}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : null}
                  {scheduleSpecialCases.length > 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {t('pages.shkoli.detail.schedule.specialCases')}
                      </p>
                      <ul className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                        {scheduleSpecialCases.map((entry, index) => (
                          <li
                            key={`${entry.date}-${index}`}
                            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                          >
                            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                              <div
                                className={`h-1.5 ${
                                  entry.cancelled
                                    ? 'bg-rose-200'
                                    : 'bg-emerald-200'
                                }`}
                              />
                              <div className="px-3 py-2 text-center">
                                <p className="text-sm font-semibold text-slate-900">
                                  {formatScheduleDate(
                                    entry.date,
                                    i18n.language,
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex-1">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                                  entry.cancelled
                                    ? 'bg-rose-100 text-rose-700'
                                    : 'bg-emerald-100 text-emerald-700'
                                }`}
                              >
                                {getSpecialCaseStatus(entry, t)}
                              </span>
                              {entry.reason ? (
                                <p className="mt-2 text-xs text-slate-500">
                                  {t('pages.shkoli.detail.schedule.reason')}:{' '}
                                  {entry.reason}
                                </p>
                              ) : null}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
            <div
              id="course-lecturers"
              className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-sm font-semibold text-slate-900">
                {t('pages.shkoli.detail.sections.lecturers')}
              </h3>
              {isLecturersLoading ? (
                <p className="mt-3 text-sm text-slate-600">
                  {t('pages.shkoli.detail.lecturersLoading')}
                </p>
              ) : lecturersError ? (
                <div
                  className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
                  role="alert"
                >
                  {lecturersErrorMessage}
                </div>
              ) : lecturers && lecturers.length > 0 ? (
                <ul className="mt-4 space-y-3">
                  {lecturers.map((lecturer) => {
                    const displayName =
                      getUserDisplayName(lecturer) || fallbackValue
                    return (
                      <li
                        key={lecturer.id ?? displayName}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-600">
                          {displayName
                            .split(' ')
                            .map((part) => part[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {displayName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {lecturer.email ?? fallbackValue}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-slate-600">
                  {t('pages.shkoli.detail.lecturersPlaceholder')}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <div
              id="course-lyceum"
              className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-sm font-semibold text-slate-900">
                {t('pages.shkoli.detail.sections.lyceum')}
              </h3>
              {!lyceumId ? (
                <p className="mt-3 text-sm text-slate-600">
                  {t('pages.shkoli.detail.lyceumPlaceholder')}
                </p>
              ) : isLyceumLoading ? (
                <p className="mt-3 text-sm text-slate-600">
                  {t('pages.shkoli.detail.lyceumLoading')}
                </p>
              ) : lyceumError ? (
                <div
                  className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
                  role="alert"
                >
                  {lyceumErrorMessage}
                </div>
              ) : lyceum ? (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    {lyceum.name ?? fallbackValue}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    {[lyceum.town, lyceum.address]
                      .filter(Boolean)
                      .join(', ') || fallbackValue}
                  </p>
                  <Link
                    to={`/lyceums/${lyceumId}`}
                    className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-brand transition hover:text-brand-dark"
                  >
                    {t('pages.shkoli.detail.actions.openLyceum')}
                  </Link>
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-600">
                  {t('pages.shkoli.detail.lyceumPlaceholder')}
                </p>
              )}
            </div>
            <div
              id="course-gallery"
              className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-sm font-semibold text-slate-900">
                {t('pages.shkoli.detail.sections.gallery')}
              </h3>
              {galleryImages.length > 0 ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {galleryImages.map((image, index) => {
                    const imageUrl =
                      resolveCourseImageUrl(image.url) ??
                      courseMainPlaceholder
                    return (
                      <div
                        key={image.id ?? `${imageUrl}-${index}`}
                        className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/70"
                      >
                        <img
                          src={imageUrl}
                          alt={
                            image.altText ??
                            t('pages.shkoli.detail.images.galleryAlt', {
                              name: courseName,
                              index: index + 1,
                            })
                          }
                          className="h-40 w-full object-cover"
                          loading="lazy"
                          onError={(event) => {
                            const target = event.currentTarget
                            target.onerror = null
                            target.src = courseMainPlaceholder
                          }}
                        />
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-600">
                  {t('pages.shkoli.detail.galleryEmpty')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      )}
    </section>
  )
}

export default CourseDetailPage
