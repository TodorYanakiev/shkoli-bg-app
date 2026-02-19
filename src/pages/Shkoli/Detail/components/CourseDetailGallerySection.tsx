import { useEffect, useMemo, useState } from 'react'
import type { TFunction } from 'i18next'

import courseMainPlaceholder from '../../../../assets/course-main-placeholder.svg'
import type { CourseImageResponse } from '../../../../types/courses'
import { resolveCourseImageUrl } from '../../../../utils/courseImages'

type CourseDetailGallerySectionProps = {
  galleryImages: CourseImageResponse[]
  courseName: string
  t: TFunction
}

type GalleryItem = {
  key: string
  src: string
  alt: string
}

export const CourseDetailGallerySection = ({
  galleryImages,
  courseName,
  t,
}: CourseDetailGallerySectionProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const galleryItems = useMemo<GalleryItem[]>(
    () =>
      galleryImages.map((image, index) => {
        const imageUrl = resolveCourseImageUrl(image) ?? courseMainPlaceholder
        return {
          key: `${image.id ?? 'gallery'}-${index}`,
          src: imageUrl,
          alt:
            image.altText ??
            t('pages.shkoli.detail.images.galleryAlt', {
              name: courseName,
              index: index + 1,
            }),
        }
      }),
    [courseName, galleryImages, t],
  )

  const hasLightbox = activeIndex != null && galleryItems.length > 0
  const safeActiveIndex =
    activeIndex == null
      ? 0
      : ((activeIndex % galleryItems.length) + galleryItems.length) %
        galleryItems.length
  const lightboxTopInset = 'var(--topnav-height, 76px)'

  useEffect(() => {
    if (!hasLightbox || typeof document === 'undefined') return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveIndex(null)
      } else if (event.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev == null ? 0 : prev + 1))
      } else if (event.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev == null ? 0 : prev - 1))
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [hasLightbox])

  return (
    <section id="course-gallery" className="scroll-mt-24">
      <h3 className="text-3xl font-semibold text-slate-900">
        {t('pages.shkoli.detail.sections.gallery')}
      </h3>
      {galleryItems.length > 0 ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {galleryItems.map((image, index) => (
            <button
              key={image.key}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white text-left transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="aspect-[4/3] h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                loading="lazy"
                onError={(event) => {
                  const target = event.currentTarget
                  target.onerror = null
                  target.src = courseMainPlaceholder
                }}
              />
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-base text-slate-600">
          {t('pages.shkoli.detail.galleryEmpty')}
        </p>
      )}

      {hasLightbox ? (
        <div
          className="fixed inset-x-0 bottom-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/80 px-4 pb-6 pt-3"
          style={{ top: lightboxTopInset }}
          role="dialog"
          aria-modal="true"
          aria-label={t('pages.shkoli.detail.galleryLightbox.label')}
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={galleryItems[safeActiveIndex].src}
              alt={galleryItems[safeActiveIndex].alt}
              className="max-h-[82vh] w-full rounded-2xl object-contain"
              style={{
                maxHeight:
                  'calc(100dvh - var(--topnav-height, 76px) - 2.5rem)',
              }}
            />

            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev ?? 0) - 1)}
              className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-sm transition hover:bg-white"
              aria-label={t('pages.shkoli.detail.galleryLightbox.previous')}
            >
              <svg
                viewBox="0 0 20 20"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12.5 4.5L7 10l5.5 5.5" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev ?? 0) + 1)}
              className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-sm transition hover:bg-white"
              aria-label={t('pages.shkoli.detail.galleryLightbox.next')}
            >
              <svg
                viewBox="0 0 20 20"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M7.5 4.5L13 10l-5.5 5.5" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-sm transition hover:bg-white"
              aria-label={t('feedback.dismiss')}
            >
              <svg
                viewBox="0 0 20 20"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 5l10 10" />
                <path d="M15 5L5 15" />
              </svg>
            </button>
            <p className="mt-3 text-center text-xs text-slate-200">
              {t('pages.shkoli.detail.galleryLightbox.counter', {
                current: safeActiveIndex + 1,
                total: galleryItems.length,
              })}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  )
}
