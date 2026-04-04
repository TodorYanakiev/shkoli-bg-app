import httpClient from './httpClient'
import type { UserResponse } from '../types/users'
import type {
  SubscriberExportDownloadResponse,
  SubscriberExportFormat,
  SubscriberExportJobResponse,
} from '../types/subscribers'

export const subscribeToCourse = async (courseId: number) => {
  await httpClient.post(`/api/v1/courses/${courseId}/subscribe`)
}

export const unsubscribeFromCourse = async (courseId: number) => {
  await httpClient.delete(`/api/v1/courses/${courseId}/subscribe`)
}

export const subscribeToLyceum = async (lyceumId: number) => {
  await httpClient.post(`/api/v1/lyceums/${lyceumId}/subscribe`)
}

export const unsubscribeFromLyceum = async (lyceumId: number) => {
  await httpClient.delete(`/api/v1/lyceums/${lyceumId}/subscribe`)
}

export const getCourseSubscribers = async (courseId: number) => {
  const response = await httpClient.get<UserResponse[]>(
    `/api/v1/courses/${courseId}/subscribers`,
  )
  return response.data
}

export const getLyceumSubscribers = async (lyceumId: number) => {
  const response = await httpClient.get<UserResponse[]>(
    `/api/v1/lyceums/${lyceumId}/subscribers`,
  )
  return response.data
}

export const createCourseSubscribersExport = async (
  courseId: number,
  format: SubscriberExportFormat,
) => {
  const response = await httpClient.post<SubscriberExportJobResponse>(
    `/api/v1/courses/${courseId}/subscribers/export`,
    undefined,
    {
      params: { format },
    },
  )

  return response.data
}

export const createLyceumSubscribersExport = async (
  lyceumId: number,
  format: SubscriberExportFormat,
) => {
  const response = await httpClient.post<SubscriberExportJobResponse>(
    `/api/v1/lyceums/${lyceumId}/subscribers/export`,
    undefined,
    {
      params: { format },
    },
  )

  return response.data
}

export const getCourseSubscribersExport = async (
  courseId: number,
  exportId: number,
) => {
  const response = await httpClient.get<SubscriberExportJobResponse>(
    `/api/v1/courses/${courseId}/subscribers/export/${exportId}`,
  )

  return response.data
}

export const getLyceumSubscribersExport = async (
  lyceumId: number,
  exportId: number,
) => {
  const response = await httpClient.get<SubscriberExportJobResponse>(
    `/api/v1/lyceums/${lyceumId}/subscribers/export/${exportId}`,
  )

  return response.data
}

export const downloadCourseSubscribersExport = async (
  courseId: number,
  exportId: number,
) => {
  const response = await httpClient.get<SubscriberExportDownloadResponse>(
    `/api/v1/courses/${courseId}/subscribers/export/${exportId}/download-url`,
  )

  if (typeof response.data?.url !== 'string' || response.data.url.length === 0) {
    throw new Error('Missing course subscriber export download url')
  }

  return response.data
}

export const downloadLyceumSubscribersExport = async (
  lyceumId: number,
  exportId: number,
) => {
  const response = await httpClient.get<SubscriberExportDownloadResponse>(
    `/api/v1/lyceums/${lyceumId}/subscribers/export/${exportId}/download-url`,
  )

  if (typeof response.data?.url !== 'string' || response.data.url.length === 0) {
    throw new Error('Missing lyceum subscriber export download url')
  }

  return response.data
}
