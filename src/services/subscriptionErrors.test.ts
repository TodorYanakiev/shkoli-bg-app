import { describe, expect, it } from 'vitest'

import {
  createInvalidSubscriptionTargetError,
  mapSubscriptionApiError,
} from './subscriptionErrors'
import type { ApiError } from '../types/api'

describe('subscriptionErrors', () => {
  it('maps unauthorized subscription errors to authRequired', () => {
    const error = {
      kind: 'unauthorized',
      status: 401,
    } satisfies ApiError

    expect(mapSubscriptionApiError(error, 'course', 'subscribe')).toEqual({
      type: 'auth',
      status: 401,
      messageKey: 'errors.subscriptions.authRequired',
    })
  })

  it('maps course subscribe conflicts to alreadySubscribed', () => {
    const error = {
      kind: 'unknown',
      status: 409,
    } satisfies ApiError

    expect(mapSubscriptionApiError(error, 'course', 'subscribe')).toEqual({
      type: 'validation',
      status: 409,
      messageKey: 'errors.courses.alreadySubscribed',
    })
  })

  it('maps lyceum unsubscribe bad requests to notSubscribed', () => {
    const error = {
      kind: 'unknown',
      status: 400,
    } satisfies ApiError

    expect(
      mapSubscriptionApiError(error, 'lyceum', 'unsubscribe'),
    ).toEqual({
      type: 'validation',
      status: 400,
      messageKey: 'errors.lyceums.notSubscribed',
    })
  })

  it('creates a notFound app error for invalid subscription targets', () => {
    expect(createInvalidSubscriptionTargetError('lyceum')).toEqual({
      type: 'validation',
      messageKey: 'errors.lyceums.subscriptionNotFound',
    })
  })
})
