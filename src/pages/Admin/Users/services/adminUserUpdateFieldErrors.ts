import type { TFunction } from 'i18next'
import type { UseFormSetError } from 'react-hook-form'

import type { ApiError } from '../../../../types/api'
import type { AdminUserEditFormValues } from '../validations/adminUserEditSchema'

const updateFormFieldByApiField: Partial<
  Record<string, keyof AdminUserEditFormValues>
> = {
  firstname: 'firstname',
  firstName: 'firstname',
  lastname: 'lastname',
  lastName: 'lastname',
  username: 'username',
  email: 'email',
  role: 'role',
  description: 'description',
}

const getFieldValidationMessageKey = (
  field: keyof AdminUserEditFormValues,
  message: string,
): string | null => {
  const normalizedMessage = message.toLowerCase()

  if (
    normalizedMessage.includes('blank') ||
    normalizedMessage.includes('required')
  ) {
    return 'validation.required'
  }

  if (field === 'email' && normalizedMessage.includes('email')) {
    return 'validation.email'
  }

  if (field === 'username') {
    if (
      normalizedMessage.includes('between') &&
      normalizedMessage.includes('3') &&
      normalizedMessage.includes('50')
    ) {
      return 'validation.usernameRange'
    }
    if (
      normalizedMessage.includes('at least') ||
      normalizedMessage.includes('minimum')
    ) {
      return 'validation.usernameMin'
    }
    if (
      normalizedMessage.includes('at most') ||
      normalizedMessage.includes('maximum')
    ) {
      return 'validation.usernameMax'
    }
  }

  if (field === 'description' && normalizedMessage.includes('500')) {
    return 'validation.descriptionMax'
  }

  if (field === 'role') {
    return 'validation.invalidOption'
  }

  return null
}

type ApplyAdminUserUpdateFieldErrorsParams = {
  error: ApiError
  setError: UseFormSetError<AdminUserEditFormValues>
  t: TFunction
}

export const applyAdminUserUpdateFieldErrors = ({
  error,
  setError,
  t,
}: ApplyAdminUserUpdateFieldErrorsParams) => {
  let hasMappedFieldError = false

  Object.entries(error.fieldErrors ?? {}).forEach(([rawField, rawMessage]) => {
    const formField = updateFormFieldByApiField[rawField]
    if (!formField) return
    const messageKey = getFieldValidationMessageKey(formField, rawMessage)
    if (!messageKey) return

    setError(formField, {
      type: 'server',
      message: t(messageKey),
    })
    hasMappedFieldError = true
  })

  if (error.status === 409) {
    const normalizedMessage = error.message?.toLowerCase() ?? ''
    if (error.fieldErrors?.email || normalizedMessage.includes('email')) {
      setError('email', {
        type: 'server',
        message: t('errors.users.emailExists'),
      })
      hasMappedFieldError = true
    }
    if (
      error.fieldErrors?.username ||
      normalizedMessage.includes('username')
    ) {
      setError('username', {
        type: 'server',
        message: t('errors.users.usernameExists'),
      })
      hasMappedFieldError = true
    }
  }

  return hasMappedFieldError
}
