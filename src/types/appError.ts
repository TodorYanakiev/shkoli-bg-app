export type AppErrorType =
  | 'network'
  | 'validation'
  | 'auth'
  | 'forbidden'
  | 'notFound'
  | 'server'
  | 'unknown'

export type AppError = {
  type: AppErrorType
  status?: number
  messageKey: string
  fieldErrors?: Record<string, string>
}
