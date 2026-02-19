import { useTranslation } from 'react-i18next'
import LegalDocument, {
  type LegalDocumentSection,
} from '../../components/ui/LegalDocument'
import SeoHead from '../../components/ui/SeoHead'
import { useCurrentLocale } from '../../hooks/useCurrentLocale'

const CookiesPage = () => {
  const { t } = useTranslation(['legal', 'common'])
  const locale = useCurrentLocale()
  const sections = t('legal:cookiesPolicy.sections', {
    returnObjects: true,
  }) as LegalDocumentSection[]
  const pageDescription = t('legal:cookiesPolicy.sections.0.paragraphs.0').slice(
    0,
    160,
  )
  const breadcrumbs = [
    { label: t('common:nav.shkoli'), path: '/shkoli' },
    { label: t('legal:cookiesPolicy.title'), path: '/cookies' },
  ]

  return (
    <>
      <SeoHead
        title={`${t('legal:cookiesPolicy.title')} | ${t('common:app.title')}`}
        description={pageDescription}
        canonicalPath="/cookies"
        locale={locale}
        breadcrumbs={breadcrumbs}
      />
      <LegalDocument
        title={t('legal:cookiesPolicy.title')}
        lastUpdated={t('legal:cookiesPolicy.lastUpdated')}
        sections={sections}
      />
    </>
  )
}

export default CookiesPage
