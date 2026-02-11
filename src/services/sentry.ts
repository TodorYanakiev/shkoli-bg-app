import * as Sentry from '@sentry/react'

import { env } from './env'

const defaultTracePropagationTargets: Array<string | RegExp> = [
  /^\/api(?:\/|$)/,
]

let isSentryInitialized = false
let isSentryDiagnosticsEnabled = false

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const createTraceTargetFromBaseUrl = (
  baseUrl: string,
): string | RegExp | null => {
  if (!baseUrl) {
    return null
  }

  if (baseUrl.startsWith('http://') || baseUrl.startsWith('https://')) {
    return new RegExp(`^${escapeRegExp(baseUrl)}(?:\\/|$)`)
  }

  if (baseUrl.startsWith('/')) {
    return new RegExp(`^${escapeRegExp(baseUrl)}(?:\\/|$)`)
  }

  return baseUrl
}

const getTracePropagationTargets = (): Array<string | RegExp> => {
  const apiTarget = createTraceTargetFromBaseUrl(env.apiBaseUrl)
  if (!apiTarget) {
    return [...defaultTracePropagationTargets]
  }

  return [...defaultTracePropagationTargets, apiTarget]
}

export const initializeSentry = (): void => {
  isSentryDiagnosticsEnabled = true

  if (!env.sentryDsn) {
    return
  }

  if (isSentryInitialized) {
    Sentry.getReplay()?.start()
    return
  }

  Sentry.init({
    dsn: env.sentryDsn,
    sendDefaultPii: true,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    tracePropagationTargets: getTracePropagationTargets(),
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    enableLogs: true,
    environment: env.appEnvironment,
    beforeSend: (event) =>
      isSentryDiagnosticsEnabled ? event : null,
    beforeSendTransaction: (event) =>
      isSentryDiagnosticsEnabled ? event : null,
  })

  isSentryInitialized = true
  Sentry.getReplay()?.start()
}

export const disableSentry = (): void => {
  isSentryDiagnosticsEnabled = false

  if (!isSentryInitialized) {
    return
  }

  void Sentry.getReplay()?.stop()
}
