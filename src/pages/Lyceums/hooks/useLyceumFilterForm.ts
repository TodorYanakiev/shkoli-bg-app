import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import {
  getLyceumFilterSchema,
  type LyceumFilterFormValues,
} from '../validations/lyceumFilterSchema'

type UseLyceumFilterFormOptions = {
  defaultValues: LyceumFilterFormValues
}

export const useLyceumFilterForm = ({
  defaultValues,
}: UseLyceumFilterFormOptions) => {
  const schema = getLyceumFilterSchema()

  const form = useForm<LyceumFilterFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const { reset } = form

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  return form
}
