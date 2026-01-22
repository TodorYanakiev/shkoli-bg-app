import type { TFunction } from 'i18next'
import { Link } from 'react-router-dom'

import UserAvatar from '../../../components/ui/UserAvatar'

type TopNavMobileAuthProps = {
  isAuthenticated: boolean
  profileAvatarAlt: string
  hasAdministratedLyceum: boolean
  administratedLyceumId: number | null
  administratedLyceumLabel: string
  isLoggingOut: boolean
  onLogout: () => void
  t: TFunction
}

export const TopNavMobileAuth = ({
  isAuthenticated,
  profileAvatarAlt,
  hasAdministratedLyceum,
  administratedLyceumId,
  administratedLyceumLabel,
  isLoggingOut,
  onLogout,
  t,
}: TopNavMobileAuthProps) => (
  <div className="flex flex-col gap-2 pt-2">
    {isAuthenticated ? (
      <>
        <div className="flex items-center gap-2">
          <Link
            to="/profile"
            aria-label={t('nav.profileLink')}
            className="flex flex-1 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            <UserAvatar alt={profileAvatarAlt} size="sm" />
            <span>{t('nav.profile')}</span>
          </Link>
          <button
            type="button"
            onClick={onLogout}
            disabled={isLoggingOut}
            aria-label={isLoggingOut ? t('nav.loggingOut') : t('nav.logout')}
            title={isLoggingOut ? t('nav.loggingOut') : t('nav.logout')}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
              <path
                d="M8 5H5.5A1.5 1.5 0 0 0 4 6.5v7A1.5 1.5 0 0 0 5.5 15H8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.5 7.5L15 10l-3.5 2.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 10h7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        {hasAdministratedLyceum && administratedLyceumId != null ? (
          <Link
            to={`/lyceums/${administratedLyceumId}`}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            <span>{administratedLyceumLabel}</span>
          </Link>
        ) : null}
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
)
