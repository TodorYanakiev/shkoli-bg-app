import { useTranslation } from 'react-i18next'

import { useToast } from '../../../components/feedback/ToastContext'
import SeoHead from '../../../components/ui/SeoHead'
import { useCurrentLocale } from '../../../hooks/useCurrentLocale'
import { useLocalizedNavigate } from '../../../hooks/useLocalizedNavigate'
import LyceumRightsHeader from './components/LyceumRightsHeader'
import LyceumRightsRequestCard from './components/LyceumRightsRequestCard'
import LyceumRightsVerifyCard from './components/LyceumRightsVerifyCard'
import { useLyceumRightsActions } from './hooks/useLyceumRightsActions'
import { useLyceumRightsForms } from './hooks/useLyceumRightsForms'
import { useLyceumRightsSuggestions } from './hooks/useLyceumRightsSuggestions'
import { useLyceumRightsView } from './hooks/useLyceumRightsView'

const LyceumRightsPage = () => {
  const { t } = useTranslation()
  const locale = useCurrentLocale()
  const { showToast } = useToast()
  const navigate = useLocalizedNavigate()
  const {
    requestForm,
    verifyForm,
    selectedTown,
    shouldFetchSuggestions,
  } = useLyceumRightsForms(t)
  const {
    requestMutation,
    verifyMutation,
    requestOutcome,
    requestedLyceum,
    handleRequestSubmit,
    handleVerifySubmit,
    handleStartOver,
  } = useLyceumRightsActions({
    t,
    showToast,
    navigate,
    resetRequest: requestForm.reset,
    resetVerify: verifyForm.reset,
  })
  const {
    requestErrorKey,
    verifyErrorKey,
    isRequestLocked,
    hasRequested,
    shouldShowRequestError,
  } = useLyceumRightsView({
    requestOutcome,
    requestError: requestMutation.error ?? null,
    verifyError: verifyMutation.error ?? null,
  })
  const {
    suggestionNames,
    suggestionMessageKey,
    suggestionMessageTone,
    isSuggestionsLoading,
  } = useLyceumRightsSuggestions({
    selectedTown,
    isRequestLocked,
    shouldFetchSuggestions,
  })

  return (
    <section className="space-y-4">
      <SeoHead
        title={`${t('pages.profile.lyceumRights.title')} | ${t(
          'app.title',
        )}`}
        description={t('pages.profile.lyceumRights.subtitle')}
        canonicalPath="/profile/lyceum-rights"
        locale={locale}
        forceNoindex
      />
      <LyceumRightsHeader />
      <div className="grid gap-4 lg:grid-cols-2">
        <LyceumRightsRequestCard
          form={requestForm}
          onSubmit={handleRequestSubmit}
          isSubmitting={requestMutation.isPending}
          isVerifySubmitting={verifyMutation.isPending}
          isRequestLocked={isRequestLocked}
          hasRequested={hasRequested}
          requestOutcome={requestOutcome}
          requestedLyceum={requestedLyceum}
          requestErrorKey={requestErrorKey}
          shouldShowRequestError={shouldShowRequestError}
          selectedTown={selectedTown}
          suggestionNames={suggestionNames}
          suggestionMessageKey={suggestionMessageKey}
          suggestionMessageTone={suggestionMessageTone}
          isSuggestionsLoading={isSuggestionsLoading}
          onStartOver={handleStartOver}
        />
        <LyceumRightsVerifyCard
          form={verifyForm}
          onSubmit={handleVerifySubmit}
          hasRequested={hasRequested}
          isSubmitting={verifyMutation.isPending}
          verifyErrorKey={verifyErrorKey}
        />
      </div>
    </section>
  )
}

export default LyceumRightsPage
