import type { TFunction } from 'i18next'
import { Link } from 'react-router-dom'

import type { SideNavItem } from '../types'

type LyceumDetailSideNavProps = {
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
  onToggle: () => void
  t: TFunction
}

export const LyceumDetailSideNav = ({
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
  onToggle,
  t,
}: LyceumDetailSideNavProps) => {
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
        aria-label={t('pages.lyceums.detail.sideNav.label')}
        className={sideNavContainerClassName}
      >
        <div className={sideNavListClassName}>
          {items.map((item) => {
            if (typeof item.to === 'string') {
              return (
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
              )
            }

            if (typeof item.href === 'string') {
              return (
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
              )
            }

            return (
              <button
                key={item.key}
                type="button"
                onClick={item.onClick}
                title={item.label}
                aria-haspopup="dialog"
                aria-controls={item.controlsId}
                className={sideNavItemClassName}
              >
                <span className={sideNavIconClassName}>{item.icon}</span>
                {isSideNavExpanded ? (
                  <span>{item.label}</span>
                ) : (
                  <span className="sr-only">{item.label}</span>
                )}
              </button>
            )
          })}
        </div>
        <button
          type="button"
          onClick={onToggle}
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
  )
}
