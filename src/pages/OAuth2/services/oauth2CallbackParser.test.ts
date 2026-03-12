import { describe, expect, it } from 'vitest'

import { parseOAuth2CallbackHash } from './oauth2CallbackParser'

describe('parseOAuth2CallbackHash', () => {
  it('parses complete status payload', () => {
    const result = parseOAuth2CallbackHash(
      '#status=complete&access_token=access&refresh_token=refresh',
    )

    expect(result).toEqual({
      state: 'complete',
      accessToken: 'access',
      refreshToken: 'refresh',
    })
  })

  it('parses pending status payload', () => {
    const result = parseOAuth2CallbackHash(
      '#status=pending&registration_token=token&missing_fields=username,email,firstname,lastname',
    )

    expect(result).toEqual({
      state: 'pending',
      registrationToken: 'token',
      missingFields: ['username', 'email', 'firstname', 'lastname'],
    })
  })

  it('maps error payload', () => {
    const result = parseOAuth2CallbackHash('#error=access_denied')

    expect(result).toEqual({
      state: 'error',
      errorCode: 'error',
      messageKey: 'errors.auth.oauth2Cancelled',
    })
  })

  it('returns invalid callback data when required tokens are missing', () => {
    const result = parseOAuth2CallbackHash('#status=complete&access_token=access')

    expect(result).toEqual({
      state: 'error',
      errorCode: 'invalid_data',
      messageKey: 'errors.auth.oauth2InvalidCallbackData',
    })
  })
})
