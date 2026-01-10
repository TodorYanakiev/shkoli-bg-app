import httpClient from './httpClient'
import type { CourseResponse } from '../types/courses'

export const getCourseById = async (courseId: number) => {
  const response = await httpClient.get<CourseResponse>(
    `/api/v1/courses/${courseId}`,
  )
  return response.data
}
