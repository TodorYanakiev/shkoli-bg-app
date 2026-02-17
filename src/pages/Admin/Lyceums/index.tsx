import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

import { AdminLyceumsFilters } from './components/AdminLyceumsFilters'
import { AdminLyceumsGrid } from './components/AdminLyceumsGrid'
import { AdminLyceumsHeader } from './components/AdminLyceumsHeader'
import { useAdminLyceumsData } from './hooks/useAdminLyceumsData'

const AdminLyceumsPage = () => {
  const { t } = useTranslation()
  const {
    lyceums,
    isLoading,
    error,
    pagination,
    verifiedCount,
    filters,
  } =
    useAdminLyceumsData()

  return (
    <section className="space-y-6">
      <Helmet>
        <title>{`${t('pages.admin.lyceums.title')} | ${t(
          'pages.admin.title',
        )} | ${t('app.title')}`}</title>
      </Helmet>
      <AdminLyceumsHeader
        verifiedCount={verifiedCount}
        isLoading={isLoading}
      />
      <AdminLyceumsFilters
        state={filters.state}
        townOptions={filters.townOptions}
        hasActiveFilters={filters.hasActiveFilters}
        isLoading={isLoading}
        onNameChange={filters.setNameFilter}
        onTownChange={filters.setTownFilter}
        onIncludeVerifiedChange={filters.setIncludeVerifiedFilter}
        onIncludeUnverifiedChange={filters.setIncludeUnverifiedFilter}
        onClear={filters.clearFilters}
      />
      <AdminLyceumsGrid
        lyceums={lyceums}
        isLoading={isLoading}
        error={error}
        pagination={pagination}
        hasActiveFilters={filters.hasActiveFilters}
      />
    </section>
  )
}

export default AdminLyceumsPage
