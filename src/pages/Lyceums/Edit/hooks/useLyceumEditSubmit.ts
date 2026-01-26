import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import type { TFunction } from 'i18next'

import { useToast } from '../../../../components/feedback/ToastContext'
import { lyceumDetailQueryKey } from '../../hooks/useLyceum'
import { useUpdateLyceumMutation } from '../../hooks/useUpdateLyceumMutation'
import { buildLyceumUpdatePayload } from '../services/lyceumEditFormUtils'
import { getLyceumUpdateError } from '../services/lyceumEditErrors'
import type { AppError } from '../../../../types/appError'
import type { LyceumUpdateFormValues } from '../validations/lyceumUpdateSchema'

type UseLyceumEditSubmitOptions = {
  lyceumId: number
  isValidId: boolean
  t: TFunction
}

type LyceumEditSubmitState = {
  onSubmit: (values: LyceumUpdateFormValues) => void
  isSubmitting: boolean
  submitError: AppError | null
}

export const useLyceumEditSubmit = ({
  lyceumId,
  isValidId,
  t,
}: UseLyceumEditSubmitOptions): LyceumEditSubmitState => {
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const mutation = useUpdateLyceumMutation()

  const onSubmit = useCallback(
    (values: LyceumUpdateFormValues) => {
      if (!isValidId) return

      const payload = buildLyceumUpdatePayload(values)

      mutation.mutate(
        { id: lyceumId, payload },
        {
          onSuccess: (data) => {
            queryClient.setQueryData(lyceumDetailQueryKey(lyceumId), data)
            showToast({
              message: t('feedback.lyceums.updateSuccess'),
              tone: 'success',
            })
            navigate(`/lyceums/${lyceumId}`, { replace: true })
          },
        },
      )
    },
    [isValidId, lyceumId, mutation, queryClient, showToast, navigate, t],
  )

  const submitError = getLyceumUpdateError(mutation.error ?? null)

  return {
    onSubmit,
    isSubmitting: mutation.isPending,
    submitError,
  }
}
