import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Link,
  NavLink,
  useNavigate,
  useLocation,
  type NavLinkRenderProps,
} from 'react-router-dom'

import logo from '../../assets/logo.png'
import { useToast } from '../../components/feedback/ToastContext'
import UserAvatar from '../../components/ui/UserAvatar'
import { useAuthStatus } from '../../hooks/useAuthStatus'
import { useLogoutMutation } from '../../hooks/useLogoutMutation'
import { useUserProfile } from '../../pages/Profile/hooks/useUserProfile'
import type { ApiError } from '../../types/api'
import { clearTokens } from '../../utils/authStorage'
import { getUserDisplayName } from '../../utils/user'

const TopNav = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStatus()
  const { data: currentUser } = useUserProfile({ enabled: isAuthenticated })
  const logoutMutation = useLogoutMutation()
  const { showToast } = useToast()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const profileName =
    getUserDisplayName(currentUser) || t('pages.profile.unknownUser')
  const profileAvatarAlt = t('nav.profileAvatarAlt', { name: profileName })

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  const navLinkClassName = ({ isActive }: NavLinkRenderProps) =>
    [
      'border-b-2 px-3 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'border-brand text-slate-900'
        : 'border-transparent text-slate-600 hover:border-brand/40 hover:text-brand-dark',
    ].join(' ')

  const mobileNavLinkClassName = ({ isActive }: NavLinkRenderProps) =>
    [
      'rounded-md px-3 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'bg-brand/10 text-brand'
        : 'text-slate-700 hover:bg-slate-100',
    ].join(' ')

  const getLogoutErrorMessage = (
    error: ApiError | null,
    translate: (key: string) => string,
  ) => {
    if (!error) return null
    if (error.kind === 'unauthorized' || error.kind === 'forbidden') {
      return null
    }
    if (error.kind === 'network') {
      return translate('errors.network')
    }
    return translate('errors.auth.logoutFailed')
  }

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        clearTokens()
        showToast({
          message: t('feedback.auth.logoutSuccess'),
          tone: 'success',
        })
        navigate('/auth/login', { replace: true })
      },
      onError: (error) => {
        if (error.kind === 'unauthorized' || error.kind === 'forbidden') {
          clearTokens()
          navigate('/auth/login', { replace: true })
        }
      },
    })
  }

  const logoutErrorMessage = getLogoutErrorMessage(
    logoutMutation.error ?? null,
    t,
  )

  return (
    <header className="sticky top-0 z-20 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
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
            className="hidden items-center gap-1 md:flex"
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
          <div className="hidden items-center gap-2 md:flex">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  aria-label={t('nav.profileLink')}
                  title={profileName}
                  className="inline-flex items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <UserAvatar alt={profileAvatarAlt} size="sm" />
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                >
                  {logoutMutation.isPending
                    ? t('nav.loggingOut')
                    : t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth/register"
                  className="inline-flex items-center justify-center rounded-full border border-brand/30 px-4 py-2 text-sm font-semibold text-brand transition hover:border-brand hover:text-brand-dark"
                >
                  {t('nav.register')}
                </Link>
                <Link
                  to="/auth/login"
                  className="inline-flex items-center justify-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  {t('nav.login')}
                </Link>
              </>
            )}
          </div>
          <button
            type="button"
            aria-label={t('layouts.app.nav.toggle')}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 p-2 text-slate-700 transition hover:border-slate-300 hover:text-slate-900 md:hidden"
          >
            <span className="sr-only">{t('layouts.app.nav.toggle')}</span>
            <span className="flex flex-col gap-1">
              <span className="block h-0.5 w-5 rounded bg-current" />
              <span className="block h-0.5 w-5 rounded bg-current" />
              <span className="block h-0.5 w-5 rounded bg-current" />
            </span>
          </button>
        </div>
      </div>
      {logoutErrorMessage ? (
        <div
          className="border-t border-rose-100 bg-rose-50 px-4 py-2 text-xs text-rose-700 sm:px-6 lg:px-12"
          role="alert"
        >
          {logoutErrorMessage}
        </div>
      ) : null}
      <div
        id="mobile-nav"
        aria-hidden={!isMenuOpen}
        className={`border-t border-slate-200 bg-white transition-[max-height,opacity] duration-200 ease-out md:hidden ${
          isMenuOpen
            ? 'max-h-[420px] opacity-100'
            : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-3 px-4 py-4">
          <NavLink to="/shkoli" className={mobileNavLinkClassName}>
            {t('nav.shkoli')}
          </NavLink>
          <NavLink to="/lyceums" className={mobileNavLinkClassName}>
            {t('nav.lyceums')}
          </NavLink>
          <NavLink to="/map" className={mobileNavLinkClassName}>
            {t('nav.map')}
          </NavLink>
          <NavLink to="/about" className={mobileNavLinkClassName}>
            {t('nav.about')}
          </NavLink>
          <div className="flex flex-col gap-2 pt-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  aria-label={t('nav.profileLink')}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  <UserAvatar alt={profileAvatarAlt} size="sm" />
                  <span>{t('nav.profile')}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                >
                  {logoutMutation.isPending
                    ? t('nav.loggingOut')
                    : t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth/register"
                  className="inline-flex items-center justify-center rounded-full border border-brand/30 px-4 py-2 text-sm font-semibold text-brand transition hover:border-brand hover:text-brand-dark"
                >
                  {t('nav.register')}
                </Link>
                <Link
                  to="/auth/login"
                  className="inline-flex items-center justify-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  {t('nav.login')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopNav
