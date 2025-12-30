import { useTranslation } from 'react-i18next'
import { Link, NavLink, type NavLinkRenderProps } from 'react-router-dom'

import logo from '../../assets/logo.png'

const TopNav = () => {
  const { t } = useTranslation()
  const navLinkClassName = ({ isActive }: NavLinkRenderProps) =>
    [
      'border-b-2 px-3 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'border-brand text-slate-900'
        : 'border-transparent text-slate-600 hover:border-brand/40 hover:text-brand-dark',
    ].join(' ')

  return (
    <header className="relative z-10 w-full border-b border-slate-200 bg-white">
      <div className="flex w-full items-center justify-between px-4 py-4 sm:px-6 lg:px-12">
        <Link
          to="/shkoli"
          className="group flex items-center gap-3"
          aria-label={t('app.title')}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 ring-1 ring-brand/20 shadow-sm transition group-hover:bg-brand/15">
            <img
              src={logo}
              alt={t('app.logoAlt')}
              className="h-7 w-7 object-contain"
              loading="lazy"
            />
          </span>
          <span className="text-base font-semibold text-brand">
            {t('app.title')}
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <nav
            aria-label={t('layouts.app.nav.label')}
            className="flex items-center gap-1"
          >
            <NavLink to="/shkoli" className={navLinkClassName}>
              {t('nav.shkoli')}
            </NavLink>
            <NavLink to="/lyceums" className={navLinkClassName}>
              {t('nav.lyceums')}
            </NavLink>
            <NavLink to="/map" className={navLinkClassName}>
              {t('nav.map')}
            </NavLink>
            <NavLink to="/about" className={navLinkClassName}>
              {t('nav.about')}
            </NavLink>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-full border border-brand/30 px-4 py-2 text-sm font-semibold text-brand transition hover:border-brand hover:text-brand-dark"
            >
              {t('nav.register')}
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {t('nav.login')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopNav
