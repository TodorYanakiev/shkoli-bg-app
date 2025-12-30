import { useTranslation } from 'react-i18next'
import { Link, Outlet } from 'react-router-dom'

const AuthLayout = () => {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-4">
          <Link to="/shkoli" className="text-lg font-semibold">
            {t('app.title')}
          </Link>
          <span className="text-sm text-slate-500">
            {t('layouts.auth.subtitle')}
          </span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}

export default AuthLayout
