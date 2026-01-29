import { useMutation } from '@tanstack/react-query'

import { assignLyceumAdministrator } from '../../../../services/lyceums'
import type { ApiError } from '../../../../types/api'

type AssignLyceumAdminPayload = {
  lyceumId: number
  userId: number
}

export const assignLyceumAdminMutationKey = [
  'admin',
  'lyceums',
  'admins',
  'assign',
] as const

export const useAssignLyceumAdminMutation = () =>
  useMutation<void, ApiError, AssignLyceumAdminPayload>({
    mutationKey: assignLyceumAdminMutationKey,
    mutationFn: ({ lyceumId, userId }) =>
      assignLyceumAdministrator(lyceumId, userId),
    retry: false,
  })
