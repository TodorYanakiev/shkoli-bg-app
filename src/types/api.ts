export type ApiErrorKind = 'unauthorized' | 'forbidden' | 'network' | 'unknown'

export type ApiError = {
  status: number
  kind: ApiErrorKind
}
