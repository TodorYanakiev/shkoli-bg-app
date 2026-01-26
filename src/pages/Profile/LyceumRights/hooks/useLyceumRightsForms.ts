import { zodResolver } from '@hookform/resolvers/zod'
import type { TFunction } from 'i18next'
import { useMemo } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'

import {
  getLyceumRightsRequestSchema,
  getLyceumRightsVerificationSchema,
  type LyceumRightsRequestFormValues,
  type LyceumRightsVerificationFormValues,
} from '../validations/lyceumRightsSchemas'

type LyceumRightsForms = {
  requestForm: UseFormReturn<LyceumRightsRequestFormValues>
  verifyForm: UseFormReturn<LyceumRightsVerificationFormValues>
  selectedTown: string
  lyceumNameValue: string
  trimmedLyceumName: string
  shouldFetchSuggestions: boolean
}

export const useLyceumRightsForms = (t: TFunction): LyceumRightsForms => {
  const requestSchema = useMemo(() => getLyceumRightsRequestSchema(t), [t])
  const verifySchema = useMemo(() => getLyceumRightsVerificationSchema(t), [t])

  const requestForm = useForm<LyceumRightsRequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      lyceumName: '',
      town: '',
    },
  })

  const verifyForm = useForm<LyceumRightsVerificationFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      verificationCode: '',
    },
  })

  const selectedTown = requestForm.watch('town') ?? ''
  const lyceumNameValue = requestForm.watch('lyceumName') ?? ''
  const trimmedLyceumName = lyceumNameValue.trim()
  const shouldFetchSuggestions =
    Boolean(selectedTown) || Boolean(trimmedLyceumName)

  return {
    requestForm,
    verifyForm,
    selectedTown,
    lyceumNameValue,
    trimmedLyceumName,
    shouldFetchSuggestions,
  }
}
