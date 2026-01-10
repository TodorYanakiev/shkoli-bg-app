import { S3Client } from '@aws-sdk/client-s3'
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity'
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity'
import { Upload } from '@aws-sdk/lib-storage'

import { env } from '../constants/env'

type UploadFileToS3Params = {
  file: File
  key: string
  onProgress?: (progress: number) => void
}

const getS3Client = () => {
  if (!env.awsRegion || !env.awsIdentityPoolId) {
    throw new Error('s3_config_missing')
  }

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

export const uploadFileToS3 = async ({
  file,
  key,
  onProgress,
}: UploadFileToS3Params) => {
  if (!env.s3BucketName) {
    throw new Error('s3_bucket_missing')
  }

  const client = getS3Client()
  const uploader = new Upload({
    client,
    params: {
      Bucket: env.s3BucketName,
      Key: key,
      Body: file,
      ContentType: file.type,
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
