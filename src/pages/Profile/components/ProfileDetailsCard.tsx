import { useTranslation } from 'react-i18next'

type ProfileDetailsCardProps = {
  fullName: string
  username: string
  email: string
  administratedLyceumName: string
  showAdministratedLyceum: boolean
}

const ProfileDetailsCard = ({
  fullName,
  username,
  email,
  administratedLyceumName,
  showAdministratedLyceum,
}: ProfileDetailsCardProps) => {
  const { t } = useTranslation()

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">
        {t('pages.profile.details.title')}
      </h2>
      <dl className="mt-4 space-y-3 text-sm sm:space-y-0 sm:grid sm:grid-cols-[minmax(0,180px)_minmax(0,1fr)] sm:gap-x-6 sm:gap-y-3">
        <div className="sm:contents">
          <dt className="text-slate-500">
            {t('pages.profile.details.fullName')}
          </dt>
          <dd className="font-medium text-slate-900">{fullName}</dd>
        </div>
        <div className="sm:contents">
          <dt className="text-slate-500">
            {t('pages.profile.details.username')}
          </dt>
          <dd className="font-medium text-slate-900">{username}</dd>
        </div>
        <div className="sm:contents">
          <dt className="text-slate-500">
            {t('pages.profile.details.email')}
          </dt>
          <dd className="font-medium text-slate-900">{email}</dd>
        </div>
        {showAdministratedLyceum ? (
          <div className="sm:contents">
            <dt className="text-slate-500">
              {t('pages.profile.details.administratedLyceum')}
            </dt>
            <dd className="font-medium text-slate-900">
              {administratedLyceumName}
            </dd>
          </div>
        ) : null}
      </dl>
    </div>
  )
}

export default ProfileDetailsCard
