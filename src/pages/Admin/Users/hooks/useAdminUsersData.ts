import { useEffect, useMemo } from 'react'

import type { AppError } from '../../../../types/appError'
import type { UserResponse } from '../../../../types/users'
import type { AdminUsersFilterState, AdminUsersPagination } from '../types'
import { filterAdminUsers } from '../services/adminUsersFilterService'
import { getAdminUsersLoadError } from '../services/adminUsersErrors'
import { useAdminUserByEmail } from './useAdminUserByEmail'
import { useAdminUsers } from './useAdminUsers'
import { useAdminUsersFilters } from './useAdminUsersFilters'

type AdminUsersFilters = {
  state: AdminUsersFilterState
  hasActiveFilters: boolean
  setPage: (value: number) => void
  setSearchFilter: (value: string) => void
  setRoleFilter: (value: AdminUsersFilterState['role']) => void
  setIncludeEnabledFilter: (value: boolean) => void
  setIncludeDisabledFilter: (value: boolean) => void
  clearFilters: () => void
}

type AdminUsersData = {
  users: UserResponse[]
  isLoading: boolean
  error: AppError | null
  pagination: AdminUsersPagination
  adminCount: number
  filters: AdminUsersFilters
}

const EMPTY_USERS: UserResponse[] = []
const ADMIN_USERS_PAGE_SIZE = 9

export const useAdminUsersData = (): AdminUsersData => {
  const {
    state: filterState,
    hasActiveFilters,
    setPage,
    setSearchFilter,
    setRoleFilter,
    setIncludeEnabledFilter,
    setIncludeDisabledFilter,
    clearFilters,
  } = useAdminUsersFilters()
  const normalizedSearch = filterState.search.trim()
  const hasSearch = normalizedSearch.length > 0
  const usersQuery = useAdminUsers({
    page: Math.max(filterState.page - 1, 0),
    size: ADMIN_USERS_PAGE_SIZE,
  }, {
    enabled: !hasSearch,
  })
  const userByEmailQuery = useAdminUserByEmail(
    normalizedSearch,
    { enabled: hasSearch },
  )
  const pagedUsers = usersQuery.data?.content ?? EMPTY_USERS

  const allUsers = useMemo(() => {
    if (hasSearch) {
      return userByEmailQuery.data ? [userByEmailQuery.data] : EMPTY_USERS
    }
    return pagedUsers
  }, [hasSearch, pagedUsers, userByEmailQuery.data])

  const filteredUsers = useMemo(
    () => filterAdminUsers(allUsers, filterState),
    [allUsers, filterState],
  )
  const adminCount = useMemo(
    () => filteredUsers.filter((user) => user.role === 'ADMIN').length,
    [filteredUsers],
  )

  const isLoading = hasSearch ? userByEmailQuery.isLoading : usersQuery.isLoading
  const error = hasSearch ? userByEmailQuery.error : usersQuery.error
  const appError = getAdminUsersLoadError(error ?? null)

  const pagedTotalItems = usersQuery.data?.totalElements ?? 0
  const pagedTotalPages = Math.max(usersQuery.data?.totalPages ?? 1, 1)
  const pagedCurrentPage = Math.min(
    Math.max(filterState.page, 1),
    pagedTotalPages,
  )
  const pagedPageSize = usersQuery.data?.size || ADMIN_USERS_PAGE_SIZE

  useEffect(() => {
    if (hasSearch) return
    if (usersQuery.isLoading || usersQuery.isFetching) return
    if (pagedTotalItems === 0 && filterState.page !== 1) {
      setPage(1)
      return
    }
    if (filterState.page > pagedTotalPages) {
      setPage(pagedTotalPages)
    }
  }, [
    filterState.page,
    hasSearch,
    pagedTotalItems,
    pagedTotalPages,
    setPage,
    usersQuery.isFetching,
    usersQuery.isLoading,
  ])

  const lookupTotalItems = filteredUsers.length
  const lookupPageStart = lookupTotalItems > 0 ? 1 : 0
  const lookupPageEnd = lookupTotalItems > 0 ? lookupTotalItems : 0

  const pagedVisibleCount = filteredUsers.length
  const pagedPageStart =
    pagedTotalItems === 0 || pagedVisibleCount === 0
      ? 0
      : (pagedCurrentPage - 1) * pagedPageSize + 1
  const pagedPageEnd =
    pagedTotalItems === 0 || pagedVisibleCount === 0
      ? 0
      : Math.min(pagedPageStart + pagedVisibleCount - 1, pagedTotalItems)

  const pagination: AdminUsersPagination = hasSearch
    ? {
        currentPage: 1,
        totalPages: 1,
        pageSize: lookupTotalItems,
        totalItems: lookupTotalItems,
        pageStart: lookupPageStart,
        pageEnd: lookupPageEnd,
        canGoPrev: false,
        canGoNext: false,
        hasMultiplePages: false,
        goToPrev: () => undefined,
        goToNext: () => undefined,
      }
    : {
        currentPage: pagedCurrentPage,
        totalPages: pagedTotalPages,
        pageSize: pagedPageSize,
        totalItems: pagedTotalItems,
        pageStart: pagedPageStart,
        pageEnd: pagedPageEnd,
        canGoPrev: pagedCurrentPage > 1,
        canGoNext: pagedCurrentPage < pagedTotalPages && pagedTotalItems > 0,
        hasMultiplePages: pagedTotalPages > 1,
        goToPrev: () => setPage(pagedCurrentPage - 1),
        goToNext: () => setPage(pagedCurrentPage + 1),
      }

  return {
    users: filteredUsers,
    isLoading,
    error: appError,
    pagination,
    adminCount,
    filters: {
      state: filterState,
      hasActiveFilters,
      setPage,
      setSearchFilter,
      setRoleFilter,
      setIncludeEnabledFilter,
      setIncludeDisabledFilter,
      clearFilters,
    },
  }
}
