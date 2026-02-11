import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { useCookieConsent } from './useCookieConsent'
import { disableSentry, initializeSentry } from '../services/sentry'
import {
  disableContentsquare,
  disableGoogleAnalytics,
  disableHotjar,
  enableContentsquare,
  enforceContentsquareOptOut,
  enableGoogleAnalytics,
  enableHotjar,
  trackContentsquarePageView,
  trackGoogleAnalyticsPageView,
  trackHotjarPageView,
} from '../services/tracking'

export const useConsentManagedTracking = () => {
  const location = useLocation()
  const {
    preferences: { analytics, diagnostics },
  } = useCookieConsent()

  useEffect(() => {
    if (analytics) {
      enableGoogleAnalytics()
      enableHotjar()
      enableContentsquare()
      return
    }

    disableGoogleAnalytics()
    disableHotjar()
    disableContentsquare()
  }, [analytics])

  useEffect(() => {
    if (diagnostics) {
      initializeSentry()
      return
    }

    disableSentry()
  }, [diagnostics])

  useEffect(() => {
    if (!analytics) {
      enforceContentsquareOptOut()
      return
    }

    const pagePath = `${location.pathname}${location.search}${location.hash}`

    trackGoogleAnalyticsPageView(pagePath)
    trackHotjarPageView(pagePath)
    trackContentsquarePageView(pagePath)
  }, [analytics, location.pathname, location.search, location.hash])
}
