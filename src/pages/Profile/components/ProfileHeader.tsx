import { useTranslation } from 'react-i18next'

const ProfileHeader = () => {
  const { t } = useTranslation()

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">
        {t('pages.profile.title')}
      </h1>
      <p className="text-sm text-slate-600">{t('pages.profile.subtitle')}</p>
    </div>
  )
}

export default ProfileHeader
