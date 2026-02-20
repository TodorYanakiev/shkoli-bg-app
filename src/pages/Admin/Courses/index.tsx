import { useTranslation } from 'react-i18next'

import SeoHead from '../../../components/ui/SeoHead'
import { useCurrentLocale } from '../../../hooks/useCurrentLocale'
import { AdminCoursesFilters } from './components/AdminCoursesFilters'
import { AdminCoursesGrid } from './components/AdminCoursesGrid'
import { AdminCoursesHeader } from './components/AdminCoursesHeader'
import { useAdminCoursesData } from './hooks/useAdminCoursesData'

const AdminCoursesPage = () => {
  const { t } = useTranslation()
  const currentLocale = useCurrentLocale()
  const {
    form,
    onSubmit,
    filterState,
    isExpanded,
    toggleExpanded,
    clearFilters,
    locale: filterLocale,
    courses,
    isLoading,
    isFetching,
    error,
    hasActiveFilters,
    pagination,
  } = useAdminCoursesData()

  return (
    <section className="space-y-6">
      <SeoHead
        title={`${t('pages.admin.courses.title')} | ${t(
          'pages.admin.title',
        )} | ${t('app.title')}`}
        description={t('pages.admin.courses.subtitle')}
        canonicalPath="/admin/courses"
        locale={currentLocale}
        forceNoindex
      />
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
        locale={filterLocale}
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
