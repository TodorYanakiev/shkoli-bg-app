import { useTranslation } from 'react-i18next'
import LegalDocument, {
  type LegalDocumentSection,
} from '../../components/ui/LegalDocument'
import SeoHead from '../../components/ui/SeoHead'
import { useCurrentLocale } from '../../hooks/useCurrentLocale'

const TermsAndConditionsPage = () => {
  const { t } = useTranslation(['legal', 'common'])
  const locale = useCurrentLocale()
  const sections = t('legal:termsAndConditions.sections', {
    returnObjects: true,
  }) as LegalDocumentSection[]
  const pageDescription = t(
    'legal:termsAndConditions.sections.0.paragraphs.0',
  ).slice(0, 160)
  const breadcrumbs = [
    { label: t('common:nav.shkoli'), path: '/shkoli' },
    { label: t('legal:termsAndConditions.title'), path: '/terms-and-conditions' },
  ]

  return (
    <>
      <SeoHead
        title={`${t('legal:termsAndConditions.title')} | ${t('common:app.title')}`}
        description={pageDescription}
        canonicalPath="/terms-and-conditions"
        locale={locale}
        breadcrumbs={breadcrumbs}
      />
      <LegalDocument
        title={t('legal:termsAndConditions.title')}
        lastUpdated={t('legal:termsAndConditions.lastUpdated')}
        sections={sections}
      />
    </>
  )
}

export default TermsAndConditionsPage
