import httpClient from './httpClient'
import type {
  LyceumRightsRequest,
  LyceumRightsVerificationRequest,
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
