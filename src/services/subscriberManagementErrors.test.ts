import { describe, expect, it } from 'vitest'

import {
  createInvalidSubscriberTargetError,
  createMissingExportJobError,
  mapSubscriberManagementApiError,
} from './subscriberManagementErrors'
import type { ApiError } from '../types/api'

describe('subscriberManagementErrors', () => {
  it('maps forbidden subscriber list errors to forbidden', () => {
    const error = {
      kind: 'forbidden',
      status: 403,
    } satisfies ApiError

    expect(
      mapSubscriberManagementApiError(error, 'course', 'list'),
    ).toEqual({
      type: 'forbidden',
      status: 403,
      messageKey: 'errors.auth.forbidden',
    })
  })

  it('maps invalid format export errors to invalidFormat', () => {
    const error = {
      kind: 'unknown',
      status: 400,
    } satisfies ApiError

    expect(
      mapSubscriberManagementApiError(error, 'lyceum', 'createExport'),
    ).toEqual({
      type: 'validation',
      status: 400,
      messageKey: 'errors.subscribers.invalidFormat',
    })
  })

  it('maps export download not-ready errors to fileNotReady', () => {
    const error = {
      kind: 'unknown',
      status: 409,
    } satisfies ApiError

    expect(
      mapSubscriberManagementApiError(error, 'course', 'downloadExport'),
    ).toEqual({
      type: 'validation',
      status: 409,
      messageKey: 'errors.subscribers.fileNotReady',
    })
  })

  it('creates a validation app error for invalid subscriber targets', () => {
    expect(createInvalidSubscriberTargetError('course')).toEqual({
      type: 'validation',
      messageKey: 'errors.courses.subscriptionNotFound',
    })
  })

  it('creates a fallback error for missing export jobs', () => {
    expect(createMissingExportJobError('lyceum', 'downloadExport')).toEqual({
      type: 'validation',
      messageKey: 'errors.lyceums.subscribers.downloadFailed',
    })
  })
})
