import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

const AdminPage = () => {
  const { t } = useTranslation()

  return (
    <section className="space-y-3">
      <Helmet>
        <title>{`${t('pages.admin.title')} | ${t('app.title')}`}</title>
      </Helmet>
      <h1 className="text-2xl font-semibold text-slate-900">
        {t('pages.admin.title')}
      </h1>
      <p className="text-sm text-slate-600">{t('pages.admin.subtitle')}</p>
    </section>
  )
}

export default AdminPage
