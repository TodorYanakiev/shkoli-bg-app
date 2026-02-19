import type { TFunction } from 'i18next'

import type { CourseImageResponse } from '../../../../types/courses'
import { resolveCourseImageUrl } from '../../../../utils/courseImages'
import { getExistingImageKey } from '../services/courseEditImageUtils'

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

type CourseEditExistingImagesProps = {
  mainImages: CourseImageResponse[]
  existingGalleryImages: CourseImageResponse[]
  isImagesLoading: boolean
  imagesErrorMessage: string | null
  isDeletePending: boolean
  isSubmitting: boolean
  onDeleteExistingImage: (image: CourseImageResponse) => void
  t: TFunction
}

export const CourseEditExistingImages = ({
  mainImages,
  existingGalleryImages,
  isImagesLoading,
  imagesErrorMessage,
  isDeletePending,
  isSubmitting,
  onDeleteExistingImage,
  t,
}: CourseEditExistingImagesProps) => {
  if (isImagesLoading) {
    return (
      <p className="text-sm text-slate-600">
        {t('pages.shkoli.edit.images.loading')}
      </p>
    )
  }

  if (imagesErrorMessage) {
    return <p className="text-sm text-rose-600">{imagesErrorMessage}</p>
  }

  if (mainImages.length === 0 && existingGalleryImages.length === 0) {
    return (
      <p className="text-sm text-slate-600">
        {t('pages.shkoli.edit.images.empty')}
      </p>
    )
  }

  return (
    <div className="space-y-4">
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
