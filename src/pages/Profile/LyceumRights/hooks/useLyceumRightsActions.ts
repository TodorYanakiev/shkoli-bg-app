import { useQueryClient } from '@tanstack/react-query'
import type { TFunction } from 'i18next'
import { useState } from 'react'
import type { NavigateOptions } from 'react-router-dom'

import type { ToastContextValue } from '../../../../components/feedback/ToastContext'
import { userProfileQueryKey } from '../../hooks/useUserProfile'
import {
  type LyceumRightsRequestFormValues,
  type LyceumRightsVerificationFormValues,
} from '../validations/lyceumRightsSchemas'
import { useRequestLyceumRightsMutation } from './useRequestLyceumRightsMutation'
import { useVerifyLyceumRightsMutation } from './useVerifyLyceumRightsMutation'
import type { RequestOutcome } from '../types'
import { parseRequestOutcome } from '../services/lyceumRightsOutcome'

type UseLyceumRightsActionsOptions = {
  t: TFunction
  showToast: ToastContextValue['showToast']
  navigate: (to: string, options?: NavigateOptions) => void
  resetRequest: () => void
  resetVerify: () => void
}

type UseLyceumRightsActionsResult = {
  requestMutation: ReturnType<typeof useRequestLyceumRightsMutation>
  verifyMutation: ReturnType<typeof useVerifyLyceumRightsMutation>
  requestedLyceum: LyceumRightsRequestFormValues | null
  requestOutcome: RequestOutcome | null
  handleRequestSubmit: (values: LyceumRightsRequestFormValues) => void
  handleVerifySubmit: (values: LyceumRightsVerificationFormValues) => void
  handleStartOver: () => void
}

export const useLyceumRightsActions = ({
  t,
  showToast,
  navigate,
  resetRequest,
  resetVerify,
}: UseLyceumRightsActionsOptions): UseLyceumRightsActionsResult => {
  const queryClient = useQueryClient()
  const requestMutation = useRequestLyceumRightsMutation()
  const verifyMutation = useVerifyLyceumRightsMutation()
  const [requestedLyceum, setRequestedLyceum] =
    useState<LyceumRightsRequestFormValues | null>(null)
  const [requestOutcome, setRequestOutcome] = useState<RequestOutcome | null>(
    null,
  )

  const handleRequestSubmit = (values: LyceumRightsRequestFormValues) => {
    setRequestOutcome(null)
    requestMutation.mutate(values, {
      onSuccess: (message) => {
        const outcome = parseRequestOutcome(message)
        setRequestOutcome(outcome)
        if (outcome.type === 'emailSent') {
          setRequestedLyceum(values)
          showToast({
            message: t('feedback.profile.lyceumRightsRequested'),
            tone: 'success',
          })
        } else {
          setRequestedLyceum(null)
        }
      },
      onError: (error) => {
        setRequestedLyceum(null)
        if (error.status === 409) {
          setRequestOutcome({ type: 'alreadyAdminOther' })
        }
      },
    })
  }

  const handleVerifySubmit = (values: LyceumRightsVerificationFormValues) => {
    verifyMutation.mutate(values, {
      onSuccess: () => {
        showToast({
          message: t('feedback.profile.lyceumRightsVerified'),
          tone: 'success',
        })
        queryClient.invalidateQueries({ queryKey: userProfileQueryKey })
        resetVerify()
        resetRequest()
        setRequestedLyceum(null)
        setRequestOutcome(null)
        navigate('/profile', { replace: true })
      },
    })
  }

  const handleStartOver = () => {
    setRequestedLyceum(null)
    setRequestOutcome(null)
    resetRequest()
    resetVerify()
    requestMutation.reset()
    verifyMutation.reset()
  }

  return {
    requestMutation,
    verifyMutation,
    requestedLyceum,
    requestOutcome,
    handleRequestSubmit,
    handleVerifySubmit,
    handleStartOver,
  }
}
