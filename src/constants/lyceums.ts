export const LYCEUM_TOWNS = [
  'БЛАГОЕВГРАД',
  'БУРГАС',
  'ВАРНА',
  'ВЕЛИКО ТЪРНОВО',
  'ВИДИН',
  'ВРАЦА',
  'ГАБРОВО',
  'ДОБРИЧ',
  'КЪРДЖАЛИ',
  'КЮСТЕНДИЛ',
  'ЛОВЕЧ',
  'МОНТАНА',
  'ПАЗАРДЖИК',
  'ПЕРНИК',
  'ПЛЕВЕН',
  'ПЛОВДИВ',
  'РАЗГРАД',
  'РУСЕ',
  'СИЛИСТРА',
  'СЛИВЕН',
  'СМОЛЯН',
  'СОФИЯ',
  'СТАРА ЗАГОРА',
  'ТЪРГОВИЩЕ',
  'ХАСКОВО',
  'ШУМЕН',
  'ЯМБОЛ',
] as const

export type LyceumTown = (typeof LYCEUM_TOWNS)[number]

export const PUBLIC_LYCEUM_TOWNS = [
  'БУРГАС',
  'ВАРНА',
  'ПЛОВДИВ',
  'СОФИЯ',
] as const

export type PublicLyceumTown = (typeof PUBLIC_LYCEUM_TOWNS)[number]

export const LYCEUM_IMAGE_ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const

export const LYCEUM_IMAGE_MAX_SIZE_MB = 5

export const LYCEUM_IMAGE_MAX_SIZE_BYTES =
  LYCEUM_IMAGE_MAX_SIZE_MB * 1024 * 1024
