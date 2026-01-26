import { useTranslation } from 'react-i18next'

import UserAvatar from '../../../components/ui/UserAvatar'

type ProfileSummaryCardProps = {
  displayName: string
  roleLabel: string
}

const ProfileSummaryCard = ({
  displayName,
  roleLabel,
}: ProfileSummaryCardProps) => {
  const { t } = useTranslation()

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">
        {t('pages.profile.summary.title')}
      </h2>
      <div className="mt-4 flex items-center gap-4">
        <UserAvatar
          alt={t('nav.profileAvatarAlt', { name: displayName })}
          size="lg"
        />
        <div>
          <p className="text-lg font-semibold text-slate-900">{displayName}</p>
          <span className="mt-2 inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
            {roleLabel}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProfileSummaryCard
