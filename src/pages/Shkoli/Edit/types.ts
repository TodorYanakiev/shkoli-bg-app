import type { CourseImageRole } from '../../../types/courses'

export type PendingCourseImageStatus =
  | 'idle'
  | 'uploading'
  | 'uploaded'
  | 'error'

export type PendingCourseImage = {
  id: string
  role: CourseImageRole
  file: File
  previewUrl: string
  altText: string
  width?: number
  height?: number
  mimeType?: string
  status: PendingCourseImageStatus
  progress: number
  error?: string
}

export type ImageUploadResult = {
  uploadedCount: number
  failedCount: number
}

export type ImageDeleteResult = {
  ok: boolean
  deleted: number
  errorMessage?: string
}
