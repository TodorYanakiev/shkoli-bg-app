import { useMemo } from 'react'

import { useLyceumLecturers } from '../../../Lyceums/hooks/useLyceumLecturers'
import { useUserProfile } from '../../../Profile/hooks/useUserProfile'
import type { ApiError } from '../../../../types/api'
import type {
  CourseImageResponse,
  CourseResponse,
} from '../../../../types/courses'
import type { CurrentUser, UserResponse } from '../../../../types/users'
import { useCourse } from '../../hooks/useCourse'
import { useCourseImages } from '../../hooks/useCourseImages'

type UseCourseEditDataOptions = {
  courseId: number
  isValidId: boolean
}

type CourseEditData = {
  course?: CourseResponse
  user?: CurrentUser
  lecturers?: UserResponse[]
  courseImages: CourseImageResponse[]
  mainImages: CourseImageResponse[]
  existingGalleryImages: CourseImageResponse[]
  isCourseLoading: boolean
  isUserLoading: boolean
  isLecturersLoading: boolean
  isImagesLoading: boolean
  courseError: ApiError | null
  userError: ApiError | null
  lecturersError: ApiError | null
  courseImagesError: ApiError | null
  hasEditAccess: boolean
  lyceumId?: number
}

export const useCourseEditData = ({
  courseId,
  isValidId,
}: UseCourseEditDataOptions): CourseEditData => {
  const {
    data: course,
    isLoading: isCourseLoading,
    error: courseError,
  } = useCourse(courseId, { enabled: isValidId })

  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useUserProfile()

  const lyceumId = course?.lyceumId
  const {
    data: lecturers,
    isLoading: isLecturersLoading,
    error: lecturersError,
  } = useLyceumLecturers(lyceumId, { enabled: Boolean(lyceumId) })

  const isCourseLecturer = Boolean(
    user?.id != null && course?.lecturerIds?.includes(user.id),
  )
  const isLyceumAdministrator =
    user?.administratedLyceumId != null &&
    lyceumId != null &&
    user.administratedLyceumId === lyceumId
  const hasEditAccess = Boolean(
    course &&
      (user?.role === 'ADMIN' ||
        isLyceumAdministrator ||
        isCourseLecturer),
  )

  const {
    data: courseImages = [],
    isLoading: isImagesLoading,
    error: courseImagesError,
  } = useCourseImages(courseId, {
    enabled: isValidId && hasEditAccess,
  })

  const { mainImages, existingGalleryImages } = useMemo(() => {
    const main = courseImages.filter((image) => image.role === 'MAIN')
    const gallery = [...courseImages]
      .filter((image) => image.role === 'GALLERY')
      .sort(
        (a, b) =>
          (a.orderIndex ?? Number.MAX_SAFE_INTEGER) -
          (b.orderIndex ?? Number.MAX_SAFE_INTEGER),
      )

    return {
      mainImages: main,
      existingGalleryImages: gallery,
    }
  }, [courseImages])

  return {
    course,
    user,
    lecturers,
    courseImages,
    mainImages,
    existingGalleryImages,
    isCourseLoading,
    isUserLoading,
    isLecturersLoading,
    isImagesLoading,
    courseError,
    userError,
    lecturersError,
    courseImagesError,
    hasEditAccess,
    lyceumId,
  }
}
