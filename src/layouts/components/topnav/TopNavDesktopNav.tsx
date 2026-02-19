import type { TFunction } from 'i18next'
import { NavLink, type NavLinkRenderProps } from 'react-router-dom'

import { useLocalizedPath } from '../../../hooks/useLocalizedPath'

type TopNavDesktopNavProps = {
  t: TFunction
  isGlobalAdmin: boolean
}

const navLinkClassName = ({ isActive }: NavLinkRenderProps) =>
  [
    'border-b-2 px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'border-brand text-slate-900'
      : 'border-transparent text-slate-600 hover:border-brand/40 hover:text-brand-dark',
  ].join(' ')

export const TopNavDesktopNav = ({
  t,
  isGlobalAdmin,
}: TopNavDesktopNavProps) => {
  const localizedPath = useLocalizedPath()

  return (
    <nav
      aria-label={t('layouts.app.nav.label')}
      className="hidden items-center gap-1 md:flex"
    >
      <NavLink to={localizedPath('/shkoli')} className={navLinkClassName}>
        {t('nav.shkoli')}
      </NavLink>
      <NavLink to={localizedPath('/lyceums')} className={navLinkClassName}>
        {t('nav.lyceums')}
      </NavLink>
      <NavLink to={localizedPath('/map')} className={navLinkClassName}>
        {t('nav.map')}
      </NavLink>
      {isGlobalAdmin ? (
        <NavLink to={localizedPath('/admin')} className={navLinkClassName}>
          {t('nav.admin')}
        </NavLink>
      ) : null}
    </nav>
  )
}
