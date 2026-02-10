import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import LegalDocument, {
  type LegalDocumentSection,
} from '../../components/ui/LegalDocument'

const TermsAndConditionsPage = () => {
  const { t } = useTranslation(['legal', 'common'])
  const sections = t('legal:termsAndConditions.sections', {
    returnObjects: true,
  }) as LegalDocumentSection[]

  return (
    <>
      <Helmet>
        <title>{`${t('legal:termsAndConditions.title')} | ${t('common:app.title')}`}</title>
      </Helmet>
      <LegalDocument
        title={t('legal:termsAndConditions.title')}
        lastUpdated={t('legal:termsAndConditions.lastUpdated')}
        sections={sections}
      />
    </>
  )
}

export default TermsAndConditionsPage
