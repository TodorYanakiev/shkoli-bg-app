import httpClient from './httpClient'
import type {
  CourseImageRequest,
  CourseImageResponse,
  CourseRequest,
  CourseResponse,
} from '../types/courses'

export const getCourseById = async (courseId: number) => {
  const response = await httpClient.get<CourseResponse>(
    `/api/v1/courses/${courseId}`,
  )
  return response.data
}

export const createCourse = async (payload: CourseRequest) => {
  const response = await httpClient.post<CourseResponse>(
    '/api/v1/courses',
    payload,
  )
  return response.data
}

export const registerCourseImage = async (
  courseId: number,
  payload: CourseImageRequest,
) => {
  const response = await httpClient.post<CourseImageResponse>(
    `/api/v1/courses/${courseId}/images`,
    payload,
  )
  return response.data
}

export const getCourseImages = async (courseId: number) => {
  const response = await httpClient.get<CourseImageResponse[]>(
    `/api/v1/courses/${courseId}/images`,
  )
  return response.data
}

export const deleteCourseImage = async (
  courseId: number,
  imageId: number,
) => {
  await httpClient.delete(
    `/api/v1/courses/${courseId}/images/${imageId}`,
  )
}
