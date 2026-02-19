import { useTranslation } from 'react-i18next'

import SeoHead from '../../components/ui/SeoHead'
import { useCurrentLocale } from '../../hooks/useCurrentLocale'
import LoginForm from './components/LoginForm'

const LoginPage = () => {
  const { t } = useTranslation()
  const locale = useCurrentLocale()

  return (
    <section className="space-y-3">
      <SeoHead
        title={`${t('pages.login.title')} | ${t('app.title')}`}
        description={t('pages.login.subtitle')}
        canonicalPath="/auth/login"
        locale={locale}
        forceNoindex
      />
      <h1 className="text-2xl font-semibold text-slate-900">
        {t('pages.login.title')}
      </h1>
      <p className="text-sm text-slate-600">
        {t('pages.login.subtitle')}
      </p>
      <LoginForm />
    </section>
  )
}

export default LoginPage
