import { useTranslation } from 'react-i18next'
import { NavLink, type NavLinkRenderProps } from 'react-router-dom'

import { useAdminNavItems } from '../hooks/useAdminNavItems'

type AdminSideNavProps = {
  isDesktop: boolean
  isSideNavExpanded: boolean
  sideNavWidth: string
  onToggle: () => void
}

export const AdminSideNav = ({
  isDesktop,
  isSideNavExpanded,
  sideNavWidth,
  onToggle,
}: AdminSideNavProps) => {
  const { t } = useTranslation()
  const items = useAdminNavItems()

  if (!isDesktop) return null

  const navIconClassName = 'h-5 w-5'
  const baseButtonClassName =
    'group inline-flex items-center rounded-lg text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 lg:text-sm'
  const itemClassName = ({ isActive }: NavLinkRenderProps) =>
    [
      baseButtonClassName,
      isSideNavExpanded
        ? 'w-full justify-start gap-3 px-3 py-1'
        : 'h-11 w-11 justify-center',
      isActive ? 'bg-brand/10 text-brand' : 'text-slate-700',
    ].join(' ')
  const iconClassName = (isActive: boolean) =>
    [
      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-white transition group-hover:border-brand/30',
      isActive ? 'border-brand/30 text-brand' : 'border-slate-200 text-brand',
    ].join(' ')
  const toggleClassName = [
    baseButtonClassName,
    'mt-2',
    isSideNavExpanded
      ? 'w-full justify-start gap-3 px-3 py-1'
      : 'h-11 w-11 justify-center',
  ].join(' ')
  const containerClassName = [
    'flex h-full w-full flex-col gap-3 px-2 py-4',
    isSideNavExpanded ? 'items-stretch' : 'items-center',
  ].join(' ')
  const listClassName = [
    'flex flex-1 flex-col gap-2 overflow-y-auto',
    isSideNavExpanded ? 'pr-1' : 'pr-0',
  ].join(' ')

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
        aria-label={t('pages.admin.navLabel')}
        className={containerClassName}
      >
        <div className={listClassName}>
          {items.map((item) => (
            <NavLink key={item.id} to={item.to} className={itemClassName}>
              {({ isActive }) => (
                <>
                  <span className={iconClassName(isActive)}>
                    <item.Icon className={navIconClassName} />
                  </span>
                  {isSideNavExpanded ? (
                    <span>{item.label}</span>
                  ) : (
                    <span className="sr-only">{item.label}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-label={
            isSideNavExpanded
              ? t('pages.admin.sideNav.collapse')
              : t('pages.admin.sideNav.expand')
          }
          title={
            isSideNavExpanded
              ? t('pages.admin.sideNav.collapse')
              : t('pages.admin.sideNav.expand')
          }
          className={toggleClassName}
        >
          <span className={iconClassName(false)}>
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
            <span>{t('pages.admin.sideNav.collapse')}</span>
          ) : (
            <span className="sr-only">
              {t('pages.admin.sideNav.expand')}
            </span>
          )}
        </button>
      </nav>
    </aside>
  )
}
