import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import LegalDocument, {
  type LegalDocumentSection,
} from '../../components/ui/LegalDocument'

const CookiesPage = () => {
  const { t } = useTranslation(['legal', 'common'])
  const sections = t('legal:cookiesPolicy.sections', {
    returnObjects: true,
  }) as LegalDocumentSection[]

  return (
    <>
      <Helmet>
        <title>{`${t('legal:cookiesPolicy.title')} | ${t('common:app.title')}`}</title>
      </Helmet>
      <LegalDocument
        title={t('legal:cookiesPolicy.title')}
        lastUpdated={t('legal:cookiesPolicy.lastUpdated')}
        sections={sections}
      />
    </>
  )
}

export default CookiesPage
