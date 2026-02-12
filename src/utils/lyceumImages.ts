import { env } from '../constants/env'
import type {
  LyceumImageResponse,
  LyceumImageRole,
} from '../types/lyceums'

const normalizeSource = (value?: string) => {
  if (typeof value !== 'string') return null
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : null
}

const hasImageSource = (image?: LyceumImageResponse) =>
  Boolean(normalizeSource(image?.url) || normalizeSource(image?.s3Key))

export const getLyceumImageByRole = (
  images: LyceumImageResponse[] | undefined,
  role: LyceumImageRole,
) => images?.find((image) => image.role === role && hasImageSource(image))

export const getPreferredLyceumImage = (
  images: LyceumImageResponse[] | undefined,
  role: LyceumImageRole,
) =>
  getLyceumImageByRole(images, role) ??
  images?.find((image) => hasImageSource(image))

export const resolveLyceumImageUrl = (image?: LyceumImageResponse | null) => {
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
