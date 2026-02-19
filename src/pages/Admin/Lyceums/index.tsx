import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import SeoHead from '../../../components/ui/SeoHead'
import { useCurrentLocale } from '../../../hooks/useCurrentLocale'
import { AdminLyceumsFilters } from './components/AdminLyceumsFilters'
import { AdminLyceumsGrid } from './components/AdminLyceumsGrid'
import { AdminLyceumsHeader } from './components/AdminLyceumsHeader'
import { AdminLyceumCreateModal } from './components/AdminLyceumCreateModal'
import { useAdminLyceumCreateActions } from './hooks/useAdminLyceumCreateActions'
import { useAdminLyceumsData } from './hooks/useAdminLyceumsData'

const AdminLyceumsPage = () => {
  const { t } = useTranslation()
  const locale = useCurrentLocale()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { isCreating, onCreate } = useAdminLyceumCreateActions()
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
      <SeoHead
        title={`${t('pages.admin.lyceums.title')} | ${t(
          'pages.admin.title',
        )} | ${t('app.title')}`}
        description={t('pages.admin.lyceums.subtitle')}
        canonicalPath="/admin/lyceums"
        locale={locale}
        forceNoindex
      />
      <AdminLyceumsHeader
        verifiedCount={verifiedCount}
        isLoading={isLoading}
        isCreateSubmitting={isCreating}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
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
      <AdminLyceumCreateModal
        isOpen={isCreateModalOpen}
        isSubmitting={isCreating}
        onConfirm={onCreate}
        onCancel={() => setIsCreateModalOpen(false)}
      />
    </section>
  )
}

export default AdminLyceumsPage
