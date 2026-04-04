import { useCallback, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'

import type { AppError } from '../types/appError'
import type {
  SubscriberExportDownloadResponse,
  SubscriberExportFormat,
  SubscriberExportJobResponse,
} from '../types/subscribers'
import { downloadFileFromUrl } from '../utils/downloadFile'

type UseSubscriberExportFlowOptions = {
  enabled?: boolean
  queryKeyPrefix: readonly unknown[]
  createExport: (
    format: SubscriberExportFormat,
  ) => Promise<SubscriberExportJobResponse>
  getExportJob: (exportId: number) => Promise<SubscriberExportJobResponse>
  downloadExport: (
    exportId: number,
  ) => Promise<SubscriberExportDownloadResponse>
  mapCreateExportError: (error: unknown) => AppError
  mapExportStatusError: (error: unknown) => AppError
  mapDownloadError: (error: unknown) => AppError
}

type SubscriberExportFlowResult = {
  selectedFormat: SubscriberExportFormat
  exportJob: SubscriberExportJobResponse | null
  exportError: AppError | null
  isCreatingExport: boolean
  isLoadingExportStatus: boolean
  isDownloadingExport: boolean
  isReadyToDownload: boolean
  isExportInProgress: boolean
  onChangeFormat: (format: SubscriberExportFormat) => void
  onRunExportAction: () => Promise<void>
}

const EXPORT_STATUS_REFRESH_INTERVAL_MS = 1500

const isTerminalExportStatus = (status?: string) =>
  status === 'COMPLETED' || status === 'FAILED'

export const useSubscriberExportFlow = ({
  enabled = true,
  queryKeyPrefix,
  createExport,
  getExportJob,
  downloadExport,
  mapCreateExportError,
  mapExportStatusError,
  mapDownloadError,
}: UseSubscriberExportFlowOptions): SubscriberExportFlowResult => {
  const [selectedFormat, setSelectedFormat] =
    useState<SubscriberExportFormat>('CSV')
  const [activeExportId, setActiveExportId] = useState<number | null>(null)
  const [seedExportJob, setSeedExportJob] =
    useState<SubscriberExportJobResponse | null>(null)

  const exportStatusQuery = useQuery<SubscriberExportJobResponse, AppError>({
    queryKey: [...queryKeyPrefix, 'export', activeExportId],
    queryFn: async () => {
      try {
        return await getExportJob(activeExportId as number)
      } catch (error) {
        throw mapExportStatusError(error)
      }
    },
    enabled: enabled && typeof activeExportId === 'number',
    retry: false,
    refetchInterval: (query) => {
      const status = query.state.data?.status ?? seedExportJob?.status
      return isTerminalExportStatus(status)
        ? false
        : EXPORT_STATUS_REFRESH_INTERVAL_MS
    },
  })

  const exportJob = useMemo(() => {
    if (exportStatusQuery.data) {
      return exportStatusQuery.data
    }

    if (
      seedExportJob &&
      typeof activeExportId === 'number' &&
      seedExportJob.id === activeExportId
    ) {
      return seedExportJob
    }

    return null
  }, [activeExportId, exportStatusQuery.data, seedExportJob])

  const createExportMutation = useMutation<
    SubscriberExportJobResponse,
    AppError,
    SubscriberExportFormat
  >({
    mutationFn: async (format) => {
      try {
        return await createExport(format)
      } catch (error) {
        throw mapCreateExportError(error)
      }
    },
    retry: false,
  })

  const downloadExportMutation = useMutation<void, AppError, void>({
    mutationFn: async () => {
      try {
        const downloadResponse = await downloadExport(activeExportId as number)
        if (
          typeof downloadResponse.url !== 'string' ||
          downloadResponse.url.length === 0
        ) {
          throw new Error('Missing subscriber export download url')
        }

        downloadFileFromUrl(downloadResponse.url)
      } catch (error) {
        throw mapDownloadError(error)
      }
    },
    retry: false,
  })

  const isReadyToDownload =
    exportJob?.status === 'COMPLETED' && exportJob.format === selectedFormat
  const isExportInProgress =
    createExportMutation.isPending ||
    exportJob?.status === 'PENDING' ||
    exportJob?.status === 'IN_PROGRESS'

  const onChangeFormat = useCallback((format: SubscriberExportFormat) => {
    setSelectedFormat(format)
  }, [])

  const onRunExportAction = useCallback(async () => {
    if (isReadyToDownload) {
      try {
        await downloadExportMutation.mutateAsync()
      } catch {
        return
      }

      return
    }

    try {
      const exportJobResponse = await createExportMutation.mutateAsync(
        selectedFormat,
      )

      setSeedExportJob(exportJobResponse)
      setActiveExportId(
        typeof exportJobResponse.id === 'number' ? exportJobResponse.id : null,
      )
    } catch {
      return
    }
  }, [
    createExportMutation,
    downloadExportMutation,
    isReadyToDownload,
    selectedFormat,
  ])

  return {
    selectedFormat,
    exportJob,
    exportError:
      createExportMutation.error ??
      exportStatusQuery.error ??
      downloadExportMutation.error ??
      null,
    isCreatingExport: createExportMutation.isPending,
    isLoadingExportStatus: exportStatusQuery.isFetching,
    isDownloadingExport: downloadExportMutation.isPending,
    isReadyToDownload,
    isExportInProgress,
    onChangeFormat,
    onRunExportAction,
  }
}
