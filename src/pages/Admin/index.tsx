import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

import SeoHead from '../../components/ui/SeoHead'
import { useCurrentLocale } from '../../hooks/useCurrentLocale'
import { AdminSideNav } from './components/AdminSideNav'
import { AdminSubNav } from './components/AdminSubNav'
import { useAdminLayout } from './hooks/useAdminLayout'

const AdminPage = () => {
  const { t } = useTranslation()
  const locale = useCurrentLocale()
  const { isDesktop, isSideNavExpanded, setIsSideNavExpanded, sideNavWidth } =
    useAdminLayout()

  return (
    <section className="space-y-6">
      <SeoHead
        title={`${t('pages.admin.title')} | ${t('app.title')}`}
        description={t('pages.admin.subtitle')}
        canonicalPath="/admin"
        locale={locale}
        forceNoindex
      />
      <AdminSideNav
        isDesktop={isDesktop}
        isSideNavExpanded={isSideNavExpanded}
        sideNavWidth={sideNavWidth}
        onToggle={() => setIsSideNavExpanded((prev) => !prev)}
      />
      <AdminSubNav />
      <Outlet />
    </section>
  )
}

export default AdminPage
