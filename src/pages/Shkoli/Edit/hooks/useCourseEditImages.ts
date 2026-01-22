import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { TFunction } from 'i18next'

import {
  COURSE_IMAGE_ALLOWED_MIME_TYPES,
  COURSE_IMAGE_MAX_SIZE_BYTES,
  COURSE_IMAGE_MAX_SIZE_MB,
} from '../../../../constants/courses'
import { uploadFileToS3 } from '../../../../services/s3'
import type {
  CourseImageResponse,
  CourseImageRole,
} from '../../../../types/courses'
import { courseImagesQueryKey } from '../../hooks/useCourseImages'
import { useDeleteCourseImageMutation } from '../../hooks/useDeleteCourseImageMutation'
import { useRegisterCourseImageMutation } from '../../hooks/useRegisterCourseImageMutation'
import { normalizeOptionalText } from '../services/courseEditFormUtils'
import {
  buildCourseImageS3Key,
  createImageId,
  loadImageDimensions,
} from '../services/courseEditImageUtils'
import {
  getCourseImageActionError,
  isApiError,
} from '../services/courseEditErrors'
import type {
  ImageDeleteResult,
  ImageUploadResult,
  PendingCourseImage,
} from '../types'

type UseCourseEditImagesOptions = {
  courseId: number
  isValidId: boolean
  t: TFunction
}

export const useCourseEditImages = ({
  courseId,
  isValidId,
  t,
}: UseCourseEditImagesOptions) => {
  const queryClient = useQueryClient()
  const registerImageMutation = useRegisterCourseImageMutation()
  const deleteImageMutation = useDeleteCourseImageMutation()

  const [logoImage, setLogoImage] = useState<PendingCourseImage | null>(
    null,
  )
  const [mainImage, setMainImage] = useState<PendingCourseImage | null>(
    null,
  )
  const [galleryImages, setGalleryImages] = useState<
    PendingCourseImage[]
  >([])
  const [logoImageError, setLogoImageError] = useState<string | null>(
    null,
  )
  const [mainImageError, setMainImageError] = useState<string | null>(
    null,
  )
  const [galleryImageError, setGalleryImageError] = useState<
    string | null
  >(null)
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  const imageStateRef = useRef({
    logoImage: null as PendingCourseImage | null,
    mainImage: null as PendingCourseImage | null,
    galleryImages: [] as PendingCourseImage[],
  })

  const allowedImageTypesLabel = useMemo(
    () =>
      COURSE_IMAGE_ALLOWED_MIME_TYPES.map((type) =>
        type.replace('image/', '').toUpperCase(),
      ).join(', '),
    [],
  )

  const validateImageFile = (file: File) => {
    if (
      !COURSE_IMAGE_ALLOWED_MIME_TYPES.includes(
        file.type as (typeof COURSE_IMAGE_ALLOWED_MIME_TYPES)[number],
      )
    ) {
      return t('validation.imageType', {
        formats: allowedImageTypesLabel,
      })
    }
    if (file.size > COURSE_IMAGE_MAX_SIZE_BYTES) {
      return t('validation.imageSize', {
        size: COURSE_IMAGE_MAX_SIZE_MB,
      })
    }
    return null
  }

  const createPendingImage = async (
    file: File,
    role: CourseImageRole,
  ): Promise<PendingCourseImage> => {
    const previewUrl = URL.createObjectURL(file)
    try {
      const { width, height } = await loadImageDimensions(previewUrl)
      return {
        id: createImageId(),
        role,
        file,
        previewUrl,
        altText: '',
        width,
        height,
        mimeType: file.type,
        status: 'idle',
        progress: 0,
      }
    } catch (error) {
      URL.revokeObjectURL(previewUrl)
      throw error
    }
  }

  const updateImageState = (
    id: string,
    updates: Partial<PendingCourseImage>,
  ) => {
    setLogoImage((prev) =>
      prev && prev.id === id ? { ...prev, ...updates } : prev,
    )
    setMainImage((prev) =>
      prev && prev.id === id ? { ...prev, ...updates } : prev,
    )
    setGalleryImages((prev) =>
      prev.map((image) =>
        image.id === id ? { ...image, ...updates } : image,
      ),
    )
  }

  const markImageError = (id: string, message: string) => {
    updateImageState(id, { status: 'error', error: message })
  }

  const clearImageState = (image: PendingCourseImage | null) => {
    if (!image) return
    URL.revokeObjectURL(image.previewUrl)
  }

  const handleSingleImageSelect = async (
    event: ChangeEvent<HTMLInputElement>,
    role: CourseImageRole,
  ) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const errorMessage = validateImageFile(file)
    if (errorMessage) {
      if (role === 'LOGO') {
        setLogoImageError(errorMessage)
      } else {
        setMainImageError(errorMessage)
      }
      return
    }

    try {
      const pendingImage = await createPendingImage(file, role)
      if (role === 'LOGO') {
        clearImageState(logoImage)
        setLogoImage(pendingImage)
        setLogoImageError(null)
      } else {
        clearImageState(mainImage)
        setMainImage(pendingImage)
        setMainImageError(null)
      }
    } catch {
      if (role === 'LOGO') {
        setLogoImageError(t('pages.shkoli.create.images.loadError'))
      } else {
        setMainImageError(t('pages.shkoli.create.images.loadError'))
      }
    }
  }

  const handleGallerySelect = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (files.length === 0) return

    const validFiles = files.filter((file) => {
      const errorMessage = validateImageFile(file)
      if (errorMessage) {
        setGalleryImageError(errorMessage)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    try {
      const pendingImages = await Promise.all(
        validFiles.map((file) => createPendingImage(file, 'GALLERY')),
      )
      setGalleryImages((prev) => [...prev, ...pendingImages])
      setGalleryImageError(null)
    } catch {
      setGalleryImageError(t('pages.shkoli.create.images.loadError'))
    }
  }

  const removeSingleImage = (role: CourseImageRole) => {
    if (role === 'LOGO') {
      clearImageState(logoImage)
      setLogoImage(null)
      setLogoImageError(null)
    } else {
      clearImageState(mainImage)
      setMainImage(null)
      setMainImageError(null)
    }
  }

  const removeGalleryImage = (id: string) => {
    setGalleryImages((prev) => {
      const target = prev.find((image) => image.id === id)
      if (target) {
        clearImageState(target)
      }
      return prev.filter((image) => image.id !== id)
    })
  }

  const updateLogoAltText = (value: string) => {
    setLogoImage((prev) => (prev ? { ...prev, altText: value } : prev))
  }

  const updateMainAltText = (value: string) => {
    setMainImage((prev) => (prev ? { ...prev, altText: value } : prev))
  }

  const updateGalleryAltText = (id: string, value: string) => {
    setGalleryImages((prev) =>
      prev.map((image) =>
        image.id === id ? { ...image, altText: value } : image,
      ),
    )
  }

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
      if (error.status === 409) {
        return t('errors.courses.imageDuplicate')
      }
      if (error.kind === 'network') {
        return t('errors.network')
      }
      if (error.kind === 'unauthorized' || error.kind === 'forbidden') {
        return t('errors.auth.forbidden')
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

  useEffect(() => {
    imageStateRef.current = {
      logoImage,
      mainImage,
      galleryImages,
    }
  }, [logoImage, mainImage, galleryImages])

  useEffect(() => {
    return () => {
      const current = imageStateRef.current
      if (current.logoImage) {
        URL.revokeObjectURL(current.logoImage.previewUrl)
      }
      if (current.mainImage) {
        URL.revokeObjectURL(current.mainImage.previewUrl)
      }
      current.galleryImages.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl)
      })
    }
  }, [])

  const imageActionError = getCourseImageActionError(
    deleteImageMutation.error ?? null,
  )

  return {
    logoImage,
    mainImage,
    galleryImages,
    logoImageError,
    mainImageError,
    galleryImageError,
    allowedImageTypesLabel,
    isUploadingImages,
    isDeletePending: deleteImageMutation.isPending,
    imageActionError,
    handleSingleImageSelect,
    handleGallerySelect,
    removeSingleImage,
    removeGalleryImage,
    updateLogoAltText,
    updateMainAltText,
    updateGalleryAltText,
    uploadCourseImages,
    deleteExistingImages,
    handleDeleteExistingImage,
    markImageError,
  }
}
