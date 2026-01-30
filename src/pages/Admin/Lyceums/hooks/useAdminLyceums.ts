import { useQuery } from '@tanstack/react-query'

import type { ApiError } from '../../../../types/api'
import type { LyceumResponse } from '../../../../types/lyceums'
import { fetchAdminLyceums } from '../services/adminLyceumsService'

export const adminLyceumsQueryKey = ['admin', 'lyceums'] as const

export const useAdminLyceums = () =>
  useQuery<LyceumResponse[], ApiError>({
    queryKey: adminLyceumsQueryKey,
    queryFn: fetchAdminLyceums,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  })
