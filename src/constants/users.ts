export const USER_IMAGE_ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const

export const USER_IMAGE_MAX_SIZE_MB = 5

export const USER_IMAGE_MAX_SIZE_BYTES = USER_IMAGE_MAX_SIZE_MB * 1024 * 1024
