import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

import AppFooter from './components/AppFooter'
import TopNav from './components/TopNav'

const AuthLayout = () => {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <TopNav />
      <main className="w-full flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-12">
        <p className="mb-6 text-sm text-slate-500">
          {t('layouts.auth.subtitle')}
        </p>
        <Outlet />
      </main>
      <AppFooter />
    </div>
  )
}

export default AuthLayout
