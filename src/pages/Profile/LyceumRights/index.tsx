import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useToast } from '../../../components/feedback/ToastContext'
import SeoHead from '../../../components/ui/SeoHead'
import { useCurrentLocale } from '../../../hooks/useCurrentLocale'
import { useLocalizedNavigate } from '../../../hooks/useLocalizedNavigate'
import LyceumRightsHeader from './components/LyceumRightsHeader'
import LyceumManualPickerModal from './components/LyceumManualPickerModal'
import LyceumRightsRequestCard from './components/LyceumRightsRequestCard'
import LyceumRightsVerifyCard from './components/LyceumRightsVerifyCard'
import { useLyceumRightsActions } from './hooks/useLyceumRightsActions'
import { useLyceumRightsForms } from './hooks/useLyceumRightsForms'
import { useLyceumRightsManualPicker } from './hooks/useLyceumRightsManualPicker'
import { useLyceumRightsSuggestions } from './hooks/useLyceumRightsSuggestions'
import { useLyceumRightsView } from './hooks/useLyceumRightsView'
import type { ManualLyceumOption } from './services/lyceumManualPicker'

const LyceumRightsPage = () => {
  const { t } = useTranslation()
  const locale = useCurrentLocale()
  const { showToast } = useToast()
  const navigate = useLocalizedNavigate()
  const [isManualPickerOpen, setIsManualPickerOpen] = useState(false)
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
  const {
    lyceumTownGroups,
    isLoading: isManualPickerLoading,
    isError: isManualPickerError,
    refetch: refetchManualLyceums,
  } = useLyceumRightsManualPicker({
    enabled: isManualPickerOpen,
  })
  const isManualPickerDisabled =
    isRequestLocked || requestMutation.isPending || verifyMutation.isPending

  const handleOpenManualPicker = useCallback(() => {
    if (isManualPickerDisabled) {
      return
    }
    setIsManualPickerOpen(true)
  }, [isManualPickerDisabled])

  const handleCloseManualPicker = useCallback(() => {
    setIsManualPickerOpen(false)
  }, [])

  const handleManualLyceumSelect = useCallback(
    (option: ManualLyceumOption) => {
      requestForm.setValue('lyceumName', option.name, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      })
      requestForm.setValue('town', option.town, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      })
      setIsManualPickerOpen(false)
      handleRequestSubmit({
        lyceumName: option.name,
        town: option.town,
      })
    },
    [handleRequestSubmit, requestForm],
  )

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
          suggestionNames={suggestionNames}
          suggestionMessageKey={suggestionMessageKey}
          suggestionMessageTone={suggestionMessageTone}
          onOpenManualPicker={handleOpenManualPicker}
          isManualPickerDisabled={isManualPickerDisabled}
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
      <LyceumManualPickerModal
        isOpen={isManualPickerOpen}
        isLoading={isManualPickerLoading}
        isError={isManualPickerError}
        isSubmitting={requestMutation.isPending}
        lyceumTownGroups={lyceumTownGroups}
        onClose={handleCloseManualPicker}
        onRetry={() => {
          refetchManualLyceums()
        }}
        onSelect={handleManualLyceumSelect}
      />
    </section>
  )
}

export default LyceumRightsPage
