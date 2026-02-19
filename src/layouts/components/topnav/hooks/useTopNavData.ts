import type { TFunction } from 'i18next'

import { useAuthStatus } from '../../../../hooks/useAuthStatus'
import { useAdministratedLyceum } from '../../../../pages/Profile/hooks/useAdministratedLyceum'
import { useUserProfile } from '../../../../pages/Profile/hooks/useUserProfile'
import { useLyceumLecturers } from '../../../../pages/Lyceums/hooks/useLyceumLecturers'
import { useCourse } from '../../../../pages/Shkoli/hooks/useCourse'
import { stripLocalePrefix } from '../../../../utils/localizedPath'
import { getUserDisplayName } from '../../../../utils/user'
import { resolveUserImageUrl } from '../../../../utils/userImages'

type UseTopNavDataOptions = {
  pathname: string
  t: TFunction
}

type TopNavData = {
  isAuthenticated: boolean
  profileName: string
  profileAvatarUrl: string | null
  profileAvatarAlt: string
  isGlobalAdmin: boolean
  administratedLyceumId: number | null
  hasAdministratedLyceum: boolean
  administratedLyceumLabel: string
  currentCourseId: number | null
  currentLyceumId: number | null
  canEditCourse: boolean
  hasCourseActions: boolean
  canEditLyceum: boolean
  canAddCourse: boolean
  canInviteLecturer: boolean
  hasLyceumActions: boolean
}

export const useTopNavData = ({
  pathname,
  t,
}: UseTopNavDataOptions): TopNavData => {
  const normalizedPathname = stripLocalePrefix(pathname)
  const { isAuthenticated } = useAuthStatus()
  const { data: currentUser } = useUserProfile({ enabled: isAuthenticated })
  const isGlobalAdmin = currentUser?.role === 'ADMIN'

  const courseMatch = normalizedPathname.match(/^\/shkoli\/(\d+)(?:\/.*)?$/)
  const currentCourseId = courseMatch ? Number(courseMatch[1]) : null
  const isCourseIdValid = Number.isFinite(currentCourseId)
  const lyceumMatch = normalizedPathname.match(/^\/lyceums\/(\d+)(?:\/.*)?$/)
  const currentLyceumId = lyceumMatch ? Number(lyceumMatch[1]) : null
  const isLyceumIdValid = Number.isFinite(currentLyceumId)

  const canEditLyceum =
    isLyceumIdValid &&
    (currentUser?.role === 'ADMIN' ||
      currentUser?.administratedLyceumId === currentLyceumId)
  const { data: lyceumLecturers } = useLyceumLecturers(
    currentLyceumId ?? undefined,
    {
      enabled: isAuthenticated && isLyceumIdValid,
    },
  )
  const isLyceumLecturer = Boolean(
    currentUser?.id != null &&
      lyceumLecturers?.some((lecturer) => lecturer.id === currentUser.id),
  )
  const canAddCourse = Boolean(
    isLyceumIdValid && (canEditLyceum || isLyceumLecturer),
  )
  const canInviteLecturer = canEditLyceum
  const hasLyceumActions = canEditLyceum || canAddCourse || canInviteLecturer

  const { data: currentCourse } = useCourse(currentCourseId ?? undefined, {
    enabled: isAuthenticated && isCourseIdValid,
  })
  const courseLecturerIds = currentCourse?.lecturerIds ?? []
  const isCourseLecturer =
    isCourseIdValid &&
    typeof currentUser?.id === 'number' &&
    courseLecturerIds.includes(currentUser.id)
  const isCourseLyceumAdmin =
    isCourseIdValid &&
    typeof currentUser?.administratedLyceumId === 'number' &&
    currentUser.administratedLyceumId === currentCourse?.lyceumId
  const canEditCourse = Boolean(
    isCourseIdValid &&
      (currentUser?.role === 'ADMIN' ||
        isCourseLyceumAdmin ||
        isCourseLecturer),
  )
  const hasCourseActions = canEditCourse

  const administratedLyceumId =
    typeof currentUser?.administratedLyceumId === 'number' &&
    Number.isFinite(currentUser.administratedLyceumId)
      ? currentUser.administratedLyceumId
      : null
  const hasAdministratedLyceum = administratedLyceumId !== null
  const {
    data: administratedLyceum,
    isLoading: isAdministratedLyceumLoading,
    error: administratedLyceumError,
  } = useAdministratedLyceum(administratedLyceumId ?? undefined, {
    enabled: isAuthenticated && hasAdministratedLyceum,
  })

  const profileName =
    getUserDisplayName(currentUser) || t('pages.profile.unknownUser')
  const profileAvatarUrl = resolveUserImageUrl(currentUser?.profileImage)
  const profileAvatarAlt = t('nav.profileAvatarAlt', { name: profileName })
  const administratedLyceumLabel = administratedLyceum?.name
    ? administratedLyceum.name
    : isAdministratedLyceumLoading
      ? t('pages.profile.details.administratedLyceumLoading')
      : administratedLyceumError
        ? t('pages.profile.details.administratedLyceumUnavailable')
        : t('pages.profile.details.administratedLyceumUnknown')

  return {
    isAuthenticated,
    profileName,
    profileAvatarUrl,
    profileAvatarAlt,
    isGlobalAdmin,
    administratedLyceumId,
    hasAdministratedLyceum,
    administratedLyceumLabel,
    currentCourseId,
    currentLyceumId,
    canEditCourse,
    hasCourseActions,
    canEditLyceum,
    canAddCourse,
    canInviteLecturer,
    hasLyceumActions,
  }
}
