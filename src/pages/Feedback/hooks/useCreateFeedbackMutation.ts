import { useMutation } from '@tanstack/react-query'

import { createFeedback } from '../../../services/feedback'
import type { ApiError } from '../../../types/api'
import type {
  FeedbackRequest,
  FeedbackResponse,
} from '../../../types/feedback'

export const createFeedbackMutationKey = ['feedback', 'create'] as const

export const useCreateFeedbackMutation = () =>
  useMutation<FeedbackResponse, ApiError, FeedbackRequest>({
    mutationKey: createFeedbackMutationKey,
    mutationFn: createFeedback,
    retry: false,
  })
