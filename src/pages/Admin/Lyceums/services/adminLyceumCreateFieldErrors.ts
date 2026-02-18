import type { TFunction } from 'i18next'
import type { UseFormSetError } from 'react-hook-form'

import type { ApiError } from '../../../../types/api'
import type { AdminLyceumCreateFormValues } from '../validations/adminLyceumCreateSchema'

const createFormFieldByApiField: Partial<
  Record<string, keyof AdminLyceumCreateFormValues>
> = {
  name: 'name',
  chitalishtaUrl: 'chitalishtaUrl',
  status: 'status',
  bulstat: 'bulstat',
  chairman: 'chairman',
  secretary: 'secretary',
  phone: 'phone',
  town: 'town',
  region: 'region',
  municipality: 'municipality',
  address: 'address',
  urlToLibrariesSite: 'urlToLibrariesSite',
  registrationNumber: 'registrationNumber',
  longitude: 'longitude',
  latitude: 'latitude',
  email: 'email',
}

const numericFields = new Set<keyof AdminLyceumCreateFormValues>([
  'registrationNumber',
  'longitude',
  'latitude',
])

const getValidationMessageKey = (
  field: keyof AdminLyceumCreateFormValues,
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

  if (
    numericFields.has(field) &&
    (normalizedMessage.includes('number') ||
      normalizedMessage.includes('numeric'))
  ) {
    return 'validation.number'
  }

  return null
}

type ApplyAdminLyceumCreateFieldErrorsParams = {
  error: ApiError
  setError: UseFormSetError<AdminLyceumCreateFormValues>
  t: TFunction
}

export const applyAdminLyceumCreateFieldErrors = ({
  error,
  setError,
  t,
}: ApplyAdminLyceumCreateFieldErrorsParams) => {
  let hasMappedFieldError = false

  Object.entries(error.fieldErrors ?? {}).forEach(([rawField, rawMessage]) => {
    const formField = createFormFieldByApiField[rawField]
    if (!formField) return

    const messageKey = getValidationMessageKey(formField, rawMessage)
    if (!messageKey) return

    setError(formField, {
      type: 'server',
      message: t(messageKey),
    })
    hasMappedFieldError = true
  })

  return hasMappedFieldError
}
