import { useMutation } from '@tanstack/react-query'

import { removeLyceumAdministrator } from '../../../../services/lyceums'
import type { ApiError } from '../../../../types/api'

type RemoveLyceumAdminPayload = {
  lyceumId: number
  userId: number
}

export const removeLyceumAdminMutationKey = [
  'admin',
  'lyceums',
  'admins',
  'remove',
] as const

export const useRemoveLyceumAdminMutation = () =>
  useMutation<void, ApiError, RemoveLyceumAdminPayload>({
    mutationKey: removeLyceumAdminMutationKey,
    mutationFn: ({ lyceumId, userId }) =>
      removeLyceumAdministrator(lyceumId, userId),
    retry: false,
  })
