import { useSubscriberExportFlow } from '../../../../hooks/useSubscriberExportFlow'
import {
  createCourseSubscribersExport,
  downloadCourseSubscribersExport,
  getCourseSubscribersExport,
} from '../../../../services/subscriptions'
import { mapSubscriberManagementApiError } from '../../../../services/subscriberManagementErrors'

export const useCourseSubscriberExport = (courseId?: number) =>
  useSubscriberExportFlow({
    enabled: typeof courseId === 'number' && Number.isFinite(courseId),
    queryKeyPrefix: ['courses', 'subscribers', courseId],
    createExport: (format) =>
      createCourseSubscribersExport(courseId as number, format),
    getExportJob: (exportId) =>
      getCourseSubscribersExport(courseId as number, exportId),
    downloadExport: (exportId) =>
      downloadCourseSubscribersExport(courseId as number, exportId),
    mapCreateExportError: (error) =>
      mapSubscriberManagementApiError(error, 'course', 'createExport'),
    mapExportStatusError: (error) =>
      mapSubscriberManagementApiError(error, 'course', 'exportStatus'),
    mapDownloadError: (error) =>
      mapSubscriberManagementApiError(error, 'course', 'downloadExport'),
  })
