import type { TFunction } from 'i18next'
import type { ChangeEvent } from 'react'

import { COURSE_IMAGE_MAX_SIZE_MB } from '../../../../constants/courses'
import type { CourseImageRole } from '../../../../types/courses'
import { courseCreateStyles } from './courseCreateStyles'
import { CourseCreateGalleryUpload } from './CourseCreateGalleryUpload'
import { CourseCreateImageUploadCard } from './CourseCreateImageUploadCard'
import type { PendingCourseImage } from '../types'

type CourseCreateImagesSectionProps = {
  allowedImageTypesLabel: string
  mainImage: PendingCourseImage | null
  galleryImages: PendingCourseImage[]
  mainImageError: string | null
  galleryImageError: string | null
  isSubmitting: boolean
  onSingleImageSelect: (
    event: ChangeEvent<HTMLInputElement>,
    role: CourseImageRole,
  ) => void
  onGallerySelect: (event: ChangeEvent<HTMLInputElement>) => void
  onRemoveSingleImage: (role: CourseImageRole) => void
  onRemoveGalleryImage: (id: string) => void
  onUpdateMainAltText: (value: string) => void
  onUpdateGalleryAltText: (id: string, value: string) => void
  t: TFunction
}

export const CourseCreateImagesSection = ({
  allowedImageTypesLabel,
  mainImage,
  galleryImages,
  mainImageError,
  galleryImageError,
  isSubmitting,
  onSingleImageSelect,
  onGallerySelect,
  onRemoveSingleImage,
  onRemoveGalleryImage,
  onUpdateMainAltText,
  onUpdateGalleryAltText,
  t,
}: CourseCreateImagesSectionProps) => (
  <fieldset className={courseCreateStyles.fieldsetClassName}>
    <legend className={courseCreateStyles.legendClassName}>
      {t('pages.shkoli.create.form.sections.images')}
    </legend>
    <p className="text-sm text-slate-600">
      {t('pages.shkoli.create.images.helper', {
        size: COURSE_IMAGE_MAX_SIZE_MB,
        formats: allowedImageTypesLabel,
      })}
    </p>
    <div className="grid gap-4 pt-2 md:grid-cols-2">
      <CourseCreateImageUploadCard
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
    <CourseCreateGalleryUpload
      galleryImages={galleryImages}
      galleryImageError={galleryImageError}
      isSubmitting={isSubmitting}
      onGallerySelect={onGallerySelect}
      onRemoveGalleryImage={onRemoveGalleryImage}
      onUpdateGalleryAltText={onUpdateGalleryAltText}
      t={t}
    />
  </fieldset>
)
