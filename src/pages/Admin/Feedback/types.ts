import type {
  FeedbackReadFilter,
  FeedbackSortParam,
} from '../../../types/feedback'

export type AdminFeedbackFilterState = {
  page: number
  filter: FeedbackReadFilter
  sort: FeedbackSortParam
}

export type AdminFeedbackPagination = {
  currentPage: number
  totalPages: number
  totalItems: number
  pageStart: number
  pageEnd: number
  canGoPrev: boolean
  canGoNext: boolean
  hasMultiplePages: boolean
  goToPrev: () => void
  goToNext: () => void
}
