import { afterEach, describe, expect, it } from 'vitest'

import {
  buildLoginPathWithRedirect,
  clearStoredPostLoginRedirect,
  consumeStoredPostLoginRedirect,
  getPostLoginRedirectFromSearchParams,
  getStoredPostLoginRedirect,
  setStoredPostLoginRedirect,
} from './authRedirect'

afterEach(() => {
  clearStoredPostLoginRedirect()
})

describe('authRedirect', () => {
  it('builds a login path with a safe post-login redirect', () => {
    expect(
      buildLoginPathWithRedirect('/bg/auth/login', '/bg/shkoli/42?tab=reviews'),
    ).toBe('/bg/auth/login?returnTo=%2Fbg%2Fshkoli%2F42%3Ftab%3Dreviews')
  })

  it('does not add an unsafe redirect to the login path', () => {
    expect(
      buildLoginPathWithRedirect('/bg/auth/login', 'https://example.com'),
    ).toBe('/bg/auth/login')
  })

  it('reads only safe redirects from search params', () => {
    expect(
      getPostLoginRedirectFromSearchParams(
        new URLSearchParams('returnTo=%2Fbg%2Flyceums%2F7'),
      ),
    ).toBe('/bg/lyceums/7')

    expect(
      getPostLoginRedirectFromSearchParams(
        new URLSearchParams('returnTo=https%3A%2F%2Fexample.com'),
      ),
    ).toBeNull()
  })

  it('stores and consumes a safe redirect', () => {
    setStoredPostLoginRedirect('/bg/shkoli/42')

    expect(getStoredPostLoginRedirect()).toBe('/bg/shkoli/42')
    expect(consumeStoredPostLoginRedirect()).toBe('/bg/shkoli/42')
    expect(getStoredPostLoginRedirect()).toBeNull()
  })

  it('clears an unsafe redirect instead of storing it', () => {
    setStoredPostLoginRedirect('/bg/shkoli/42')
    setStoredPostLoginRedirect('https://example.com')

    expect(getStoredPostLoginRedirect()).toBeNull()
  })
})
