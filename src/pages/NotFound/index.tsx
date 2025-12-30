import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  const { t } = useTranslation()

  return (
    <section className="mx-auto w-full max-w-3xl space-y-4 px-6 py-16 text-center">
      <h1 className="text-3xl font-semibold text-slate-900">
        {t('pages.notFound.title')}
      </h1>
      <p className="text-sm text-slate-600">
        {t('pages.notFound.message')}
      </p>
      <Link
        to="/shkoli"
        className="inline-flex items-center justify-center rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        {t('pages.notFound.action')}
      </Link>
    </section>
  )
}

export default NotFoundPage
