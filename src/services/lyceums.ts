import httpClient from './httpClient'
import type {
  LyceumRightsRequest,
  LyceumRightsVerificationRequest,
  LyceumResponse,
} from '../types/lyceums'

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

export const getLyceumById = async (id: number) => {
  const response = await httpClient.get<LyceumResponse>(`/api/v1/lyceums/${id}`)
  return response.data
}
