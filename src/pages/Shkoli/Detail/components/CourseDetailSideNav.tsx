import type { TFunction } from 'i18next'
import { Link } from 'react-router-dom'

import type { SideNavItem } from '../types'

type CourseDetailSideNavProps = {
  items: SideNavItem[]
  isDesktop: boolean
  isSideNavExpanded: boolean
  sideNavWidth: string
  navIconClassName: string
  sideNavItemClassName: string
  sideNavIconClassName: string
  sideNavToggleClassName: string
  sideNavContainerClassName: string
  sideNavListClassName: string
  canDeleteCourse?: boolean
  isDeletingCourse?: boolean
  onDeleteCourse?: () => void
  onToggle: () => void
  t: TFunction
}

export const CourseDetailSideNav = ({
  items,
  isDesktop,
  isSideNavExpanded,
  sideNavWidth,
  navIconClassName,
  sideNavItemClassName,
  sideNavIconClassName,
  sideNavToggleClassName,
  sideNavContainerClassName,
  sideNavListClassName,
  canDeleteCourse = false,
  isDeletingCourse = false,
  onDeleteCourse,
  onToggle,
  t,
}: CourseDetailSideNavProps) => {
  if (!isDesktop) {
    return null
  }

  return (
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
          {items.map((item) =>
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
                <span className={sideNavIconClassName}>{item.icon}</span>
                {isSideNavExpanded ? (
                  <span>{item.label}</span>
                ) : (
                  <span className="sr-only">{item.label}</span>
                )}
              </a>
            ),
          )}
        </div>
        {canDeleteCourse && onDeleteCourse ? (
          <button
            type="button"
            onClick={onDeleteCourse}
            disabled={isDeletingCourse}
            title={t('pages.shkoli.detail.sideNav.deleteCourse')}
            className={[
              'group inline-flex items-center rounded-lg text-xs font-semibold transition lg:text-sm',
              isSideNavExpanded
                ? 'w-full justify-start gap-3 px-3 py-1'
                : 'h-11 w-11 justify-center',
              'text-rose-700 hover:bg-rose-50 hover:text-rose-800',
              'disabled:cursor-not-allowed disabled:opacity-60',
            ].join(' ')}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-700 transition">
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
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
              </svg>
            </span>
            {isSideNavExpanded ? (
              <span>
                {isDeletingCourse
                  ? t('pages.shkoli.detail.sideNav.deletingCourse')
                  : t('pages.shkoli.detail.sideNav.deleteCourse')}
              </span>
            ) : (
              <span className="sr-only">
                {isDeletingCourse
                  ? t('pages.shkoli.detail.sideNav.deletingCourse')
                  : t('pages.shkoli.detail.sideNav.deleteCourse')}
              </span>
            )}
          </button>
        ) : null}
        <button
          type="button"
          onClick={onToggle}
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
  )
}
