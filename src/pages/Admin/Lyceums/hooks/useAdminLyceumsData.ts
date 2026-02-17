import { useMemo } from 'react'

import type { AppError } from '../../../../types/appError'
import type { LyceumResponse } from '../../../../types/lyceums'
import type {
  AdminLyceumsPagination,
  AdminLyceumsFilterState,
} from '../types'
import { useAdminLyceums } from './useAdminLyceums'
import { useAdminLyceumsPagination } from './useAdminLyceumsPagination'
import { getAdminLyceumsLoadError } from '../services/adminLyceumsErrors'
import { useAdminLyceumFilters } from './useAdminLyceumFilters'
import {
  filterAdminLyceums,
  getAdminLyceumTownOptions,
} from '../services/adminLyceumsFilterService'

type AdminLyceumFilters = {
  state: AdminLyceumsFilterState
  townOptions: string[]
  hasActiveFilters: boolean
  setNameFilter: (value: string) => void
  setTownFilter: (value: string) => void
  setIncludeVerifiedFilter: (value: boolean) => void
  setIncludeUnverifiedFilter: (value: boolean) => void
  clearFilters: () => void
}

const EMPTY_LYCEUMS: LyceumResponse[] = []

type AdminLyceumsData = {
  lyceums: LyceumResponse[]
  isLoading: boolean
  error: AppError | null
  pagination: AdminLyceumsPagination
  verifiedCount: number
  filters: AdminLyceumFilters
}

export const useAdminLyceumsData = (): AdminLyceumsData => {
  const { data, isLoading, error } = useAdminLyceums()
  const {
    state: filterState,
    hasActiveFilters,
    setNameFilter,
    setTownFilter,
    setIncludeVerifiedFilter,
    setIncludeUnverifiedFilter,
    clearFilters,
  } = useAdminLyceumFilters()
  const allLyceums = data ?? EMPTY_LYCEUMS
  const townOptions = useMemo(
    () => getAdminLyceumTownOptions(allLyceums),
    [allLyceums],
  )
  const filteredLyceums = useMemo(
    () => filterAdminLyceums(allLyceums, filterState),
    [allLyceums, filterState],
  )
  const verifiedCount = useMemo(
    () =>
      filteredLyceums.filter(
        (lyceum) => lyceum.verificationStatus === 'VERIFIED',
      ).length,
    [filteredLyceums],
  )
  const { pageItems, pagination } = useAdminLyceumsPagination(
    filteredLyceums,
    {
      isLoading,
    },
  )

  return {
    lyceums: pageItems,
    isLoading,
    error: getAdminLyceumsLoadError(error ?? null),
    pagination,
    verifiedCount,
    filters: {
      state: filterState,
      townOptions,
      hasActiveFilters,
      setNameFilter,
      setTownFilter,
      setIncludeVerifiedFilter,
      setIncludeUnverifiedFilter,
      clearFilters,
    },
  }
}
