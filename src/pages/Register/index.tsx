import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

import RegisterForm from './components/RegisterForm'

const RegisterPage = () => {
  const { t } = useTranslation()

  return (
    <section className="space-y-3">
      <Helmet>
        <title>{`${t('pages.register.title')} | ${t('app.title')}`}</title>
      </Helmet>
      <h1 className="text-2xl font-semibold text-slate-900">
        {t('pages.register.title')}
      </h1>
      <p className="text-sm text-slate-600">
        {t('pages.register.subtitle')}
      </p>
      <RegisterForm />
    </section>
  )
}

export default RegisterPage
