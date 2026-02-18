import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

import { AdminUsersFilters } from './components/AdminUsersFilters'
import { AdminUsersGrid } from './components/AdminUsersGrid'
import { AdminUsersHeader } from './components/AdminUsersHeader'
import { useAdminUsersData } from './hooks/useAdminUsersData'

const AdminUsersPage = () => {
  const { t } = useTranslation()
  const { users, isLoading, error, pagination, adminCount, filters } =
    useAdminUsersData()

  return (
    <section className="space-y-6">
      <Helmet>
        <title>{`${t('pages.admin.users.title')} | ${t(
          'pages.admin.title',
        )} | ${t('app.title')}`}</title>
      </Helmet>
      <AdminUsersHeader
        totalItems={pagination.totalItems}
        adminCount={adminCount}
        isLoading={isLoading}
      />
      <AdminUsersFilters
        state={filters.state}
        hasActiveFilters={filters.hasActiveFilters}
        isLoading={isLoading}
        onSearchChange={filters.setSearchFilter}
        onRoleChange={filters.setRoleFilter}
        onIncludeEnabledChange={filters.setIncludeEnabledFilter}
        onIncludeDisabledChange={filters.setIncludeDisabledFilter}
        onClear={filters.clearFilters}
      />
      <AdminUsersGrid
        users={users}
        isLoading={isLoading}
        error={error}
        pagination={pagination}
        hasActiveFilters={filters.hasActiveFilters}
      />
    </section>
  )
}

export default AdminUsersPage
