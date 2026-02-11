import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  acceptAllCookieConsent,
  getCookieConsentPreferences,
  getCookieConsentRecord,
  hasCookieConsentSelection,
  rejectOptionalCookieConsent,
  saveCookieConsentPreferences,
  subscribeToCookieConsentChange,
} from './cookieConsent'

describe('cookieConsent service', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('returns defaults when no consent has been selected', () => {
    expect(hasCookieConsentSelection()).toBe(false)
    expect(getCookieConsentRecord()).toBeNull()
    expect(getCookieConsentPreferences()).toEqual({
      necessary: true,
      analytics: false,
      diagnostics: false,
    })
  })

  it('stores fully accepted consent', () => {
    acceptAllCookieConsent()

    expect(hasCookieConsentSelection()).toBe(true)
    expect(getCookieConsentPreferences()).toEqual({
      necessary: true,
      analytics: true,
      diagnostics: true,
    })
  })

  it('stores optional rejection consent', () => {
    rejectOptionalCookieConsent()

    expect(hasCookieConsentSelection()).toBe(true)
    expect(getCookieConsentPreferences()).toEqual({
      necessary: true,
      analytics: false,
      diagnostics: false,
    })
  })

  it('stores custom preferences', () => {
    saveCookieConsentPreferences({
      analytics: true,
      diagnostics: false,
    })

    expect(getCookieConsentPreferences()).toEqual({
      necessary: true,
      analytics: true,
      diagnostics: false,
    })
  })

  it('notifies subscribers on consent updates', () => {
    const listener = vi.fn()
    const unsubscribe = subscribeToCookieConsentChange(listener)

    acceptAllCookieConsent()
    unsubscribe()

    expect(listener).toHaveBeenCalledTimes(1)
  })
})

