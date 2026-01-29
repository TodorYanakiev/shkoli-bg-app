import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { CONTACT_EMAIL } from '../../constants/contact'

const AboutPage = () => {
  const { t } = useTranslation()

  return (
    <section className="space-y-3">
      <Helmet>
        <title>{`${t('pages.about.title')} | ${t('app.title')}`}</title>
      </Helmet>
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
