import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

const AdminUsersPage = () => {
  const { t } = useTranslation()

  return (
    <section className="space-y-3">
      <Helmet>
        <title>{`${t('pages.admin.users.title')} | ${t(
          'pages.admin.title',
        )} | ${t('app.title')}`}</title>
      </Helmet>
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-slate-900">
          {t('pages.admin.users.title')}
        </h2>
        <p className="text-sm text-slate-600">
          {t('pages.admin.users.subtitle')}
        </p>
      </div>
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-600">
        {t('pages.admin.users.placeholder')}
      </div>
    </section>
  )
}

export default AdminUsersPage
