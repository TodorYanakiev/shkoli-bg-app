import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

import AppFooter from './components/AppFooter'
import AuthBenefits from './components/AuthBenefits'
import TopNav from './components/TopNav'

const AuthLayout = () => {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <TopNav />
      <main className="relative w-full flex-1 overflow-hidden px-4 py-8 sm:px-6 sm:py-10 lg:px-12">
        <div aria-hidden className="page-background" />
        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <Outlet />
            </div>
            <AuthBenefits />
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  )
}

export default AuthLayout
