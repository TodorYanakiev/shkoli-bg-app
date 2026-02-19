import { useTranslation } from 'react-i18next'

import SeoHead from '../../components/ui/SeoHead'
import { useCurrentLocale } from '../../hooks/useCurrentLocale'
import RegisterForm from './components/RegisterForm'

const RegisterPage = () => {
  const { t } = useTranslation()
  const locale = useCurrentLocale()

  return (
    <section className="space-y-3">
      <SeoHead
        title={`${t('pages.register.title')} | ${t('app.title')}`}
        description={t('pages.register.subtitle')}
        canonicalPath="/auth/register"
        locale={locale}
        forceNoindex
      />
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
