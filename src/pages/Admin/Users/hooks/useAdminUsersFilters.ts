import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import type { AdminUserRoleFilter, AdminUsersFilterState } from '../types'

const SEARCH_PARAM = 'q'
const ROLE_PARAM = 'role'
const ENABLED_PARAM = 'enabled'
const DISABLED_PARAM = 'disabled'
const PAGE_PARAM = 'page'
const DEFAULT_INCLUDE_ENABLED = true
const DEFAULT_INCLUDE_DISABLED = true
const DEFAULT_PAGE = 1

const parseTextParam = (value: string | null) => value ?? ''

const parseRoleParam = (value: string | null): AdminUserRoleFilter => {
  if (value === 'USER' || value === 'ADMIN') {
    return value
  }
  return ''
}

const parseBooleanParam = (
  value: string | null,
  defaultValue: boolean,
) => {
  if (value === null) return defaultValue
  if (value === '0') return false
  if (value === '1') return true
  return defaultValue
}

const parsePageParam = (value: string | null) => {
  if (!value) return DEFAULT_PAGE
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_PAGE
  return parsed
}

const setTextParam = (
  searchParams: URLSearchParams,
  key: string,
  value: string,
) => {
  if (value.trim().length === 0) {
    searchParams.delete(key)
    return
  }
  searchParams.set(key, value)
}

const setRoleParam = (
  searchParams: URLSearchParams,
  key: string,
  value: AdminUserRoleFilter,
) => {
  if (!value) {
    searchParams.delete(key)
    return
  }
  searchParams.set(key, value)
}

const setBooleanParam = (
  searchParams: URLSearchParams,
  key: string,
  value: boolean,
  defaultValue: boolean,
) => {
  if (value === defaultValue) {
    searchParams.delete(key)
    return
  }
  searchParams.set(key, value ? '1' : '0')
}

type AdminUsersFiltersController = {
  state: AdminUsersFilterState
  hasActiveFilters: boolean
  setPage: (value: number) => void
  setSearchFilter: (value: string) => void
  setRoleFilter: (value: AdminUserRoleFilter) => void
  setIncludeEnabledFilter: (value: boolean) => void
  setIncludeDisabledFilter: (value: boolean) => void
  clearFilters: () => void
}

export const useAdminUsersFilters = (): AdminUsersFiltersController => {
  const [searchParams, setSearchParams] = useSearchParams()

  const state = useMemo<AdminUsersFilterState>(
    () => ({
      search: parseTextParam(searchParams.get(SEARCH_PARAM)),
      role: parseRoleParam(searchParams.get(ROLE_PARAM)),
      includeEnabled: parseBooleanParam(
        searchParams.get(ENABLED_PARAM),
        DEFAULT_INCLUDE_ENABLED,
      ),
      includeDisabled: parseBooleanParam(
        searchParams.get(DISABLED_PARAM),
        DEFAULT_INCLUDE_DISABLED,
      ),
      page: parsePageParam(searchParams.get(PAGE_PARAM)),
    }),
    [searchParams],
  )

  const hasActiveFilters =
    state.search.trim().length > 0 ||
    state.role !== '' ||
    state.includeEnabled !== DEFAULT_INCLUDE_ENABLED ||
    state.includeDisabled !== DEFAULT_INCLUDE_DISABLED

  const setSearchFilter = useCallback(
    (value: string) => {
      const nextParams = new URLSearchParams(searchParams)
      setTextParam(nextParams, SEARCH_PARAM, value)
      nextParams.delete(PAGE_PARAM)
      setSearchParams(nextParams, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  const setRoleFilter = useCallback(
    (value: AdminUserRoleFilter) => {
      const nextParams = new URLSearchParams(searchParams)
      setRoleParam(nextParams, ROLE_PARAM, value)
      nextParams.delete(PAGE_PARAM)
      setSearchParams(nextParams, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  const setIncludeEnabledFilter = useCallback(
    (value: boolean) => {
      const nextParams = new URLSearchParams(searchParams)
      setBooleanParam(
        nextParams,
        ENABLED_PARAM,
        value,
        DEFAULT_INCLUDE_ENABLED,
      )
      nextParams.delete(PAGE_PARAM)
      setSearchParams(nextParams, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  const setIncludeDisabledFilter = useCallback(
    (value: boolean) => {
      const nextParams = new URLSearchParams(searchParams)
      setBooleanParam(
        nextParams,
        DISABLED_PARAM,
        value,
        DEFAULT_INCLUDE_DISABLED,
      )
      nextParams.delete(PAGE_PARAM)
      setSearchParams(nextParams, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  const clearFilters = useCallback(() => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete(SEARCH_PARAM)
    nextParams.delete(ROLE_PARAM)
    nextParams.delete(ENABLED_PARAM)
    nextParams.delete(DISABLED_PARAM)
    nextParams.delete(PAGE_PARAM)
    setSearchParams(nextParams, { replace: true })
  }, [searchParams, setSearchParams])

  const setPage = useCallback(
    (value: number) => {
      const nextPage = Number.isFinite(value) ? Math.floor(value) : DEFAULT_PAGE
      const normalizedPage = nextPage > 0 ? nextPage : DEFAULT_PAGE
      const nextParams = new URLSearchParams(searchParams)
      if (normalizedPage === DEFAULT_PAGE) {
        nextParams.delete(PAGE_PARAM)
      } else {
        nextParams.set(PAGE_PARAM, String(normalizedPage))
      }
      setSearchParams(nextParams)
    },
    [searchParams, setSearchParams],
  )

  return {
    state,
    hasActiveFilters,
    setPage,
    setSearchFilter,
    setRoleFilter,
    setIncludeEnabledFilter,
    setIncludeDisabledFilter,
    clearFilters,
  }
}
