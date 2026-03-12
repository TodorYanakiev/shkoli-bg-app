import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useLocalizedPath } from '../../../hooks/useLocalizedPath'

type OAuth2CallbackErrorStateProps = {
  messageKey: string
}

const OAuth2CallbackErrorState = ({
  messageKey,
}: OAuth2CallbackErrorStateProps) => {
  const { t } = useTranslation()
  const localizedPath = useLocalizedPath()

  return (
    <div className="mt-6 w-full max-w-xl space-y-4 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-800 shadow-sm">
      <p className="text-sm font-semibold">{t(messageKey)}</p>
      <div className="flex flex-wrap gap-3">
        <Link
          to={localizedPath('/auth/login')}
          className="inline-flex items-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          {t('pages.oauth2.actions.backToLogin')}
        </Link>
        <Link
          to={localizedPath('/auth/register')}
          className="inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
        >
          {t('pages.oauth2.actions.goToRegister')}
        </Link>
      </div>
    </div>
  )
}

export default OAuth2CallbackErrorState
