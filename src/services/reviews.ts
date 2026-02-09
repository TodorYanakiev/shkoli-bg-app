import httpClient from './httpClient'
import type {
  ReviewRequest,
  ReviewResponse,
  ReviewUpdateRequest,
} from '../types/reviews'

export const getCourseReviews = async (courseId: number) => {
  const response = await httpClient.get<ReviewResponse[]>(
    `/api/v1/courses/${courseId}/reviews`,
  )
  return response.data
}

export const getCourseReview = async (
  courseId: number,
  userId: number,
) => {
  const response = await httpClient.get<ReviewResponse>(
    `/api/v1/courses/${courseId}/reviews/${userId}`,
  )
  return response.data
}

export const createCourseReview = async (
  courseId: number,
  payload: ReviewRequest,
) => {
  const response = await httpClient.post<ReviewResponse>(
    `/api/v1/courses/${courseId}/reviews`,
    payload,
  )
  return response.data
}

export const updateCourseReview = async (
  courseId: number,
  userId: number,
  payload: ReviewUpdateRequest,
) => {
  const response = await httpClient.put<ReviewResponse>(
    `/api/v1/courses/${courseId}/reviews/${userId}`,
    payload,
  )
  return response.data
}

export const deleteCourseReview = async (
  courseId: number,
  userId: number,
) => {
  await httpClient.delete(`/api/v1/courses/${courseId}/reviews/${userId}`)
}

export const getLyceumReviews = async (lyceumId: number) => {
  const response = await httpClient.get<ReviewResponse[]>(
    `/api/v1/lyceums/${lyceumId}/reviews`,
  )
  return response.data
}

export const getLyceumReview = async (
  lyceumId: number,
  userId: number,
) => {
  const response = await httpClient.get<ReviewResponse>(
    `/api/v1/lyceums/${lyceumId}/reviews/${userId}`,
  )
  return response.data
}

export const createLyceumReview = async (
  lyceumId: number,
  payload: ReviewRequest,
) => {
  const response = await httpClient.post<ReviewResponse>(
    `/api/v1/lyceums/${lyceumId}/reviews`,
    payload,
  )
  return response.data
}

export const updateLyceumReview = async (
  lyceumId: number,
  userId: number,
  payload: ReviewUpdateRequest,
) => {
  const response = await httpClient.put<ReviewResponse>(
    `/api/v1/lyceums/${lyceumId}/reviews/${userId}`,
    payload,
  )
  return response.data
}

export const deleteLyceumReview = async (
  lyceumId: number,
  userId: number,
) => {
  await httpClient.delete(`/api/v1/lyceums/${lyceumId}/reviews/${userId}`)
}

export const getUserReviews = async (userId: number) => {
  const response = await httpClient.get<ReviewResponse[]>(
    `/api/v1/users/${userId}/reviews`,
  )
  return response.data
}

export const getUserReview = async (
  userId: number,
  reviewerId: number,
) => {
  const response = await httpClient.get<ReviewResponse>(
    `/api/v1/users/${userId}/reviews/${reviewerId}`,
  )
  return response.data
}

export const createUserReview = async (
  userId: number,
  payload: ReviewRequest,
) => {
  const response = await httpClient.post<ReviewResponse>(
    `/api/v1/users/${userId}/reviews`,
    payload,
  )
  return response.data
}

export const updateUserReview = async (
  userId: number,
  reviewerId: number,
  payload: ReviewUpdateRequest,
) => {
  const response = await httpClient.put<ReviewResponse>(
    `/api/v1/users/${userId}/reviews/${reviewerId}`,
    payload,
  )
  return response.data
}

export const deleteUserReview = async (
  userId: number,
  reviewerId: number,
) => {
  await httpClient.delete(`/api/v1/users/${userId}/reviews/${reviewerId}`)
}
