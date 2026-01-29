import type { AppError } from '../../../../types/appError'
import type { LyceumResponse } from '../../../../types/lyceums'
import type { AdminLyceumsPagination } from '../types'
import { useAdminLyceums } from './useAdminLyceums'
import { useAdminLyceumsPagination } from './useAdminLyceumsPagination'
import { getAdminLyceumsLoadError } from '../services/adminLyceumsErrors'

type AdminLyceumsData = {
  lyceums: LyceumResponse[]
  isLoading: boolean
  error: AppError | null
  pagination: AdminLyceumsPagination
}

export const useAdminLyceumsData = (): AdminLyceumsData => {
  const { data, isLoading, error } = useAdminLyceums()
  const allLyceums = data ?? []
  const { pageItems, pagination } = useAdminLyceumsPagination(allLyceums, {
    isLoading,
  })

  return {
    lyceums: pageItems,
    isLoading,
    error: getAdminLyceumsLoadError(error ?? null),
    pagination,
  }
}
