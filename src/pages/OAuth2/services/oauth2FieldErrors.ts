import type { TFunction } from 'i18next'
import type { UseFormSetError } from 'react-hook-form'

import type { AppError } from '../../../types/appError'
import type { OAuth2CompleteProfileFormValues } from '../types'

const oauth2FormFields: Array<keyof OAuth2CompleteProfileFormValues> = [
  'username',
  'email',
  'firstname',
  'lastname',
  'description',
]

const isOAuth2FormField = (
  fieldName: string,
): fieldName is keyof OAuth2CompleteProfileFormValues =>
  oauth2FormFields.includes(fieldName as keyof OAuth2CompleteProfileFormValues)

type ApplyOAuth2FieldErrorsParams = {
  error: AppError
  setError: UseFormSetError<OAuth2CompleteProfileFormValues>
  t: TFunction
}

export const applyOAuth2CompleteFieldErrors = ({
  error,
  setError,
  t,
}: ApplyOAuth2FieldErrorsParams) => {
  let hasMappedErrors = false

  Object.entries(error.fieldErrors ?? {}).forEach(([fieldName, messageKey]) => {
    if (!isOAuth2FormField(fieldName)) {
      return
    }

    setError(fieldName, {
      type: 'server',
      message: t(messageKey),
    })
    hasMappedErrors = true
  })

  return hasMappedErrors
}
