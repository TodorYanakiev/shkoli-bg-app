import axios, { AxiosError } from 'axios'

import { env } from '../constants/env'
import { clearTokens, getAccessToken } from '../utils/authStorage'
import type { ApiError } from '../types/api'

const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
})

httpClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status

    if (status === 401 || status === 403) {
      clearTokens()
    }

    const normalizedError: ApiError = {
      status: status ?? 0,
      kind:
        status === 401
          ? 'unauthorized'
          : status === 403
            ? 'forbidden'
            : status
              ? 'unknown'
              : 'network',
    }

    return Promise.reject(normalizedError)
  },
)

export default httpClient
