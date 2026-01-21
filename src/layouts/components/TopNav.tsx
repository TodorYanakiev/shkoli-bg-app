import { useEffect, useRef, useState } from 'react'
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
import LanguageSwitcher from '../../components/ui/LanguageSwitcher'
import UserAvatar from '../../components/ui/UserAvatar'
import { useAuthStatus } from '../../hooks/useAuthStatus'
import { useLogoutMutation } from '../../hooks/useLogoutMutation'
import { useAdministratedLyceum } from '../../pages/Profile/hooks/useAdministratedLyceum'
import { useUserProfile } from '../../pages/Profile/hooks/useUserProfile'
import { useLyceumLecturers } from '../../pages/Lyceums/hooks/useLyceumLecturers'
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
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement | null>(null)
  const profileMenuRef = useRef<HTMLDivElement | null>(null)
  const lyceumMatch = location.pathname.match(/^\/lyceums\/(\d+)(?:\/.*)?$/)
  const currentLyceumId = lyceumMatch ? Number(lyceumMatch[1]) : null
  const canEditLyceum =
    Number.isFinite(currentLyceumId) &&
    (currentUser?.role === 'ADMIN' ||
      currentUser?.administratedLyceumId === currentLyceumId)
  const { data: lyceumLecturers } = useLyceumLecturers(
    currentLyceumId ?? undefined,
    {
      enabled: isAuthenticated && Number.isFinite(currentLyceumId),
    },
  )
  const isLyceumLecturer = Boolean(
    currentUser?.id != null &&
      lyceumLecturers?.some((lecturer) => lecturer.id === currentUser.id),
  )
  const canAddCourse = Boolean(
    Number.isFinite(currentLyceumId) && (canEditLyceum || isLyceumLecturer),
  )
  const canInviteLecturer = canEditLyceum

  const administratedLyceumId =
    typeof currentUser?.administratedLyceumId === 'number' &&
    Number.isFinite(currentUser.administratedLyceumId)
      ? currentUser.administratedLyceumId
      : null
  const hasAdministratedLyceum = administratedLyceumId !== null
  const {
    data: administratedLyceum,
    isLoading: isAdministratedLyceumLoading,
    error: administratedLyceumError,
  } = useAdministratedLyceum(administratedLyceumId ?? undefined, {
    enabled: isAuthenticated && hasAdministratedLyceum,
  })
  const profileName =
    getUserDisplayName(currentUser) || t('pages.profile.unknownUser')
  const profileAvatarAlt = t('nav.profileAvatarAlt', { name: profileName })
  const administratedLyceumLabel = administratedLyceum?.name
    ? administratedLyceum.name
    : isAdministratedLyceumLoading
      ? t('pages.profile.details.administratedLyceumLoading')
      : administratedLyceumError
        ? t('pages.profile.details.administratedLyceumUnavailable')
        : t('pages.profile.details.administratedLyceumUnknown')

  useEffect(() => {
    setIsMenuOpen(false)
    setIsProfileMenuOpen(false)
  }, [location.pathname, location.search])

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

  useEffect(() => {
    if (typeof document === 'undefined' || !isProfileMenuOpen) return undefined

    const handleClickOutside = (event: MouseEvent) => {
      if (!profileMenuRef.current) return
      if (!profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isProfileMenuOpen])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const header = headerRef.current
    if (!header) return

    const root = document.documentElement
    const updateHeight = () => {
      root.style.setProperty('--topnav-height', `${header.offsetHeight}px`)
    }

    updateHeight()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateHeight)
      return () => {
        window.removeEventListener('resize', updateHeight)
        root.style.removeProperty('--topnav-height')
      }
    }

    const observer = new ResizeObserver(updateHeight)
    observer.observe(header)
    return () => {
      observer.disconnect()
      root.style.removeProperty('--topnav-height')
    }
  }, [isMenuOpen, logoutErrorMessage])

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-20 w-full border-b border-slate-200 bg-white/95 backdrop-blur"
    >
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
                <div ref={profileMenuRef} className="relative">
                  <button
                    type="button"
                    aria-label={t('nav.profileMenuLabel')}
                    aria-haspopup="menu"
                    aria-expanded={isProfileMenuOpen}
                    aria-controls="profile-menu"
                    title={profileName}
                    onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                    className="inline-flex items-center gap-1 rounded-full border border-transparent bg-white pr-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    <UserAvatar alt={profileAvatarAlt} size="sm" />
                    <svg
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      className={`h-4 w-4 text-slate-600 transition ${
                        isProfileMenuOpen ? 'rotate-180' : ''
                      }`}
                    >
                      <path
                        d="M5.5 7.5l4.5 4.5 4.5-4.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <div
                    id="profile-menu"
                    role="menu"
                    aria-hidden={!isProfileMenuOpen}
                    className={`absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-slate-200 bg-white p-2 shadow-lg transition ${
                      isProfileMenuOpen
                        ? 'scale-100 opacity-100'
                        : 'pointer-events-none scale-95 opacity-0'
                    }`}
                  >
                    {hasAdministratedLyceum ? (
                      <Link
                        to={`/lyceums/${administratedLyceumId}`}
                        role="menuitem"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                      >
                        {administratedLyceumLabel}
                      </Link>
                    ) : null}
                    <Link
                      to="/profile"
                      role="menuitem"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      {t('nav.profile')}
                    </Link>
                  </div>
                </div>
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
            <LanguageSwitcher className="ml-2" />
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
          {canEditLyceum || canAddCourse ? (
            <div className="ml-4 flex flex-col gap-2">
              {canEditLyceum ? (
                <Link
                  to={`/lyceums/${currentLyceumId}/edit`}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-brand/40 hover:text-brand"
                >
                  {t('pages.lyceums.detail.editCta')}
                </Link>
              ) : null}
              {canAddCourse ? (
                <Link
                  to={`/shkoli/new?lyceumId=${currentLyceumId}`}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-brand/40 hover:text-brand"
                >
                  {t('pages.lyceums.detail.sideNav.addCourse')}
                </Link>
              ) : null}
              {canInviteLecturer ? (
                <Link
                  to={`/lyceums/${currentLyceumId}?inviteLecturer=1`}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-brand/40 hover:text-brand"
                >
                  {t('pages.lyceums.detail.sideNav.addLecturer')}
                </Link>
              ) : null}
            </div>
          ) : null}
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
                {hasAdministratedLyceum ? (
                  <Link
                    to={`/lyceums/${administratedLyceumId}`}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    <span>{administratedLyceumLabel}</span>
                  </Link>
                ) : null}
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
            <div className="border-t border-slate-200 pt-3">
              <LanguageSwitcher className="ml-auto" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopNav
