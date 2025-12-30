import { Outlet } from 'react-router-dom'

import AppFooter from './components/AppFooter'
import AppHeader from './components/AppHeader'
import TopNav from './components/TopNav'

const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <TopNav />
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  )
}

export default AppLayout
