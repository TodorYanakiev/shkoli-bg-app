import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useToast } from '../../../components/feedback/ToastContext'
import LyceumRightsHeader from './components/LyceumRightsHeader'
import LyceumRightsRequestCard from './components/LyceumRightsRequestCard'
import LyceumRightsVerifyCard from './components/LyceumRightsVerifyCard'
import { useLyceumRightsActions } from './hooks/useLyceumRightsActions'
import { useLyceumRightsForms } from './hooks/useLyceumRightsForms'
import { useLyceumRightsSuggestions } from './hooks/useLyceumRightsSuggestions'
import { useLyceumRightsView } from './hooks/useLyceumRightsView'

const LyceumRightsPage = () => {
  const { t } = useTranslation()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const {
    requestForm,
    verifyForm,
    selectedTown,
    lyceumNameValue,
    trimmedLyceumName,
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
  const { suggestionNames, suggestionMessageKey, suggestionMessageTone } =
    useLyceumRightsSuggestions({
      selectedTown,
      lyceumNameValue,
      trimmedLyceumName,
      isRequestLocked,
      shouldFetchSuggestions,
    })

  return (
    <section className="space-y-4">
      <Helmet>
        <title>{`${t('pages.profile.lyceumRights.title')} | ${t(
          'app.title',
        )}`}</title>
      </Helmet>
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
          suggestionNames={suggestionNames}
          suggestionMessageKey={suggestionMessageKey}
          suggestionMessageTone={suggestionMessageTone}
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
