import { useTranslation } from 'react-i18next'

const LoginPage = () => {
  const { t } = useTranslation()

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold text-slate-900">
        {t('pages.login.title')}
      </h1>
      <p className="text-sm text-slate-600">
        {t('pages.login.subtitle')}
      </p>
    </section>
  )
}

export default LoginPage
