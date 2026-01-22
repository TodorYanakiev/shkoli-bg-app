import type { TFunction } from 'i18next'
import { Link, NavLink, type NavLinkRenderProps } from 'react-router-dom'

type TopNavMobileCourseActionsProps = {
  hasCourseActions: boolean
  isCourseActionsOpen: boolean
  onToggle: () => void
  currentCourseId: number | null
  getNavLinkClassName: (props: NavLinkRenderProps) => string
  t: TFunction
}

export const TopNavMobileCourseActions = ({
  hasCourseActions,
  isCourseActionsOpen,
  onToggle,
  currentCourseId,
  getNavLinkClassName,
  t,
}: TopNavMobileCourseActionsProps) => {
  const editCourseLink = currentCourseId
    ? `/shkoli/${currentCourseId}/edit`
    : '/shkoli'

  return (
    <>
      <div className="flex items-center gap-2">
        <NavLink
          to="/shkoli"
          className={(props) => `${getNavLinkClassName(props)} flex-1`}
        >
          {t('nav.shkoli')}
        </NavLink>
        {hasCourseActions ? (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isCourseActionsOpen}
            aria-controls="mobile-course-actions"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:border-brand/40 hover:text-brand"
          >
            <svg
              viewBox="0 0 20 20"
              aria-hidden="true"
              className={`h-4 w-4 transition ${
                isCourseActionsOpen ? 'rotate-180' : ''
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
      {hasCourseActions ? (
        <div
          id="mobile-course-actions"
          aria-hidden={!isCourseActionsOpen}
          className={`ml-4 flex flex-col gap-2 overflow-hidden transition-[max-height,opacity] duration-200 ease-out ${
            isCourseActionsOpen
              ? 'max-h-32 opacity-100'
              : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <Link
            to={editCourseLink}
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-brand/40 hover:text-brand"
          >
            {t('pages.shkoli.detail.sideNav.editCourse')}
          </Link>
        </div>
      ) : null}
    </>
  )
}
