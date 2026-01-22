import type { TFunction } from 'i18next'
import type { ChangeEvent } from 'react'

import type {
  CourseImageResponse,
  CourseImageRole,
} from '../../../../types/courses'
import { courseEditStyles } from './courseEditStyles'
import { CourseEditExistingImages } from './CourseEditExistingImages'
import { CourseEditUploadImages } from './CourseEditUploadImages'
import type { PendingCourseImage } from '../types'

type CourseEditImagesSectionProps = {
  courseImages: CourseImageResponse[]
  logoImages: CourseImageResponse[]
  mainImages: CourseImageResponse[]
  existingGalleryImages: CourseImageResponse[]
  isImagesLoading: boolean
  imagesErrorMessage: string | null
  imageActionErrorMessage: string | null
  isDeletePending: boolean
  isSubmitting: boolean
  onDeleteExistingImage: (image: CourseImageResponse) => void
  allowedImageTypesLabel: string
  logoImage: PendingCourseImage | null
  mainImage: PendingCourseImage | null
  galleryImages: PendingCourseImage[]
  logoImageError: string | null
  mainImageError: string | null
  galleryImageError: string | null
  onSingleImageSelect: (
    event: ChangeEvent<HTMLInputElement>,
    role: CourseImageRole,
  ) => void
  onGallerySelect: (event: ChangeEvent<HTMLInputElement>) => void
  onRemoveSingleImage: (role: CourseImageRole) => void
  onRemoveGalleryImage: (id: string) => void
  onUpdateLogoAltText: (value: string) => void
  onUpdateMainAltText: (value: string) => void
  onUpdateGalleryAltText: (id: string, value: string) => void
  t: TFunction
}

export const CourseEditImagesSection = ({
  courseImages,
  logoImages,
  mainImages,
  existingGalleryImages,
  isImagesLoading,
  imagesErrorMessage,
  imageActionErrorMessage,
  isDeletePending,
  isSubmitting,
  onDeleteExistingImage,
  allowedImageTypesLabel,
  logoImage,
  mainImage,
  galleryImages,
  logoImageError,
  mainImageError,
  galleryImageError,
  onSingleImageSelect,
  onGallerySelect,
  onRemoveSingleImage,
  onRemoveGalleryImage,
  onUpdateLogoAltText,
  onUpdateMainAltText,
  onUpdateGalleryAltText,
  t,
}: CourseEditImagesSectionProps) => (
  <fieldset className={courseEditStyles.fieldsetClassName}>
    <legend className={courseEditStyles.legendClassName}>
      {t('pages.shkoli.edit.images.title')}
    </legend>
    <CourseEditExistingImages
      courseImages={courseImages}
      logoImages={logoImages}
      mainImages={mainImages}
      existingGalleryImages={existingGalleryImages}
      isImagesLoading={isImagesLoading}
      imagesErrorMessage={imagesErrorMessage}
      isDeletePending={isDeletePending}
      isSubmitting={isSubmitting}
      onDeleteExistingImage={onDeleteExistingImage}
      t={t}
    />
    {imageActionErrorMessage ? (
      <p className="mt-3 text-sm text-rose-600">
        {imageActionErrorMessage}
      </p>
    ) : null}
    <CourseEditUploadImages
      allowedImageTypesLabel={allowedImageTypesLabel}
      logoImage={logoImage}
      mainImage={mainImage}
      galleryImages={galleryImages}
      logoImageError={logoImageError}
      mainImageError={mainImageError}
      galleryImageError={galleryImageError}
      onSingleImageSelect={onSingleImageSelect}
      onGallerySelect={onGallerySelect}
      onRemoveSingleImage={onRemoveSingleImage}
      onRemoveGalleryImage={onRemoveGalleryImage}
      onUpdateLogoAltText={onUpdateLogoAltText}
      onUpdateMainAltText={onUpdateMainAltText}
      onUpdateGalleryAltText={onUpdateGalleryAltText}
      isSubmitting={isSubmitting}
      t={t}
    />
  </fieldset>
)
