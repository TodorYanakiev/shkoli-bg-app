import type { LyceumRequest, LyceumResponse } from '../../../types/lyceums'
import type { ApiError } from '../../../types/api'

export type AdminLyceumsFilterState = {
  name: string
  town: string
  includeVerified: boolean
  includeUnverified: boolean
}

export type AdminLyceumsPagination = {
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  pageStart: number
  pageEnd: number
  canGoPrev: boolean
  canGoNext: boolean
  hasMultiplePages: boolean
  goToPrev: () => void
  goToNext: () => void
}

export type AdminLyceumsPaginationResult = {
  pageItems: LyceumResponse[]
  pagination: AdminLyceumsPagination
}

export type AdminLyceumCreatePayload = LyceumRequest

export type AdminLyceumCreateResult = {
  ok: boolean
  error: ApiError | null
}
