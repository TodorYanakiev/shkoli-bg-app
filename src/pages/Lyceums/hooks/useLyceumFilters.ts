import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import type { LyceumFilterFormValues } from '../validations/lyceumFilterSchema'
import type { LyceumFilterQuery, LyceumFilterState } from '../types'

const LYCEUMS_PAGE_SIZE = 6
const DEFAULT_PAGE = 1

const parsePage = (value: string | null) => {
  if (!value) return DEFAULT_PAGE
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_PAGE
  return parsed
}

export const useLyceumFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const town = useMemo(() => {
    const value = searchParams.get('town')?.trim()
    return value && value.length > 0 ? value : ''
  }, [searchParams])

  const page = useMemo(
    () => parsePage(searchParams.get('page')),
    [searchParams],
  )

  const state = useMemo<LyceumFilterState>(
    () => ({
      town: town || undefined,
      page,
    }),
    [town, page],
  )

  const formDefaults = useMemo<LyceumFilterFormValues>(
    () => ({
      town,
    }),
    [town],
  )

  const query = useMemo<LyceumFilterQuery>(
    () => ({
      page: Math.max(0, page - 1),
      size: LYCEUMS_PAGE_SIZE,
      town: town || undefined,
    }),
    [page, town],
  )

  const applyFilters = useCallback(
    (values: LyceumFilterFormValues) => {
      const nextParams = new URLSearchParams()
      const normalizedTown = values.town.trim()

      if (normalizedTown) {
        nextParams.set('town', normalizedTown)
      }

      setSearchParams(nextParams)
    },
    [setSearchParams],
  )

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams())
  }, [setSearchParams])

  const setPage = useCallback(
    (nextPage: number) => {
      const nextParams = new URLSearchParams(searchParams)
      if (nextPage <= 1) {
        nextParams.delete('page')
      } else {
        nextParams.set('page', String(nextPage))
      }
      setSearchParams(nextParams)
    },
    [searchParams, setSearchParams],
  )

  return {
    state,
    query,
    formDefaults,
    applyFilters,
    clearFilters,
    setPage,
    pageSize: LYCEUMS_PAGE_SIZE,
  }
}
