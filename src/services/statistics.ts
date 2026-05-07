import httpClient from './httpClient'
import type { EntityStatisticsResponse } from '../types/statistics'

export const getCourseStatistics = async (courseId: number) => {
  const response = await httpClient.get<EntityStatisticsResponse>(
    `/api/v1/courses/${courseId}/statistics`,
  )
  return response.data
}

export const getLyceumStatistics = async (lyceumId: number) => {
  const response = await httpClient.get<EntityStatisticsResponse>(
    `/api/v1/lyceums/${lyceumId}/statistics`,
  )
  return response.data
}

export const shareCourse = async (courseId: number) => {
  await httpClient.post(`/api/v1/courses/${courseId}/share`)
}

export const shareLyceum = async (lyceumId: number) => {
  await httpClient.post(`/api/v1/lyceums/${lyceumId}/share`)
}
