import { useMutation } from '@tanstack/react-query'

import {
  deleteFeedback,
  markFeedbackRead,
  markFeedbackUnread,
} from '../../../../services/feedback'
import type { ApiError } from '../../../../types/api'
import type { FeedbackResponse } from '../../../../types/feedback'

type FeedbackIdPayload = {
  feedbackId: number
}

export const markFeedbackReadMutationKey = [
  'admin',
  'feedback',
  'read',
] as const

export const markFeedbackUnreadMutationKey = [
  'admin',
  'feedback',
  'unread',
] as const

export const deleteFeedbackMutationKey = [
  'admin',
  'feedback',
  'delete',
] as const

export const useMarkFeedbackReadMutation = () =>
  useMutation<FeedbackResponse, ApiError, FeedbackIdPayload>({
    mutationKey: markFeedbackReadMutationKey,
    mutationFn: ({ feedbackId }) => markFeedbackRead(feedbackId),
    retry: false,
  })

export const useMarkFeedbackUnreadMutation = () =>
  useMutation<FeedbackResponse, ApiError, FeedbackIdPayload>({
    mutationKey: markFeedbackUnreadMutationKey,
    mutationFn: ({ feedbackId }) => markFeedbackUnread(feedbackId),
    retry: false,
  })

export const useDeleteFeedbackMutation = () =>
  useMutation<void, ApiError, FeedbackIdPayload>({
    mutationKey: deleteFeedbackMutationKey,
    mutationFn: ({ feedbackId }) => deleteFeedback(feedbackId),
    retry: false,
  })
