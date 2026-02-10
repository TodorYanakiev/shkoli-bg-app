import * as Sentry from '@sentry/react'

import { env } from './env'

const defaultTracePropagationTargets: Array<string | RegExp> = [
  'localhost',
  /^\/api/,
]

let isSentryInitialized = false

const getTracePropagationTargets = (): Array<string | RegExp> => {
  if (!env.apiBaseUrl) {
    return defaultTracePropagationTargets
  }

  return [...defaultTracePropagationTargets, env.apiBaseUrl]
}

export const initializeSentry = (): void => {
  if (isSentryInitialized || !env.sentryDsn) {
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
  })

  isSentryInitialized = true
}
