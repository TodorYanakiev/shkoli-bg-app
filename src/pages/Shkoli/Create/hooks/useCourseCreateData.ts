import { useLyceum } from '../../../Lyceums/hooks/useLyceum'
import { useLyceumLecturers } from '../../../Lyceums/hooks/useLyceumLecturers'
import { useUserProfile } from '../../../Profile/hooks/useUserProfile'
import type { ApiError } from '../../../../types/api'
import type { LyceumResponse } from '../../../../types/lyceums'
import type { CurrentUser, UserResponse } from '../../../../types/users'

type UseCourseCreateDataOptions = {
  lyceumId: number | null
  isValidLyceumId: boolean
}

type CourseCreateData = {
  lyceum?: LyceumResponse
  lecturers?: UserResponse[]
  user?: CurrentUser
  isLyceumLoading: boolean
  isLecturersLoading: boolean
  isUserLoading: boolean
  lyceumError: ApiError | null
  lecturersError: ApiError | null
  userError: ApiError | null
  isUserAdminForLyceum: boolean
  isLyceumLecturer: boolean
  hasCourseAccess: boolean
  isAccessLoading: boolean
  isLoading: boolean
}

export const useCourseCreateData = ({
  lyceumId,
  isValidLyceumId,
}: UseCourseCreateDataOptions): CourseCreateData => {
  const {
    data: lyceum,
    isLoading: isLyceumLoading,
    error: lyceumError,
  } = useLyceum(lyceumId ?? undefined, { enabled: isValidLyceumId })
  const {
    data: lecturers,
    isLoading: isLecturersLoading,
    error: lecturersError,
  } = useLyceumLecturers(lyceumId ?? undefined, {
    enabled: isValidLyceumId,
  })
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useUserProfile()

  const isUserAdminForLyceum =
    lyceumId != null &&
    (user?.role === 'ADMIN' || user?.administratedLyceumId === lyceumId)
  const isLyceumLecturer = Boolean(
    user?.id != null &&
      lecturers?.some((lecturer) => lecturer.id === user.id),
  )
  const hasCourseAccess = Boolean(
    lyceumId != null && (isUserAdminForLyceum || isLyceumLecturer),
  )

  const isAccessLoading =
    isValidLyceumId && !isUserAdminForLyceum && isLecturersLoading
  const isLoading = isLyceumLoading || isUserLoading || isAccessLoading

  return {
    lyceum,
    lecturers,
    user,
    isLyceumLoading,
    isLecturersLoading,
    isUserLoading,
    lyceumError,
    lecturersError,
    userError,
    isUserAdminForLyceum,
    isLyceumLecturer,
    hasCourseAccess,
    isAccessLoading,
    isLoading,
  }
}
