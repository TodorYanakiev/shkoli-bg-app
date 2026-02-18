import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import type { TFunction } from 'i18next'

import {
  getAdminLyceumCreateSchema,
  type AdminLyceumCreateFormValues,
} from '../validations/adminLyceumCreateSchema'

type UseAdminLyceumCreateFormOptions = {
  isOpen: boolean
  t: TFunction
}

const defaultValues: AdminLyceumCreateFormValues = {
  name: '',
  chitalishtaUrl: '',
  status: '',
  bulstat: '',
  chairman: '',
  secretary: '',
  phone: '',
  town: '',
  region: '',
  municipality: '',
  address: '',
  urlToLibrariesSite: '',
  registrationNumber: '',
  longitude: '',
  latitude: '',
  email: '',
}

export const useAdminLyceumCreateForm = ({
  isOpen,
  t,
}: UseAdminLyceumCreateFormOptions) => {
  const schema = useMemo(() => getAdminLyceumCreateSchema(t), [t])
  const form = useForm<AdminLyceumCreateFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })
  const { reset } = form

  useEffect(() => {
    if (isOpen) return
    reset(defaultValues)
  }, [isOpen, reset])

  return form
}
