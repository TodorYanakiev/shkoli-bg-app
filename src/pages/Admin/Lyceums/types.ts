import type { LyceumResponse } from '../../../types/lyceums'

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
