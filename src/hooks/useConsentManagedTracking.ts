import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { useCookieConsent } from './useCookieConsent'

let trackingModulePromise: Promise<typeof import('../services/tracking')> | null =
  null
let sentryModulePromise: Promise<typeof import('../services/sentry')> | null =
  null

const loadTrackingModule = () => {
  if (!trackingModulePromise) {
    trackingModulePromise = import('../services/tracking')
  }

  return trackingModulePromise
}

const loadSentryModule = () => {
  if (!sentryModulePromise) {
    sentryModulePromise = import('../services/sentry')
  }

  return sentryModulePromise
}

export const useConsentManagedTracking = () => {
  const location = useLocation()
  const {
    preferences: { analytics, diagnostics },
  } = useCookieConsent()

  useEffect(() => {
    let isCancelled = false

    const syncAnalyticsConsent = async () => {
      const tracking = await loadTrackingModule()
      if (isCancelled) {
        return
      }

      if (analytics) {
        tracking.enableGoogleAnalytics()
        tracking.enableHotjar()
        tracking.enableContentsquare()
        return
      }

      tracking.disableGoogleAnalytics()
      tracking.disableHotjar()
      tracking.disableContentsquare()
      tracking.enforceContentsquareOptOut()
    }

    void syncAnalyticsConsent()

    return () => {
      isCancelled = true
    }
  }, [analytics])

  useEffect(() => {
    let isCancelled = false

    const syncDiagnosticsConsent = async () => {
      const sentry = await loadSentryModule()
      if (isCancelled) {
        return
      }

      if (diagnostics) {
        sentry.initializeSentry()
        return
      }

      sentry.disableSentry()
    }

    void syncDiagnosticsConsent()

    return () => {
      isCancelled = true
    }
  }, [diagnostics])

  useEffect(() => {
    if (!analytics) {
      return
    }

    let isCancelled = false

    const trackPageView = async () => {
      const tracking = await loadTrackingModule()
      if (isCancelled) {
        return
      }

      const pagePath = `${location.pathname}${location.search}${location.hash}`

      tracking.trackGoogleAnalyticsPageView(pagePath)
      tracking.trackHotjarPageView(pagePath)
      tracking.trackContentsquarePageView(pagePath)
    }

    void trackPageView()

    return () => {
      isCancelled = true
    }
  }, [analytics, location.pathname, location.search, location.hash])
}
