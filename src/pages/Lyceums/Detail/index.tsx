import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import placeholderImage from '../../../assets/lyceum-placeholder.svg'
import { useAuthStatus } from '../../../hooks/useAuthStatus'
import type { ApiError } from '../../../types/api'
import { getUserDisplayName } from '../../../utils/user'
import LyceumCourseCard from './components/LyceumCourseCard'
import LyceumLecturerCard from './components/LyceumLecturerCard'
import { useLyceum } from '../hooks/useLyceum'
import { useLyceumCourses } from '../hooks/useLyceumCourses'
import { useLyceumLecturers } from '../hooks/useLyceumLecturers'
import { useUsersByIds } from '../../../hooks/useUsersByIds'
import { useUserProfile } from '../../Profile/hooks/useUserProfile'

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
  if (error.status === 404) {
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

const MAX_VISIBLE_COURSES = 4
const MAX_VISIBLE_LECTURERS = 5
const CAROUSEL_CARD_STYLE = {
  flex: '0 0 calc((100% - (var(--carousel-cols) - 1) * var(--carousel-gap)) / var(--carousel-cols))',
} as const

type CarouselMetrics = {
  step: number
  perView: number
  trackRef: RefObject<HTMLUListElement>
  cardRef: RefObject<HTMLLIElement>
}

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

const useCarouselMetrics = (
  itemsCount: number,
  fallbackPerView: number,
): CarouselMetrics => {
  const [step, setStep] = useState(0)
  const [perView, setPerView] = useState(fallbackPerView)
  const trackRef = useRef<HTMLUListElement | null>(null)
  const cardRef = useRef<HTMLLIElement | null>(null)

  useEffect(() => {
    const track = trackRef.current
    const firstCard = cardRef.current
    if (!track || !firstCard) return

    const updateMetrics = () => {
      const styles = getComputedStyle(track)
      const gapValue = Number.parseFloat(
        styles.columnGap || styles.gap || '0',
      )
      const columnsValue = Number.parseInt(
        styles.getPropertyValue('--carousel-cols'),
        10,
      )
      const cardWidth = firstCard.getBoundingClientRect().width
      const gap = Number.isFinite(gapValue) ? gapValue : 0

      if (Number.isFinite(cardWidth) && cardWidth > 0) {
        setStep(cardWidth + gap)
      }

      if (Number.isFinite(columnsValue) && columnsValue > 0) {
        setPerView(columnsValue)
      } else {
        setPerView(fallbackPerView)
      }
    }

    updateMetrics()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateMetrics)
      return () => window.removeEventListener('resize', updateMetrics)
    }

    const observer = new ResizeObserver(updateMetrics)
    observer.observe(track)
    observer.observe(firstCard)
    return () => observer.disconnect()
  }, [itemsCount, fallbackPerView])

  return { step, perView, trackRef, cardRef }
}

const LyceumDetailPage = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuthStatus()
  const { data: user } = useUserProfile({ enabled: isAuthenticated })
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(min-width: 1024px)').matches
  })
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(min-width: 1024px)').matches
  })

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

  const [courseStartIndex, setCourseStartIndex] = useState(0)
  const [lecturerStartIndex, setLecturerStartIndex] = useState(0)

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

  const coursesCarousel = useCarouselMetrics(
    coursesCount,
    MAX_VISIBLE_COURSES,
  )
  const lecturersCarousel = useCarouselMetrics(
    lecturersCount,
    MAX_VISIBLE_LECTURERS,
  )

  useEffect(() => {
    const maxStartIndex = Math.max(
      0,
      coursesCount - coursesCarousel.perView,
    )
    setCourseStartIndex((prev) => Math.min(prev, maxStartIndex))
  }, [coursesCount, coursesCarousel.perView])

  useEffect(() => {
    const maxStartIndex = Math.max(
      0,
      lecturersCount - lecturersCarousel.perView,
    )
    setLecturerStartIndex((prev) => Math.min(prev, maxStartIndex))
  }, [lecturersCount, lecturersCarousel.perView])

  const lecturersById = useMemo(() => {
    if (!lecturers) return new Map<number, string>()
    return new Map(
      lecturers
        .filter((lecturer) => lecturer.id != null)
        .map((lecturer) => [
          lecturer.id as number,
          getUserDisplayName(lecturer),
        ]),
    )
  }, [lecturers])

  const courseLecturerIds = useMemo(() => {
    if (!courses) return []
    const ids = courses.flatMap((course) => course.lecturerIds ?? [])
    const validIds = ids.filter(
      (id): id is number => Number.isFinite(id),
    )
    return Array.from(new Set(validIds))
  }, [courses])

  const missingLecturerIds = useMemo(() => {
    if (courseLecturerIds.length === 0) return []
    return courseLecturerIds.filter((id) => !lecturersById.has(id))
  }, [courseLecturerIds, lecturersById])

  const { data: extraLecturers } = useUsersByIds(missingLecturerIds, {
    enabled: isValidId && missingLecturerIds.length > 0,
  })

  const extraLecturersById = useMemo(() => {
    if (!extraLecturers) return new Map<number, string>()
    return new Map(
      extraLecturers
        .filter((lecturer) => lecturer.id != null)
        .map((lecturer) => [
          lecturer.id as number,
          getUserDisplayName(lecturer),
        ]),
    )
  }, [extraLecturers])

  const courseLecturersById = useMemo(() => {
    const merged = new Map(lecturersById)
    extraLecturersById.forEach((name, id) => {
      if (!merged.has(id)) {
        merged.set(id, name)
      }
    })
    return merged
  }, [lecturersById, extraLecturersById])

  const maxCourseStartIndex = Math.max(
    0,
    coursesCount - coursesCarousel.perView,
  )
  const clampedCourseStartIndex = Math.min(
    courseStartIndex,
    maxCourseStartIndex,
  )
  const courseOffset = coursesCarousel.step * clampedCourseStartIndex
  const canGoPrevCourse = clampedCourseStartIndex > 0
  const canGoNextCourse = clampedCourseStartIndex < maxCourseStartIndex

  const maxLecturerStartIndex = Math.max(
    0,
    lecturersCount - lecturersCarousel.perView,
  )
  const clampedLecturerStartIndex = Math.min(
    lecturerStartIndex,
    maxLecturerStartIndex,
  )
  const lecturerOffset = lecturersCarousel.step * clampedLecturerStartIndex
  const canGoPrevLecturer = clampedLecturerStartIndex > 0
  const canGoNextLecturer = clampedLecturerStartIndex < maxLecturerStartIndex

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

  const canEditLyceum =
    isValidId &&
    (user?.role === 'ADMIN' || user?.administratedLyceumId === lyceumId)
  const isLyceumLecturer = Boolean(
    user?.id != null &&
      lecturers?.some((lecturer) => lecturer.id === user.id),
  )
  const canAddCourse =
    isValidId &&
    (user?.role === 'ADMIN' ||
      user?.administratedLyceumId === lyceumId ||
      isLyceumLecturer)
  const navIconClassName = 'h-5 w-5'
  const sideNavWidth = !isDesktop
    ? '0px'
    : isSideNavExpanded
      ? '16rem'
      : '4.75rem'
  const baseSideNavItems: SideNavItem[] = [
    {
      key: 'lyceum-info',
      label: t('pages.lyceums.detail.sideNav.info'),
      href: '#lyceum-info',
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
      key: 'lyceum-courses',
      label: t('pages.lyceums.detail.sideNav.courses'),
      href: '#lyceum-courses',
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
          <path d="M8 6.5h11" />
          <path d="M8 12h11" />
          <path d="M8 17.5h11" />
          <circle cx="5" cy="6.5" r="1.2" />
          <circle cx="5" cy="12" r="1.2" />
          <circle cx="5" cy="17.5" r="1.2" />
        </svg>
      ),
    },
    {
      key: 'lyceum-lecturers',
      label: t('pages.lyceums.detail.sideNav.lecturers'),
      href: '#lyceum-lecturers',
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
  ]
  const sideNavItems: SideNavItem[] = [
    ...baseSideNavItems,
    ...(canAddCourse
      ? [
          {
            key: 'lyceum-add-course',
            label: t('pages.lyceums.detail.sideNav.addCourse'),
            to: `/shkoli/new?lyceumId=${lyceumId}`,
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
        ]
      : []),
    ...(canEditLyceum
      ? [
          {
            key: 'lyceum-edit',
            label: t('pages.lyceums.detail.editCta'),
            to: `/lyceums/${lyceumId}/edit`,
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
      : []),
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

    if (!lyceum || !isDesktop) {
      root.style.removeProperty('--page-sidebar-offset')
      return
    }

    root.style.setProperty('--page-sidebar-offset', sideNavWidth)

    return () => {
      root.style.removeProperty('--page-sidebar-offset')
    }
  }, [lyceum, sideNavWidth, isDesktop])

  return (
    <section className="space-y-6 -mt-8 sm:mt-0">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <div className="hidden flex-col gap-3 sm:flex sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            {lyceum?.name ?? t('pages.lyceums.detail.title')}
          </h1>
          <p className="text-sm text-slate-600">
            {heroLocation || t('pages.lyceums.detail.subtitle')}
          </p>
        </div>
        <Link
          to="/lyceums"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900 sm:w-auto"
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
                aria-label={t('pages.lyceums.detail.sideNav.label')}
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
                        <span className={sideNavIconClassName}>{item.icon}</span>
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
                      ? t('pages.lyceums.detail.sideNav.collapse')
                      : t('pages.lyceums.detail.sideNav.expand')
                  }
                  title={
                    isSideNavExpanded
                      ? t('pages.lyceums.detail.sideNav.collapse')
                      : t('pages.lyceums.detail.sideNav.expand')
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
                    <span>{t('pages.lyceums.detail.sideNav.collapse')}</span>
                  ) : (
                    <span className="sr-only">
                      {t('pages.lyceums.detail.sideNav.expand')}
                    </span>
                  )}
                </button>
              </nav>
            </aside>
          ) : null}
          <div className="space-y-6">
            <div
              id="lyceum-info"
              className="scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="grid gap-4 lg:gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="p-5 sm:p-6 lg:p-8">
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
            className="relative scroll-mt-24 overflow-hidden rounded-3xl px-3 py-6 sm:px-5"
          >
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute -top-6 left-8 h-24 w-24 rounded-full bg-brand/10 blur-2xl" />
              <div className="absolute bottom-4 right-6 h-32 w-32 rounded-full bg-emerald-100/80 blur-3xl" />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                  {t('pages.lyceums.detail.sections.courses')}
                </h3>
              </div>
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                {t('pages.lyceums.detail.countLabel', { count: coursesCount })}
              </span>
            </div>
            {isCoursesLoading ? (
              <div className="mt-4 animate-pulse rounded-2xl border border-dashed border-slate-200 bg-white/80 p-4 text-sm text-slate-600 shadow-sm">
                {t('pages.lyceums.detail.coursesLoading')}
              </div>
            ) : coursesError ? (
              <div
                className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
                role="alert"
              >
                {coursesErrorMessage}
              </div>
            ) : courses && courses.length > 0 ? (
              <>
                <div className="mt-4 overflow-hidden">
                  <ul
                    ref={coursesCarousel.trackRef}
                    className="flex flex-nowrap gap-4 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-reduce:transition-none [--carousel-cols:1] sm:[--carousel-cols:2] lg:[--carousel-cols:4] [--carousel-gap:1rem]"
                    style={{ transform: `translateX(-${courseOffset}px)` }}
                  >
                    {courses.map((course, index) => {
                      const lecturerIds = course.lecturerIds ?? []
                      const primaryLecturerId = lecturerIds[0]
                      const primaryLecturerName =
                        (primaryLecturerId
                          ? courseLecturersById.get(primaryLecturerId)
                          : '') || fallbackValue
                      const additionalLecturers = Math.max(
                        0,
                        lecturerIds.length - 1,
                      )

                      return (
                        <li
                          key={
                            course.id ?? `${course.name ?? 'course'}-${index}`
                          }
                          ref={index === 0 ? coursesCarousel.cardRef : undefined}
                          className="h-full flex-none"
                          style={CAROUSEL_CARD_STYLE}
                        >
                          <LyceumCourseCard
                            course={course}
                            lecturerName={primaryLecturerName}
                            additionalLecturers={additionalLecturers}
                            fallbackValue={fallbackValue}
                          />
                        </li>
                      )
                    })}
                  </ul>
                </div>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setCourseStartIndex((prev) => Math.max(0, prev - 1))
                    }
                    disabled={!canGoPrevCourse}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/90 p-2 text-slate-600 shadow-sm transition hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={t(
                      'pages.lyceums.detail.coursesCarousel.previous',
                    )}
                    title={t('pages.lyceums.detail.coursesCarousel.previous')}
                  >
                    <svg
                      viewBox="0 0 20 20"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M12.5 4.5L7 10l5.5 5.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCourseStartIndex((prev) =>
                        Math.min(maxCourseStartIndex, prev + 1),
                      )
                    }
                    disabled={!canGoNextCourse}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/90 p-2 text-slate-600 shadow-sm transition hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={t('pages.lyceums.detail.coursesCarousel.next')}
                    title={t('pages.lyceums.detail.coursesCarousel.next')}
                  >
                    <svg
                      viewBox="0 0 20 20"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M7.5 4.5L13 10l-5.5 5.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white/80 p-4 text-sm text-slate-600 shadow-sm">
                {t('pages.lyceums.detail.coursesPlaceholder')}
              </div>
            )}
          </div>
          <div
            id="lyceum-lecturers"
            className="scroll-mt-24 rounded-2xl border border-slate-200/60 bg-transparent p-4 shadow-none sm:p-5"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                  {t('pages.lyceums.detail.sections.lecturers')}
                </h3>
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
              <>
                <div className="relative mt-4 overflow-hidden rounded-2xl bg-slate-100/60 p-2">
                  <div className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-emerald-200/40 blur-3xl" />
                  <div className="pointer-events-none absolute -right-8 bottom-0 h-28 w-28 rounded-full bg-sky-200/40 blur-3xl" />
                  <ul
                    ref={lecturersCarousel.trackRef}
                    className="relative z-10 flex flex-nowrap gap-2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform motion-reduce:transition-none [--carousel-cols:1] sm:[--carousel-cols:2] md:[--carousel-cols:3] lg:[--carousel-cols:5] [--carousel-gap:0.5rem]"
                    style={{ transform: `translateX(-${lecturerOffset}px)` }}
                  >
                    {lecturers.map((lecturer, index) => {
                      const displayName =
                        getUserDisplayName(lecturer) || fallbackValue
                      const isLeadingEdge =
                        canGoPrevLecturer &&
                        index === clampedLecturerStartIndex
                      const isTrailingEdge =
                        canGoNextLecturer &&
                        index ===
                          clampedLecturerStartIndex +
                            lecturersCarousel.perView -
                            1
                      const edgeClass =
                        isLeadingEdge || isTrailingEdge
                          ? 'opacity-80 translate-y-1'
                          : 'opacity-100'
                      return (
                        <li
                          key={lecturer.id ?? `${displayName}-${index}`}
                          ref={
                            index === 0
                              ? lecturersCarousel.cardRef
                              : undefined
                          }
                          className={`h-full flex-none transition-transform transition-opacity duration-300 ${edgeClass}`}
                          style={CAROUSEL_CARD_STYLE}
                        >
                          <LyceumLecturerCard
                            lecturer={lecturer}
                            displayName={displayName}
                            fallbackValue={fallbackValue}
                          />
                        </li>
                      )
                    })}
                  </ul>
                  <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-6 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />
                  <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-6 bg-gradient-to-l from-white/90 via-white/60 to-transparent" />
                </div>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setLecturerStartIndex((prev) => Math.max(0, prev - 1))
                    }
                    disabled={!canGoPrevLecturer}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/90 p-2 text-slate-600 shadow-sm transition hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={t(
                      'pages.lyceums.detail.lecturersCarousel.previous',
                    )}
                    title={t('pages.lyceums.detail.lecturersCarousel.previous')}
                  >
                    <svg
                      viewBox="0 0 20 20"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M12.5 4.5L7 10l5.5 5.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setLecturerStartIndex((prev) =>
                        Math.min(maxLecturerStartIndex, prev + 1),
                      )
                    }
                    disabled={!canGoNextLecturer}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/90 p-2 text-slate-600 shadow-sm transition hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={t('pages.lyceums.detail.lecturersCarousel.next')}
                    title={t('pages.lyceums.detail.lecturersCarousel.next')}
                  >
                    <svg
                      viewBox="0 0 20 20"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M7.5 4.5L13 10l-5.5 5.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-4 rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-600">
                {t('pages.lyceums.detail.lecturersPlaceholder')}
              </div>
            )}
          </div>
        </div>
      </div>
      )}
    </section>
  )
}

export default LyceumDetailPage
