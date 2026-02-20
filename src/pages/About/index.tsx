import { useTranslation } from 'react-i18next'

import SeoHead from '../../components/ui/SeoHead'
import { CONTACT_EMAIL } from '../../constants/contact'
import { useCurrentLocale } from '../../hooks/useCurrentLocale'

const AboutPage = () => {
  const { t } = useTranslation()
  const locale = useCurrentLocale()
  const breadcrumbs = [
    { label: t('nav.shkoli'), path: '/shkoli' },
    { label: t('pages.about.title'), path: '/about' },
  ]

  return (
    <section className="space-y-3">
      <SeoHead
        title={`${t('pages.about.title')} | ${t('app.title')}`}
        description={t('pages.about.subtitle')}
        canonicalPath="/about"
        locale={locale}
        breadcrumbs={breadcrumbs}
      />
      <h1 className="text-2xl font-semibold text-slate-900">
        {t('pages.about.title')}
      </h1>
      <p className="text-sm text-slate-600">{t('pages.about.subtitle')}</p>
      <p className="text-sm text-slate-600">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-medium text-brand-dark transition-colors hover:text-brand"
        >
          {t('pages.about.contact', { email: CONTACT_EMAIL })}
        </a>
      </p>
    </section>
  )
}

export default AboutPage
