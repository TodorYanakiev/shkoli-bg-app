import { Outlet, useLocation } from 'react-router-dom'

import { useConsentManagedTracking } from '../hooks/useConsentManagedTracking'
import AppFooter from './components/AppFooter'
import TopNav from './components/TopNav'

const AppLayout = () => {
  const location = useLocation()
  const isMapRoute = location.pathname === '/map'

  useConsentManagedTracking()

  return (
    <div className="relative min-h-screen bg-transparent text-slate-900">
      <div className="relative z-10 flex min-h-screen flex-col">
        <TopNav />
        <main
          className={
            isMapRoute
              ? 'relative w-full flex-1 overflow-hidden pt-[var(--topnav-height,0px)]'
              : 'relative w-full flex-1 overflow-visible pb-8 pt-[calc(var(--topnav-height,0px)+2rem)] sm:pb-10 sm:pt-[calc(var(--topnav-height,0px)+2.5rem)] pr-4 sm:pr-6 lg:pr-12 pl-[calc(1rem+var(--page-sidebar-offset,0px))] sm:pl-[calc(1.5rem+var(--page-sidebar-offset,0px))] lg:pl-[calc(3rem+var(--page-sidebar-offset,0px))]'
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
