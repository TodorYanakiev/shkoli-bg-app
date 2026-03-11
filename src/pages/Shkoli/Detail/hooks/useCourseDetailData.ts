import { useAuthStatus } from '../../../../hooks/useAuthStatus'
import { useUsersByIds } from '../../../../hooks/useUsersByIds'
import type { AppError } from '../../../../types/appError'
import type { CourseImageResponse, CourseResponse } from '../../../../types/courses'
import type { LyceumResponse } from '../../../../types/lyceums'
import type { UserResponse } from '../../../../types/users'
import { useLyceum } from '../../../Lyceums/hooks/useLyceum'
import { useUserProfile } from '../../../Profile/hooks/useUserProfile'
import { useCourse } from '../../hooks/useCourse'
import { useCourseImages } from '../../hooks/useCourseImages'
import {
  getCourseLoadError,
  getSectionError,
} from '../services/courseDetailErrors'

type UseCourseDetailDataOptions = {
  courseId: number
  isValidId: boolean
}

type CourseDetailData = {
  course?: CourseResponse
  lecturers?: UserResponse[]
  lyceum?: LyceumResponse
  courseImages: CourseImageResponse[]
  courseImagesError: AppError | null
  courseError: AppError | null
  lecturersError: AppError | null
  lyceumError: AppError | null
  isLoading: boolean
  isLecturersLoading: boolean
  isLyceumLoading: boolean
  isCourseImagesLoading: boolean
  isValidId: boolean
  courseId: number
  lyceumId?: number
  canEditCourse: boolean
}

export const useCourseDetailData = ({
  courseId,
  isValidId,
}: UseCourseDetailDataOptions): CourseDetailData => {
  const { isAuthenticated } = useAuthStatus()
  const { data: currentUser } = useUserProfile({ enabled: isAuthenticated })

  const {
    data: course,
    isLoading,
    error: courseErrorRaw,
  } = useCourse(courseId, {
    enabled: isValidId,
  })
  const {
    data: courseImages = [],
    isLoading: isCourseImagesLoadingRaw,
    error: courseImagesErrorRaw,
  } = useCourseImages(courseId, {
    enabled: isValidId,
  })
  const lecturerIds = course?.lecturerIds ?? []
  const {
    data: lecturers,
    isLoading: isLecturersLoading,
    error: lecturersErrorRaw,
  } = useUsersByIds(lecturerIds, {
    enabled: isValidId && lecturerIds.length > 0,
  })
  const lyceumId = course?.lyceumId
  const {
    data: lyceum,
    isLoading: isLyceumLoading,
    error: lyceumErrorRaw,
  } = useLyceum(lyceumId, { enabled: Boolean(lyceumId) })
  const courseError = getCourseLoadError(courseErrorRaw ?? null)
  const lecturersError = getSectionError(
    lecturersErrorRaw ?? null,
    'pages.shkoli.detail.lecturersError',
  )
  const lyceumError = getSectionError(
    lyceumErrorRaw ?? null,
    'pages.shkoli.detail.lyceumError',
  )
  const courseImagesError =
    courseImages.length > 0
      ? null
      : getSectionError(
          courseImagesErrorRaw ?? null,
          'errors.courses.imagesLoadFailed',
        )
  const isCourseImagesLoading =
    isCourseImagesLoadingRaw && courseImages.length === 0

  const userId = currentUser?.id
  const isCourseLecturer =
    isValidId && typeof userId === 'number' && lecturerIds.includes(userId)
  const isLyceumAdministrator =
    isValidId && currentUser?.administratedLyceumId === course?.lyceumId
  const canEditCourse =
    isValidId &&
    (currentUser?.role === 'ADMIN' ||
      isLyceumAdministrator ||
      isCourseLecturer)

  return {
    course,
    lecturers,
    lyceum,
    courseImages,
    courseImagesError,
    courseError,
    lecturersError,
    lyceumError,
    isLoading,
    isLecturersLoading,
    isLyceumLoading,
    isCourseImagesLoading,
    isValidId,
    courseId,
    lyceumId: lyceumId ?? undefined,
    canEditCourse,
  }
}
