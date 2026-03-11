import { Outlet, useLocation } from 'react-router-dom'

import { useConsentManagedTracking } from '../hooks/useConsentManagedTracking'
import { stripLocalePrefix } from '../utils/localizedPath'
import AppFooter from './components/AppFooter'
import TopNav from './components/TopNav'

const AppLayout = () => {
  const location = useLocation()
  const isMapRoute = stripLocalePrefix(location.pathname) === '/map'

  useConsentManagedTracking()

  return (
    <div className="relative min-h-screen bg-transparent text-slate-900">
      <div className="relative z-10 flex min-h-screen flex-col">
        <TopNav />
        <main
          className={
            isMapRoute
              ? 'relative w-full flex-1 overflow-hidden pt-[var(--topnav-height,76px)]'
              : 'relative w-full min-h-screen flex-1 overflow-visible pb-8 pt-[calc(var(--topnav-height,76px)+2rem)] px-4 sm:pb-10 sm:px-6 sm:pt-[calc(var(--topnav-height,76px)+2.5rem)] lg:pr-12 lg:pl-[calc(3rem+var(--page-sidebar-offset,0px))]'
          }
        >
          <Outlet />
        </main>
        {isMapRoute ? null : <AppFooter />}
      </div>
    </div>
  )
}

export default AppLayout
