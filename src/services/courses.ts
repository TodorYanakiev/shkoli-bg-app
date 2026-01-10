import httpClient from './httpClient'
import type { CourseRequest, CourseResponse } from '../types/courses'

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
