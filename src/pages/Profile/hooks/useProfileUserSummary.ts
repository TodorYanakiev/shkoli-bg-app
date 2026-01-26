import { useMemo } from 'react'
import type { TFunction } from 'i18next'

import type { CurrentUser } from '../../../types/users'
import { getUserDisplayName, getUserFullName } from '../../../utils/user'

type ProfileUserSummary = {
  displayName: string
  fullName: string
  username: string
  email: string
  roleLabel: string
  hasLyceumAdministration: boolean
  administratedLyceumId?: number
  lecturedLyceumIds: number[]
  hasLecturedLyceum: boolean
  lecturerId?: number
  hasLecturedCourses: boolean
}

export const useProfileUserSummary = (
  user: CurrentUser | null | undefined,
  t: TFunction,
): ProfileUserSummary => {
  const displayName = getUserDisplayName(user) || t('pages.profile.unknownUser')
  const fullName = getUserFullName(user) || t('pages.profile.emptyValue')
  const username = user?.username ?? t('pages.profile.emptyValue')
  const email = user?.email ?? t('pages.profile.emptyValue')
  const hasLyceumAdministration = Boolean(user?.administratedLyceumId)
  const administratedLyceumId = user?.administratedLyceumId
  const lecturedLyceumIds = useMemo(() => {
    const rawIds = user?.lecturedLyceumIds ?? []
    const normalizedIds = rawIds.filter(
      (id): id is number => typeof id === 'number' && Number.isFinite(id),
    )
    return Array.from(new Set(normalizedIds))
  }, [user?.lecturedLyceumIds])
  const hasLecturedLyceum = lecturedLyceumIds.length > 0
  const lecturerId = user?.id
  const hasLecturedCourses = Boolean(
    typeof lecturerId === 'number' &&
      ((user?.lecturedCourseIds?.length ?? 0) > 0 || hasLecturedLyceum),
  )
  const roleLabel = hasLyceumAdministration
    ? t('pages.profile.roles.lyceumAdmin')
    : user?.role
      ? ({
          USER: t('pages.profile.roles.user'),
          ADMIN: t('pages.profile.roles.admin'),
        }[user.role] ?? t('pages.profile.roles.unknown'))
      : t('pages.profile.emptyValue')

  return {
    displayName,
    fullName,
    username,
    email,
    roleLabel,
    hasLyceumAdministration,
    administratedLyceumId,
    lecturedLyceumIds,
    hasLecturedLyceum,
    lecturerId,
    hasLecturedCourses,
  }
}
