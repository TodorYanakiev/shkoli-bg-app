import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getFeedbackPage } from '../../../../services/feedback'
import type { ApiError } from '../../../../types/api'
import type {
  FeedbackPageQuery,
  PageFeedbackResponse,
} from '../../../../types/feedback'

export const adminFeedbackQueryKeyPrefix = ['admin', 'feedback'] as const

export const adminFeedbackQueryKey = (query: FeedbackPageQuery) =>
  [...adminFeedbackQueryKeyPrefix, 'page', query] as const

export const useAdminFeedback = (query: FeedbackPageQuery) =>
  useQuery<PageFeedbackResponse, ApiError>({
    queryKey: adminFeedbackQueryKey(query),
    queryFn: () => getFeedbackPage(query),
    placeholderData: keepPreviousData,
    retry: 1,
    staleTime: 30 * 1000,
  })
