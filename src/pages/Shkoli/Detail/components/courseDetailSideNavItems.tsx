import type { TFunction } from 'i18next'

import type { SideNavItem } from '../types'

type CourseDetailSideNavItemsOptions = {
  t: TFunction
  courseId: number
  canEditCourse: boolean
  canViewSubscribers: boolean
  canViewStatistics: boolean
  navIconClassName: string
  subscribersModalId: string
  onOpenSubscribers: () => void
}

export const getCourseDetailSideNavItems = ({
  t,
  courseId,
  canEditCourse,
  canViewSubscribers,
  canViewStatistics,
  navIconClassName,
  subscribersModalId,
  onOpenSubscribers,
}: CourseDetailSideNavItemsOptions): SideNavItem[] => {
  const courseEditNavItem: SideNavItem = {
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
  }
  const baseSideNavItems: SideNavItem[] = [
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
          <circle
            cx="12"
            cy="7.5"
            r="1"
            fill="currentColor"
            stroke="none"
          />
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
      key: 'course-reviews',
      label: t('pages.shkoli.detail.sideNav.reviews'),
      href: '#course-reviews',
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
          <path d="M4 5.5h16v10H8l-4 4v-14z" />
          <path d="M9 9.5h6" />
          <path d="M9 12.5h4" />
        </svg>
      ),
    },
  ]
  const courseSubscribersNavItem: SideNavItem = {
    key: 'course-subscribers',
    label: t('pages.shkoli.detail.actions.viewSubscribers'),
    onClick: onOpenSubscribers,
    controlsId: subscribersModalId,
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
  }
  const courseStatisticsNavItem: SideNavItem = {
    key: 'course-statistics',
    label: t('pages.shkoli.detail.sideNav.statistics'),
    href: '#course-statistics',
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
        <path d="M4 19.5h16" />
        <path d="M7 16v-5" />
        <path d="M12 16V6.5" />
        <path d="M17 16V9" />
      </svg>
    ),
  }

  return [
    ...baseSideNavItems,
    ...(canViewStatistics ? [courseStatisticsNavItem] : []),
    ...(canViewSubscribers ? [courseSubscribersNavItem] : []),
    ...(canEditCourse ? [courseEditNavItem] : []),
  ]
}
