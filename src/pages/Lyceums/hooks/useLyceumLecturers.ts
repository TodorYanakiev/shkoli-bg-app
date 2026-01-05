import { useQuery } from '@tanstack/react-query'

import { getLyceumLecturers } from '../../../services/lyceums'
import type { ApiError } from '../../../types/api'
import type { UserResponse } from '../../../types/users'

export const lyceumLecturersQueryKey = (id?: number) =>
  ['lyceums', 'lecturers', id] as const

type UseLyceumLecturersOptions = {
  enabled?: boolean
}

export const useLyceumLecturers = (
  id?: number,
  options: UseLyceumLecturersOptions = {},
) =>
  useQuery<UserResponse[], ApiError>({
    queryKey: lyceumLecturersQueryKey(id),
    queryFn: () => getLyceumLecturers(id as number),
    enabled: Boolean(id) && (options.enabled ?? true),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  })
