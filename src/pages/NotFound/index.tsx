import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import SeoHead from '../../components/ui/SeoHead'
import { useCurrentLocale } from '../../hooks/useCurrentLocale'
import { useLocalizedPath } from '../../hooks/useLocalizedPath'

const NotFoundPage = () => {
  const { t } = useTranslation()
  const locale = useCurrentLocale()
  const localizedPath = useLocalizedPath()

  return (
    <section className="mx-auto w-full max-w-3xl space-y-4 px-4 py-12 text-center sm:px-6 sm:py-16">
      <SeoHead
        title={`${t('pages.notFound.title')} | ${t('app.title')}`}
        description={t('pages.notFound.message')}
        canonicalPath="/not-found"
        locale={locale}
        forceNoindex
      />
      <h1 className="text-3xl font-semibold text-slate-900">
        {t('pages.notFound.title')}
      </h1>
      <p className="text-sm text-slate-600">
        {t('pages.notFound.message')}
      </p>
      <Link
        to={localizedPath('/shkoli')}
        className="inline-flex items-center justify-center rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        {t('pages.notFound.action')}
      </Link>
    </section>
  )
}

export default NotFoundPage
