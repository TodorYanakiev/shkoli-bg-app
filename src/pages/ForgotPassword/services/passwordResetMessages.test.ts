import { beforeAll, describe, expect, it } from 'vitest'

import i18n from '../../../locales/i18n'
import type { ApiError } from '../../../types/api'
import {
  getPasswordResetErrorMessage,
  getPasswordResetSuccessMessage,
  type PasswordResetEndpoint,
} from './passwordResetMessages'

const apiError = (
  endpoint: PasswordResetEndpoint,
  status: number,
  message?: string,
): [PasswordResetEndpoint, ApiError] => [
  endpoint,
  {
    status,
    kind: status === 403 ? 'forbidden' : 'unknown',
    message,
  },
]

beforeAll(async () => {
  await i18n.changeLanguage('en')
})

describe('password reset API message mapping', () => {
  it.each([
    [
      'request' as const,
      'If an account with that email exists, we have sent a verification code.',
      'Verification code sent.',
    ],
    ['verify' as const, 'Verification code confirmed.', 'Verification code confirmed.'],
    [
      'reset' as const,
      'Password has been reset successfully.',
      'Password reset successfully.',
    ],
  ])('maps %s success output', (endpoint, response, expected) => {
    expect(getPasswordResetSuccessMessage(endpoint, response, i18n.t)).toBe(
      expected,
    )
  })

  it.each([
    [
      ...apiError(
        'request',
        400,
        'Email must not be blank!\nInvalid email!',
      ),
      'Email must not be blank.\nEnter a valid email address.',
    ],
    [
      ...apiError('request', 409),
      "We couldn't create a new reset code because of a data conflict. Try again.",
    ],
    [
      ...apiError('request', 500, 'Internal server error'),
      'Internal server error. Please try again.',
    ],
    [
      ...apiError('verify', 400, 'Verification code must not be blank!'),
      'Verification code must not be blank.',
    ],
    [
      ...apiError('verify', 400, 'Invalid verification code.'),
      'Invalid verification code.',
    ],
    [
      ...apiError('verify', 400, 'Verification code has expired.'),
      'Verification code has expired.',
    ],
    [...apiError('verify', 403, 'The user is disabled'), 'This account is disabled.'],
    [...apiError('verify', 500), 'Internal server error. Please try again.'],
    [
      ...apiError(
        'reset',
        400,
        [
          'Email must not be blank!',
          'Invalid email!',
          'Verification code must not be blank!',
          'New password must not be blank!',
          'New password must be at least 8 characters long!',
          'Confirmation password must not be blank!',
          'Passwords do not match!',
        ].join('\n'),
      ),
      [
        'Email must not be blank.',
        'Enter a valid email address.',
        'Verification code must not be blank.',
        'New password must not be blank.',
        'New password must be at least 8 characters long.',
        'Confirmation password must not be blank.',
        'Passwords do not match.',
      ].join('\n'),
    ],
    [
      ...apiError('reset', 400, 'Invalid verification code.'),
      'Invalid verification code.',
    ],
    [
      ...apiError('reset', 400, 'Verification code has expired.'),
      'Verification code has expired.',
    ],
    [...apiError('reset', 403, 'The user is disabled'), 'This account is disabled.'],
    [...apiError('reset', 500), 'Internal server error. Please try again.'],
    [
      'request' as const,
      { status: 0, kind: 'network' as const },
      "We couldn't reach the server. Try again.",
    ],
  ])('maps %s error output', (endpoint, error, expected) => {
    expect(getPasswordResetErrorMessage(endpoint, error, i18n.t)).toBe(expected)
  })
})
