import type { TFunction } from 'i18next'
import { Link } from 'react-router-dom'

import LanguageSwitcher from '../../../components/ui/LanguageSwitcher'
import { TopNavProfileMenu } from './TopNavProfileMenu'

type TopNavDesktopActionsProps = {
  isAuthenticated: boolean
  profileName: string
  profileAvatarUrl: string | null
  profileAvatarAlt: string
  hasAdministratedLyceum: boolean
  administratedLyceumId: number | null
  administratedLyceumLabel: string
  isProfileMenuOpen: boolean
  onToggleProfileMenu: () => void
  onCloseProfileMenu: () => void
  onLogout: () => void
  isLoggingOut: boolean
  t: TFunction
}

export const TopNavDesktopActions = ({
  isAuthenticated,
  profileName,
  profileAvatarUrl,
  profileAvatarAlt,
  hasAdministratedLyceum,
  administratedLyceumId,
  administratedLyceumLabel,
  isProfileMenuOpen,
  onToggleProfileMenu,
  onCloseProfileMenu,
  onLogout,
  isLoggingOut,
  t,
}: TopNavDesktopActionsProps) => (
  <div className="hidden items-center gap-2 md:flex">
    {isAuthenticated ? (
      <>
        <TopNavProfileMenu
          profileName={profileName}
          profileAvatarUrl={profileAvatarUrl}
          profileAvatarAlt={profileAvatarAlt}
          hasAdministratedLyceum={hasAdministratedLyceum}
          administratedLyceumId={administratedLyceumId}
          administratedLyceumLabel={administratedLyceumLabel}
          isOpen={isProfileMenuOpen}
          onToggle={onToggleProfileMenu}
          onClose={onCloseProfileMenu}
          t={t}
        />
        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
        >
          {isLoggingOut ? t('nav.loggingOut') : t('nav.logout')}
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
)
