import { useMemo } from 'react'
import type { TFunction } from 'i18next'

import { COURSE_IMAGE_ALLOWED_MIME_TYPES } from '../../../../constants/courses'
import { useCourseEditImageSelection } from './useCourseEditImageSelection'
import { useCourseEditImageState } from './useCourseEditImageState'
import { useCourseEditImageUpload } from './useCourseEditImageUpload'

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
  const imageState = useCourseEditImageState()
  const allowedImageTypesLabel = useMemo(
    () =>
      COURSE_IMAGE_ALLOWED_MIME_TYPES.map((type) =>
        type.replace('image/', '').toUpperCase(),
      ).join(', '),
    [],
  )
  const { handleSingleImageSelect, handleGallerySelect } =
    useCourseEditImageSelection({
      t,
      allowedImageTypesLabel,
      replaceMainImage: imageState.replaceMainImage,
      addGalleryImages: imageState.addGalleryImages,
      setMainImageError: imageState.setMainImageError,
      setGalleryImageError: imageState.setGalleryImageError,
    })
  const {
    uploadCourseImages,
    deleteExistingImages,
    handleDeleteExistingImage,
    isUploadingImages,
    isDeletePending,
    imageActionError,
  } = useCourseEditImageUpload({
    courseId,
    isValidId,
    t,
    mainImage: imageState.mainImage,
    galleryImages: imageState.galleryImages,
    updateImageState: imageState.updateImageState,
  })

  return {
    mainImage: imageState.mainImage,
    galleryImages: imageState.galleryImages,
    mainImageError: imageState.mainImageError,
    galleryImageError: imageState.galleryImageError,
    allowedImageTypesLabel,
    isUploadingImages,
    isDeletePending,
    imageActionError,
    handleSingleImageSelect,
    handleGallerySelect,
    removeSingleImage: imageState.removeSingleImage,
    removeGalleryImage: imageState.removeGalleryImage,
    updateMainAltText: imageState.updateMainAltText,
    updateGalleryAltText: imageState.updateGalleryAltText,
    uploadCourseImages,
    deleteExistingImages,
    handleDeleteExistingImage,
    markImageError: imageState.markImageError,
  }
}
