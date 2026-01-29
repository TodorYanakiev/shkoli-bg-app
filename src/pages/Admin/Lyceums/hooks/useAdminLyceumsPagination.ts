import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import type { LyceumResponse } from '../../../../types/lyceums'
import type { AdminLyceumsPaginationResult } from '../types'

const PAGE_PARAM = 'page'
const DEFAULT_PAGE = 1
const PAGE_SIZE = 9

type UseAdminLyceumsPaginationOptions = {
  isLoading?: boolean
}

const clampPage = (page: number, totalPages: number) =>
  Math.min(Math.max(page, 1), totalPages)

export const useAdminLyceumsPagination = (
  items: LyceumResponse[],
  options: UseAdminLyceumsPaginationOptions = {},
): AdminLyceumsPaginationResult => {
  const [searchParams, setSearchParams] = useSearchParams()
  const totalItems = items.length
  const rawPage = Number(searchParams.get(PAGE_PARAM))
  const parsedPage = Number.isFinite(rawPage)
    ? Math.floor(rawPage)
    : DEFAULT_PAGE
  const safePage = parsedPage > 0 ? parsedPage : DEFAULT_PAGE
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
  const currentPage = clampPage(safePage, totalPages)

  useEffect(() => {
    if (options.isLoading) return
    if (currentPage === safePage) return
    const nextParams = new URLSearchParams(searchParams)
    if (currentPage === DEFAULT_PAGE) {
      nextParams.delete(PAGE_PARAM)
    } else {
      nextParams.set(PAGE_PARAM, String(currentPage))
    }
    setSearchParams(nextParams, { replace: true })
  }, [currentPage, options.isLoading, safePage, searchParams, setSearchParams])

  const startIndex = (currentPage - 1) * PAGE_SIZE
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalItems)

  const pageItems = useMemo(
    () => items.slice(startIndex, endIndex),
    [items, startIndex, endIndex],
  )

  const goToPage = (page: number) => {
    const nextPage = clampPage(page, totalPages)
    const nextParams = new URLSearchParams(searchParams)
    if (nextPage === DEFAULT_PAGE) {
      nextParams.delete(PAGE_PARAM)
    } else {
      nextParams.set(PAGE_PARAM, String(nextPage))
    }
    setSearchParams(nextParams)
  }

  return {
    pageItems,
    pagination: {
      currentPage,
      totalPages,
      pageSize: PAGE_SIZE,
      totalItems,
      pageStart: totalItems === 0 ? 0 : startIndex + 1,
      pageEnd: endIndex,
      canGoPrev: currentPage > 1,
      canGoNext: currentPage < totalPages && totalItems > 0,
      hasMultiplePages: totalPages > 1,
      goToPrev: () => goToPage(currentPage - 1),
      goToNext: () => goToPage(currentPage + 1),
    },
  }
}
