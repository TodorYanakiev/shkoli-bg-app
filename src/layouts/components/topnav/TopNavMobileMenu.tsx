import type { TFunction } from 'i18next'
import { NavLink, type NavLinkRenderProps } from 'react-router-dom'

import { TopNavMobileCourseActions } from './TopNavMobileCourseActions'
import { TopNavMobileLyceumActions } from './TopNavMobileLyceumActions'
import { TopNavMobileAuth } from './TopNavMobileAuth'

type TopNavMobileMenuProps = {
  isOpen: boolean
  isAuthenticated: boolean
  isGlobalAdmin: boolean
  hasCourseActions: boolean
  isCourseActionsOpen: boolean
  onToggleCourseActions: () => void
  currentCourseId: number | null
  hasLyceumActions: boolean
  isLyceumActionsOpen: boolean
  onToggleLyceumActions: () => void
  currentLyceumId: number | null
  canEditLyceum: boolean
  canAddCourse: boolean
  canInviteLecturer: boolean
  profileAvatarUrl: string | null
  profileAvatarAlt: string
  hasAdministratedLyceum: boolean
  administratedLyceumId: number | null
  administratedLyceumLabel: string
  isLoggingOut: boolean
  onLogout: () => void
  t: TFunction
}

const mobileNavLinkClassName = ({ isActive }: NavLinkRenderProps) =>
  [
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-brand/10 text-brand'
      : 'text-slate-700 hover:bg-slate-100',
  ].join(' ')

export const TopNavMobileMenu = ({
  isOpen,
  isAuthenticated,
  isGlobalAdmin,
  hasCourseActions,
  isCourseActionsOpen,
  onToggleCourseActions,
  currentCourseId,
  hasLyceumActions,
  isLyceumActionsOpen,
  onToggleLyceumActions,
  currentLyceumId,
  canEditLyceum,
  canAddCourse,
  canInviteLecturer,
  profileAvatarUrl,
  profileAvatarAlt,
  hasAdministratedLyceum,
  administratedLyceumId,
  administratedLyceumLabel,
  isLoggingOut,
  onLogout,
  t,
}: TopNavMobileMenuProps) => (
  <div
    id="mobile-nav"
    aria-hidden={!isOpen}
    className={`overflow-hidden border-t border-slate-200 bg-white transition-[max-height,opacity] duration-200 ease-out md:hidden ${
      isOpen
        ? 'max-h-[calc(100vh-var(--topnav-height))] opacity-100'
        : 'max-h-0 opacity-0 pointer-events-none'
    }`}
  >
    <div className="flex max-h-[calc(100vh-var(--topnav-height))] flex-col gap-3 overflow-y-auto px-4 py-4">
      <TopNavMobileCourseActions
        hasCourseActions={hasCourseActions}
        isCourseActionsOpen={isCourseActionsOpen}
        onToggle={onToggleCourseActions}
        currentCourseId={currentCourseId}
        getNavLinkClassName={mobileNavLinkClassName}
        t={t}
      />
      <TopNavMobileLyceumActions
        hasLyceumActions={hasLyceumActions}
        isLyceumActionsOpen={isLyceumActionsOpen}
        onToggle={onToggleLyceumActions}
        currentLyceumId={currentLyceumId}
        canEditLyceum={canEditLyceum}
        canAddCourse={canAddCourse}
        canInviteLecturer={canInviteLecturer}
        getNavLinkClassName={mobileNavLinkClassName}
        t={t}
      />
      <NavLink to="/map" className={mobileNavLinkClassName}>
        {t('nav.map')}
      </NavLink>
      <NavLink to="/about" className={mobileNavLinkClassName}>
        {t('nav.about')}
      </NavLink>
      {isGlobalAdmin ? (
        <NavLink to="/admin" className={mobileNavLinkClassName}>
          {t('nav.admin')}
        </NavLink>
      ) : null}
      <TopNavMobileAuth
        isAuthenticated={isAuthenticated}
        profileAvatarUrl={profileAvatarUrl}
        profileAvatarAlt={profileAvatarAlt}
        hasAdministratedLyceum={hasAdministratedLyceum}
        administratedLyceumId={administratedLyceumId}
        administratedLyceumLabel={administratedLyceumLabel}
        isLoggingOut={isLoggingOut}
        onLogout={onLogout}
        t={t}
      />
    </div>
  </div>
)
