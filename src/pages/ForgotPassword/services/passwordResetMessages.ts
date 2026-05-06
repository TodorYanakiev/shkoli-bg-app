import type { TFunction } from 'i18next'

import type { ApiError } from '../../../types/api'

export type PasswordResetEndpoint = 'request' | 'verify' | 'reset'

const REQUEST_SUCCESS_MESSAGE =
  'If an account with that email exists, we have sent a verification code.'
const VERIFY_SUCCESS_MESSAGE = 'Verification code confirmed.'
const RESET_SUCCESS_MESSAGE = 'Password has been reset successfully.'

const normalized = (message?: string) =>
  message?.replace(/\r\n/g, '\n').trim() ?? ''

const toMessageLines = (message?: string) =>
  normalized(message)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

const requestValidationMessages: Record<string, string> = {
  'Email must not be blank!':
    'errors.auth.passwordReset.messages.emailRequired',
  'Invalid email!': 'errors.auth.passwordReset.messages.emailInvalid',
}

const verifyValidationMessages: Record<string, string> = {
  ...requestValidationMessages,
  'Verification code must not be blank!':
    'errors.auth.passwordReset.messages.codeRequired',
}

const resetValidationMessages: Record<string, string> = {
  ...verifyValidationMessages,
  'New password must not be blank!':
    'errors.auth.passwordReset.messages.newPasswordRequired',
  'New password must be at least 8 characters long!':
    'errors.auth.passwordReset.messages.newPasswordMin',
  'Confirmation password must not be blank!':
    'errors.auth.passwordReset.messages.confirmationPasswordRequired',
  'Passwords do not match!':
    'errors.auth.passwordReset.messages.passwordsDoNotMatch',
}

const businessMessages: Record<string, string> = {
  'Invalid verification code.':
    'errors.auth.passwordReset.messages.invalidCode',
  'Verification code has expired.':
    'errors.auth.passwordReset.messages.expiredCode',
  'The user is disabled': 'errors.auth.passwordReset.messages.userDisabled',
  'Internal server error':
    'errors.auth.passwordReset.messages.internalServerError',
}

const statusFallbacks: Record<
  PasswordResetEndpoint,
  Partial<Record<number, string>>
> = {
  request: {
    400: 'errors.auth.passwordReset.requestInvalid',
    409: 'errors.auth.passwordReset.requestConflict',
    500: 'errors.auth.passwordReset.server',
  },
  verify: {
    400: 'errors.auth.passwordReset.verifyInvalid',
    403: 'errors.auth.passwordReset.userDisabled',
    500: 'errors.auth.passwordReset.server',
  },
  reset: {
    400: 'errors.auth.passwordReset.resetInvalid',
    403: 'errors.auth.passwordReset.userDisabled',
    500: 'errors.auth.passwordReset.server',
  },
}

const genericFallbacks: Record<PasswordResetEndpoint, string> = {
  request: 'errors.auth.passwordResetRequestFailed',
  verify: 'errors.auth.passwordResetVerifyFailed',
  reset: 'errors.auth.passwordResetFailed',
}

const validationMessagesByEndpoint: Record<
  PasswordResetEndpoint,
  Record<string, string>
> = {
  request: requestValidationMessages,
  verify: verifyValidationMessages,
  reset: resetValidationMessages,
}

const toLocalizedMessageLines = (
  lines: string[],
  endpoint: PasswordResetEndpoint,
  t: TFunction,
) => {
  const validationMessages = validationMessagesByEndpoint[endpoint]

  return lines.map((line) => {
    const key = validationMessages[line] ?? businessMessages[line]
    return key ? t(key) : line
  })
}

export const getPasswordResetSuccessMessage = (
  endpoint: PasswordResetEndpoint,
  responseMessage: string | undefined,
  t: TFunction,
) => {
  const message = normalized(responseMessage)

  if (endpoint === 'request' && message === REQUEST_SUCCESS_MESSAGE) {
    return t('feedback.auth.passwordResetCodeSent')
  }

  if (endpoint === 'verify' && message === VERIFY_SUCCESS_MESSAGE) {
    return t('feedback.auth.passwordResetCodeVerified')
  }

  if (endpoint === 'reset' && message === RESET_SUCCESS_MESSAGE) {
    return t('feedback.auth.passwordResetSuccess')
  }

  if (message) {
    return message
  }

  if (endpoint === 'request') {
    return t('feedback.auth.passwordResetCodeSent')
  }

  if (endpoint === 'verify') {
    return t('feedback.auth.passwordResetCodeVerified')
  }

  return t('feedback.auth.passwordResetSuccess')
}

export const getPasswordResetErrorMessage = (
  endpoint: PasswordResetEndpoint,
  error: ApiError | null,
  t: TFunction,
) => {
  if (!error) return null

  if (error.kind === 'network') {
    return t('errors.network')
  }

  const lines = toMessageLines(error.message)

  if (lines.length > 0) {
    return toLocalizedMessageLines(lines, endpoint, t).join('\n')
  }

  const statusFallback = statusFallbacks[endpoint][error.status]
  if (statusFallback) {
    return t(statusFallback)
  }

  return t(genericFallbacks[endpoint])
}
