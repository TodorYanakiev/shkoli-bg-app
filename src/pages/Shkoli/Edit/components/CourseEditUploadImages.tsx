import type { TFunction } from 'i18next'
import type { ChangeEvent } from 'react'

import { COURSE_IMAGE_MAX_SIZE_MB } from '../../../../constants/courses'
import type { CourseImageRole } from '../../../../types/courses'
import type { PendingCourseImage } from '../types'
import { CourseEditGalleryUpload } from './CourseEditGalleryUpload'
import { CourseEditImageUploadCard } from './CourseEditImageUploadCard'

type CourseEditUploadImagesProps = {
  allowedImageTypesLabel: string
  mainImage: PendingCourseImage | null
  galleryImages: PendingCourseImage[]
  mainImageError: string | null
  galleryImageError: string | null
  onSingleImageSelect: (
    event: ChangeEvent<HTMLInputElement>,
    role: CourseImageRole,
  ) => void
  onGallerySelect: (event: ChangeEvent<HTMLInputElement>) => void
  onRemoveSingleImage: (role: CourseImageRole) => void
  onRemoveGalleryImage: (id: string) => void
  onUpdateMainAltText: (value: string) => void
  onUpdateGalleryAltText: (id: string, value: string) => void
  isSubmitting: boolean
  t: TFunction
}

export const CourseEditUploadImages = ({
  allowedImageTypesLabel,
  mainImage,
  galleryImages,
  mainImageError,
  galleryImageError,
  onSingleImageSelect,
  onGallerySelect,
  onRemoveSingleImage,
  onRemoveGalleryImage,
  onUpdateMainAltText,
  onUpdateGalleryAltText,
  isSubmitting,
  t,
}: CourseEditUploadImagesProps) => (
  <div className="mt-6">
    <p className="text-sm text-slate-600">
      {t('pages.shkoli.create.images.helper', {
        size: COURSE_IMAGE_MAX_SIZE_MB,
        formats: allowedImageTypesLabel,
      })}
    </p>
    <div className="grid gap-4 pt-2 md:grid-cols-2">
      <CourseEditImageUploadCard
        label={t('pages.shkoli.create.images.mainLabel')}
        role="MAIN"
        image={mainImage}
        error={mainImageError}
        isSubmitting={isSubmitting}
        onSelect={onSingleImageSelect}
        onRemove={onRemoveSingleImage}
        onAltTextChange={onUpdateMainAltText}
        t={t}
      />
    </div>
    <CourseEditGalleryUpload
      galleryImages={galleryImages}
      galleryImageError={galleryImageError}
      onGallerySelect={onGallerySelect}
      onRemoveGalleryImage={onRemoveGalleryImage}
      onUpdateGalleryAltText={onUpdateGalleryAltText}
      isSubmitting={isSubmitting}
      t={t}
    />
  </div>
)
