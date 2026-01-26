import type { TFunction } from 'i18next'

import type { PendingCourseImage } from '../types'

export const getPendingImageStatusLabel = (
  pendingImage: PendingCourseImage,
  t: TFunction,
) => {
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

export const getPendingImageStatusClassName = (
  pendingImage: PendingCourseImage,
) => {
  if (pendingImage.status === 'error') return 'text-rose-600'
  if (pendingImage.status === 'uploaded') return 'text-emerald-600'
  return 'text-slate-500'
}
