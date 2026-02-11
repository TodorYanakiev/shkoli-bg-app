import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import LegalDocument, {
  type LegalDocumentSection,
} from '../../components/ui/LegalDocument'

const PrivacyPolicyPage = () => {
  const { t } = useTranslation(['legal', 'common'])
  const sections = t('legal:privacyPolicy.sections', {
    returnObjects: true,
  }) as LegalDocumentSection[]

  return (
    <>
      <Helmet>
        <title>{`${t('legal:privacyPolicy.title')} | ${t('common:app.title')}`}</title>
      </Helmet>
      <LegalDocument
        title={t('legal:privacyPolicy.title')}
        lastUpdated={t('legal:privacyPolicy.lastUpdated')}
        sections={sections}
      />
    </>
  )
}

export default PrivacyPolicyPage
