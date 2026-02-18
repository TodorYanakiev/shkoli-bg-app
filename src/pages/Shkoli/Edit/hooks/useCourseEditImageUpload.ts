import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { TFunction } from 'i18next'

import { uploadFileToS3 } from '../../../../services/s3'
import type { CourseImageResponse, CourseImageRole } from '../../../../types/courses'
import { courseImagesQueryKey } from '../../hooks/useCourseImages'
import { useDeleteCourseImageMutation } from '../../hooks/useDeleteCourseImageMutation'
import { useRegisterCourseImageMutation } from '../../hooks/useRegisterCourseImageMutation'
import { normalizeOptionalText } from '../services/courseEditFormUtils'
import { buildCourseImageS3Key } from '../services/courseEditImageUtils'
import { getCourseImageActionError, isApiError } from '../services/courseEditErrors'
import type { ImageDeleteResult, ImageUploadResult, PendingCourseImage } from '../types'

type UseCourseEditImageUploadOptions = {
  courseId: number
  isValidId: boolean
  t: TFunction
  logoImage: PendingCourseImage | null
  mainImage: PendingCourseImage | null
  galleryImages: PendingCourseImage[]
  updateImageState: (
    id: string,
    updates: Partial<PendingCourseImage>,
  ) => void
}

export const useCourseEditImageUpload = ({
  courseId,
  isValidId,
  t,
  logoImage,
  mainImage,
  galleryImages,
  updateImageState,
}: UseCourseEditImageUploadOptions) => {
  const queryClient = useQueryClient()
  const registerImageMutation = useRegisterCourseImageMutation()
  const deleteImageMutation = useDeleteCourseImageMutation()
  const [isUploadingImages, setIsUploadingImages] = useState(false)

  const getImageUploadErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
      if (
        error.message === 's3_config_missing' ||
        error.message === 's3_bucket_missing'
      ) {
        return t('errors.courses.imageConfigMissing')
      }
    }

    if (isApiError(error)) {
      if (error.status === 400) {
        return t('errors.courses.imageInvalid')
      }
      if (error.status === 404) {
        return t('errors.courses.imageCourseNotFound')
      }
      if (error.status === 409) {
        return t('errors.courses.imageDuplicate')
      }
      if (error.kind === 'network') {
        return t('errors.network')
      }
      if (error.kind === 'unauthorized' || error.kind === 'forbidden') {
        return t('errors.auth.forbidden')
      }
      if (error.status >= 500) {
        return t('errors.courses.imageUploadFailed')
      }
    }

    return t('errors.courses.imageUploadFailed')
  }

  const uploadCourseImages = async (
    selectedCourseId: number,
    options: { skipRoles?: Set<CourseImageRole> } = {},
  ): Promise<ImageUploadResult> => {
    const { skipRoles } = options
    const images: PendingCourseImage[] = [
      ...(logoImage ? [logoImage] : []),
      ...(mainImage ? [mainImage] : []),
      ...galleryImages,
    ].filter((image) => !skipRoles || !skipRoles.has(image.role))

    if (images.length === 0) {
      return { uploadedCount: 0, failedCount: 0 }
    }

    setIsUploadingImages(true)
    let uploadedCount = 0
    let failedCount = 0

    try {
      for (const image of images) {
        updateImageState(image.id, {
          status: 'uploading',
          progress: 0,
          error: undefined,
        })

        try {
          const orderIndex =
            image.role === 'GALLERY'
              ? galleryImages.findIndex((item) => item.id === image.id)
              : undefined
          const s3Key = buildCourseImageS3Key(
            selectedCourseId,
            image.role,
            image.file.name,
            orderIndex,
          )
          await uploadFileToS3({
            file: image.file,
            key: s3Key,
            onProgress: (progress) =>
              updateImageState(image.id, { progress }),
          })

          await registerImageMutation.mutateAsync({
            courseId: selectedCourseId,
            data: {
              s3Key,
              role: image.role,
              altText: normalizeOptionalText(image.altText),
              width: image.width,
              height: image.height,
              mimeType: image.mimeType,
              orderIndex:
                image.role === 'GALLERY' && orderIndex != null
                  ? orderIndex
                  : undefined,
            },
          })

          updateImageState(image.id, {
            status: 'uploaded',
            progress: 100,
          })
          uploadedCount += 1
        } catch (error) {
          updateImageState(image.id, {
            status: 'error',
            error: getImageUploadErrorMessage(error),
          })
          failedCount += 1
        }
      }
    } finally {
      setIsUploadingImages(false)
    }

    return { uploadedCount, failedCount }
  }

  const getDeleteErrorMessage = (error: unknown) => {
    if (isApiError(error)) {
      return (
        getCourseImageActionError(error)?.messageKey ?? 'errors.generic'
      )
    }
    return 'errors.generic'
  }

  const deleteExistingImages = async (
    selectedCourseId: number,
    imagesToDelete: CourseImageResponse[],
  ): Promise<ImageDeleteResult> => {
    const deletable = imagesToDelete.filter(
      (image): image is CourseImageResponse & { id: number } =>
        typeof image.id === 'number',
    )

    if (deletable.length === 0) {
      return { ok: true, deleted: 0 }
    }

    for (const image of deletable) {
      try {
        await deleteImageMutation.mutateAsync({
          courseId: selectedCourseId,
          imageId: image.id,
        })
      } catch (error) {
        const messageKey = getDeleteErrorMessage(error)
        return {
          ok: false,
          deleted: 0,
          errorMessage: t(messageKey),
        }
      }
    }

    return { ok: true, deleted: deletable.length }
  }

  const handleDeleteExistingImage = (image: CourseImageResponse) => {
    if (!image.id || !isValidId) return
    deleteImageMutation.mutate(
      { courseId, imageId: image.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: courseImagesQueryKey(courseId),
          })
        },
      },
    )
  }

  const imageActionError = getCourseImageActionError(
    deleteImageMutation.error ?? null,
  )

  return {
    uploadCourseImages,
    deleteExistingImages,
    handleDeleteExistingImage,
    isUploadingImages,
    isDeletePending: deleteImageMutation.isPending,
    imageActionError,
  }
}
