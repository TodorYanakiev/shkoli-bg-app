import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

import { AdminSideNav } from './components/AdminSideNav'
import { AdminSubNav } from './components/AdminSubNav'
import { useAdminLayout } from './hooks/useAdminLayout'

const AdminPage = () => {
  const { t } = useTranslation()
  const { isDesktop, isSideNavExpanded, setIsSideNavExpanded, sideNavWidth } =
    useAdminLayout()

  return (
    <section className="space-y-6">
      <Helmet>
        <title>{`${t('pages.admin.title')} | ${t('app.title')}`}</title>
      </Helmet>
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
