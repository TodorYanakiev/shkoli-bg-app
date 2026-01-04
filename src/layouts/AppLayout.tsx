import { Outlet } from 'react-router-dom'

import AppFooter from './components/AppFooter'
import TopNav from './components/TopNav'

const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <TopNav />
      <main className="relative w-full flex-1 overflow-hidden px-4 py-8 sm:px-6 sm:py-10 lg:px-12">
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
