import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

import { AdminCoursesFilters } from './components/AdminCoursesFilters'
import { AdminCoursesGrid } from './components/AdminCoursesGrid'
import { AdminCoursesHeader } from './components/AdminCoursesHeader'
import { useAdminCoursesData } from './hooks/useAdminCoursesData'

const AdminCoursesPage = () => {
  const { t } = useTranslation()
  const {
    form,
    onSubmit,
    filterState,
    isExpanded,
    toggleExpanded,
    clearFilters,
    locale,
    courses,
    isLoading,
    isFetching,
    error,
    hasActiveFilters,
    pagination,
  } = useAdminCoursesData()

  return (
    <section className="space-y-6">
      <Helmet>
        <title>{`${t('pages.admin.courses.title')} | ${t(
          'pages.admin.title',
        )} | ${t('app.title')}`}</title>
      </Helmet>
      <AdminCoursesHeader
        totalItems={pagination.totalItems}
        isLoading={isLoading}
      />
      <AdminCoursesFilters
        form={form}
        onSubmit={onSubmit}
        filterState={filterState}
        isExpanded={isExpanded}
        onToggleExpanded={toggleExpanded}
        onClear={clearFilters}
        isFetching={isFetching}
        locale={locale}
      />
      <AdminCoursesGrid
        courses={courses}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        hasActiveFilters={hasActiveFilters}
        pagination={pagination}
      />
    </section>
  )
}

export default AdminCoursesPage
