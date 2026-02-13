import type { TFunction } from 'i18next'
import type { UseFormSetError } from 'react-hook-form'

import type { ApiError } from '../../../../types/api'
import type { UpdateUserFormValues } from '../../../../validations/users'

const updateFormFieldByApiField: Partial<
  Record<string, keyof UpdateUserFormValues>
> = {
  firstname: 'firstname',
  firstName: 'firstname',
  lastname: 'lastname',
  lastName: 'lastname',
  username: 'username',
  email: 'email',
  description: 'description',
}

const getUpdateFieldValidationMessageKey = (
  field: keyof UpdateUserFormValues,
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

  return null
}

type ApplyUpdateUserServerFieldErrorsParams = {
  error: ApiError
  setError: UseFormSetError<UpdateUserFormValues>
  t: TFunction
}

export const applyUpdateUserServerFieldErrors = ({
  error,
  setError,
  t,
}: ApplyUpdateUserServerFieldErrorsParams) => {
  let hasMappedFieldError = false

  Object.entries(error.fieldErrors ?? {}).forEach(([rawField, rawMessage]) => {
    const formField = updateFormFieldByApiField[rawField]
    if (!formField) return

    const messageKey = getUpdateFieldValidationMessageKey(formField, rawMessage)
    if (!messageKey) return

    setError(formField, {
      type: 'server',
      message: t(messageKey),
    })
    hasMappedFieldError = true
  })

  if (!hasMappedFieldError && error.status === 400) {
    const normalizedMessage = error.message?.toLowerCase() ?? ''
    if (
      normalizedMessage.includes('email') &&
      normalizedMessage.includes('blank')
    ) {
      setError('email', {
        type: 'server',
        message: t('validation.required'),
      })
      hasMappedFieldError = true
    }
    if (
      normalizedMessage.includes('username') &&
      normalizedMessage.includes('blank')
    ) {
      setError('username', {
        type: 'server',
        message: t('validation.required'),
      })
      hasMappedFieldError = true
    }
    if (
      normalizedMessage.includes('username') &&
      normalizedMessage.includes('between') &&
      normalizedMessage.includes('3') &&
      normalizedMessage.includes('50')
    ) {
      setError('username', {
        type: 'server',
        message: t('validation.usernameRange'),
      })
      hasMappedFieldError = true
    }
    if (
      normalizedMessage.includes('email') &&
      normalizedMessage.includes('invalid')
    ) {
      setError('email', {
        type: 'server',
        message: t('validation.email'),
      })
    }
  }

  if (error.status !== 409) return

  const normalizedMessage = error.message?.toLowerCase() ?? ''
  if (normalizedMessage.includes('email')) {
    setError('email', {
      type: 'server',
      message: t('errors.profile.emailExists'),
    })
  }
  if (normalizedMessage.includes('username')) {
    setError('username', {
      type: 'server',
      message: t('errors.profile.usernameExists'),
    })
  }
}
