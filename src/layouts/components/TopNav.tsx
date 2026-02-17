import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import logo from '../../assets/logo.png'
import LanguageSwitcher from '../../components/ui/LanguageSwitcher'
import { TopNavBrand } from './topnav/TopNavBrand'
import { TopNavDesktopActions } from './topnav/TopNavDesktopActions'
import { TopNavDesktopNav } from './topnav/TopNavDesktopNav'
import { TopNavMobileMenu } from './topnav/TopNavMobileMenu'
import { useTopNavData } from './topnav/hooks/useTopNavData'
import { useTopNavLogout } from './topnav/hooks/useTopNavLogout'

const TopNav = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isCourseActionsOpen, setIsCourseActionsOpen] = useState(false)
  const [isLyceumActionsOpen, setIsLyceumActionsOpen] = useState(false)
  const topBarRef = useRef<HTMLDivElement | null>(null)

  const {
    isAuthenticated,
    profileName,
    profileAvatarUrl,
    profileAvatarAlt,
    isGlobalAdmin,
    administratedLyceumId,
    hasAdministratedLyceum,
    administratedLyceumLabel,
    currentCourseId,
    currentLyceumId,
    hasCourseActions,
    canEditLyceum,
    canAddCourse,
    canInviteLecturer,
    hasLyceumActions,
  } = useTopNavData({ pathname: location.pathname, t })

  const { onLogout, logoutErrorMessage, isLoggingOut } = useTopNavLogout({
    t,
  })

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const mobileNav = document.getElementById('mobile-nav')
      const activeElement = document.activeElement as HTMLElement | null
      if (mobileNav && activeElement && mobileNav.contains(activeElement)) {
        activeElement.blur()
      }
    }

    setIsMenuOpen(false)
    setIsProfileMenuOpen(false)
    setIsCourseActionsOpen(false)
    setIsLyceumActionsOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (isMenuOpen || typeof document === 'undefined') {
      return
    }

    const mobileNav = document.getElementById('mobile-nav')
    const activeElement = document.activeElement as HTMLElement | null
    if (mobileNav && activeElement && mobileNav.contains(activeElement)) {
      activeElement.blur()
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (!hasCourseActions) {
      setIsCourseActionsOpen(false)
      return
    }
    if (isMenuOpen) {
      setIsCourseActionsOpen(true)
    }
  }, [hasCourseActions, isMenuOpen])

  useEffect(() => {
    if (!hasLyceumActions) {
      setIsLyceumActionsOpen(false)
      return
    }
    if (isMenuOpen) {
      setIsLyceumActionsOpen(true)
    }
  }, [hasLyceumActions, isMenuOpen])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const topBar = topBarRef.current
    if (!topBar) return

    const root = document.documentElement
    const updateHeight = () => {
      root.style.setProperty('--topnav-height', `${topBar.offsetHeight}px`)
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
    observer.observe(topBar)
    return () => {
      observer.disconnect()
      root.style.removeProperty('--topnav-height')
    }
  }, [isMenuOpen, logoutErrorMessage])

  return (
    <header className="fixed left-0 right-0 top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div
        ref={topBarRef}
        className="flex w-full items-center justify-between px-4 py-4 sm:px-6 lg:px-12"
      >
        <TopNavBrand
          logoSrc={logo}
          logoAlt={t('app.logoAlt')}
          title={t('app.title')}
        />
        <div className="ml-auto flex items-center gap-3">
          <TopNavDesktopNav t={t} isGlobalAdmin={isGlobalAdmin} />
          <TopNavDesktopActions
            isAuthenticated={isAuthenticated}
            profileName={profileName}
            profileAvatarUrl={profileAvatarUrl}
            profileAvatarAlt={profileAvatarAlt}
            hasAdministratedLyceum={hasAdministratedLyceum}
            administratedLyceumId={administratedLyceumId}
            administratedLyceumLabel={administratedLyceumLabel}
            isProfileMenuOpen={isProfileMenuOpen}
            onToggleProfileMenu={() =>
              setIsProfileMenuOpen((prev) => !prev)
            }
            onCloseProfileMenu={() => setIsProfileMenuOpen(false)}
            onLogout={onLogout}
            isLoggingOut={isLoggingOut}
            t={t}
          />
          <div className="md:hidden">
            <LanguageSwitcher />
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
      <TopNavMobileMenu
        isOpen={isMenuOpen}
        isAuthenticated={isAuthenticated}
        isGlobalAdmin={isGlobalAdmin}
        hasCourseActions={hasCourseActions}
        isCourseActionsOpen={isCourseActionsOpen}
        onToggleCourseActions={() =>
          setIsCourseActionsOpen((prev) => !prev)
        }
        currentCourseId={currentCourseId}
        hasLyceumActions={hasLyceumActions}
        isLyceumActionsOpen={isLyceumActionsOpen}
        onToggleLyceumActions={() =>
          setIsLyceumActionsOpen((prev) => !prev)
        }
        currentLyceumId={currentLyceumId}
        canEditLyceum={canEditLyceum}
        canAddCourse={canAddCourse}
        canInviteLecturer={canInviteLecturer}
        profileAvatarUrl={profileAvatarUrl}
        profileAvatarAlt={profileAvatarAlt}
        hasAdministratedLyceum={hasAdministratedLyceum}
        administratedLyceumId={administratedLyceumId}
        administratedLyceumLabel={administratedLyceumLabel}
        isLoggingOut={isLoggingOut}
        onLogout={onLogout}
        t={t}
      />
    </header>
  )
}

export default TopNav
