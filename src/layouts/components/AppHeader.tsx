import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const AppHeader = () => {
  const { t } = useTranslation()

  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            {t('layouts.app.header.kicker')}
          </p>
          <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
            {t('layouts.app.header.title')}
          </h2>
          <p className="text-sm text-slate-600">
            {t('layouts.app.header.subtitle')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/map"
            className="inline-flex items-center justify-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {t('layouts.app.header.cta')}
          </Link>
        </div>
      </div>
    </section>
  )
}

export default AppHeader
