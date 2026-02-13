import { env } from '../constants/env'
import type { UserImageResponse } from '../types/users'

const normalizeSource = (value?: string) => {
  if (typeof value !== 'string') return null
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : null
}

const hasImageSource = (image?: UserImageResponse | null) =>
  Boolean(normalizeSource(image?.url) || normalizeSource(image?.s3Key))

export const resolveUserImageUrl = (image?: UserImageResponse | null) => {
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

export const hasUserProfileImage = (image?: UserImageResponse | null) =>
  (typeof image?.id === 'number' && Number.isFinite(image.id)) ||
  hasImageSource(image)

export const sanitizeUserImageFileName = (fileName: string) =>
  fileName
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '-')

export const buildUserImageS3Key = (userId: number, fileName: string) => {
  const prefix = env.s3UserAllowedPrefix || 'users/'
  const normalizedPrefix = prefix.endsWith('/') ? prefix : `${prefix}/`
  const safeName = sanitizeUserImageFileName(fileName)
  const timestamp = Date.now()
  return `${normalizedPrefix}${userId}/profile-${timestamp}-${safeName}`
}

export const loadImageDimensions = (url: string) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve({ width: image.width, height: image.height })
    image.onerror = () => reject(new Error('invalid_image'))
    image.src = url
  })

export const formatImageSize = (size: number) =>
  `${(size / (1024 * 1024)).toFixed(2)} MB`

export const getDefaultUserProfileImageAltText = (
  username?: string | null,
) => {
  const normalizedUsername = username?.trim()
  if (normalizedUsername) {
    return `${normalizedUsername} profile picture`
  }

  return 'user profile picture'
}
