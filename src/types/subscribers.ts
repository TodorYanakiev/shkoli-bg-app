export type SubscriberScope = 'course' | 'lyceum'

export type SubscriberExportFormat = 'CSV' | 'XLSX' | 'EXCEL'

export type SubscriberExportStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'FAILED'

export type SubscriberExportJobResponse = {
  id?: number
  scope?: string
  targetId?: number
  format?: SubscriberExportFormat | string
  status?: SubscriberExportStatus | string
  fileName?: string
  errorMessage?: string
  createdAt?: string
  updatedAt?: string
  completedAt?: string
}

export type SubscriberExportDownloadResponse = {
  url?: string
  fileName?: string
  expiresAt?: string
}
