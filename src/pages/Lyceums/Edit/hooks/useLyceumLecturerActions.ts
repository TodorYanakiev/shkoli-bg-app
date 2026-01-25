import { useQueryClient } from '@tanstack/react-query'
import type { TFunction } from 'i18next'
import { useState } from 'react'

import type { ToastContextValue } from '../../../../components/feedback/ToastContext'
import { lyceumLecturersQueryKey } from '../../hooks/useLyceumLecturers'
import { useInviteLyceumLecturerMutation } from '../../hooks/useInviteLyceumLecturerMutation'
import { useRemoveLyceumLecturerMutation } from '../../hooks/useRemoveLyceumLecturerMutation'
import type { LyceumLecturerFormValues } from '../../validations/lyceumLecturerSchema'

type UseLyceumLecturerActionsOptions = {
  lyceumId: number
  resetForm: () => void
  showToast: ToastContextValue['showToast']
  t: TFunction
}

export const useLyceumLecturerActions = ({
  lyceumId,
  resetForm,
  showToast,
  t,
}: UseLyceumLecturerActionsOptions) => {
  const queryClient = useQueryClient()
  const inviteMutation = useInviteLyceumLecturerMutation()
  const removeMutation = useRemoveLyceumLecturerMutation()
  const [removingId, setRemovingId] = useState<number | null>(null)

  const handleAddSubmit = (values: LyceumLecturerFormValues) => {
    const normalizedEmail = values.email.trim().toLowerCase()
    inviteMutation.reset()
    inviteMutation.mutate(
      { email: normalizedEmail, lyceumId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: lyceumLecturersQueryKey(lyceumId),
          })
          resetForm()
          showToast({
            message: t('feedback.lyceums.lecturerAdded'),
            tone: 'success',
          })
        },
      },
    )
  }

  const handleRemove = (userId?: number) => {
    if (!userId) return
    removeMutation.reset()
    setRemovingId(userId)
    removeMutation.mutate(
      { lyceumId, userId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: lyceumLecturersQueryKey(lyceumId),
          })
          setRemovingId(null)
          showToast({
            message: t('feedback.lyceums.lecturerRemoved'),
            tone: 'success',
          })
        },
        onError: () => {
          setRemovingId(null)
        },
      },
    )
  }

  return {
    inviteMutation,
    removeMutation,
    removingId,
    handleAddSubmit,
    handleRemove,
  }
}
