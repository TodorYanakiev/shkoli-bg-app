import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const LyceumRightsHeader = () => {
  const { t } = useTranslation()

  return (
    <>
      <Link to="/profile" className="text-sm font-semibold text-brand">
        {t('pages.profile.lyceumRights.backLink')}
      </Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          {t('pages.profile.lyceumRights.title')}
        </h1>
        <p className="text-sm text-slate-600">
          {t('pages.profile.lyceumRights.subtitle')}
        </p>
      </div>
    </>
  )
}

export default LyceumRightsHeader
