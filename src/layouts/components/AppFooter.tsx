import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const AppFooter = () => {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="flex w-full flex-col gap-6 py-6 text-sm text-slate-600 pr-4 sm:pr-6 lg:pr-12 pl-[calc(1rem+var(--page-sidebar-offset,0px))] sm:pl-[calc(1.5rem+var(--page-sidebar-offset,0px))] lg:pl-[calc(3rem+var(--page-sidebar-offset,0px))] md:flex-row md:items-center md:justify-between">
        <div className="space-y-1 text-center md:text-left">
          <p className="text-sm font-semibold text-slate-900">
            {t('app.title')}
          </p>
          <p>{t('layouts.app.footer.description')}</p>
          <p className="text-xs text-slate-400">
            {t('layouts.app.footer.notice')}
          </p>
        </div>
        <nav
          aria-label={t('layouts.app.footer.linksLabel')}
          className="flex items-center justify-center gap-3 text-sm md:justify-end"
        >
          <Link
            to="/shkoli"
            className="font-medium text-slate-600 transition-colors hover:text-brand-dark"
          >
            {t('nav.shkoli')}
          </Link>
          <Link
            to="/map"
            className="font-medium text-slate-600 transition-colors hover:text-brand-dark"
          >
            {t('nav.map')}
          </Link>
        </nav>
      </div>
    </footer>
  )
}

export default AppFooter
