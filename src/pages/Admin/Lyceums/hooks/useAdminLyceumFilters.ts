import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import type { AdminLyceumsFilterState } from '../types'

const NAME_PARAM = 'name'
const TOWN_PARAM = 'town'
const VERIFIED_PARAM = 'verified'
const UNVERIFIED_PARAM = 'unverified'
const VERIFICATION_STATUS_PARAM = 'verificationStatus'
const PAGE_PARAM = 'page'
const DEFAULT_INCLUDE_VERIFIED = true
const DEFAULT_INCLUDE_UNVERIFIED = true

const parseTextParam = (value: string | null) => value ?? ''

const parseBooleanParam = (
  value: string | null,
  defaultValue: boolean,
) => {
  if (value === null) return defaultValue
  if (value === '0') return false
  if (value === '1') return true
  return defaultValue
}

const parseIncludeVerified = (
  value: string | null,
  legacyValue: string | null,
) => {
  if (value !== null) {
    return parseBooleanParam(value, DEFAULT_INCLUDE_VERIFIED)
  }
  if (legacyValue === 'VERIFIED') return true
  if (legacyValue === 'PENDING' || legacyValue === 'NOT_VERIFIED') {
    return false
  }
  return DEFAULT_INCLUDE_VERIFIED
}

const parseIncludeUnverified = (
  value: string | null,
  legacyValue: string | null,
) => {
  if (value !== null) {
    return parseBooleanParam(value, DEFAULT_INCLUDE_UNVERIFIED)
  }
  if (legacyValue === 'VERIFIED') return false
  if (legacyValue === 'PENDING' || legacyValue === 'NOT_VERIFIED') {
    return true
  }
  return DEFAULT_INCLUDE_UNVERIFIED
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

type AdminLyceumFiltersController = {
  state: AdminLyceumsFilterState
  hasActiveFilters: boolean
  setNameFilter: (value: string) => void
  setTownFilter: (value: string) => void
  setIncludeVerifiedFilter: (value: boolean) => void
  setIncludeUnverifiedFilter: (value: boolean) => void
  clearFilters: () => void
}

export const useAdminLyceumFilters = (): AdminLyceumFiltersController => {
  const [searchParams, setSearchParams] = useSearchParams()

  const state = useMemo<AdminLyceumsFilterState>(
    () => ({
      name: parseTextParam(searchParams.get(NAME_PARAM)),
      town: parseTextParam(searchParams.get(TOWN_PARAM)),
      includeVerified: parseIncludeVerified(
        searchParams.get(VERIFIED_PARAM),
        searchParams.get(VERIFICATION_STATUS_PARAM),
      ),
      includeUnverified: parseIncludeUnverified(
        searchParams.get(UNVERIFIED_PARAM),
        searchParams.get(VERIFICATION_STATUS_PARAM),
      ),
    }),
    [searchParams],
  )

  const hasActiveFilters =
    state.name.trim().length > 0 ||
    state.town.trim().length > 0 ||
    state.includeVerified !== DEFAULT_INCLUDE_VERIFIED ||
    state.includeUnverified !== DEFAULT_INCLUDE_UNVERIFIED

  const setNameFilter = useCallback(
    (value: string) => {
      const nextParams = new URLSearchParams(searchParams)
      setTextParam(nextParams, NAME_PARAM, value)
      nextParams.delete(PAGE_PARAM)
      setSearchParams(nextParams, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  const setTownFilter = useCallback(
    (value: string) => {
      const nextParams = new URLSearchParams(searchParams)
      setTextParam(nextParams, TOWN_PARAM, value)
      nextParams.delete(PAGE_PARAM)
      setSearchParams(nextParams, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  const setIncludeVerifiedFilter = useCallback(
    (value: boolean) => {
      const nextParams = new URLSearchParams(searchParams)
      setBooleanParam(
        nextParams,
        VERIFIED_PARAM,
        value,
        DEFAULT_INCLUDE_VERIFIED,
      )
      nextParams.delete(VERIFICATION_STATUS_PARAM)
      nextParams.delete(PAGE_PARAM)
      setSearchParams(nextParams, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  const setIncludeUnverifiedFilter = useCallback(
    (value: boolean) => {
      const nextParams = new URLSearchParams(searchParams)
      setBooleanParam(
        nextParams,
        UNVERIFIED_PARAM,
        value,
        DEFAULT_INCLUDE_UNVERIFIED,
      )
      nextParams.delete(VERIFICATION_STATUS_PARAM)
      nextParams.delete(PAGE_PARAM)
      setSearchParams(nextParams, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  const clearFilters = useCallback(() => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete(NAME_PARAM)
    nextParams.delete(TOWN_PARAM)
    nextParams.delete(VERIFIED_PARAM)
    nextParams.delete(UNVERIFIED_PARAM)
    nextParams.delete(VERIFICATION_STATUS_PARAM)
    nextParams.delete(PAGE_PARAM)
    setSearchParams(nextParams, { replace: true })
  }, [searchParams, setSearchParams])

  return {
    state,
    hasActiveFilters,
    setNameFilter,
    setTownFilter,
    setIncludeVerifiedFilter,
    setIncludeUnverifiedFilter,
    clearFilters,
  }
}
