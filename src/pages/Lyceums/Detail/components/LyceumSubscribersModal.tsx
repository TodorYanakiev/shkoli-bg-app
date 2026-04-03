import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { SubscribersModal } from '../../../../components/ui/SubscribersModal'
import type { SubscriberExportFormat } from '../../../../types/subscribers'
import { useLyceumSubscriberExport } from '../hooks/useLyceumSubscriberExport'
import { useLyceumSubscribers } from '../hooks/useLyceumSubscribers'

type LyceumSubscribersModalProps = {
  modalId: string
  lyceumId: number
  lyceumName: string
  onClose: () => void
}

export const LyceumSubscribersModal = ({
  modalId,
  lyceumId,
  lyceumName,
  onClose,
}: LyceumSubscribersModalProps) => {
  const { t } = useTranslation()
  const {
    data: subscribers,
    isLoading: isSubscribersLoading,
    error: subscribersError,
  } = useLyceumSubscribers(lyceumId)
  const {
    selectedFormat,
    exportJob,
    exportError,
    isCreatingExport,
    isLoadingExportStatus,
    isDownloadingExport,
    isReadyToDownload,
    isExportInProgress,
    onChangeFormat,
    onRunExportAction,
  } = useLyceumSubscriberExport(lyceumId)

  const formatOptions = useMemo(
    () => [
      {
        value: 'CSV' as SubscriberExportFormat,
        label: t('subscribersModal.formats.csv'),
      },
      {
        value: 'XLSX' as SubscriberExportFormat,
        label: t('subscribersModal.formats.xlsx'),
      },
    ],
    [t],
  )

  const exportStatusLabel = exportJob?.status
    ? t(`subscribersModal.status.${exportJob.status}`)
    : null
  const exportStatusMessage = exportJob?.status
    ? t(`subscribersModal.statusDescriptions.${exportJob.status}`)
    : null
  const exportStatusTone =
    exportJob?.status === 'COMPLETED'
      ? 'success'
      : exportJob?.status === 'FAILED'
        ? 'danger'
        : 'neutral'
  const exportActionLabel = isDownloadingExport
    ? t('subscribersModal.actions.downloadingExport')
    : isReadyToDownload
      ? t('subscribersModal.actions.downloadExport')
      : isCreatingExport || isExportInProgress || isLoadingExportStatus
        ? t('subscribersModal.actions.creatingExport')
        : t('subscribersModal.actions.createExport')
  const subscribersErrorMessage = subscribersError
    ? t(subscribersError.messageKey)
    : null
  const exportErrorMessage = exportError ? t(exportError.messageKey) : null
  const isExportActionDisabled =
    isCreatingExport ||
    isLoadingExportStatus ||
    isDownloadingExport ||
    isSubscribersLoading ||
    Boolean(subscribersErrorMessage) ||
    (subscribers?.length ?? 0) === 0

  return (
    <SubscribersModal
      modalId={modalId}
      title={t('pages.lyceums.detail.subscribers.title', {
        name: lyceumName,
      })}
      subtitle={t('pages.lyceums.detail.subscribers.subtitle')}
      subscriberCount={subscribers?.length ?? 0}
      subscribers={subscribers}
      isSubscribersLoading={isSubscribersLoading}
      subscribersErrorMessage={subscribersErrorMessage}
      emptyMessage={t('pages.lyceums.detail.subscribers.empty')}
      selectedFormat={selectedFormat}
      formatOptions={formatOptions}
      exportActionLabel={exportActionLabel}
      exportStatusLabel={exportStatusLabel}
      exportStatusMessage={exportStatusMessage}
      exportStatusTone={exportStatusTone}
      exportErrorMessage={exportErrorMessage}
      isExportActionDisabled={isExportActionDisabled}
      onClose={onClose}
      onChangeFormat={onChangeFormat}
      onRunExportAction={() => {
        void onRunExportAction()
      }}
    />
  )
}
