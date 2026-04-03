import { useSubscriberExportFlow } from '../../../../hooks/useSubscriberExportFlow'
import {
  createLyceumSubscribersExport,
  downloadLyceumSubscribersExport,
  getLyceumSubscribersExport,
} from '../../../../services/subscriptions'
import { mapSubscriberManagementApiError } from '../../../../services/subscriberManagementErrors'

export const useLyceumSubscriberExport = (lyceumId?: number) =>
  useSubscriberExportFlow({
    enabled: typeof lyceumId === 'number' && Number.isFinite(lyceumId),
    queryKeyPrefix: ['lyceums', 'subscribers', lyceumId],
    createExport: (format) =>
      createLyceumSubscribersExport(lyceumId as number, format),
    getExportJob: (exportId) =>
      getLyceumSubscribersExport(lyceumId as number, exportId),
    downloadExport: (exportId) =>
      downloadLyceumSubscribersExport(lyceumId as number, exportId),
    mapCreateExportError: (error) =>
      mapSubscriberManagementApiError(error, 'lyceum', 'createExport'),
    mapExportStatusError: (error) =>
      mapSubscriberManagementApiError(error, 'lyceum', 'exportStatus'),
    mapDownloadError: (error) =>
      mapSubscriberManagementApiError(error, 'lyceum', 'downloadExport'),
  })
