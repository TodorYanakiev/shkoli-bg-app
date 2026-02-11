import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const COOKIE_CONSENT_STORAGE_KEY = 'education-nearby-cookie-consent'

const clearAllCookies = () => {
  document.cookie
    .split(';')
    .map((entry) => entry.split('=')[0]?.trim())
    .filter((name): name is string => Boolean(name))
    .forEach((name) => {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
    })
}

const getCookieNames = (): string[] =>
  document.cookie
    .split(';')
    .map((entry) => entry.split('=')[0]?.trim())
    .filter((name): name is string => Boolean(name))

const resetBrowserState = () => {
  window.localStorage.clear()
  window.sessionStorage.clear()
  window.localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY)
  clearAllCookies()
  document.head.innerHTML = ''
  window.dataLayer = undefined
  window.gtag = undefined
  window.hj = undefined
  window._hjSettings = undefined
  window._uxa = undefined
}

describe('tracking service cookie handling', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.useRealTimers()
    resetBrowserState()
  })

  afterEach(() => {
    vi.useRealTimers()
    resetBrowserState()
  })

  it('clears Google Analytics cookies and storage data when disabled', async () => {
    const { disableGoogleAnalytics } = await import('./tracking')

    document.cookie = '_ga=ga-cookie;path=/'
    document.cookie = '_gid=gid-cookie;path=/'
    document.cookie = 'app_cookie=keep;path=/'
    window.localStorage.setItem('_ga_session', 'remove')
    window.localStorage.setItem('app_local_storage', 'keep')
    window.sessionStorage.setItem('_gcl_aw', 'remove')
    window.sessionStorage.setItem('app_session_storage', 'keep')

    disableGoogleAnalytics()

    expect(getCookieNames()).not.toContain('_ga')
    expect(getCookieNames()).not.toContain('_gid')
    expect(getCookieNames()).toContain('app_cookie')
    expect(window.localStorage.getItem('_ga_session')).toBeNull()
    expect(window.localStorage.getItem('app_local_storage')).toBe('keep')
    expect(window.sessionStorage.getItem('_gcl_aw')).toBeNull()
    expect(window.sessionStorage.getItem('app_session_storage')).toBe('keep')
  })

  it('clears Hotjar cookies and storage data when disabled', async () => {
    const { disableHotjar } = await import('./tracking')

    document.cookie = '_hjSessionUser_123=user;path=/'
    document.cookie = '_hjSession_123=session;path=/'
    document.cookie = 'app_cookie=keep;path=/'
    window.localStorage.setItem('_hj_session', 'remove')
    window.localStorage.setItem('app_local_storage', 'keep')
    window.sessionStorage.setItem('_hj_first_seen', 'remove')
    window.sessionStorage.setItem('app_session_storage', 'keep')

    disableHotjar()

    expect(
      getCookieNames().some((cookieName) => cookieName.startsWith('_hj')),
    ).toBe(false)
    expect(getCookieNames()).toContain('app_cookie')
    expect(window.localStorage.getItem('_hj_session')).toBeNull()
    expect(window.localStorage.getItem('app_local_storage')).toBe('keep')
    expect(window.sessionStorage.getItem('_hj_first_seen')).toBeNull()
    expect(window.sessionStorage.getItem('app_session_storage')).toBe('keep')
  })

  it('clears Contentsquare artifacts and keeps the opt-out cookie when disabled', async () => {
    const { disableContentsquare, enableContentsquare } = await import(
      './tracking'
    )

    vi.useFakeTimers()

    document.cookie = '_cs_optout=true;path=/'
    document.cookie = '_cs_id=content-square;path=/'
    document.cookie = 'cs_custom=custom-value;path=/'
    document.cookie = 'app_cookie=keep;path=/'
    window.localStorage.setItem('_cs_local', 'remove')
    window.localStorage.setItem('app_local_storage', 'keep')
    window.sessionStorage.setItem('cs_session', 'remove')
    window.sessionStorage.setItem('app_session_storage', 'keep')

    enableContentsquare()
    disableContentsquare()
    vi.advanceTimersByTime(2_100)

    expect(getCookieNames()).toContain('_cs_optout')
    expect(
      getCookieNames().some(
        (cookieName) =>
          cookieName.startsWith('_cs_') && cookieName !== '_cs_optout',
      ),
    ).toBe(false)
    expect(
      getCookieNames().some((cookieName) => cookieName.startsWith('cs_')),
    ).toBe(false)
    expect(getCookieNames()).toContain('app_cookie')
    expect(window.localStorage.getItem('_cs_local')).toBeNull()
    expect(window.localStorage.getItem('app_local_storage')).toBe('keep')
    expect(window.sessionStorage.getItem('cs_session')).toBeNull()
    expect(window.sessionStorage.getItem('app_session_storage')).toBe('keep')
    expect(window._uxa).toEqual([['optout']])
  })

  it('enforces Contentsquare opt-out cookie and removes Contentsquare storage', async () => {
    const { enforceContentsquareOptOut } = await import('./tracking')

    document.cookie = '_cs_id=content-square;path=/'
    document.cookie = 'cs_custom=custom-value;path=/'
    window.localStorage.setItem('_cs_local', 'remove')
    window.sessionStorage.setItem('cs_session', 'remove')
    window._uxa = [['trackPageview', '/']]

    enforceContentsquareOptOut()

    expect(getCookieNames()).toContain('_cs_optout')
    expect(
      getCookieNames().some(
        (cookieName) =>
          cookieName.startsWith('_cs_') && cookieName !== '_cs_optout',
      ),
    ).toBe(false)
    expect(
      getCookieNames().some((cookieName) => cookieName.startsWith('cs_')),
    ).toBe(false)
    expect(window.localStorage.getItem('_cs_local')).toBeNull()
    expect(window.sessionStorage.getItem('cs_session')).toBeNull()
    expect(window._uxa).toContainEqual(['optout'])
  })
})
