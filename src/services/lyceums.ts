import httpClient from './httpClient'
import type { CourseResponse } from '../types/courses'
import type {
  LyceumFilterParams,
  LyceumLecturerRequest,
  LyceumRequest,
  LyceumRightsRequest,
  LyceumRightsVerificationRequest,
  LyceumResponse,
} from '../types/lyceums'
import type { UserResponse } from '../types/users'

export const requestLyceumRights = async (payload: LyceumRightsRequest) => {
  const response = await httpClient.post<string>(
    '/api/v1/lyceums/request-rights',
    payload,
  )
  return response.data
}

export const verifyLyceumRights = async (
  payload: LyceumRightsVerificationRequest,
) => {
  const response = await httpClient.post<string>(
    '/api/v1/lyceums/verify-rights',
    payload,
  )
  return response.data
}

export const getAllLyceums = async () => {
  const response = await httpClient.get<LyceumResponse[]>('/api/v1/lyceums')
  return response.data
}

export const getLyceumById = async (id: number) => {
  const response = await httpClient.get<LyceumResponse>(`/api/v1/lyceums/${id}`)
  return response.data
}

export const updateLyceum = async (id: number, payload: LyceumRequest) => {
  const response = await httpClient.put<LyceumResponse>(
    `/api/v1/lyceums/${id}`,
    payload,
  )
  return response.data
}

export const filterLyceums = async (params: LyceumFilterParams) => {
  const response = await httpClient.get<LyceumResponse[]>(
    '/api/v1/lyceums/filter',
    { params },
  )
  return response.data
}

export const getLyceumCourses = async (lyceumId: number) => {
  const response = await httpClient.get<CourseResponse[]>(
    `/api/v1/lyceums/${lyceumId}/courses`,
  )
  return response.data
}

export const getLyceumLecturers = async (lyceumId: number) => {
  const response = await httpClient.get<UserResponse[]>(
    `/api/v1/lyceums/${lyceumId}/lecturers`,
  )
  return response.data
}

export const addLyceumLecturer = async (payload: LyceumLecturerRequest) => {
  await httpClient.post('/api/v1/lyceums/lecturers', payload)
}

export const removeLyceumLecturer = async (
  lyceumId: number,
  userId: number,
) => {
  await httpClient.delete(`/api/v1/lyceums/${lyceumId}/lecturers/${userId}`)
}
