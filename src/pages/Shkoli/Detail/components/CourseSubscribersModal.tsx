import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { SubscribersModal } from '../../../../components/ui/SubscribersModal'
import type { SubscriberExportFormat } from '../../../../types/subscribers'
import { useCourseSubscriberExport } from '../hooks/useCourseSubscriberExport'
import { useCourseSubscribers } from '../hooks/useCourseSubscribers'

type CourseSubscribersModalProps = {
  modalId: string
  courseId: number
  courseName: string
  onClose: () => void
}

export const CourseSubscribersModal = ({
  modalId,
  courseId,
  courseName,
  onClose,
}: CourseSubscribersModalProps) => {
  const { t } = useTranslation()
  const {
    data: subscribers,
    isLoading: isSubscribersLoading,
    error: subscribersError,
  } = useCourseSubscribers(courseId)
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
  } = useCourseSubscriberExport(courseId)

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
      title={t('pages.shkoli.detail.subscribers.title', {
        name: courseName,
      })}
      subtitle={t('pages.shkoli.detail.subscribers.subtitle')}
      subscriberCount={subscribers?.length ?? 0}
      subscribers={subscribers}
      isSubscribersLoading={isSubscribersLoading}
      subscribersErrorMessage={subscribersErrorMessage}
      emptyMessage={t('pages.shkoli.detail.subscribers.empty')}
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
