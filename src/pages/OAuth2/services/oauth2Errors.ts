import type { ApiError } from '../../../types/api'
import type { AppError } from '../../../types/appError'
import type { OAuth2CompleteProfileFormValues } from '../types'

const isApiError = (value: unknown): value is ApiError => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Partial<ApiError>
  return (
    typeof candidate.status === 'number' &&
    typeof candidate.kind === 'string'
  )
}

const completeProfileFieldByApiField: Partial<
  Record<string, keyof OAuth2CompleteProfileFormValues>
> = {
  username: 'username',
  userName: 'username',
  email: 'email',
  firstname: 'firstname',
  firstName: 'firstname',
  lastname: 'lastname',
  lastName: 'lastname',
  description: 'description',
}

const toValidationMessageKey = (
  field: keyof OAuth2CompleteProfileFormValues,
  message: string,
): string | null => {
  const normalizedMessage = message.toLowerCase()

  if (
    normalizedMessage.includes('blank') ||
    normalizedMessage.includes('required') ||
    normalizedMessage.includes('must not be null')
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

const toAppFieldErrors = (
  fieldErrors: Record<string, string> | undefined,
): Record<string, string> | undefined => {
  if (!fieldErrors) {
    return undefined
  }

  const mappedFieldErrors = Object.entries(fieldErrors)
    .map(([rawField, rawMessage]) => {
      const formField = completeProfileFieldByApiField[rawField]
      if (!formField) {
        return null
      }

      const messageKey = toValidationMessageKey(formField, rawMessage)
      if (!messageKey) {
        return null
      }

      return [formField, messageKey] as [string, string]
    })
    .filter((entry): entry is [string, string] => entry !== null)

  return mappedFieldErrors.length > 0
    ? Object.fromEntries(mappedFieldErrors)
    : undefined
}

const getConflictMessageKey = (error: ApiError) => {
  const normalizedMessage = error.message?.toLowerCase() ?? ''
  const hasEmailError = Boolean(error.fieldErrors?.email)
  const hasUsernameError = Boolean(error.fieldErrors?.username)

  if (
    hasEmailError ||
    hasUsernameError ||
    normalizedMessage.includes('email') ||
    normalizedMessage.includes('username')
  ) {
    return 'errors.auth.userExists'
  }

  return 'errors.auth.oauth2CompleteFailed'
}

export const toOAuth2CompleteError = (error: unknown): AppError => {
  if (!isApiError(error)) {
    return {
      type: 'unknown',
      messageKey: 'errors.auth.oauth2CompleteFailed',
    }
  }

  if (error.kind === 'network') {
    return {
      type: 'network',
      status: error.status,
      messageKey: 'errors.network',
    }
  }

  if (error.kind === 'unauthorized' || error.status === 401) {
    return {
      type: 'auth',
      status: error.status,
      messageKey: 'errors.auth.oauth2RegistrationExpired',
    }
  }

  if (error.kind === 'forbidden' || error.status === 403) {
    return {
      type: 'forbidden',
      status: error.status,
      messageKey: 'errors.auth.forbidden',
    }
  }

  if (error.status === 404) {
    return {
      type: 'notFound',
      status: error.status,
      messageKey: 'errors.auth.oauth2RegistrationExpired',
    }
  }

  if (error.status === 409) {
    return {
      type: 'validation',
      status: error.status,
      messageKey: getConflictMessageKey(error),
      fieldErrors: toAppFieldErrors(error.fieldErrors),
    }
  }

  if (error.status === 400 || error.status === 422) {
    return {
      type: 'validation',
      status: error.status,
      messageKey: 'errors.auth.oauth2CompleteInvalid',
      fieldErrors: toAppFieldErrors(error.fieldErrors),
    }
  }

  if (error.status >= 500) {
    return {
      type: 'server',
      status: error.status,
      messageKey: 'errors.auth.oauth2CompleteFailed',
    }
  }

  return {
    type: 'unknown',
    status: error.status,
    messageKey: 'errors.auth.oauth2CompleteFailed',
  }
}
