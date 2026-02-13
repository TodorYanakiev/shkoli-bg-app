const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
const s3AllowedPrefix =
  import.meta.env.VITE_S3_ALLOWED_PREFIX ?? 'courses/'
const s3LyceumAllowedPrefix =
  import.meta.env.VITE_S3_LYCEUM_ALLOWED_PREFIX ?? 'lyceums/'
const s3UserAllowedPrefix =
  import.meta.env.VITE_S3_USER_ALLOWED_PREFIX ?? 'users/'
const s3BucketName = import.meta.env.VITE_S3_BUCKET_NAME ?? ''
const s3PublicBaseUrl = import.meta.env.VITE_S3_PUBLIC_BASE_URL ?? ''
const awsRegion = import.meta.env.VITE_AWS_REGION ?? ''
const awsIdentityPoolId = import.meta.env.VITE_AWS_IDENTITY_POOL_ID ?? ''
const sentryDsn = import.meta.env.VITE_SENTRY_DSN ?? ''
const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID ?? ''
const hotjarSiteId = import.meta.env.VITE_HOTJAR_SITE_ID ?? ''
const parsedHotjarVersion = Number.parseInt(
  import.meta.env.VITE_HOTJAR_VERSION ?? '',
  10,
)
const hotjarVersion =
  Number.isFinite(parsedHotjarVersion) && parsedHotjarVersion > 0
    ? parsedHotjarVersion
    : 6
const appEnvironment = import.meta.env.MODE

export const env = {
  apiBaseUrl,
  s3AllowedPrefix,
  s3LyceumAllowedPrefix,
  s3UserAllowedPrefix,
  s3BucketName,
  s3PublicBaseUrl,
  awsRegion,
  awsIdentityPoolId,
  sentryDsn,
  gaMeasurementId,
  hotjarSiteId,
  hotjarVersion,
  appEnvironment,
}
