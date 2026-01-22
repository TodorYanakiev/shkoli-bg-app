import type { TFunction } from 'i18next'
import type { ChangeEvent } from 'react'

import {
  COURSE_IMAGE_ALLOWED_MIME_TYPES,
  COURSE_IMAGE_MAX_SIZE_MB,
} from '../../../../constants/courses'
import type {
  CourseImageResponse,
  CourseImageRole,
} from '../../../../types/courses'
import { resolveCourseImageUrl } from '../../../../utils/courseImages'
import { courseEditStyles } from './courseEditStyles'
import {
  formatImageSize,
  getExistingImageKey,
} from '../services/courseEditImageUtils'
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

type ExistingImageGroupProps = {
  title: string
  images: CourseImageResponse[]
  emptyLabel: string
  imageClassName: string
  listClassName: string
  showMimeType: boolean
  showOrderIndex: boolean
  isDeletePending: boolean
  isSubmitting: boolean
  onDeleteExistingImage: (image: CourseImageResponse) => void
  t: TFunction
}

const ExistingImageGroup = ({
  title,
  images,
  emptyLabel,
  imageClassName,
  listClassName,
  showMimeType,
  showOrderIndex,
  isDeletePending,
  isSubmitting,
  onDeleteExistingImage,
  t,
}: ExistingImageGroupProps) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
      {title}
    </p>
    {images.length > 0 ? (
      <div className={listClassName}>
        {images.map((image, index) => {
          const imageUrl = resolveCourseImageUrl(image)
          const altText =
            image.altText ?? t('pages.shkoli.edit.images.altFallback')
          return (
            <div
              key={getExistingImageKey(image, index)}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3"
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={altText}
                  className={`${imageClassName} rounded-xl border border-slate-200 object-cover`}
                  loading="lazy"
                />
              ) : (
                <div
                  className={`${imageClassName} flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-[10px] text-slate-500`}
                >
                  {t('pages.shkoli.edit.images.unavailable')}
                </div>
              )}
              <div className="text-xs text-slate-600">
                <p className="font-semibold text-slate-800">{altText}</p>
                {showMimeType && image.mimeType ? (
                  <p>{image.mimeType}</p>
                ) : null}
                {showOrderIndex && typeof image.orderIndex === 'number' ? (
                  <p>
                    {t('pages.shkoli.edit.images.order', {
                      index: image.orderIndex + 1,
                    })}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => onDeleteExistingImage(image)}
                disabled={isDeletePending || isSubmitting}
                className="ml-auto text-xs font-semibold text-rose-600 transition hover:text-rose-700 disabled:cursor-not-allowed disabled:text-rose-300"
              >
                {t('pages.shkoli.create.images.remove')}
              </button>
            </div>
          )
        })}
      </div>
    ) : (
      <p className="mt-2 text-sm text-slate-600">{emptyLabel}</p>
    )}
  </div>
)

type ExistingImagesProps = Pick<
  CourseEditImagesSectionProps,
  | 'courseImages'
  | 'logoImages'
  | 'mainImages'
  | 'existingGalleryImages'
  | 'isImagesLoading'
  | 'imagesErrorMessage'
  | 'isDeletePending'
  | 'isSubmitting'
  | 'onDeleteExistingImage'
  | 't'
>

const ExistingImages = ({
  courseImages,
  logoImages,
  mainImages,
  existingGalleryImages,
  isImagesLoading,
  imagesErrorMessage,
  isDeletePending,
  isSubmitting,
  onDeleteExistingImage,
  t,
}: ExistingImagesProps) => {
  if (isImagesLoading) {
    return (
      <p className="text-sm text-slate-600">
        {t('pages.shkoli.edit.images.loading')}
      </p>
    )
  }

  if (imagesErrorMessage) {
    return (
      <p className="text-sm text-rose-600">{imagesErrorMessage}</p>
    )
  }

  if (courseImages.length === 0) {
    return (
      <p className="text-sm text-slate-600">
        {t('pages.shkoli.edit.images.empty')}
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <ExistingImageGroup
        title={t('pages.shkoli.edit.images.currentLogo')}
        images={logoImages}
        emptyLabel={t('pages.shkoli.edit.images.none')}
        imageClassName="h-16 w-16"
        listClassName="mt-2 flex flex-wrap gap-3"
        showMimeType
        showOrderIndex={false}
        isDeletePending={isDeletePending}
        isSubmitting={isSubmitting}
        onDeleteExistingImage={onDeleteExistingImage}
        t={t}
      />
      <ExistingImageGroup
        title={t('pages.shkoli.edit.images.currentMain')}
        images={mainImages}
        emptyLabel={t('pages.shkoli.edit.images.none')}
        imageClassName="h-16 w-24"
        listClassName="mt-2 flex flex-wrap gap-3"
        showMimeType
        showOrderIndex={false}
        isDeletePending={isDeletePending}
        isSubmitting={isSubmitting}
        onDeleteExistingImage={onDeleteExistingImage}
        t={t}
      />
      <ExistingImageGroup
        title={t('pages.shkoli.edit.images.currentGallery')}
        images={existingGalleryImages}
        emptyLabel={t('pages.shkoli.edit.images.none')}
        imageClassName="h-16 w-16"
        listClassName="mt-2 grid gap-3 sm:grid-cols-2"
        showMimeType={false}
        showOrderIndex
        isDeletePending={isDeletePending}
        isSubmitting={isSubmitting}
        onDeleteExistingImage={onDeleteExistingImage}
        t={t}
      />
    </div>
  )
}

type ImageUploadCardProps = {
  label: string
  role: CourseImageRole
  image: PendingCourseImage | null
  error: string | null
  isSubmitting: boolean
  onSelect: (
    event: ChangeEvent<HTMLInputElement>,
    role: CourseImageRole,
  ) => void
  onRemove: (role: CourseImageRole) => void
  onAltTextChange: (value: string) => void
  t: TFunction
}

const ImageUploadCard = ({
  label,
  role,
  image,
  error,
  isSubmitting,
  onSelect,
  onRemove,
  onAltTextChange,
  t,
}: ImageUploadCardProps) => {
  const statusLabel = (pendingImage: PendingCourseImage) => {
    if (pendingImage.status === 'uploading') {
      return t('pages.shkoli.create.images.progress', {
        progress: pendingImage.progress,
      })
    }
    if (pendingImage.status === 'uploaded') {
      return t('pages.shkoli.create.images.uploaded')
    }
    if (pendingImage.status === 'error') {
      return pendingImage.error ?? t('pages.shkoli.create.images.error')
    }
    return t('pages.shkoli.create.images.pending')
  }

  const statusClassName = (pendingImage: PendingCourseImage) => {
    if (pendingImage.status === 'error') return 'text-rose-600'
    if (pendingImage.status === 'uploaded') return 'text-emerald-600'
    return 'text-slate-500'
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        {image ? (
          <button
            type="button"
            onClick={() => onRemove(role)}
            disabled={isSubmitting}
            className="text-xs font-semibold text-rose-600 transition hover:text-rose-700 disabled:cursor-not-allowed disabled:text-rose-300"
          >
            {t('pages.shkoli.create.images.remove')}
          </button>
        ) : null}
      </div>
      <input
        type="file"
        accept={COURSE_IMAGE_ALLOWED_MIME_TYPES.join(',')}
        onChange={(event) => onSelect(event, role)}
        disabled={isSubmitting}
        className="mt-3 w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
      />
      {error ? (
        <span className={courseEditStyles.errorTextClassName}>{error}</span>
      ) : null}
      {image ? (
        <div className="mt-4 flex gap-3">
          <img
            src={image.previewUrl}
            alt={t('pages.shkoli.create.images.previewAlt')}
            className="h-20 w-20 rounded-xl border border-slate-200 object-cover"
          />
          <div className="flex-1 space-y-2">
            <label className="text-xs font-medium text-slate-600">
              {t('pages.shkoli.create.images.altTextLabel')}
              <input
                type="text"
                value={image.altText}
                onChange={(event) => onAltTextChange(event.target.value)}
                disabled={isSubmitting}
                className={courseEditStyles.inputClassName(false)}
                placeholder={t(
                  'pages.shkoli.create.images.altTextPlaceholder',
                )}
              />
            </label>
            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
              {image.width && image.height ? (
                <span>
                  {image.width}x{image.height}px
                </span>
              ) : null}
              <span>{formatImageSize(image.file.size)}</span>
              <span>{image.mimeType || image.file.type}</span>
            </div>
            <p
              className={`text-xs font-medium ${statusClassName(image)}`}
            >
              {statusLabel(image)}
            </p>
            {image.status === 'uploading' ? (
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-brand transition-all"
                  style={{
                    width: `${image.progress}%`,
                  }}
                />
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <p className="mt-2 text-xs text-slate-500">
          {t('pages.shkoli.create.images.empty')}
        </p>
      )}
    </div>
  )
}

type GalleryUploadProps = Pick<
  CourseEditImagesSectionProps,
  | 'galleryImages'
  | 'galleryImageError'
  | 'onGallerySelect'
  | 'onRemoveGalleryImage'
  | 'onUpdateGalleryAltText'
  | 'isSubmitting'
  | 't'
>

const GalleryUpload = ({
  galleryImages,
  galleryImageError,
  onGallerySelect,
  onRemoveGalleryImage,
  onUpdateGalleryAltText,
  isSubmitting,
  t,
}: GalleryUploadProps) => {
  const statusLabel = (pendingImage: PendingCourseImage) => {
    if (pendingImage.status === 'uploading') {
      return t('pages.shkoli.create.images.progress', {
        progress: pendingImage.progress,
      })
    }
    if (pendingImage.status === 'uploaded') {
      return t('pages.shkoli.create.images.uploaded')
    }
    if (pendingImage.status === 'error') {
      return pendingImage.error ?? t('pages.shkoli.create.images.error')
    }
    return t('pages.shkoli.create.images.pending')
  }

  const statusClassName = (pendingImage: PendingCourseImage) => {
    if (pendingImage.status === 'error') return 'text-rose-600'
    if (pendingImage.status === 'uploaded') return 'text-emerald-600'
    return 'text-slate-500'
  }

  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-700">
            {t('pages.shkoli.create.images.galleryLabel')}
          </p>
          <p className="text-xs text-slate-500">
            {t('pages.shkoli.create.images.galleryHint')}
          </p>
        </div>
        <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900">
          {t('pages.shkoli.create.images.addGallery')}
          <input
            type="file"
            accept={COURSE_IMAGE_ALLOWED_MIME_TYPES.join(',')}
            multiple
            onChange={onGallerySelect}
            disabled={isSubmitting}
            className="sr-only"
          />
        </label>
      </div>
      {galleryImageError ? (
        <span className={courseEditStyles.errorTextClassName}>
          {galleryImageError}
        </span>
      ) : null}
      {galleryImages.length === 0 ? (
        <p className="mt-3 text-xs text-slate-500">
          {t('pages.shkoli.create.images.galleryEmpty')}
        </p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              className="rounded-xl border border-slate-200 p-3"
            >
              <div className="flex items-start gap-3">
                <img
                  src={image.previewUrl}
                  alt={t('pages.shkoli.create.images.previewAlt')}
                  className="h-16 w-16 rounded-lg border border-slate-200 object-cover"
                />
                <div className="flex-1 space-y-2">
                  <p className="text-xs font-semibold text-slate-600">
                    {t('pages.shkoli.create.images.galleryItem', {
                      index: index + 1,
                    })}
                  </p>
                  <label className="text-xs font-medium text-slate-600">
                    {t('pages.shkoli.create.images.altTextLabel')}
                    <input
                      type="text"
                      value={image.altText}
                      onChange={(event) =>
                        onUpdateGalleryAltText(
                          image.id,
                          event.target.value,
                        )
                      }
                      disabled={isSubmitting}
                      className={courseEditStyles.inputClassName(false)}
                      placeholder={t(
                        'pages.shkoli.create.images.altTextPlaceholder',
                      )}
                    />
                  </label>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                    {image.width && image.height ? (
                      <span>
                        {image.width}x{image.height}px
                      </span>
                    ) : null}
                    <span>{formatImageSize(image.file.size)}</span>
                    <span>{image.mimeType || image.file.type}</span>
                  </div>
                  <p
                    className={`text-xs font-medium ${statusClassName(image)}`}
                  >
                    {statusLabel(image)}
                  </p>
                  {image.status === 'uploading' ? (
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-brand transition-all"
                        style={{
                          width: `${image.progress}%`,
                        }}
                      />
                    </div>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveGalleryImage(image.id)}
                  disabled={isSubmitting}
                  className="text-xs font-semibold text-rose-600 transition hover:text-rose-700 disabled:cursor-not-allowed disabled:text-rose-300"
                >
                  {t('pages.shkoli.create.images.remove')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

type UploadImagesProps = Pick<
  CourseEditImagesSectionProps,
  | 'allowedImageTypesLabel'
  | 'logoImage'
  | 'mainImage'
  | 'galleryImages'
  | 'logoImageError'
  | 'mainImageError'
  | 'galleryImageError'
  | 'onSingleImageSelect'
  | 'onGallerySelect'
  | 'onRemoveSingleImage'
  | 'onRemoveGalleryImage'
  | 'onUpdateLogoAltText'
  | 'onUpdateMainAltText'
  | 'onUpdateGalleryAltText'
  | 'isSubmitting'
  | 't'
>

const UploadImages = ({
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
  isSubmitting,
  t,
}: UploadImagesProps) => (
  <div className="mt-6">
    <p className="text-sm text-slate-600">
      {t('pages.shkoli.create.images.helper', {
        size: COURSE_IMAGE_MAX_SIZE_MB,
        formats: allowedImageTypesLabel,
      })}
    </p>
    <div className="grid gap-4 pt-2 md:grid-cols-2">
      <ImageUploadCard
        label={t('pages.shkoli.create.images.logoLabel')}
        role="LOGO"
        image={logoImage}
        error={logoImageError}
        isSubmitting={isSubmitting}
        onSelect={onSingleImageSelect}
        onRemove={onRemoveSingleImage}
        onAltTextChange={onUpdateLogoAltText}
        t={t}
      />
      <ImageUploadCard
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
    <GalleryUpload
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
  <ExistingImages
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
  <UploadImages
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
