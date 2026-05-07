import { useTranslation } from 'react-i18next'

import SeoHead from '../../../components/ui/SeoHead'
import { useCurrentLocale } from '../../../hooks/useCurrentLocale'
import { AdminFeedbackFilters } from './components/AdminFeedbackFilters'
import { AdminFeedbackHeader } from './components/AdminFeedbackHeader'
import { AdminFeedbackList } from './components/AdminFeedbackList'
import { useAdminFeedbackData } from './hooks/useAdminFeedbackData'

const AdminFeedbackPage = () => {
  const { t } = useTranslation()
  const locale = useCurrentLocale()
  const {
    feedbacks,
    isLoading,
    isFetching,
    error,
    pagination,
    filters,
  } = useAdminFeedbackData()

  return (
    <section className="space-y-6">
      <SeoHead
        title={`${t('pages.admin.feedback.title')} | ${t(
          'pages.admin.title',
        )} | ${t('app.title')}`}
        description={t('pages.admin.feedback.subtitle')}
        canonicalPath="/admin/feedback"
        locale={locale}
        forceNoindex
      />
      <AdminFeedbackHeader
        totalItems={pagination.totalItems}
        isLoading={isLoading}
      />
      <AdminFeedbackFilters
        state={filters.state}
        hasActiveFilters={filters.hasActiveFilters}
        isLoading={isLoading}
        isFetching={isFetching}
        onFilterChange={filters.setFilter}
        onSortChange={filters.setSort}
        onClear={filters.clearFilters}
      />
      <AdminFeedbackList
        feedbacks={feedbacks}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        hasActiveFilters={filters.hasActiveFilters}
        pagination={pagination}
      />
    </section>
  )
}

export default AdminFeedbackPage
