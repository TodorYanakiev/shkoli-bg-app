import type { TFunction } from 'i18next'
import { Link, NavLink, type NavLinkRenderProps } from 'react-router-dom'

import { useLocalizedPath } from '../../../hooks/useLocalizedPath'

type TopNavMobileLyceumActionsProps = {
  hasLyceumActions: boolean
  isLyceumActionsOpen: boolean
  onToggle: () => void
  currentLyceumId: number | null
  canEditLyceum: boolean
  canAddCourse: boolean
  canInviteLecturer: boolean
  getNavLinkClassName: (props: NavLinkRenderProps) => string
  t: TFunction
}

export const TopNavMobileLyceumActions = ({
  hasLyceumActions,
  isLyceumActionsOpen,
  onToggle,
  currentLyceumId,
  canEditLyceum,
  canAddCourse,
  canInviteLecturer,
  getNavLinkClassName,
  t,
}: TopNavMobileLyceumActionsProps) => {
  const localizedPath = useLocalizedPath()
  const editLyceumLink = currentLyceumId
    ? localizedPath(`/lyceums/${currentLyceumId}/edit`)
    : localizedPath('/lyceums')
  const addCourseLink = currentLyceumId
    ? localizedPath(`/shkoli/new?lyceumId=${currentLyceumId}`)
    : localizedPath('/shkoli/new')
  const inviteLecturerLink = currentLyceumId
    ? localizedPath(`/lyceums/${currentLyceumId}?inviteLecturer=1`)
    : localizedPath('/lyceums')

  return (
    <>
      <div className="flex items-center gap-2">
        <NavLink
          to={localizedPath('/lyceums')}
          className={(props) => `${getNavLinkClassName(props)} flex-1`}
        >
          {t('nav.lyceums')}
        </NavLink>
        {hasLyceumActions ? (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isLyceumActionsOpen}
            aria-controls="mobile-lyceum-actions"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:border-brand/40 hover:text-brand"
          >
            <svg
              viewBox="0 0 20 20"
              aria-hidden="true"
              className={`h-4 w-4 transition ${
                isLyceumActionsOpen ? 'rotate-180' : ''
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
        ) : null}
      </div>
      {hasLyceumActions ? (
        <div
          id="mobile-lyceum-actions"
          aria-hidden={!isLyceumActionsOpen}
          className={`ml-4 flex flex-col gap-2 overflow-hidden transition-[max-height,opacity] duration-200 ease-out ${
            isLyceumActionsOpen
              ? 'max-h-48 opacity-100'
              : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          {canEditLyceum ? (
            <Link
              to={editLyceumLink}
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-brand/40 hover:text-brand"
            >
              {t('pages.lyceums.detail.editCta')}
            </Link>
          ) : null}
          {canAddCourse ? (
            <Link
              to={addCourseLink}
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-brand/40 hover:text-brand"
            >
              {t('pages.lyceums.detail.sideNav.addCourse')}
            </Link>
          ) : null}
          {canInviteLecturer ? (
            <Link
              to={inviteLecturerLink}
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-brand/40 hover:text-brand"
            >
              {t('pages.lyceums.detail.sideNav.addLecturer')}
            </Link>
          ) : null}
        </div>
      ) : null}
    </>
  )
}
