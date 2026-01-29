import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

import { AdminLyceumsGrid } from './components/AdminLyceumsGrid'
import { AdminLyceumsHeader } from './components/AdminLyceumsHeader'
import { useAdminLyceumsData } from './hooks/useAdminLyceumsData'

const AdminLyceumsPage = () => {
  const { t } = useTranslation()
  const { lyceums, isLoading, error, pagination } = useAdminLyceumsData()

  return (
    <section className="space-y-6">
      <Helmet>
        <title>{`${t('pages.admin.lyceums.title')} | ${t(
          'pages.admin.title',
        )} | ${t('app.title')}`}</title>
      </Helmet>
      <AdminLyceumsHeader
        totalLyceums={pagination.totalItems}
        isLoading={isLoading}
      />
      <AdminLyceumsGrid
        lyceums={lyceums}
        isLoading={isLoading}
        error={error}
        pagination={pagination}
      />
    </section>
  )
}

export default AdminLyceumsPage
