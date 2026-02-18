import type { ApiError } from '../../../types/api'
import type { UserRole, UserUpdateRequest } from '../../../types/users'

export type AdminUserRoleFilter = '' | UserRole

export type AdminUsersFilterState = {
  search: string
  role: AdminUserRoleFilter
  includeEnabled: boolean
  includeDisabled: boolean
  page: number
}

export type AdminUsersQuery = {
  page: number
  size: number
}

export type AdminUsersPagination = {
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  pageStart: number
  pageEnd: number
  canGoPrev: boolean
  canGoNext: boolean
  hasMultiplePages: boolean
  goToPrev: () => void
  goToNext: () => void
}

export type AdminUserUpdateResult = {
  ok: boolean
  error: ApiError | null
}

export type AdminUserUpdatePayload = {
  userId: number
  payload: UserUpdateRequest
  role: UserRole
  currentRole?: UserRole
}
