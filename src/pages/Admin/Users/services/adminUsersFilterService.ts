import type { UserResponse } from '../../../../types/users'
import { getUserDisplayName } from '../../../../utils/user'
import type { AdminUsersFilterState } from '../types'

const normalizeText = (value: string | undefined) =>
  value?.trim().toLocaleLowerCase() ?? ''

const matchesText = (value: string | undefined, query: string) => {
  if (query.length === 0) return true
  return normalizeText(value).includes(query)
}

const matchesSearch = (user: UserResponse, query: string) => {
  if (query.length === 0) return true
  return (
    matchesText(getUserDisplayName(user), query) ||
    matchesText(user.username, query) ||
    matchesText(user.email, query)
  )
}

const matchesRole = (user: UserResponse, role: AdminUsersFilterState['role']) =>
  role === '' ? true : user.role === role

const matchesEnabledState = (
  user: UserResponse,
  filters: AdminUsersFilterState,
) => {
  const isEnabled = user.enabled !== false
  return (
    (filters.includeEnabled && isEnabled) ||
    (filters.includeDisabled && !isEnabled)
  )
}

const getUserSortLabel = (user: UserResponse) =>
  getUserDisplayName(user) || user.email || user.username || ''

export const filterAdminUsers = (
  users: UserResponse[],
  filters: AdminUsersFilterState,
) => {
  const normalizedSearch = normalizeText(filters.search)

  return users
    .filter(
      (user) =>
        matchesSearch(user, normalizedSearch) &&
        matchesRole(user, filters.role) &&
        matchesEnabledState(user, filters),
    )
    .sort((a, b) =>
      getUserSortLabel(a).localeCompare(getUserSortLabel(b), 'bg', {
        sensitivity: 'base',
      }),
    )
}

