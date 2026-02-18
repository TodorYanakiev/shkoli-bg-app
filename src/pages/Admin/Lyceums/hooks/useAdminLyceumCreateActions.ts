import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { useToast } from '../../../../components/feedback/ToastContext'
import type { ApiError } from '../../../../types/api'
import type {
  AdminLyceumCreatePayload,
  AdminLyceumCreateResult,
} from '../types'
import { adminLyceumsQueryKey } from './useAdminLyceums'
import { useCreateAdminLyceumMutation } from './useCreateAdminLyceumMutation'

type AdminLyceumCreateActions = {
  isCreating: boolean
  onCreate: (
    payload: AdminLyceumCreatePayload,
  ) => Promise<AdminLyceumCreateResult>
}

export const useAdminLyceumCreateActions = (): AdminLyceumCreateActions => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const mutation = useCreateAdminLyceumMutation()

  const onCreate = useCallback(
    async (payload: AdminLyceumCreatePayload) => {
      if (mutation.isPending) {
        return { ok: false, error: null }
      }

      try {
        await mutation.mutateAsync({
          payload,
        })
        await queryClient.invalidateQueries({ queryKey: adminLyceumsQueryKey })
        showToast({
          message: t('feedback.lyceums.createSuccess'),
          tone: 'success',
        })
        return { ok: true, error: null }
      } catch (error) {
        return { ok: false, error: error as ApiError }
      }
    },
    [mutation, queryClient, showToast, t],
  )

  return {
    isCreating: mutation.isPending,
    onCreate,
  }
}
