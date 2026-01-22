import type { TFunction } from 'i18next'
import type { ChangeEvent } from 'react'

import { COURSE_IMAGE_ALLOWED_MIME_TYPES } from '../../../../constants/courses'
import { courseCreateStyles } from './courseCreateStyles'
import { formatImageSize } from '../services/courseCreateImageUtils'
import type { PendingCourseImage } from '../types'

type CourseCreateGalleryUploadProps = {
  galleryImages: PendingCourseImage[]
  galleryImageError: string | null
  isSubmitting: boolean
  onGallerySelect: (event: ChangeEvent<HTMLInputElement>) => void
  onRemoveGalleryImage: (id: string) => void
  onUpdateGalleryAltText: (id: string, value: string) => void
  t: TFunction
}

export const CourseCreateGalleryUpload = ({
  galleryImages,
  galleryImageError,
  isSubmitting,
  onGallerySelect,
  onRemoveGalleryImage,
  onUpdateGalleryAltText,
  t,
}: CourseCreateGalleryUploadProps) => {
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
        <span className={courseCreateStyles.errorTextClassName}>
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
                      className={courseCreateStyles.inputClassName(false)}
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
