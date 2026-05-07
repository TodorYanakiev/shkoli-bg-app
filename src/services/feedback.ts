import httpClient from './httpClient'
import type { AnonymousRequestConfig } from './httpClient'
import type {
  FeedbackPageQuery,
  FeedbackRequest,
  FeedbackResponse,
  PageFeedbackResponse,
} from '../types/feedback'

const anonymousRequestConfig: AnonymousRequestConfig = { skipAuth: true }
const DEFAULT_FEEDBACK_PAGE_SIZE = 9

export const createFeedback = async (payload: FeedbackRequest) => {
  const response = await httpClient.post<FeedbackResponse>(
    '/api/v1/feedback',
    payload,
    anonymousRequestConfig,
  )
  return response.data
}

export const getFeedbackPage = async (query: FeedbackPageQuery = {}) => {
  const response = await httpClient.get<PageFeedbackResponse>(
    '/api/v1/feedback',
    {
      params: {
        page: query.page ?? 0,
        size: query.size ?? DEFAULT_FEEDBACK_PAGE_SIZE,
        filter: query.filter ?? 'all',
        sort: query.sort ?? 'createdAt,desc',
      },
    },
  )
  return response.data
}

export const markFeedbackRead = async (feedbackId: number) => {
  const response = await httpClient.patch<FeedbackResponse>(
    `/api/v1/feedback/${feedbackId}/read`,
  )
  return response.data
}

export const markFeedbackUnread = async (feedbackId: number) => {
  const response = await httpClient.patch<FeedbackResponse>(
    `/api/v1/feedback/${feedbackId}/unread`,
  )
  return response.data
}

export const deleteFeedback = async (feedbackId: number) => {
  await httpClient.delete(`/api/v1/feedback/${feedbackId}`)
}
