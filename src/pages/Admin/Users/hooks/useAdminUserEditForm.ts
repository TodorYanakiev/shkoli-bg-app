import { useEffect, useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { TFunction } from 'i18next'

import type { UserResponse } from '../../../../types/users'
import {
  getAdminUserEditSchema,
  type AdminUserEditFormValues,
} from '../validations/adminUserEditSchema'

type UseAdminUserEditFormOptions = {
  user?: UserResponse | null
  isOpen: boolean
  t: TFunction
}

export const useAdminUserEditForm = ({
  user,
  isOpen,
  t,
}: UseAdminUserEditFormOptions) => {
  const schema = useMemo(() => getAdminUserEditSchema(t), [t])

  const form = useForm<AdminUserEditFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstname: '',
      lastname: '',
      username: '',
      email: '',
      description: '',
    },
  })

  const { reset } = form

  useEffect(() => {
    if (!isOpen) {
      reset({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        description: '',
      })
      return
    }

    reset({
      firstname: user?.firstname ?? user?.firstName ?? '',
      lastname: user?.lastname ?? user?.lastName ?? '',
      username: user?.username ?? '',
      email: user?.email ?? '',
      description: user?.description ?? '',
    })
  }, [isOpen, reset, user])

  return form
}

