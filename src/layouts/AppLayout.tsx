import { Outlet } from 'react-router-dom'

import AppFooter from './components/AppFooter'
import TopNav from './components/TopNav'

const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <TopNav />
      <main className="relative w-full flex-1 overflow-hidden py-8 sm:py-10 pr-4 sm:pr-6 lg:pr-12 pl-[calc(1rem+var(--page-sidebar-offset,0px))] sm:pl-[calc(1.5rem+var(--page-sidebar-offset,0px))] lg:pl-[calc(3rem+var(--page-sidebar-offset,0px))]">
        <div aria-hidden className="page-background" />
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>
      <AppFooter />
    </div>
  )
}

export default AppLayout
