import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

type ProfileActionsCardProps = {
  hasLyceumAdministration: boolean
}

const ProfileActionsCard = ({
  hasLyceumAdministration,
}: ProfileActionsCardProps) => {
  const { t } = useTranslation()

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">
        {t('pages.profile.actions.title')}
      </h2>
      <div className="mt-3 flex flex-wrap gap-3">
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
      </div>
    </div>
  )
}

export default ProfileActionsCard
