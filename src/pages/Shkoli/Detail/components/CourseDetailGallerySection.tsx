import type { TFunction } from 'i18next'

import courseMainPlaceholder from '../../../../assets/course-main-placeholder.svg'
import type { CourseImageResponse } from '../../../../types/courses'
import { resolveCourseImageUrl } from '../../../../utils/courseImages'

type CourseDetailGallerySectionProps = {
  galleryImages: CourseImageResponse[]
  courseName: string
  t: TFunction
}

export const CourseDetailGallerySection = ({
  galleryImages,
  courseName,
  t,
}: CourseDetailGallerySectionProps) => (
  <div
    id="course-gallery"
    className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
  >
    <h3 className="text-sm font-semibold text-slate-900">
      {t('pages.shkoli.detail.sections.gallery')}
    </h3>
    {galleryImages.length > 0 ? (
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {galleryImages.map((image, index) => {
          const imageUrl =
            resolveCourseImageUrl(image) ?? courseMainPlaceholder
          return (
            <div
              key={image.id ?? `${imageUrl}-${index}`}
              className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/70"
            >
              <img
                src={imageUrl}
                alt={
                  image.altText ??
                  t('pages.shkoli.detail.images.galleryAlt', {
                    name: courseName,
                    index: index + 1,
                  })
                }
                className="h-40 w-full object-cover"
                loading="lazy"
                onError={(event) => {
                  const target = event.currentTarget
                  target.onerror = null
                  target.src = courseMainPlaceholder
                }}
              />
            </div>
          )
        })}
      </div>
    ) : (
      <p className="mt-3 text-sm text-slate-600">
        {t('pages.shkoli.detail.galleryEmpty')}
      </p>
    )}
  </div>
)
