import { useTranslation } from 'react-i18next'
import LegalDocument, {
  type LegalDocumentSection,
} from '../../components/ui/LegalDocument'
import SeoHead from '../../components/ui/SeoHead'
import { useCurrentLocale } from '../../hooks/useCurrentLocale'

const PrivacyPolicyPage = () => {
  const { t } = useTranslation(['legal', 'common'])
  const locale = useCurrentLocale()
  const sections = t('legal:privacyPolicy.sections', {
    returnObjects: true,
  }) as LegalDocumentSection[]
  const pageDescription = t(
    'legal:privacyPolicy.sections.0.paragraphs.0',
  ).slice(0, 160)
  const breadcrumbs = [
    { label: t('common:nav.shkoli'), path: '/shkoli' },
    { label: t('legal:privacyPolicy.title'), path: '/privacy-policy' },
  ]

  return (
    <>
      <SeoHead
        title={`${t('legal:privacyPolicy.title')} | ${t('common:app.title')}`}
        description={pageDescription}
        canonicalPath="/privacy-policy"
        locale={locale}
        breadcrumbs={breadcrumbs}
      />
      <LegalDocument
        title={t('legal:privacyPolicy.title')}
        lastUpdated={t('legal:privacyPolicy.lastUpdated')}
        sections={sections}
      />
    </>
  )
}

export default PrivacyPolicyPage
