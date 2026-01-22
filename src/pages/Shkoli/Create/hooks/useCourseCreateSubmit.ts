import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import type { TFunction } from 'i18next'

import { useToast } from '../../../../components/feedback/ToastContext'
import {
  lecturedCoursesQueryKey,
  lecturedCoursesQueryKeyBase,
} from '../../../Profile/hooks/useLecturedCourses'
import { lyceumCoursesQueryKey } from '../../../Lyceums/hooks/useLyceumCourses'
import { courseDetailQueryKey } from '../../hooks/useCourse'
import { useCreateCourseMutation } from '../../hooks/useCreateCourseMutation'
import { getCourseCreateError } from '../services/courseCreateErrors'
import { buildCourseCreatePayload } from '../services/courseCreateFormUtils'
import type { CourseCreateFormValues } from '../validations/courseCreateSchema'

type UseCourseCreateSubmitOptions = {
  lyceumId: number | null
  isValidLyceumId: boolean
  hasCourseAccess: boolean
  uploadCourseImages: (courseId: number) => Promise<{
    uploadedCount: number
    failedCount: number
  }>
  isUploadingImages: boolean
  t: TFunction
}

export const useCourseCreateSubmit = ({
  lyceumId,
  isValidLyceumId,
  hasCourseAccess,
  uploadCourseImages,
  isUploadingImages,
  t,
}: UseCourseCreateSubmitOptions) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const mutation = useCreateCourseMutation()
  const submitError = getCourseCreateError(mutation.error ?? null)
  const isSubmitting = mutation.isPending || isUploadingImages

  const onSubmit = async (values: CourseCreateFormValues) => {
    if (!isValidLyceumId || !hasCourseAccess) return

    const { payload, lecturerIds } = buildCourseCreatePayload(
      values,
      lyceumId,
    )

    try {
      const data = await mutation.mutateAsync(payload)
      if (lyceumId != null) {
        queryClient.invalidateQueries({
          queryKey: lyceumCoursesQueryKey(lyceumId),
        })
      }
      if (lecturerIds.length > 0) {
        lecturerIds.forEach((id) => {
          if (Number.isFinite(id)) {
            queryClient.invalidateQueries({
              queryKey: lecturedCoursesQueryKey(id),
            })
          }
        })
      } else {
        queryClient.invalidateQueries({
          queryKey: lecturedCoursesQueryKeyBase,
        })
      }

      const courseId = data.id
      const imageResult =
        courseId != null
          ? await uploadCourseImages(courseId)
          : { uploadedCount: 0, failedCount: 0 }

      if (courseId != null) {
        queryClient.invalidateQueries({
          queryKey: courseDetailQueryKey(courseId),
        })
      }

      showToast({
        message: t('feedback.courses.createSuccess'),
        tone: 'success',
      })

      if (imageResult.failedCount > 0) {
        showToast({
          message: t('errors.courses.imagesUploadFailed'),
          tone: 'error',
        })
      }

      if (courseId != null) {
        navigate(`/shkoli/${courseId}`, { replace: true })
      } else if (lyceumId != null) {
        navigate(`/lyceums/${lyceumId}`, { replace: true })
      } else {
        navigate('/shkoli', { replace: true })
      }
    } catch {
      // handled by mutation state
    }
  }

  return {
    onSubmit,
    isSubmitting,
    submitError,
    isPending: mutation.isPending,
  }
}
