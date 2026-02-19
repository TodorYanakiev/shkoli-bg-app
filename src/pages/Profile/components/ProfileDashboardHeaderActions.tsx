import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

type ProfileDashboardHeaderActionsProps = {
  hasLyceumAdministration: boolean
  deleteErrorKey: string | null
  isDeletingAccount: boolean
  onDeleteAccount: () => void
}

const ProfileDashboardHeaderActions = ({
  hasLyceumAdministration,
  deleteErrorKey,
  isDeletingAccount,
  onDeleteAccount,
}: ProfileDashboardHeaderActionsProps) => {
  const { t } = useTranslation()

  return (
    <div className="mt-6 border-t border-slate-200/80 pt-5">
      <div className="flex flex-wrap items-stretch gap-3">
        <Link
          to="/profile/edit"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-brand/30 px-4 py-2 text-sm font-semibold text-brand transition hover:border-brand hover:text-brand-dark"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 20h4l10-10a2 2 0 10-4-4L4 16v4z" />
            <path d="M13 7l4 4" />
          </svg>
          {t('pages.profile.actions.editProfile')}
        </Link>
        <Link
          to="/profile/change-password"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-brand/30 px-4 py-2 text-sm font-semibold text-brand transition hover:border-brand hover:text-brand-dark"
        >
          {t('pages.profile.actions.changePassword')}
        </Link>
        {hasLyceumAdministration ? null : (
          <Link
            to="/profile/lyceum-rights"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-brand/30 px-4 py-2 text-sm font-semibold text-brand transition hover:border-brand hover:text-brand-dark"
          >
            {t('pages.profile.actions.requestLyceumRights')}
          </Link>
        )}
        <button
          type="button"
          onClick={onDeleteAccount}
          disabled={isDeletingAccount}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-400 hover:text-rose-800 disabled:cursor-not-allowed disabled:border-rose-200 disabled:text-rose-300"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M6 6l1 14h10l1-14" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
          </svg>
          {isDeletingAccount
            ? t('pages.profile.edit.delete.modal.deleting')
            : t('pages.profile.edit.delete.action')}
        </button>
      </div>
      {deleteErrorKey ? (
        <p className="mt-3 text-sm text-rose-700" role="alert">
          {t(deleteErrorKey)}
        </p>
      ) : null}
    </div>
  )
}

export default ProfileDashboardHeaderActions
