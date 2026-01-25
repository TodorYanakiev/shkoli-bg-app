import { zodResolver } from '@hookform/resolvers/zod'
import type { TFunction } from 'i18next'
import { useMemo } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'

import {
  getLyceumLecturerSchema,
  type LyceumLecturerFormValues,
} from '../../validations/lyceumLecturerSchema'

type LyceumLecturerFormResult = {
  form: UseFormReturn<LyceumLecturerFormValues>
  trimmedEmailValue: string
}

export const useLyceumLecturerForm = (t: TFunction): LyceumLecturerFormResult => {
  const schema = useMemo(() => getLyceumLecturerSchema(t), [t])
  const form = useForm<LyceumLecturerFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
    },
  })
  const emailValue = form.watch('email') ?? ''
  const trimmedEmailValue = emailValue.trim().toLowerCase()

  return { form, trimmedEmailValue }
}
