import { env } from '../constants/env'
import type { CourseImageResponse, CourseImageRole } from '../types/courses'

const normalizeSource = (value?: string) => {
  if (typeof value !== 'string') return null
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : null
}

const hasImageSource = (image?: CourseImageResponse) =>
  Boolean(normalizeSource(image?.url) || normalizeSource(image?.s3Key))

export const getCourseImageByRole = (
  images: CourseImageResponse[] | undefined,
  role: CourseImageRole,
) => images?.find((image) => image.role === role && hasImageSource(image))

export const getPreferredCourseImage = (
  images: CourseImageResponse[] | undefined,
  role: CourseImageRole,
) =>
  getCourseImageByRole(images, role) ??
  images?.find((image) => hasImageSource(image))

export const resolveCourseImageUrl = (image?: CourseImageResponse | null) => {
  const source = normalizeSource(image?.url) ?? normalizeSource(image?.s3Key)
  if (!source) return null

  if (/^https?:\/\//i.test(source)) {
    return source
  }

  const trimmedSource = source.replace(/^\/+/, '')
  const publicBaseUrl = env.s3PublicBaseUrl?.trim()

  if (publicBaseUrl) {
    const normalizedBase = publicBaseUrl.endsWith('/')
      ? publicBaseUrl
      : `${publicBaseUrl}/`
    return new URL(trimmedSource, normalizedBase).toString()
  }

  if (env.s3BucketName) {
    return `https://${env.s3BucketName}.s3.amazonaws.com/${trimmedSource}`
  }

  if (env.apiBaseUrl) {
    const baseUrl = env.apiBaseUrl.endsWith('/')
      ? env.apiBaseUrl
      : `${env.apiBaseUrl}/`
    return new URL(trimmedSource, baseUrl).toString()
  }

  return source
}
