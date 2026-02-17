import { useQuery } from '@tanstack/react-query'

import { findUserByEmail } from '../../../../services/users'
import type { ApiError } from '../../../../types/api'
import type { UserResponse } from '../../../../types/users'

const normalizeEmail = (email: string) => email.trim().toLocaleLowerCase()

export const adminUserByEmailQueryKey = (
  email: string,
) =>
  ['admin', 'users', 'by-email', normalizeEmail(email)] as const

type UseAdminUserByEmailOptions = {
  enabled?: boolean
}

export const useAdminUserByEmail = (
  email: string,
  options: UseAdminUserByEmailOptions = {},
) =>
  useQuery<UserResponse | null, ApiError>({
    queryKey: adminUserByEmailQueryKey(email),
    queryFn: () => findUserByEmail(email),
    enabled: (options.enabled ?? true) && email.trim().length > 0,
    retry: 1,
    staleTime: 60 * 1000,
  })
