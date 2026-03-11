import { env } from '../constants/env'

type UploadFileToS3Params = {
  file: File
  key: string
  onProgress?: (progress: number) => void
}

const getS3Client = async () => {
  if (!env.awsRegion || !env.awsIdentityPoolId) {
    throw new Error('s3_config_missing')
  }

  const { CognitoIdentityClient } = await import(
    '@aws-sdk/client-cognito-identity'
  )
  const { fromCognitoIdentityPool } = await import(
    '@aws-sdk/credential-provider-cognito-identity'
  )
  const { S3Client } = await import('@aws-sdk/client-s3')

  const identityClient = new CognitoIdentityClient({
    region: env.awsRegion,
  })
  const credentials = fromCognitoIdentityPool({
    client: identityClient,
    identityPoolId: env.awsIdentityPoolId,
  })

  return new S3Client({
    region: env.awsRegion,
    credentials,
  })
}

const S3_UPLOAD_CACHE_CONTROL = 'public, max-age=31536000, immutable'

export const uploadFileToS3 = async ({
  file,
  key,
  onProgress,
}: UploadFileToS3Params) => {
  if (!env.s3BucketName) {
    throw new Error('s3_bucket_missing')
  }

  const client = await getS3Client()
  const { Upload } = await import('@aws-sdk/lib-storage')
  const uploader = new Upload({
    client,
    params: {
      Bucket: env.s3BucketName,
      Key: key,
      Body: file,
      ContentType: file.type,
      CacheControl: S3_UPLOAD_CACHE_CONTROL,
    },
  })

  if (onProgress) {
    uploader.on('httpUploadProgress', (event) => {
      const total = event.total ?? 0
      const loaded = event.loaded ?? 0
      if (!total) return
      const percent = Math.round((loaded / total) * 100)
      onProgress(Math.min(100, Math.max(0, percent)))
    })
  }

  await uploader.done()
}
