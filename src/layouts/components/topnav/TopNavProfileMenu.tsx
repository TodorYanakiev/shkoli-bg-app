import { useEffect, useRef } from 'react'
import type { TFunction } from 'i18next'
import { Link } from 'react-router-dom'

import { useLocalizedPath } from '../../../hooks/useLocalizedPath'
import UserAvatar from '../../../components/ui/UserAvatar'

type TopNavProfileMenuProps = {
  profileName: string
  profileAvatarUrl: string | null
  profileAvatarAlt: string
  hasAdministratedLyceum: boolean
  administratedLyceumId: number | null
  administratedLyceumLabel: string
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  t: TFunction
}

export const TopNavProfileMenu = ({
  profileName,
  profileAvatarUrl,
  profileAvatarAlt,
  hasAdministratedLyceum,
  administratedLyceumId,
  administratedLyceumLabel,
  isOpen,
  onToggle,
  onClose,
  t,
}: TopNavProfileMenuProps) => {
  const profileMenuRef = useRef<HTMLDivElement | null>(null)
  const localizedPath = useLocalizedPath()

  useEffect(() => {
    if (typeof document === 'undefined' || !isOpen) return undefined

    const handleClickOutside = (event: MouseEvent) => {
      if (!profileMenuRef.current) return
      if (!profileMenuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  return (
    <div ref={profileMenuRef} className="relative">
      <button
        type="button"
        aria-label={t('nav.profileMenuLabel')}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="profile-menu"
        title={profileName}
        onClick={onToggle}
        className="inline-flex items-center gap-1 rounded-full border border-transparent bg-white pr-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <UserAvatar alt={profileAvatarAlt} src={profileAvatarUrl} size="sm" />
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={`h-4 w-4 text-slate-600 transition ${
            isOpen ? 'rotate-180' : ''
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
        aria-hidden={!isOpen}
        className={`absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-slate-200 bg-white p-2 shadow-lg transition ${
          isOpen
            ? 'scale-100 opacity-100'
            : 'pointer-events-none scale-95 opacity-0'
        }`}
      >
        {hasAdministratedLyceum && administratedLyceumId != null ? (
          <Link
            to={localizedPath(`/lyceums/${administratedLyceumId}`)}
            role="menuitem"
            onClick={onClose}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
          >
            {administratedLyceumLabel}
          </Link>
        ) : null}
        <Link
          to={localizedPath('/profile')}
          role="menuitem"
          onClick={onClose}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
        >
          {t('nav.profile')}
        </Link>
      </div>
    </div>
  )
}
