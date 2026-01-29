import { useQuery } from '@tanstack/react-query'

import { getLyceumAdmins } from '../../../../services/lyceums'
import type { ApiError } from '../../../../types/api'
import type { UserResponse } from '../../../../types/users'

export const adminLyceumAdminsQueryKey = (lyceumId: number) =>
  ['admin', 'lyceums', lyceumId, 'admins'] as const

type UseAdminLyceumAdminsOptions = {
  enabled?: boolean
}

export const useAdminLyceumAdmins = (
  lyceumId: number,
  options: UseAdminLyceumAdminsOptions = {},
) =>
  useQuery<UserResponse[], ApiError>({
    queryKey: adminLyceumAdminsQueryKey(lyceumId),
    queryFn: () => getLyceumAdmins(lyceumId),
    enabled: options.enabled ?? true,
    retry: 1,
    staleTime: 2 * 60 * 1000,
  })
