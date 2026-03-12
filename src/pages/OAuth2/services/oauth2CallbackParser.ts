import type {
  OAuth2CallbackResult,
  OAuth2PendingFieldName,
} from '../types'

const toNonEmptyValue = (value: string | null): string | null => {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

const toPendingFieldName = (
  rawFieldName: string,
): OAuth2PendingFieldName | null => {
  const normalized = rawFieldName.trim().toLowerCase()

  if (normalized === 'username' || normalized === 'user_name') {
    return 'username'
  }
  if (normalized === 'email') {
    return 'email'
  }
  if (normalized === 'firstname' || normalized === 'first_name') {
    return 'firstname'
  }
  if (normalized === 'lastname' || normalized === 'last_name') {
    return 'lastname'
  }

  return null
}

const parseMissingFields = (
  rawMissingFields: string | null,
): OAuth2PendingFieldName[] => {
  if (!rawMissingFields) {
    return []
  }

  const parsedFields = rawMissingFields
    .split(',')
    .map((rawField) => toPendingFieldName(rawField))
    .filter((field): field is OAuth2PendingFieldName => field !== null)

  return Array.from(new Set(parsedFields))
}

const getErrorMessageKey = (rawError: string | null) => {
  const normalizedError = rawError?.trim().toLowerCase() ?? ''

  if (normalizedError === 'access_denied') {
    return 'errors.auth.oauth2Cancelled'
  }

  return 'errors.auth.oauth2Failed'
}

export const parseOAuth2CallbackHash = (rawHash: string): OAuth2CallbackResult => {
  const normalizedHash = rawHash.startsWith('#') ? rawHash.slice(1) : rawHash
  const params = new URLSearchParams(normalizedHash)

  const oauth2Error = toNonEmptyValue(params.get('error'))
  if (oauth2Error) {
    return {
      state: 'error',
      errorCode: 'error',
      messageKey: getErrorMessageKey(oauth2Error),
    }
  }

  const status = toNonEmptyValue(params.get('status'))
  if (!status) {
    return {
      state: 'error',
      errorCode: 'missing_data',
      messageKey: 'errors.auth.oauth2MissingCallbackData',
    }
  }

  if (status === 'complete') {
    const accessToken = toNonEmptyValue(params.get('access_token'))
    const refreshToken = toNonEmptyValue(params.get('refresh_token'))

    if (!accessToken || !refreshToken) {
      return {
        state: 'error',
        errorCode: 'invalid_data',
        messageKey: 'errors.auth.oauth2InvalidCallbackData',
      }
    }

    return {
      state: 'complete',
      accessToken,
      refreshToken,
    }
  }

  if (status === 'pending') {
    const registrationToken = toNonEmptyValue(params.get('registration_token'))

    if (!registrationToken) {
      return {
        state: 'error',
        errorCode: 'invalid_data',
        messageKey: 'errors.auth.oauth2InvalidCallbackData',
      }
    }

    return {
      state: 'pending',
      registrationToken,
      missingFields: parseMissingFields(params.get('missing_fields')),
    }
  }

  return {
    state: 'error',
    errorCode: 'invalid_data',
    messageKey: 'errors.auth.oauth2InvalidCallbackData',
  }
}
