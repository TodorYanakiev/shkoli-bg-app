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
      replaceLogoImage: imageState.replaceLogoImage,
      replaceMainImage: imageState.replaceMainImage,
      addGalleryImages: imageState.addGalleryImages,
      setLogoImageError: imageState.setLogoImageError,
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
    logoImage: imageState.logoImage,
    mainImage: imageState.mainImage,
    galleryImages: imageState.galleryImages,
    updateImageState: imageState.updateImageState,
  })

  return {
    logoImage: imageState.logoImage,
    mainImage: imageState.mainImage,
    galleryImages: imageState.galleryImages,
    logoImageError: imageState.logoImageError,
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
    updateLogoAltText: imageState.updateLogoAltText,
    updateMainAltText: imageState.updateMainAltText,
    updateGalleryAltText: imageState.updateGalleryAltText,
    uploadCourseImages,
    deleteExistingImages,
    handleDeleteExistingImage,
    markImageError: imageState.markImageError,
  }
}
