export type ApiErrorKind = 'unauthorized' | 'forbidden' | 'network' | 'unknown'

export type ApiFieldErrors = Record<string, string>

export type ApiError = {
  status: number
  kind: ApiErrorKind
  message?: string
  details?: unknown
  fieldErrors?: ApiFieldErrors
}
