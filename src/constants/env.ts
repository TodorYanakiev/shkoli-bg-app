const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? ''
const s3AllowedPrefix =
  import.meta.env.VITE_S3_ALLOWED_PREFIX ?? 'courses/'
const s3BucketName = import.meta.env.VITE_S3_BUCKET_NAME ?? ''
const s3PublicBaseUrl = import.meta.env.VITE_S3_PUBLIC_BASE_URL ?? ''
const awsRegion = import.meta.env.VITE_AWS_REGION ?? ''
const awsIdentityPoolId = import.meta.env.VITE_AWS_IDENTITY_POOL_ID ?? ''

export const env = {
  apiBaseUrl,
  s3AllowedPrefix,
  s3BucketName,
  s3PublicBaseUrl,
  awsRegion,
  awsIdentityPoolId,
}
