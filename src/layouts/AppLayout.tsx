import { Outlet } from 'react-router-dom'

import AppFooter from './components/AppFooter'
import AppHeader from './components/AppHeader'
import TopNav from './components/TopNav'

const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <TopNav />
      <AppHeader />
      <main className="w-full flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-12">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  )
}

export default AppLayout
