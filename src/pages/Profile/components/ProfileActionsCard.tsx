import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

type ProfileActionsCardProps = {
  hasLyceumAdministration: boolean
  deleteErrorKey: string | null
  isDeletingAccount: boolean
  onDeleteAccount: () => void
}

const ProfileActionsCard = ({
  hasLyceumAdministration,
  deleteErrorKey,
  isDeletingAccount,
  onDeleteAccount,
}: ProfileActionsCardProps) => {
  const { t } = useTranslation()

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">
        {t('pages.profile.actions.title')}
      </h2>
      <div className="mt-3 flex flex-wrap gap-3">
        <Link
          to="/profile/edit"
          className="inline-flex items-center justify-center rounded-full border border-brand/30 px-4 py-2 text-sm font-semibold text-brand transition hover:border-brand hover:text-brand-dark"
        >
          {t('pages.profile.actions.editProfile')}
        </Link>
        <Link
          to="/profile/change-password"
          className="inline-flex items-center justify-center rounded-full border border-brand/30 px-4 py-2 text-sm font-semibold text-brand transition hover:border-brand hover:text-brand-dark"
        >
          {t('pages.profile.actions.changePassword')}
        </Link>
        {hasLyceumAdministration ? null : (
          <Link
            to="/profile/lyceum-rights"
            className="inline-flex items-center justify-center rounded-full border border-brand/30 px-4 py-2 text-sm font-semibold text-brand transition hover:border-brand hover:text-brand-dark"
          >
            {t('pages.profile.actions.requestLyceumRights')}
          </Link>
        )}
        <button
          type="button"
          onClick={onDeleteAccount}
          disabled={isDeletingAccount}
          className="inline-flex items-center justify-center rounded-full border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-400 hover:text-rose-800 disabled:cursor-not-allowed disabled:border-rose-200 disabled:text-rose-300"
        >
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

export default ProfileActionsCard
