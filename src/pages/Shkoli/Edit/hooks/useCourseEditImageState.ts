import { useEffect, useRef, useState } from 'react'

import type { CourseImageRole } from '../../../../types/courses'
import type { PendingCourseImage } from '../types'

export const useCourseEditImageState = () => {
  const [mainImage, setMainImage] = useState<PendingCourseImage | null>(
    null,
  )
  const [galleryImages, setGalleryImages] = useState<PendingCourseImage[]>(
    [],
  )
  const [mainImageError, setMainImageError] = useState<string | null>(
    null,
  )
  const [galleryImageError, setGalleryImageError] = useState<string | null>(
    null,
  )

  const imageStateRef = useRef({
    mainImage: null as PendingCourseImage | null,
    galleryImages: [] as PendingCourseImage[],
  })

  const clearImageState = (image: PendingCourseImage | null) => {
    if (!image) return
    URL.revokeObjectURL(image.previewUrl)
  }

  const replaceMainImage = (image: PendingCourseImage | null) => {
    clearImageState(mainImage)
    setMainImage(image)
  }

  const addGalleryImages = (images: PendingCourseImage[]) => {
    setGalleryImages((prev) => [...prev, ...images])
  }

  const removeSingleImage = (role: CourseImageRole) => {
    if (role !== 'MAIN') return
    clearImageState(mainImage)
    setMainImage(null)
    setMainImageError(null)
  }

  const removeGalleryImage = (id: string) => {
    setGalleryImages((prev) => {
      const target = prev.find((image) => image.id === id)
      if (target) {
        clearImageState(target)
      }
      return prev.filter((image) => image.id !== id)
    })
  }

  const updateMainAltText = (value: string) => {
    setMainImage((prev) => (prev ? { ...prev, altText: value } : prev))
  }

  const updateGalleryAltText = (id: string, value: string) => {
    setGalleryImages((prev) =>
      prev.map((image) =>
        image.id === id ? { ...image, altText: value } : image,
      ),
    )
  }

  const updateImageState = (
    id: string,
    updates: Partial<PendingCourseImage>,
  ) => {
    setMainImage((prev) =>
      prev && prev.id === id ? { ...prev, ...updates } : prev,
    )
    setGalleryImages((prev) =>
      prev.map((image) =>
        image.id === id ? { ...image, ...updates } : image,
      ),
    )
  }

  const markImageError = (id: string, message: string) => {
    updateImageState(id, { status: 'error', error: message })
  }

  useEffect(() => {
    imageStateRef.current = {
      mainImage,
      galleryImages,
    }
  }, [mainImage, galleryImages])

  useEffect(() => {
    return () => {
      const current = imageStateRef.current
      if (current.mainImage) {
        URL.revokeObjectURL(current.mainImage.previewUrl)
      }
      current.galleryImages.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl)
      })
    }
  }, [])

  return {
    mainImage,
    galleryImages,
    mainImageError,
    galleryImageError,
    setMainImageError,
    setGalleryImageError,
    replaceMainImage,
    addGalleryImages,
    removeSingleImage,
    removeGalleryImage,
    updateMainAltText,
    updateGalleryAltText,
    updateImageState,
    markImageError,
  }
}
