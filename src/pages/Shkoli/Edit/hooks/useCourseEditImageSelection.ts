import type { ChangeEvent } from 'react'
import type { TFunction } from 'i18next'

import {
  COURSE_IMAGE_ALLOWED_MIME_TYPES,
  COURSE_IMAGE_MAX_SIZE_BYTES,
  COURSE_IMAGE_MAX_SIZE_MB,
} from '../../../../constants/courses'
import type { CourseImageRole } from '../../../../types/courses'
import {
  createImageId,
  loadImageDimensions,
} from '../services/courseEditImageUtils'
import type { PendingCourseImage } from '../types'

type UseCourseEditImageSelectionOptions = {
  t: TFunction
  allowedImageTypesLabel: string
  replaceLogoImage: (image: PendingCourseImage | null) => void
  replaceMainImage: (image: PendingCourseImage | null) => void
  addGalleryImages: (images: PendingCourseImage[]) => void
  setLogoImageError: (message: string | null) => void
  setMainImageError: (message: string | null) => void
  setGalleryImageError: (message: string | null) => void
}

const validateImageFile = (
  file: File,
  t: TFunction,
  allowedImageTypesLabel: string,
) => {
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

export const useCourseEditImageSelection = ({
  t,
  allowedImageTypesLabel,
  replaceLogoImage,
  replaceMainImage,
  addGalleryImages,
  setLogoImageError,
  setMainImageError,
  setGalleryImageError,
}: UseCourseEditImageSelectionOptions) => {
  const handleSingleImageSelect = async (
    event: ChangeEvent<HTMLInputElement>,
    role: CourseImageRole,
  ) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const errorMessage = validateImageFile(
      file,
      t,
      allowedImageTypesLabel,
    )
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
        replaceLogoImage(pendingImage)
        setLogoImageError(null)
      } else {
        replaceMainImage(pendingImage)
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
      const errorMessage = validateImageFile(
        file,
        t,
        allowedImageTypesLabel,
      )
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
      addGalleryImages(pendingImages)
      setGalleryImageError(null)
    } catch {
      setGalleryImageError(t('pages.shkoli.create.images.loadError'))
    }
  }

  return {
    handleSingleImageSelect,
    handleGallerySelect,
  }
}
