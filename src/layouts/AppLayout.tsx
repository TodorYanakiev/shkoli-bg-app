import { useTranslation } from 'react-i18next'
import { NavLink, Outlet, type NavLinkRenderProps } from 'react-router-dom'

const AppLayout = () => {
  const { t } = useTranslation()
  const navLinkClassName = ({ isActive }: NavLinkRenderProps) =>
    [
      'rounded px-3 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'bg-slate-900 text-white'
        : 'text-slate-700 hover:bg-slate-100',
    ].join(' ')

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <NavLink to="/shkoli" className="text-lg font-semibold">
            {t('app.title')}
          </NavLink>
          <nav className="flex items-center gap-2">
            <NavLink to="/shkoli" className={navLinkClassName}>
              {t('nav.shkoli')}
            </NavLink>
            <NavLink to="/map" className={navLinkClassName}>
              {t('nav.map')}
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
