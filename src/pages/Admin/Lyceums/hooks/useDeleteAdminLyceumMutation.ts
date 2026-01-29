import { useMutation } from '@tanstack/react-query'

import { deleteLyceum } from '../../../../services/lyceums'
import type { ApiError } from '../../../../types/api'

type DeleteAdminLyceumPayload = {
  id: number
}

export const deleteAdminLyceumMutationKey = [
  'admin',
  'lyceums',
  'delete',
] as const

export const useDeleteAdminLyceumMutation = () =>
  useMutation<void, ApiError, DeleteAdminLyceumPayload>({
    mutationKey: deleteAdminLyceumMutationKey,
    mutationFn: ({ id }) => deleteLyceum(id),
    retry: false,
  })
