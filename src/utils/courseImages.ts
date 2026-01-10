import { env } from '../constants/env'
import type { CourseImageResponse, CourseImageRole } from '../types/courses'

export const getCourseImageByRole = (
  images: CourseImageResponse[] | undefined,
  role: CourseImageRole,
) => images?.find((image) => image.role === role && image.url)

export const getPreferredCourseImage = (
  images: CourseImageResponse[] | undefined,
  role: CourseImageRole,
) => getCourseImageByRole(images, role) ?? images?.find((image) => image.url)

export const resolveCourseImageUrl = (url?: string) => {
  if (!url) return null
  if (!env.apiBaseUrl) return url

  try {
    const baseUrl = env.apiBaseUrl.endsWith('/')
      ? env.apiBaseUrl
      : `${env.apiBaseUrl}/`
    return new URL(url, baseUrl).toString()
  } catch {
    return url
  }
}
