import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios'

import { env } from './env'
import { clearTokens, getAccessToken } from '../utils/authStorage'
import type { ApiError } from '../types/api'

type ErrorRecord = Record<string, unknown>
export type AnonymousRequestConfig = AxiosRequestConfig & {
  skipAuth: true
}
type HttpClientRequestConfig = InternalAxiosRequestConfig & {
  skipAuth?: boolean
}

const isErrorRecord = (value: unknown): value is ErrorRecord =>
  typeof value === 'object' && value !== null

const extractMessage = (errorBody: unknown): string | undefined => {
  if (!isErrorRecord(errorBody)) return undefined

  const message = errorBody.message
  if (typeof message === 'string' && message.trim().length > 0) {
    return message
  }

  const detail = errorBody.detail
  if (typeof detail === 'string' && detail.trim().length > 0) {
    return detail
  }

  const title = errorBody.title
  if (typeof title === 'string' && title.trim().length > 0) {
    return title
  }

  return undefined
}

const toFieldErrorEntries = (
  value: unknown,
): Array<[string, string]> => {
  if (!Array.isArray(value)) return []

  return value
    .map((entry) => {
      if (!isErrorRecord(entry)) return null
      const rawField = entry.field
      const rawMessage = entry.message
      if (
        typeof rawField !== 'string' ||
        rawField.trim().length === 0 ||
        typeof rawMessage !== 'string' ||
        rawMessage.trim().length === 0
      ) {
        return null
      }
      return [rawField, rawMessage] as [string, string]
    })
    .filter((entry): entry is [string, string] => Boolean(entry))
}

const extractFieldErrors = (
  errorBody: unknown,
): Record<string, string> | undefined => {
  if (!isErrorRecord(errorBody)) return undefined

  const fieldErrorsFromArray = toFieldErrorEntries(
    (errorBody as { fieldErrors?: unknown }).fieldErrors,
  )
  if (fieldErrorsFromArray.length > 0) {
    return Object.fromEntries(fieldErrorsFromArray)
  }

  const errors = (errorBody as { errors?: unknown }).errors
  if (!isErrorRecord(errors)) return undefined

  const entries = Object.entries(errors)
    .map(([field, value]) => {
      if (typeof value === 'string' && value.trim().length > 0) {
        return [field, value] as [string, string]
      }
      if (Array.isArray(value)) {
        const firstMessage = value.find(
          (item): item is string =>
            typeof item === 'string' && item.trim().length > 0,
        )
        if (firstMessage) {
          return [field, firstMessage] as [string, string]
        }
      }
      return null
    })
    .filter((entry): entry is [string, string] => Boolean(entry))

  return entries.length > 0 ? Object.fromEntries(entries) : undefined
}

const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
})

httpClient.interceptors.request.use((config) => {
  if ((config as HttpClientRequestConfig).skipAuth) {
    return config
  }

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
    const requestConfig = error.config as HttpClientRequestConfig | undefined

    if (status === 401 && !requestConfig?.skipAuth) {
      clearTokens()
    }

    const errorBody = error.response?.data
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
      message: extractMessage(errorBody),
      details: errorBody,
      fieldErrors: extractFieldErrors(errorBody),
    }

    return Promise.reject(normalizedError)
  },
)

export default httpClient
