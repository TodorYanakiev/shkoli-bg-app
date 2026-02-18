import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import type { TFunction } from 'i18next'
import type { UseFormSetError } from 'react-hook-form'

import { useToast } from '../../../../components/feedback/ToastContext'
import type {
  CourseImageResponse,
  CourseImageRole,
  CourseResponse,
} from '../../../../types/courses'
import {
  lecturedCoursesQueryKey,
  lecturedCoursesQueryKeyBase,
} from '../../../Profile/hooks/useLecturedCourses'
import { lyceumCoursesQueryKey } from '../../../Lyceums/hooks/useLyceumCourses'
import { courseDetailQueryKey } from '../../hooks/useCourse'
import { courseImagesQueryKey } from '../../hooks/useCourseImages'
import { useUpdateCourseMutation } from '../../hooks/useUpdateCourseMutation'
import { applyCourseEditServerFieldErrors } from '../services/courseEditFieldErrors'
import { getCourseUpdateError } from '../services/courseEditErrors'
import { isApiError } from '../services/courseEditErrors'
import { buildCourseUpdatePayload } from '../services/courseEditFormUtils'
import type { PendingCourseImage } from '../types'
import type { CourseEditFormValues } from '../validations/courseEditSchema'

type UseCourseEditSubmitOptions = {
  courseId: number
  isValidId: boolean
  course?: CourseResponse
  hasEditAccess: boolean
  lyceumId?: number
  mainImage: PendingCourseImage | null
  mainImages: CourseImageResponse[]
  uploadCourseImages: (
    courseId: number,
    options?: { skipRoles?: Set<CourseImageRole> },
  ) => Promise<{ uploadedCount: number; failedCount: number }>
  deleteExistingImages: (
    courseId: number,
    imagesToDelete: CourseImageResponse[],
  ) => Promise<{ ok: boolean; deleted: number; errorMessage?: string }>
  markImageError: (id: string, message: string) => void
  isUploadingImages: boolean
  setError: UseFormSetError<CourseEditFormValues>
  t: TFunction
}

export const useCourseEditSubmit = ({
  courseId,
  isValidId,
  course,
  hasEditAccess,
  lyceumId,
  mainImage,
  mainImages,
  uploadCourseImages,
  deleteExistingImages,
  markImageError,
  isUploadingImages,
  setError,
  t,
}: UseCourseEditSubmitOptions) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const mutation = useUpdateCourseMutation()
  const submitError = getCourseUpdateError(mutation.error ?? null)
  const isSubmitting = mutation.isPending || isUploadingImages

  const onSubmit = async (values: CourseEditFormValues) => {
    if (!isValidId || !course || !hasEditAccess) return

    const { payload, lecturerIds } = buildCourseUpdatePayload(values)

    try {
      const data = await mutation.mutateAsync({ id: courseId, payload })
      queryClient.setQueryData(courseDetailQueryKey(courseId), data)
      if (lyceumId != null) {
        queryClient.invalidateQueries({
          queryKey: lyceumCoursesQueryKey(lyceumId),
        })
      }
      const lecturersToRefresh = new Set<number>()
      const previousLecturers = course?.lecturerIds ?? []
      previousLecturers.forEach((id) => {
        if (typeof id === 'number' && Number.isFinite(id)) {
          lecturersToRefresh.add(id)
        }
      })
      lecturerIds.forEach((id) => {
        if (Number.isFinite(id)) {
          lecturersToRefresh.add(id)
        }
      })
      if (lecturersToRefresh.size > 0) {
        lecturersToRefresh.forEach((id) => {
          queryClient.invalidateQueries({
            queryKey: lecturedCoursesQueryKey(id),
          })
        })
      } else {
        queryClient.invalidateQueries({
          queryKey: lecturedCoursesQueryKeyBase,
        })
      }

      const skipRoles = new Set<CourseImageRole>()
      let didDeleteImages = false

      if (mainImage) {
        const deleteResult = await deleteExistingImages(
          courseId,
          mainImages,
        )
        if (!deleteResult.ok) {
          const errorMessage =
            deleteResult.errorMessage ?? t('errors.generic')
          skipRoles.add('MAIN')
          markImageError(mainImage.id, errorMessage)
          showToast({
            message: errorMessage,
            tone: 'error',
          })
        } else if (deleteResult.deleted > 0) {
          didDeleteImages = true
        }
      }

      const imageResult = await uploadCourseImages(courseId, {
        skipRoles,
      })
      const hasImageChanges =
        didDeleteImages || imageResult.uploadedCount > 0

      if (hasImageChanges) {
        queryClient.invalidateQueries({
          queryKey: courseImagesQueryKey(courseId),
        })
        queryClient.invalidateQueries({
          queryKey: courseDetailQueryKey(courseId),
        })
      }

      showToast({
        message: t('feedback.courses.updateSuccess'),
        tone: 'success',
      })

      if (imageResult.failedCount > 0) {
        showToast({
          message: t('errors.courses.imagesUploadFailed'),
          tone: 'error',
        })
      }

      navigate(`/shkoli/${courseId}`, { replace: true })
    } catch (error) {
      if (
        isApiError(error) &&
        error.status === 400
      ) {
        applyCourseEditServerFieldErrors({ error, setError, t })
      }
    }
  }

  return {
    onSubmit,
    isSubmitting,
    submitError,
  }
}
